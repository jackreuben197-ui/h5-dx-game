import type { TableLayout } from './TableLayout.js';
import type { TableLayoutId } from '../data/TexasGamePersonalSettings.js';
/** Product UI implementations consume the shared MX layout preference. */
export interface TableUiConfig {
  deskArtwork?(type: number): string | undefined;
  createLayout(preference: TableLayoutId): TableLayout;
}
