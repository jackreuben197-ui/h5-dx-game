import { TexasGamePersonalSettings } from '../../data/TexasGamePersonalSettings.js';
import type { UiSkin } from '../../ui/UiSkin.js';
import { GameClient as ReferenceClient } from '../style1/StyleClient.js';
import { getBrand } from '../style1/table/appearance/BrandManifest.js';
import { PicnicLayout } from './layout.js';
import './style.css';
/** Reuses existing view subscriptions/actions; all new appearance and geometry is local. */
export const style2: UiSkin = {
  getBrand: id => ({...getBrand(id),defaultLayout:'balanced'}),
  createClient(container, options) {
    const brand = style2.getBrand(options.brand);
    const client = new ReferenceClient(container, {
      ...options,
      preferences: options.preferences ?? new TexasGamePersonalSettings(brand.id, brand.defaultFelt, brand.layouts, brand.defaultLayout),
      ui: options.ui ?? { createLayout: id => new PicnicLayout(id) },
    });
    client.element.dataset.skin = 'style2';
    return client;
  },
};
