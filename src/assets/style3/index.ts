import { TexasGamePersonalSettings } from '../../data/TexasGamePersonalSettings.js';
import type { UiSkin } from '../../ui/UiSkin.js';
import { GameClient as ReferenceClient } from '../style1/StyleClient.js';
import { getBrand } from '../style1/table/appearance/BrandManifest.js';
import { CompactTableLayout } from '../compact-table/layout.js';
import '../compact-table/layout.css';
import './component-art.css';
import './style.css';
const desks = import.meta.glob<string>('./art/desks/*.webp', { eager: true, import: 'default', query: '?url' });

/** Night Harbor uses the compact frame and preserves the caller’s preferences and UI overrides. */
export const style3: UiSkin = {
  getBrand: id => ({...getBrand(id), defaultLayout: 'balanced', defaultFelt: '#57427f'}),
  createClient(container, options) {
    const brand = style3.getBrand(options.brand);
    const client = new ReferenceClient(container, {
      ...options,
      preferences: options.preferences ?? new TexasGamePersonalSettings(brand.id, brand.defaultFelt, brand.layouts, brand.defaultLayout),
      ui: {
        createLayout: id => new CompactTableLayout(id),
        deskArtwork: type => {
          const path = desks[`./art/desks/${type}.webp`];
          return path ? new URL(path, import.meta.url).href : undefined;
        },
        ...options.ui,
      },
    });
    client.element.dataset.tableFrame = 'compact';
    client.element.dataset.skin = 'style3';
    return client;
  },
};
