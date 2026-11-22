import type { PickerEmoji, TableEffectArt } from '../../ui/TableEffectArt.js';
import { pickerEmojiType } from '../../logic/BroadcastCode.js';
import { EmojiSpineAssets, type SpineClipConfig } from '../style1/effects/spine/EmojiSpineAssets.js';
import type { SeatEffectAssets } from '../style1/effects/spine/SpineAssets.js';

const files = import.meta.glob<string>('./effects/**/*.{atlas,skel,png,mp3,wav}', { eager: true, import: 'default', query: '?url&no-inline' });
function url(path: string): string {
  const value = files['./effects/' + path];
  if (!value) throw new Error('Missing fishbase effect: ' + path);
  return new URL(value, import.meta.url).href;
}
function clip(dir: string, name: string, animation = 'animation'): SpineClipConfig {
  return { spine: 'fishbase/' + dir + '/' + name, animation, file: leaf => url(dir + '/' + leaf) };
}
// Original voice lengths in seconds, indexed by Cocos emoji number (em16 first).
const voiceSeconds = [2.25, 1.5, 2, 3, 2.25, 2.25, 2, 4, 2.25, 2.25, 2.784, 2.016, 2.064, 1.368, 2.064, 3.024, 2.76, 1.536, 2.04, 1.536, 1.2, 2, 2.04, 1.536, 1.704, 1.536, 1.632, 2, 2.04, 2.04, 2.76, 2.064, 1.536, 3.024, 1.536, 3.744, 3.288, 2.232, 2.04, 2.04, 1.536, 2.04, 2.064, 1.416, 2.04, 4.536, 1.536, 2.28, 4.032, 2.04];
const emojis = new Map<number, PickerEmoji>();
const groups = [
  { id: 2, name: 'MushroomHead', start: 26 }, { id: 3, name: 'Shinchan', start: 36 },
  { id: 1, name: 'Teddy', start: 16 }, { id: 4, name: 'Frog', start: 46 }, { id: 5, name: 'Dog', start: 56 },
].map(({id, name, start}) => ({
  id, name, icon: url('thumb/emtab' + id + '.png'),
  items: Array.from({length: 10}, (_, offset) => {
    const index = start + offset, type = pickerEmojiType(index), key = 'em' + index;
    const sound = 'audio/' + key;
    const item = {type, thumbnail: url('thumb/' + key + '.png'), sound: url(sound + (files['./effects/' + sound + '.mp3'] ? '.mp3' : '.wav')), clip: {...clip('emoji/' + key, 'skeleton', ''), loopSeconds: voiceSeconds[index - 16]}};
    emojis.set(type, item);
    return item;
  }),
}));

async function seats(): Promise<SeatEffectAssets> {
  const result: SeatEffectAssets = new Map();
  await Promise.all((['win', 'win-self', 'allin-self', 'allin-other'] as const).map(async kind => {
    const asset = await EmojiSpineAssets.load(clip(kind, kind === 'win-self' ? 'youwin' : 'skeleton'));
    const [image] = asset.images.values();
    if (!image || asset.images.size !== 1) throw new Error('Unexpected seat atlas: ' + kind);
    result.set(kind, {data: asset.binary, atlas: asset.atlas, image,
      lift: kind.startsWith('win') ? 150 : 0, loop: kind.startsWith('allin'),
      scale: kind === 'win' ? .1936 * .5 : kind === 'win-self' ? .3113 * .5 : 1});
  }));
  return result;
}
export const fishEffects: TableEffectArt = {
  groups, emoji: type => emojis.get(type), seats,
  throwProps: {
    600: {mode: 'fly', hit: clip('props/expressionTomato', 'skeleton', 'dirt_splash'), intro: clip('props/expressionTomato', 'skeleton', 'dirt_flying'), sound: 'sfx_tomato_mus'},
    601: {mode: 'fly', hit: clip('props/expressionFlower', 'skeleton', 'hand_wave'), sound: 'sfx_rose_mus'},
    602: {mode: 'fly', hit: clip('props/expressionKiss', 'kiss', 'lip_kissing'), sound: 'sfx_kiss_mus'},
    603: {mode: 'fly', hit: clip('props/expressionGood', 'skeleton', 'thumbs_up'), intro: clip('props/expressionGood', 'skeleton', 'fist_flying'), sound: 'sfx_like_mus'},
    604: {mode: 'fly', hit: clip('props/expressionBeer', 'cheers_2', 'beer_cheers'), sound: 'sfx_cheers_mus'},
    605: {mode: 'target', hit: clip('props/expressionTouch', 'touch', 'hand_patting'), sound: 'sfx_touch_mus'},
    606: {mode: 'target', hit: clip('props/expressionShark', 'shark', 'shark_eaten'), intro: clip('props/expressionShark', 'shark', 'babyshark')},
    607: {mode: 'fly', hit: clip('props/expressionChicken', 'chicken_spine', 'hen_struggling'), intro: clip('props/expressionChicken', 'chicken_spine', 'hand_flying'), sound: 'sfx_zhuaji_mus'},
    608: {mode: 'gun', hit: clip('props/expressionBox', 'box_local', 'bullet_shots'), sender: clip('props/expressionBox', 'box_local', 'gun'), trail: clip('props/expressionBox', 'box_local', 'bullets-fireballs')},
    611: {mode: 'fly', hit: clip('props/expressionBaseballSender', 'skeleton', 'blast'), intro: clip('props/expressionBaseballSender', 'skeleton', 'bomb_flying'), sound: 'sfx_baseball'},
  },
  opening: {
    // Matches the Cocos SkeletonData import scale in SquidGame.skel.meta.
    squid: {...clip('squid', 'SquidGame'), importScale: 0.1},
    critical: clip('critical', 'quanji'),
  },
};
