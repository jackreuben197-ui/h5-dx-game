import { MediaElementSegment } from '../media/MediaElementSegment.js';
import type { MediaRule } from './MediaRule.js';
import config from './TableSound/config.json';
import { AudioSpritePlayer } from './AudioSpritePlayer.js';
import type { TableSnapshot } from '../../../core/types.js';
import type { TableUiConfig } from '../../../ui/TableUiConfig.js';
/** Native audio only. Sound stays outside protocol/data and never blocks entry. */
export class TableSound {
  readonly root = document.createElement('div');
  enabled = false;
  private clips=new AudioSpritePlayer();
  private previous?: TableSnapshot;
  private bgm?: HTMLAudioElement;
  private bgmSegment?: MediaElementSegment;
  private effects = new Set<HTMLAudioElement>();
  private disposed = false;
  private urls?: typeof import('./assets.js');
  private generation = 0;
  private turnTimer?:ReturnType<typeof setInterval>;
  private timerKey='';
  private lastRemaining=Infinity;
  private visibility = () => { if (document.hidden) this.stop(); else if (this.enabled) void this.music(); };
  constructor(private readonly tableSounds?: TableUiConfig['tableSounds']) {
    this.root.hidden = true;
    document.addEventListener('visibilitychange', this.visibility);
  }
  async setEnabled(value: boolean): Promise<void> {
    this.enabled = value; this.generation++;
    if (!value) { this.stop(); return; }
    this.clips.unlock();
    for(const [key,rule] of Object.entries(config.media))if(key!=='bgm'&&rule.preload==='auto')this.clips.preload(config.paths[key as keyof typeof config.paths]);
    await this.music();
  }
  private async music(): Promise<void> {
    if (!config.media.bgm.enabled) return;
    const urls = this.urls ??= await import('./assets.js');
    if (this.disposed || !this.enabled || document.hidden) return;
    if (!this.bgm) {
      this.bgm = new Audio(urls.bgm); this.bgmSegment=new MediaElementSegment(this.bgm,config.media.bgm as MediaRule); this.bgm.dataset.kind = "bgm"; this.root.append(this.bgm);
    }
    try { await this.bgm.play(); } catch { /* A later user gesture can retry. */ }
  }
  private effect(key: Exclude<keyof typeof config.paths, 'bgm'> | keyof NonNullable<TableUiConfig['tableSounds']>): void {
    if (!this.enabled || document.hidden) return;
    if (key === 'call' || key === 'raise' || key === 'smallBlind' || key === 'bigBlind' || key === 'myWin') {
      const url = this.tableSounds?.[key];
      if (url) { this.clips.playFile(url); return; }
      if (key !== 'call' && key !== 'raise') return;
      key = 'chips';
    }
    this.clips.play(config.paths[key],config.media[key]);
  }
  /** Room effects use the same mute/visibility lifecycle as table sound. */
  playExternalEffect(url: string): () => void {
    if (this.disposed || !this.enabled || document.hidden) return () => {};
    const audio = new Audio(url);
    const stop = () => { audio.pause(); audio.removeAttribute('src'); audio.remove(); this.effects.delete(audio); };
    audio.onended = stop; audio.onerror = stop;
    this.effects.add(audio); this.root.append(audio);
    void audio.play().catch(stop);
    return stop;
  }
  present(state: TableSnapshot): void {
    const old = this.previous; this.previous = state;
    const timer=state.actions.length?state.countdowns?.find(v=>v.seat===state.mySeat):undefined;
    const key=timer?`${state.roomID}:${state.handNum}:${timer.deadline}`:'';
    if(key!==this.timerKey){
      if(this.turnTimer)clearInterval(this.turnTimer);
      this.turnTimer=undefined;this.timerKey=key;this.lastRemaining=Infinity;
      if(timer){
        const tick=()=>{
          const left=Math.ceil(timer.deadline-Date.now()/1000);
          if(left<=0){if(this.turnTimer)clearInterval(this.turnTimer);this.turnTimer=undefined;return;}
          if(left<=Math.floor(timer.totalTime/3)&&this.lastRemaining>Math.floor(timer.totalTime/3))void this.effect('alert');
          if(left<=3&&this.lastRemaining>3)void this.effect('three');
          this.lastRemaining=left;
        };
        tick();this.turnTimer=setInterval(tick,250);
      }
    }
    if (!old || state.presentation === 'sync') return;
    if (state.presentation === 'deal' && old.handNum !== state.handNum) void this.effect('deal');
    if (state.community.length > old.community.length) void this.effect('deal');
    for (const p of state.players) {
      const before = old.players.find(v => v.seat === p.seat);
      if (!before || before.userRid !== p.userRid) continue;
      if (p.seat === state.mySeat && p.settlement?.win && !before.settlement?.win) this.effect('myWin');
      const action = p.action.split(' ', 1)[0];
      const repeatedBet = old.handNum === state.handNum && old.community.length === state.community.length
        && (action === '跟注' || action === '加注') && (p.roundBet ?? 0) > (before.roundBet ?? 0);
      if (before.action === p.action && !repeatedBet) continue;
      switch (action) {
        case '弃牌': this.effect('fold'); break;
        case '过牌': this.effect('check'); break;
        case '全下': this.effect('allin'); break;
        case '下注': this.effect('chips'); break;
        case '跟注': this.effect('call'); break;
        case '加注': this.effect('raise'); break;
        case '小盲': this.effect('smallBlind'); break;
        case '大盲': this.effect('bigBlind'); break;
      }
    }
    if (state.betting && state.betting.id !== old.betting?.id) void this.effect('turn');
  }
  private stop(): void {
    this.clips.stop();
    this.bgm?.pause();
    this.effects.forEach(a => { a.pause(); a.removeAttribute('src'); a.remove(); }); this.effects.clear();
  }
  destroy(): void {
    if(this.turnTimer)clearInterval(this.turnTimer);
    this.disposed = true; this.generation++; this.stop();this.clips.destroy();
    this.bgmSegment?.destroy();
    this.bgm?.removeAttribute('src'); this.root.remove(); this.previous = undefined;
    document.removeEventListener('visibilitychange', this.visibility);
  }
}
