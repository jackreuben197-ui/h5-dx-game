import type { TableLayout } from './TableLayout.js';
import type { TableLayoutId } from '../data/TexasGamePersonalSettings.js';
export interface StaticDeskArtwork {
  readonly portrait: string;
  readonly wide: string;
  readonly thumbnail: string;
}

export interface StaticDeskCatalog {
  readonly ids: readonly number[];
  nameKey?(id: number): string | undefined;
  image(id: number): string | undefined;
  thumbnail(id: number): string | undefined;
}

export const legacyDeskIds = Array.from({ length: 14 }, (_, index) => index + 1);

export function selectedDeskId(saved: number, catalog?: StaticDeskCatalog): number {
  const ids = catalog?.ids ?? legacyDeskIds;
  return ids.includes(saved) ? saved : ids[0] ?? 1;
}

/** Product UI implementations consume the shared MX layout preference. */
export interface TableUiConfig {
  createLayout(preference: TableLayoutId): TableLayout;
  animatePotCollection?: boolean;
  tableSounds?: Readonly<Partial<Record<'deal' | 'boardDeal' | 'chips' | 'call' | 'raise' | 'smallBlind' | 'bigBlind' | 'myWin' | 'otherWin' | 'collectPot', string>>>;
  profileProps?: ReadonlyArray<readonly [number, string]>;
  profilePropIcons?: Readonly<Partial<Record<string, string>>>;
  loadingArt?: { portrait: string; wide: string; track: string; fill: string };
  guideArt?: {
    squidResult: string;
    squidPages: readonly [string, string, string];
    previous: string;
    next: string;
    mushroom: string;
    critical: string;
  };
  /** A supplied catalog replaces the numbered legacy desks and their animations. */
  staticDesks?: StaticDeskCatalog;
  effects?: import('./TableEffectArt.js').TableEffectArt;
}
