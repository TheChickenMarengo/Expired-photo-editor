const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:800}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/claude/test.html');await p.waitForTimeout(900);
const ids=await p.evaluate(()=>[...document.querySelectorAll('#panel input[type=range]')].map(e=>e.id).filter(i=>i.startsWith('s-')));
for(const id of ids){ await p.evaluate(i=>{const e=document.getElementById(i); e.value=(+e.min+ (+e.max-+e.min)*0.6); e.dispatchEvent(new Event('input')); e.dispatchEvent(new Event('change'));},id); }
await p.waitForTimeout(1500);
await p.locator('#view').screenshot({path:'allon.png'});
console.log(ids.length, errs.join('\n')||'ok');await b.close();})();
