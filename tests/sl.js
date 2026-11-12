const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,hasTouch:true});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/claude/test.html');await p.waitForTimeout(900);
await p.click('#tabs button[data-tab=light]');await p.waitForTimeout(300);
const el=p.locator('#s-grain'); const bb=await el.boundingBox(); const v0=await el.inputValue();
// tap the track far from the dot
await p.touchscreen.tap(bb.x+bb.width*0.95,bb.y+bb.height/2); await p.waitForTimeout(200); const v1=await el.inputValue();
await p.mouse.click(bb.x+bb.width*0.95,bb.y+bb.height/2); await p.waitForTimeout(200); const v2=await el.inputValue();
// drag from the dot
const frac=(+v0-0)/(1-0); const tx=bb.x+12+(bb.width-24)*frac;
await p.mouse.move(tx,bb.y+bb.height/2); await p.mouse.down(); await p.mouse.move(tx+80,bb.y+bb.height/2,{steps:6}); await p.mouse.up(); await p.waitForTimeout(200); const v3=await el.inputValue();
// swipe to scroll over a slider
const sc0=await p.evaluate(()=>document.getElementById('panel').scrollTop);
await p.mouse.wheel(0,300); await p.waitForTimeout(300); const sc1=await p.evaluate(()=>document.getElementById('panel').scrollTop);
console.log({v0,afterTap:v1,afterClick:v2,afterDragDot:v3,scrolled:sc1>sc0});
console.log(await p.evaluate(()=>[...document.querySelectorAll('#tabs button')].map(b=>b.dataset.tab).join(',')));
console.log(errs.join('\n')||'ok');await b.close();})();
