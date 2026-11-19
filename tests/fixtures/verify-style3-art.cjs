const assert = require('node:assert/strict');
const { chromium } = require(process.env.MX_PLAYWRIGHT_MODULE || 'playwright-core');

async function audit() {
  const browser = await chromium.launch({executablePath:process.env.MX_CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
  try {
    const page = await browser.newPage({screen:{width:393,height:852},viewport:{width:393,height:659},deviceScaleFactor:3,isMobile:true,hasTouch:true});
    const base = (process.env.MX_AUDIT_URL || 'http://127.0.0.1:5183')+'/tests/fixtures/layout-audit.html';
    await page.goto(base+'?skin=style3');
    const select = page.locator('select[aria-label=scene]');
    await select.waitFor();
    const scenes = await select.locator('option').evaluateAll(options => options.map(option => option.value));
    const original = new Map();
    for (const scene of scenes) {
      const params = new URLSearchParams({scene,skin:'style3',viewport:'device',tribe:'1',action:'1',quick:'3',avatars:'fallback',cardBack:'original'});
      await page.goto(base+'?'+params);
      await page.locator('#audit-stage[data-ready=true]').waitFor();
      const resources = await page.locator('#audit-stage').evaluate(stage => {
        const result = [];
        for (const element of stage.querySelectorAll('*')) {
          if (!element.getClientRects().length || !element.checkVisibility({opacityProperty:true,visibilityProperty:true})) continue;
          for (const pseudo of [null,'::before','::after']) {
            const css = getComputedStyle(element,pseudo);
            if (pseudo && ['none','normal'].includes(css.content)) continue;
            const values = [css.backgroundImage,css.maskImage,css.borderImageSource,css.content];
            if (!pseudo && element instanceof HTMLImageElement && css.content==='normal') values.push(element.currentSrc);
            for (const value of values) {
              for (const match of value.matchAll(/\/src\/assets\/style1\/resources\/([^"')]+)/g)) {
                const file = match[1];
                // AuditRecords supplies a real image URL in its mock player profiles.
                const allowed = (file==='raw/ui/cert.png' && element.matches('.mx-nav-logo')) ||
                  (file==='raw/ui/avatar.png' && element instanceof HTMLImageElement);
                result.push({file,allowed,component:element.className});
              }
            }
          }
        }
        return result;
      });
      for (const resource of resources) {
        assert.ok(resource.allowed,JSON.stringify({scene,...resource}));
        original.set(resource.file,(original.get(resource.file) || 0)+1);
      }
    }
    console.log(scenes.length+' registered scenarios passed. Original artwork observed:',[...original.keys()].sort());
  } finally { await browser.close(); }
}
audit().catch(error => { console.error(error);process.exitCode=1; });
