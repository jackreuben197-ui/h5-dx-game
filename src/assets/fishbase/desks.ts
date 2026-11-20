import type { StaticDeskArtwork } from '../../ui/TableUiConfig.js';

const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] as const;
export type FishbaseDeskId = (typeof ids)[number];
const nameKeys: Record<FishbaseDeskId, string> = {
  1: 'UIDeskStyle_GreenPattern',
  2: 'UIDeskStyle_GlassGreen',
  3: 'UIDeskStyle_DarkGreen',
  4: 'UIDeskStyle_Bamboo',
  5: 'UIDeskStyle_BluePattern',
  6: 'UIDeskStyle_StarryBlue',
  7: 'UIDeskStyle_DeepBlue',
  8: 'UIDeskStyle_Europe',
  9: 'UIDeskStyle_Black',
  10: 'UIDeskStyle_Night',
  11: 'UIDeskStyle_Graphite',
  12: 'UIDeskStyle_NightGlow',
  13: 'UIDeskStyle_LightGreen',
  14: 'UIDeskStyle_IceBlue',
  15: 'UIDeskStyle_SkyBlue',
  16: 'UIDeskStyle_Purple',
};
export type FishbaseDeskOverrides = Readonly<Partial<Record<FishbaseDeskId, StaticDeskArtwork>>>;

function asset(id: FishbaseDeskId, variant: 'portrait' | 'wide' | 'thumb'): string {
  return new URL(`./desks/${id}-${variant}.webp`, import.meta.url).href;
}

// Persisted desk IDs follow Cocos: desk0 is choice 1, desk15 is choice 16.
export const fishbaseDesks = ids.map(id => ({
  id,
  portrait: asset(id, 'portrait'),
  wide: asset(id, 'wide'),
  thumbnail: asset(id, 'thumb'),
}));

export function resolveFishbaseDesks(container: HTMLElement, overrides: FishbaseDeskOverrides) {
  const entries = new Map<number, StaticDeskArtwork>(
    fishbaseDesks.map(desk => [desk.id, overrides[desk.id] ?? desk]),
  );
  return {
    ids,
    nameKey: (id: number) => entries.has(id) ? nameKeys[id as FishbaseDeskId] : undefined,
    image(id: number) {
      const desk = entries.get(id);
      const wide = container.clientHeight > 0 && container.clientWidth / container.clientHeight > 0.75;
      return wide ? desk?.wide : desk?.portrait;
    },
    thumbnail: (id: number) => entries.get(id)?.thumbnail,
  };
}
