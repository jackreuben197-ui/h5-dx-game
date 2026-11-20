import { componentBox } from '../../ComponentBox.js';
import config from './config.json';
import { uniqueId } from '../../../../../core/uniqueId.js';
import type { PickerEmoji } from '../../../../../ui/TableEffectArt.js';
import type { EmojiItemData } from '../../../../../logic/EmojiPropRules.js';
import { EmojiPropRules } from '../../../../../logic/EmojiPropRules.js';
import { StringHelper } from '../../../../../logic/StringHelper.js';
import type { EmojiSpineRenderer } from '../../../effects/spine/EmojiSpineRenderer.js';
import { SpriteAtlas } from '../../SpriteAtlas.js';
import { element } from '../../dom.js';
import { i18nMgr } from '../../../../../i18n/i18nMgr.js';
export class EmojiItemView {
    readonly root = componentBox(element('button', 'mx-emoji-item'),config);
    private preview = element('span', 'mx-emoji-preview');
    private spinner = element('span', 'mx-emoji-spinner');
    private dead = false;
    private ready = false;
    private busy = false;
    private renderer?: EmojiSpineRenderer;
    private key = `emoji-preview-${uniqueId()}`;
    constructor(item: EmojiItemData | PickerEmoji, privateUc: boolean, renderer: Promise<EmojiSpineRenderer> | undefined, clip: HTMLElement, send: () => void) {
        this.root.type = 'button'; this.root.disabled = true;
        const picker = 'thumbnail' in item;
        this.root.setAttribute('aria-label', picker ? i18nMgr.Get('UITexas_mainmenu_emoji') + ' ' + (item.type - 499) : i18nMgr.Get(`MX_Emoji_${item.config.propCode}`, [], item.config.propCode));
        this.preview.append(this.spinner); this.root.append(this.preview);
        const amount = picker ? 10 : Number(item.data.payPrice) || 0;
        if ((picker ? !privateUc : !EmojiPropRules.isPropFree(item.data)) && amount > 0) {
            const cost = element('span', 'mx-emoji-cost');
            const icon = element('span', ''); SpriteAtlas.paint(icon, privateUc ? config.paths.emojiUc : config.paths.emojiDiamond);
            cost.append(icon, element('span', '', privateUc ? StringHelper.GetLongString(amount) : String(amount))); this.root.append(cost);
        }
        this.root.onclick = () => { if (!this.ready || this.busy) return; this.root.classList.add('mx-emoji-selected'); send(); };
        if (picker) {
            const image = element('img', 'mx-picker-thumb');
            image.src = item.thumbnail;
            image.alt = '';
            this.preview.replaceChildren(image);
            this.ready = true;
            this.setBusy(false);
            return;
        }
        void renderer?.then(async engine => {
            if (this.dead) return;
            this.renderer = engine;
            const played = await engine.play(this.key, item.config, () => {
                if (this.dead || !this.preview.isConnected) return null;
                const r = this.preview.getBoundingClientRect();
                return {x: r.left + r.width / 2, y: r.top + r.height / 2, scale: 1, maxSize: r.width * config.layout.previewArtWidth / config.layout.previewFrameWidth, clip: clip.getBoundingClientRect()};
            }, true, true);
            if (this.dead || !played) return;
            this.ready = true; this.spinner.hidden = true; this.setBusy(this.busy);
        }).catch(() => {
            if (this.dead) return;
            this.spinner.classList.add('mx-emoji-load-failed');
            this.root.title = i18nMgr.Get('MX_EmojiLoadFailed', [], '表情加载失败，请重新打开');
        });
    }
    setBusy(busy: boolean): void { this.busy = busy; this.root.disabled = !this.ready || busy; if (!busy) this.root.classList.remove('mx-emoji-selected'); }
    destroy(): void { this.dead = true; this.renderer?.stop(this.key); this.root.onclick = null; this.root.remove(); }
}
