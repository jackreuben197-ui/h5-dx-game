import type { SpineClipConfig } from '../assets/style1/effects/spine/EmojiSpineAssets.js';
import type { SeatEffectAssets } from '../assets/style1/effects/spine/SpineAssets.js';

export interface PickerEmoji {
  type: number;
  thumbnail: string;
  sound: string;
  clip: SpineClipConfig;
}
export type ThrowPropArt = {hit: SpineClipConfig; sound?: string} & (
  | {mode: 'fly' | 'target'; intro?: SpineClipConfig}
  | {mode: 'gun'; sender: SpineClipConfig; trail: SpineClipConfig}
);
export interface TableEffectArt {
  throwProps?: Readonly<Partial<Record<number, ThrowPropArt>>>;
  groups: {id: number; name: string; icon: string; items: PickerEmoji[]}[];
  emoji(type: number): PickerEmoji | undefined;
  seats(): Promise<SeatEffectAssets>;
  opening: Record<'squid' | 'critical', SpineClipConfig>;
}
