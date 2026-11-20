import { style1 } from '../style1/index.js';
import { defaultTableUi } from '../style1/table/layouts/DefaultTableUi.js';
import type { UiSkin } from '../../ui/UiSkin.js';
import { resolveFishbaseDesks, type FishbaseDeskOverrides } from './desks.js';
import { fishEffects } from './effects.js';
import './table.css';
import './table-icons.css';
import './seats.css';
import './dialog-controls.css';
import './diamond-purchase.css';
import './effects.css';
import './loading.css';
import './table-art.css';
import './history.css';

// Filenames are server prop codes; the profile list can omit unavailable props.
const profilePropIcons = Object.fromEntries(Object.entries(import.meta.glob<string>(
  './dialogs/player-props/*.png', { eager: true, import: 'default', query: '?url' },
)).map(([path, url]) => [path.slice(path.lastIndexOf('/') + 1, -4), url]));

/** A derived skin inherits every numbered desk except its explicit replacements. */
export function createFishbaseSkin(name: string, overrides: FishbaseDeskOverrides = {}): UiSkin {
  return {
    getBrand: style1.getBrand,
    createClient(container, options) {
      const client = style1.createClient(container, {
        ...options,
        ui: {
          ...defaultTableUi,
          effects: fishEffects,
          tableSounds: {
            call: new URL('./audio/sfx_desk_post_call_p.mp3', import.meta.url).href,
            raise: new URL('./audio/sfx_desk_post_raise_p.mp3', import.meta.url).href,
            smallBlind: new URL('./audio/sfx_desk_bet_first.mp3', import.meta.url).href,
            bigBlind: new URL('./audio/sfx_desk_bet_second.mp3', import.meta.url).href,
            myWin: new URL('./audio/sfx_desk_mywin.mp3', import.meta.url).href,
          },
          profilePropIcons,
          profileProps: [[606,'鲨鱼'],[608,'机枪'],[604,'干杯'],[600,'便便'],[607,'抓鸡'],
            [611,'炸弹'],[602,'亲吻'],[601,'Nice Hand'],[603,'点赞'],[605,'摸头']],
          guideArt: {
            squidResult: new URL('./dialogs/guides/squid_over.png', import.meta.url).href,
            squidPages: [
              new URL('./dialogs/guides/squid_dialog_page_1.png', import.meta.url).href,
              new URL('./dialogs/guides/squid_dialog_page_2.png', import.meta.url).href,
              new URL('./dialogs/guides/squid_dialog_page_3.png', import.meta.url).href,
            ],
            previous: new URL('./dialogs/guides/icon_lelft_arrow.png', import.meta.url).href,
            next: new URL('./dialogs/guides/icon_right_arrow.png', import.meta.url).href,
            mushroom: new URL('./dialogs/guides/mushroom.png', import.meta.url).href,
            critical: new URL('./dialogs/guides/criticalhit.png', import.meta.url).href,
          },
          loadingArt: {
            portrait: new URL('./loading/loadingbg.jpg', import.meta.url).href,
            wide: new URL('./loading/loadingbg_pc.jpg', import.meta.url).href,
            track: new URL('./loading/barbg.png', import.meta.url).href,
            fill: new URL('./loading/progressbar.png', import.meta.url).href,
          },
          staticDesks: resolveFishbaseDesks(container, overrides),
          ...options.ui,
        },
      });
      client.element.dataset.skinFamily = 'fishbase';
      client.element.dataset.skin = name;
      return client;
    },
  };
}

export const fishbase = createFishbaseSkin('fishbase');
