import type { ThrowPropBroadcastData } from '../../../../data/TexasGameRoomDataEmoji.js';
import type { ThrowPropArt, TableEffectArt } from '../../../../ui/TableEffectArt.js';
import type { TableSound } from '../../audio/TableSound.js';
import { EmojiSpineAssets, type SpineClipConfig } from './EmojiSpineAssets.js';
import type { EmojiSpineRenderer, EmojiAnchor, EffectAnchor } from './EmojiSpineRenderer.js';

export class SkinPropPlayer {
  private lanes = new Map<number, Promise<void>>();
  private active = new Set<string>();
  private serial = 0;
  private disposed = false;
  private delays = new Map<ReturnType<typeof setTimeout>, () => void>();

  constructor(private renderer: EmojiSpineRenderer, private sound: TableSound,
    private seat: (id: number) => EmojiAnchor | null,
    private art: NonNullable<TableEffectArt['throwProps']>, private fail: (error: unknown) => void) {}

  play(data: ThrowPropBroadcastData): boolean {
    const art = this.art[data.type];
    if (!art) return false;
    const seats = [data.userID, data.targetUserID];
    const task = Promise.all(seats.map(id => this.lanes.get(id))).then(async () => {
      if (this.disposed || !seats.every(id => this.seat(id))) return;
      await this.present(data, art);
    }).catch(error => { if (!this.disposed) this.fail(error); }).finally(() => {
      for (const id of seats) if (this.lanes.get(id) === task) this.lanes.delete(id);
    });
    for (const id of seats) this.lanes.set(id, task);
    return true;
  }

  private async clip(config: SpineClipConfig, anchor: EffectAnchor, sound?: string): Promise<boolean> {
    if (this.disposed) return false;
    const key = 'skin-prop-' + ++this.serial;
    this.active.add(key);
    try {
      return await new Promise<boolean>((resolve, reject) => {
        this.renderer.play(key, config, anchor, false, false, resolve).then(played => {
          if (!played) resolve(false);
          else if (sound && !this.disposed) this.sound.playExternalEffect(EmojiSpineAssets.url('audio/prop/' + sound + '.ogg'));
        }).catch(reject);
      });
    } finally { this.active.delete(key); }
  }

  private async present(data: ThrowPropBroadcastData, art: ThrowPropArt): Promise<void> {
    const target = () => this.seat(data.targetUserID);
    const atTarget = () => {
      const anchor = target();
      return anchor && {...anchor, scale: anchor.scale * .7};
    };
    if (art.mode === 'gun') {
      // Preload the shared atlas before starting the 700 ms impact delay on a cold cache.
      await EmojiSpineAssets.load(art.sender);
      if (this.disposed || !target() || !this.seat(data.userID)) return;
      await Promise.all([
        this.clip(art.sender, () => this.aim(data, false)),
        this.clip(art.trail, () => this.aim(data, true)),
        this.delay(700).then(() => this.clip(art.hit, target)),
      ]);
      return;
    }
    if (art.mode === 'fly') {
      const flight = art.intro ?? {...art.hit, setupSeconds: .5};
      const arrived = await this.clip(flight, (elapsed, duration) => {
        const a = this.seat(data.userID), b = target();
        if (!a || !b) return null;
        const t = Math.min(1, elapsed / Math.max(.3, Math.min(duration, 2)));
        const p = t < .5 ? 2 * t * t : 1 - 2 * (1 - t) ** 2;
        return {x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p, scale: a.scale * .7};
      });
      if (!arrived) return;
    } else if (art.intro && !await this.clip(art.intro, atTarget)) return;
    await this.clip(art.hit, atTarget, art.sound);
  }

  private aim(data: ThrowPropBroadcastData, trail: boolean): EmojiAnchor | null {
    const a = this.seat(data.userID), b = this.seat(data.targetUserID);
    if (!a || !b || !a.scale) return null;
    const dx = b.x - a.x, dy = b.y - a.y, distance = Math.hypot(dx, dy);
    const rotation = Math.atan2(-dx, -dy);
    if (!trail || !distance) return {...a, rotation};
    // Match the muzzle offset and the authored length of the Cocos Spine trail in design units.
    const scale = Math.max(.5, Math.min(1.8, (distance / a.scale - 86) / 740));
    const offset = (86 + 240 * scale) * a.scale / distance;
    return {x: a.x + dx * offset, y: a.y + dy * offset, rotation, scale: a.scale * scale};
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => {
      const timer = setTimeout(() => { this.delays.delete(timer); resolve(); }, ms);
      this.delays.set(timer, resolve);
    });
  }

  destroy(): void {
    this.disposed = true;
    for (const [timer, done] of this.delays) { clearTimeout(timer); done(); }
    this.delays.clear();
    for (const key of this.active) this.renderer.stop(key);
    this.lanes.clear();
  }
}
