const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require(process.env.MX_PLAYWRIGHT_MODULE || 'playwright-core');

const lobby = process.env.MX_H5_URL || 'http://127.0.0.1:5175';
const game = process.env.MX_ASSET_URL || 'http://127.0.0.1:4180';
const output = process.env.MX_OUTPUT_DIR;
const panels = {
  menu: '.mx-menu-panel', settings: '.mx-personal-settings', report: '.mx-record-panel',
  history: '.mx-record-panel', chat: '.mx-record-panel', emoji: '.mx-emoji-panel', 'insurance-rules': '.mx-record-panel',
  'bring-wallet': '.mx-buyin-panel',
};

async function readArt(root) {
  const urls = new Set();
  for (const element of [root, ...root.querySelectorAll('*')]) {
    if (!element.getClientRects().length && !element.matches('.mx-preloading')) continue;
    if (element.matches('img') && element.currentSrc) urls.add(element.currentSrc);
    for (const pseudo of [null, '::before', '::after']) {
      const css = getComputedStyle(element, pseudo);
      for (const value of [css.backgroundImage, css.maskImage, css.borderImageSource, css.content]) {
        for (const match of value.matchAll(/url\("([^"]+)"\)/g)) urls.add(match[1]);
      }
    }
  }
  const local = [...urls].filter(url => /^https?:/.test(url) && new URL(url).pathname.includes('/src/assets/'));
  return Promise.all(local.map(async url => {
    const image = new Image();
    image.src = url;
    try { await image.decode(); return { url, ok: image.naturalWidth > 0 }; }
    catch { return { url, ok: false }; }
  }));
}

async function main() {
  assert.notEqual(new URL(game).origin, new URL(lobby).origin);
  const browser = await chromium.launch({ executablePath: process.env.MX_CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1100, height: 1100 } });
    const verified = new Set();
    function check(images) {
      assert.ok(images.length, 'Expected local artwork');
      for (const {url, ok} of images) {
        assert.equal(new URL(url).origin, new URL(game).origin, url);
        assert.ok(ok, 'Image decode failed: ' + url);
        verified.add(new URL(url).pathname);
      }
    }
    await page.goto(lobby + '/#/home');
    const preload = page.locator('#mx-table-host .mx-game[data-skin=style3] .mx-preloading');
    await preload.waitFor({ state: 'attached' });
    check(await preload.evaluate(readArt));

    // Run the actual table components at the same pair of origins, without a player session.
    const fixture = await fs.readFile(path.join(__dirname, 'layout-audit.html'), 'utf8');
    if (output) await fs.mkdir(output, {recursive: true});
    for (const scene of ['figma', 'observer', ...Object.keys(panels)]) {
      const query = new URLSearchParams({ scene:scene === 'emoji' ? 'figma' : scene, skin:'style3', avatars:'fallback', cardBack:'original', seats:'8', bb:'1', action:'1' });
      // Navigate first so Chrome assigns the real loopback address space.
      // Only the DOM in this isolated browser session is replaced.
      await page.goto(lobby + '/?' + query + '#/home', {waitUntil:'domcontentloaded'});
      await page.evaluate(markup => {
        document.open();
        document.write(markup);
        document.close();
      }, fixture.replace('src="/tests/', 'src="' + game + '/tests/'));
      const stage = page.locator('#audit-stage[data-ready=true]');
      await stage.locator('.mx-table[data-felt]').waitFor();
      if (scene === 'observer') {
        await stage.locator('.mx-table-safety').click({timeout:3000});
        assert.match(await page.locator('#audit-log').innerText(), /安全卫士：离线入口/);
        await stage.locator('.mx-support-button').click({timeout:3000});
        assert.match(await page.locator('#audit-log').innerText(), /客服：离线入口/);
      }
      if (scene === 'emoji') await stage.locator('.mx-nav-button[data-action=emoji]').click();
      if (panels[scene]) await stage.locator(panels[scene]).filter({visible:true}).first().waitFor();
      const images = await stage.evaluate(readArt);
      check(images);
      if (scene === 'figma') {
        for (const art of ['night-harbor.webp','crew.webp','seat-plate.webp','key-graphite.webp','key-cyan.webp','key-hazard.webp','key-console.webp','console-icons.svg','circuit-back.svg','cap-lagoon.svg','cap-cherry.svg','cap-violet.svg','cap-steel.svg','cap-amber.svg']) {
          assert.ok(images.some(image => new URL(image.url).pathname.endsWith('/'+art)), art);
        }
      }
      if (output) await stage.screenshot({path:path.join(output,scene+'.png'),animations:'disabled'});
      console.log(scene, images.length, 'decoded');
    }
    console.log(verified.size, 'distinct local images verified');
  } finally { await browser.close(); }
}
main().catch(error => {console.error(error);process.exitCode=1;});
