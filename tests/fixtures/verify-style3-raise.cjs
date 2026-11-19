const assert = require('node:assert/strict');
const { chromium } = require(process.env.MX_PLAYWRIGHT_MODULE || 'playwright-core');

// Only exercise the offline AuditHost. No H5 session or game server is involved.
async function verify() {
  const browser = await chromium.launch({
    executablePath: process.env.MX_CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });
  try {
    const page = await browser.newPage({viewport:{width:1050,height:1150},hasTouch:true});
    const base = process.env.MX_AUDIT_URL || 'http://127.0.0.1:5183';
    const range = page.locator('.mx-raise-range');
    const amount = page.locator('.mx-raise-amount');
    const confirm = page.locator('.mx-raise-confirm');
    const commands = page.locator('#audit-log li').filter({hasText:'本地操作成功'});
    const touch = await page.context().newCDPSession(page);
    for (const [width,height,layout,submit] of [
      [390,690,'balanced','confirm'], [320,400,'original','confirm'],
      [440,782,'classic','release'], [844,440,'oval','confirm'],
    ]) {
      const params = new URLSearchParams({skin:'style3',scene:'raise',action:'1',layout,submit,
        width:String(width),height:String(height),orientation:width>height?'auto':'portrait'});
      await page.goto(base+'/tests/fixtures/layout-audit.html?'+params);
      await range.waitFor();
      assert.ok(await amount.isVisible());
      assert.match(await amount.innerText(), /0%/);
      assert.ok((await page.locator('.mx-raise-value').innerText()).trim());
      const editor = await page.locator('.mx-raise-editor').boundingBox();
      const stage = await page.locator('#audit-stage').boundingBox();
      const nav = await page.locator('.mx-navigation').boundingBox();
      assert.ok(editor.y >= stage.y+height/2 && editor.height < height/3, JSON.stringify(editor));
      if(width>height) assert.ok(editor.x+editor.width <= nav.x+1);
      else assert.ok(editor.y+editor.height <= nav.y+1);
      const box = await range.boundingBox();
      assert.ok(box.width>box.height && box.height>=44);
      const start = box.x+13, end = box.x+box.width-13, y=box.y+box.height/2;
      if(submit === 'release') {
        assert.ok(await confirm.isHidden());
        await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:start,y}]});
        await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:(start+end)/2,y}]});
        assert.ok(Number(await range.inputValue())>0);
        assert.equal(await commands.count(),0);
        await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
      } else {
        await page.mouse.move(start,y);
        await page.mouse.down();
        await page.mouse.move(end,y,{steps:8});
        await page.mouse.up();
        assert.equal(await range.inputValue(),await range.getAttribute('max'));
        assert.match(await amount.innerText(), /100%/);
        await range.press('Home');
        assert.equal(await range.inputValue(),'0');
        assert.equal(await commands.count(),0);
        await page.locator('.mx-operation-cancel').click();
        assert.ok(await range.isHidden());
        assert.equal(await commands.count(),0);
        await page.locator('.mx-operation-raise').click();
        await range.press('ArrowRight');
        assert.equal(await range.inputValue(),'1');
        await confirm.click();
      }
      await commands.first().waitFor();
      assert.equal(await commands.count(),1);
      assert.match(await commands.first().innerText(),/加注/);
      console.log(width+'×'+height, layout, submit, 'passed');
    }
  } finally { await browser.close(); }
}
verify().catch(error=>{ console.error(error);process.exitCode=1; });
