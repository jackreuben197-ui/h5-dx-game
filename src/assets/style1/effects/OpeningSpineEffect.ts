import type { TableEffectArt } from '../../../ui/TableEffectArt.js';
import type { EmojiSpineRenderer } from './spine/EmojiSpineRenderer.js';

type Opening = keyof TableEffectArt['opening'];
export class OpeningSpineEffect {
  private renderer?: EmojiSpineRenderer;
  private loading?: Promise<EmojiSpineRenderer>;
  private active = new Map<Opening, object>();
  private dead = false;
  constructor(private layer: HTMLElement, private clips: TableEffectArt['opening']) {}
  play(kind: Opening): void {
    const request = {};
    this.active.set(kind, request);
    this.loading ??= import('./spine/EmojiSpineRenderer.js').then(({EmojiSpineRenderer}) => {
      if (this.dead) throw new DOMException('Disposed', 'AbortError');
      return this.renderer = new EmojiSpineRenderer(this.layer, e => console.warn('[DX opening]', e));
    }).catch(error => { this.loading = undefined; throw error; });
    void this.loading.then(renderer => {
      if (this.dead || this.active.get(kind) !== request) return;
      return renderer.play(kind, this.clips[kind], () => {
        const r = this.layer.getBoundingClientRect();
        const unit = Math.min(r.width / 1242, r.height / 2208);
        return {x: r.left + r.width / 2, y: r.top + r.height / 2 - 144 * unit, scale: unit, maxSize: 900 * unit};
      }, false, kind === 'critical');
    }).catch(error => { if (!this.dead) console.warn('[DX opening]', kind, error); });
  }
  stop(kind: Opening): void { this.active.delete(kind); this.renderer?.stop(kind); }
  destroy(): void { this.dead = true; this.active.clear(); this.renderer?.destroy(); }
}
