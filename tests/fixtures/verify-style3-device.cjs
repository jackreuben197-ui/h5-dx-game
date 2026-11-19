const assert = require('node:assert/strict');
const { chromium } = require(process.env.MX_PLAYWRIGHT_MODULE || 'playwright-core');

async function verify() {
  const browser = await chromium.launch({executablePath: process.env.MX_CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
  try {
    for (const [width, height, scene] of [[393,852,'figma'], [393,659,'figma'], [390,690,'figma'], [393,659,'media-video'], [852,393,'figma']]) {
      const page = await browser.newPage({screen:{width,height:width>height?393:852}, viewport:{width,height}, deviceScaleFactor:3, isMobile:true, hasTouch:true});
      const query = new URLSearchParams({skin:'style3',viewport:'device',scene,tribe:'1',quick:'3',action:'1',orientation:'auto',avatars:'fallback'});
      await page.goto((process.env.MX_AUDIT_URL || 'http://127.0.0.1:5183')+'/tests/fixtures/layout-audit.html?'+query);
      const stage = page.locator('#audit-stage[data-ready=true]');
      await stage.locator('.mx-table[data-felt]').waitFor();
      const metrics = await stage.evaluate(root => {
        function bounds(selector) {
          const e = root.querySelector(selector);
          return e?.checkVisibility() ? e.getBoundingClientRect().toJSON() : null;
        }
        function hit(selector) {
          const target = root.querySelector(selector);
          const box = target.getBoundingClientRect();
          return target.contains(document.elementFromPoint(box.x+box.width/2, box.y+box.height/2));
        }
        const add = '.mx-table-add-chips', chat = '.mx-chat-button';
        return {width:root.clientWidth, height:root.clientHeight, chat:bounds(chat), nav:bounds('.mx-navigation'),
          add:bounds(add), cap:bounds(add+' .mx-table-tool-icon'), plus:bounds(add+' .mx-table-tool-plus'),
          shield:bounds('.mx-table-safety'), hitChat:hit(chat), hitAdd:hit(add)};
      });
      const {add,cap,plus,chat,nav,shield} = metrics;
      assert.equal(metrics.width,width);assert.equal(metrics.height,height);
      for (const box of [cap,plus]) {
        assert.ok(box && box.left>=add.left && box.right<=add.right && box.top>=add.top && box.bottom<=add.bottom, JSON.stringify(metrics));
      }
      assert.ok(shield && add.right<=shield.left+1,JSON.stringify(metrics));
      assert.ok(chat.left<15 && chat.top>height/2, JSON.stringify(metrics));
      assert.ok(metrics.hitChat && metrics.hitAdd,JSON.stringify(metrics));
      if (width<height && scene==='figma') assert.ok(chat.top>=nav.top && chat.bottom<=nav.bottom);
      if(process.env.MX_OUTPUT_DIR) await page.screenshot({path:process.env.MX_OUTPUT_DIR+'/device-'+width+'x'+height+'-'+scene+'.png'});
      await page.locator('.mx-chat-button').tap();
      await page.locator('.mx-chat-dialog:visible').waitFor({timeout:3000});
      console.log(width+'×'+height+' '+scene+' passed');
      await page.close();
    }
  } finally { await browser.close(); }
}
verify().catch(error => {console.error(error);process.exitCode=1;});
