import { SpriteAtlas } from '../../SpriteAtlas.js';
import config from './config.json';

/** Bet markers can live inside a seat or on the elevated bets layer. Sample them before the seat update. */
export function animatePotCollection(stage: HTMLElement, layer: HTMLElement, target: HTMLElement): void {
  const bounds = layer.getBoundingClientRect();
  const dest = target.getBoundingClientRect();
  if (!bounds.width || !bounds.height || !dest.width || !dest.height) return;
  const sx = layer.clientWidth / bounds.width, sy = layer.clientHeight / bounds.height;
  const endX = dest.left + dest.width / 2, endY = dest.top + dest.height / 2;
  const starts = Array.from(stage.querySelectorAll('.mx-seat-bet:not([hidden]) .mx-seat-bet-chip'),
    node => node.getBoundingClientRect()).filter(rect => rect.width && rect.height);
  for (const rect of starts) {
    const chip = document.createElement('span');
    chip.className = 'mx-collecting-chip';
    chip.setAttribute('aria-hidden', 'true');
    SpriteAtlas.paint(chip, config.paths.chip);
    Object.assign(chip.style, {
      position: 'absolute', pointerEvents: 'none', backgroundRepeat: 'no-repeat',
      left: `${(rect.left - bounds.left) * sx}px`, top: `${(rect.top - bounds.top) * sy}px`,
      width: `${rect.width * sx}px`, height: `${rect.height * sy}px`,
    });
    layer.append(chip);
    const dx = (endX - rect.left - rect.width / 2) * sx;
    const dy = (endY - rect.top - rect.height / 2) * sy;
    const flight = chip.animate([
      { transform: 'translate(0, 0) scale(1)' },
      { transform: `translate(${dx}px, ${dy}px) scale(0.65)` },
    ], { duration: 330, easing: 'ease-in-out' });
    flight.onfinish = flight.oncancel = () => chip.remove();
  }
}
