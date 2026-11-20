import spine from '../../../../effects/spine/vendor/spine38.js';
import { EmojiSpineAssets, type SpineClipConfig } from './EmojiSpineAssets.js';
export interface EmojiAnchor { x: number; y: number; scale: number; rotation?: number; maxSize?: number; clip?: DOMRectReadOnly; }
export type EffectAnchor = (elapsed: number, duration: number) => EmojiAnchor | null;
interface Bounds { x: number; y: number; size: number; }
interface Playing { skeleton: spine.Skeleton; state: spine.AnimationState; duration: number; elapsed: number; loop: boolean; limit?: number; anchor: EffectAnchor; bounds?: Bounds; complete?: (finished: boolean) => void; }
/** One transparent context for all previews or all seat emojis; no game engine dependencies. */
export class EmojiSpineRenderer {
    private canvas = document.createElement('canvas');
    private context: spine.webgl.ManagedWebGLRenderingContext;
    private shader: spine.webgl.Shader;
    private batch: spine.webgl.PolygonBatcher;
    private renderer: spine.webgl.SkeletonRenderer;
    private projection = new spine.webgl.Matrix4();
    private textures: spine.webgl.GLTexture[] = [];
    private data = new Map<string, Promise<spine.SkeletonData>>();
    private bounds = new Map<string, Bounds>();
    private playing = new Map<string, Playing>();
    private tokens = new Map<string, object>();
    private frame = 0;
    private last = 0;
    private dead = false;
    private lost = false;
    private visibility = () => { this.last = 0; if (document.hidden) this.cancelFrame(); else this.wake(); };
    private contextLost = (event: Event) => { event.preventDefault(); this.lost = true; this.cancelFrame(); };
    private contextRestored = () => {
        try { this.context.restorables.slice().forEach(r => r.restore()); this.lost = false; this.wake(); }
        catch (error) { this.fail(error); }
    };
    constructor(private layer: HTMLElement, private fail: (error: unknown) => void) {
        this.canvas.setAttribute('aria-hidden', 'true');
        this.canvas.className = 'mx-emoji-canvas';
        const gl = this.canvas.getContext('webgl', {alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false});
        if (!gl) throw new Error('WebGL unavailable for emoji');
        this.context = new spine.webgl.ManagedWebGLRenderingContext(gl);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        this.shader = spine.webgl.Shader.newColoredTextured(this.context);
        this.batch = new spine.webgl.PolygonBatcher(this.context, false);
        this.renderer = new spine.webgl.SkeletonRenderer(this.context, false);
        this.renderer.premultipliedAlpha = false;
        layer.append(this.canvas);
        this.canvas.addEventListener('webglcontextlost', this.contextLost);
        this.canvas.addEventListener('webglcontextrestored', this.contextRestored);
        document.addEventListener('visibilitychange', this.visibility);
    }
    private async decode(config: SpineClipConfig, textures: spine.webgl.GLTexture[]): Promise<spine.SkeletonData> {
        const asset = await EmojiSpineAssets.load(config);
        if (this.dead) throw new DOMException('Disposed', 'AbortError');
        const atlas = new spine.TextureAtlas(asset.atlas, name => {
            const image = asset.images.get(name);
            if (!image) throw new Error('Missing emoji texture ' + name);
            const texture = new spine.webgl.GLTexture(this.context, image);
            textures.push(texture);
            return texture;
        });
        return new spine.SkeletonBinary(new spine.AtlasAttachmentLoader(atlas)).readSkeletonData(asset.binary);
    }
    private load(config: SpineClipConfig): Promise<spine.SkeletonData> {
        let task = this.data.get(config.spine);
        if (!task) {
            task = this.decode(config, this.textures).catch(error => { this.data.delete(config.spine); throw error; });
            this.data.set(config.spine, task);
        }
        return task;
    }
    async play(key: string, config: SpineClipConfig, anchor: EffectAnchor, loop = false, fit = false, complete?: (finished: boolean) => void): Promise<boolean> {
        this.stop(key);
        const token = {}; this.tokens.set(key, token);
        // Release large picker textures when this avatar finishes or is replaced.
        const owned = config.loopSeconds ? [] as spine.webgl.GLTexture[] : undefined;
        const release = () => owned?.splice(0).forEach(texture => texture.dispose());
        try {
            const data = await (owned ? this.decode(config, owned) : this.load(config));
            if (this.dead || this.tokens.get(key) !== token) { release(); return false; }
            const skeleton = new spine.Skeleton(data), state = new spine.AnimationState(new spine.AnimationStateData(data));
            const animation = config.animation ? data.findAnimation(config.animation) : data.animations[0];
            if (!animation) throw new Error('Missing emoji animation ' + config.animation);
            if (!config.setupSeconds) {
                state.setAnimation(0, animation.name, loop);
                state.apply(skeleton);
            }
            const bounds = fit ? this.measure(data, {...config, animation: animation.name}) : undefined;
            this.playing.set(key, {skeleton, state, duration: config.setupSeconds ?? animation.duration, limit: config.loopSeconds, elapsed: 0, loop, anchor, bounds,
                complete: finished => { release(); complete?.(finished); }});
            this.wake(); return true;
        } catch (error) {
            release();
            if (this.tokens.get(key) === token) this.tokens.delete(key);
            throw error;
        }
    }
    private measure(data: spine.SkeletonData, config: SpineClipConfig): Bounds {
        const key = config.spine + ':' + config.animation, cached = this.bounds.get(key); if (cached) return cached;
        const animation = data.findAnimation(config.animation)!, skeleton = new spine.Skeleton(data), offset = new spine.Vector2(), size = new spine.Vector2();
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        // CC UIEmojiItem fits 12 samples, so all frames stay inside the preview tile.
        for (let i = 0; i <= 12; i++) {
            skeleton.setToSetupPose();
            animation.apply(skeleton, 0, animation.duration * i / 12, false, [], 1, spine.MixBlend.replace, spine.MixDirection.mixIn);
            skeleton.updateWorldTransform(); skeleton.getBounds(offset, size, []);
            minX = Math.min(minX, offset.x); minY = Math.min(minY, offset.y); maxX = Math.max(maxX, offset.x + size.x); maxY = Math.max(maxY, offset.y + size.y);
        }
        const result = {x: (minX + maxX) / 2, y: (minY + maxY) / 2, size: Math.max(maxX - minX, maxY - minY, 1)};
        this.bounds.set(key, result); return result;
    }
    stop(key: string, finished = false): void { this.tokens.delete(key); const item = this.playing.get(key); this.playing.delete(key); item?.complete?.(finished); this.wake(); }
    clear(): void { this.tokens.clear(); this.playing.forEach(item => item.complete?.(false)); this.playing.clear(); this.wake(); }
    private wake(): void { if (!this.frame && !this.dead && !this.lost && !document.hidden) this.frame = requestAnimationFrame(this.draw); }
    private draw = (time: number): void => {
        this.frame = 0; if (this.dead || this.lost) return;
        try {
            const rect = this.layer.getBoundingClientRect(); if (!rect.width || !rect.height) { this.last = 0; return; }
            const dpr = Math.min(devicePixelRatio || 1, 2), width = Math.max(1, Math.round(rect.width * dpr)), height = Math.max(1, Math.round(rect.height * dpr));
            if (this.canvas.width !== width || this.canvas.height !== height) { this.canvas.width = width; this.canvas.height = height; }
            const gl = this.context.gl; gl.viewport(0, 0, width, height); gl.disable(gl.SCISSOR_TEST); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
            const dt = this.last ? Math.min((time - this.last) / 1000, .1) : 0; this.last = time;
            this.projection.ortho(0, rect.width, 0, rect.height, -1, 1);
            this.shader.bind(); this.shader.setUniformi(spine.webgl.Shader.SAMPLER, 0); this.shader.setUniform4x4f(spine.webgl.Shader.MVP_MATRIX, this.projection.values);
            for (const [key, item] of this.playing) {
                item.elapsed += dt;
                const anchor = item.anchor(item.elapsed, item.duration);
                if (!anchor || (item.elapsed >= (item.limit ?? (item.loop ? Infinity : item.duration)))) { this.stop(key, !!anchor); continue; }
                item.state.update(dt); item.state.apply(item.skeleton);
                const scale = item.bounds ? (anchor.maxSize ?? 130) / item.bounds.size : anchor.scale;
                item.skeleton.scaleX = item.skeleton.scaleY = scale;
                item.skeleton.x = anchor.x - rect.left - (item.bounds?.x ?? 0) * scale;
                item.skeleton.y = rect.height - (anchor.y - rect.top) - (item.bounds?.y ?? 0) * scale;
                item.skeleton.updateWorldTransform();
                if (anchor.rotation) {
                    const cosine = Math.cos(anchor.rotation), sine = Math.sin(anchor.rotation);
                    for (const bone of item.skeleton.bones) {
                        const x = bone.worldX - item.skeleton.x, y = bone.worldY - item.skeleton.y;
                        bone.rotateWorld(anchor.rotation * 180 / Math.PI);
                        bone.worldX = item.skeleton.x + x * cosine - y * sine;
                        bone.worldY = item.skeleton.y + x * sine + y * cosine;
                    }
                }
                if (anchor.clip) {
                    const left = Math.max(rect.left, anchor.clip.left), top = Math.max(rect.top, anchor.clip.top), right = Math.min(rect.right, anchor.clip.right), bottom = Math.min(rect.bottom, anchor.clip.bottom);
                    if (right <= left || bottom <= top) continue;
                    gl.enable(gl.SCISSOR_TEST); gl.scissor(Math.round((left - rect.left) * dpr), Math.round((rect.bottom - bottom) * dpr), Math.round((right - left) * dpr), Math.round((bottom - top) * dpr));
                } else gl.disable(gl.SCISSOR_TEST);
                this.batch.begin(this.shader); this.renderer.draw(this.batch, item.skeleton); this.batch.end();
            }
            gl.disable(gl.SCISSOR_TEST);
            if (this.playing.size) this.wake(); else this.last = 0;
        } catch (error) { this.clear(); this.fail(error); }
    };
    private cancelFrame(): void { cancelAnimationFrame(this.frame); this.frame = 0; }
    destroy(): void {
        if (this.dead) return; this.dead = true; this.cancelFrame(); this.clear();
        document.removeEventListener('visibilitychange', this.visibility);
        this.canvas.removeEventListener('webglcontextlost', this.contextLost); this.canvas.removeEventListener('webglcontextrestored', this.contextRestored);
        this.textures.forEach(t => t.dispose()); this.batch.dispose(); this.shader.dispose(); this.canvas.remove();
        this.context.gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
}
