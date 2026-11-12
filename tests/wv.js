const {chromium}=require('playwright');
(async()=>{const errs=[];const b=await chromium.launch();
for(const scheme of ['light','dark']){
const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,colorScheme:scheme});p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/claude/test.html');await p.waitForTimeout(1000);
await p.click('#tabs button[data-tab=light]');await p.waitForTimeout(400);
if(scheme==='dark'){ // glitch mid-drag
  const el=p.locator('#s-grain'), bb=await el.boundingBox(); const v=+await el.inputValue(); const tx=bb.x+12+(bb.width-24)*v;
  await p.mouse.move(tx,bb.y+bb.height/2); await p.mouse.down(); await p.mouse.move(tx+60,bb.y+bb.height/2,{steps:3});
  await p.waitForTimeout(40); await p.locator('#panel').screenshot({path:'wv_glitch.png'}); await p.mouse.up(); }
await p.waitForTimeout(400); await p.locator('#panel').screenshot({path:'wv_'+scheme+'.png'});
await p.click('#tabs button[data-tab=light]');await p.waitForTimeout(400); await p.locator('#panel').screenshot({path:'wv_c_'+scheme+'.png'});
}
console.log(errs.join('\n')||'ok');await b.close();})();
