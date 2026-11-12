const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];
for(const scheme of ['light','dark']){
const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,colorScheme:scheme});p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/claude/test.html');await p.waitForTimeout(1000);
await p.evaluate(()=>document.getElementById('cta').style.display='none');
await p.click('#tabs button[data-tab=light]');await p.waitForTimeout(300);
await p.screenshot({path:'th_'+scheme+'.png'});}
const d=await b.newPage({viewport:{width:1280,height:800},colorScheme:'light'});await d.goto('file:///home/claude/test.html');await d.waitForTimeout(1000);
await d.click('#tabs button[data-tab=film]');await d.waitForTimeout(300);await d.screenshot({path:'th_desk.png'});
console.log(errs.join('\n')||'ok');await b.close();})();
