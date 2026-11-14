const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();
for(const f of ['test-before.html','test.html']){ const p=await (await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true})).newPage();
await p.goto('file:///home/claude/'+f+'?clean');await p.waitForTimeout(600);await p.setInputFiles('#file','/home/claude/room.jpg');await p.waitForTimeout(2500);
const cdp=await p.context().newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate',{rate:20}); await p.click('.tabs [data-tab=light]'); await p.waitForTimeout(300);
await p.evaluate(()=>{ const s=document.getElementById('s-grain'); s.value=1.2; s.dispatchEvent(new Event('input',{bubbles:true})); s.dispatchEvent(new Event('change',{bubbles:true})); });
await p.waitForTimeout(6000);
// pretend this is a very slow phone, then drag without releasing
for(const v of [1.1,1.3,1.15]){ await p.evaluate(v=>{ const s=document.getElementById('s-grain'); s.value=v; s.dispatchEvent(new Event('input',{bubbles:true})); },v); await p.waitForTimeout(500);} 
await p.evaluate(()=>{ const s=document.getElementById('s-grain'); s.value=1.25; s.dispatchEvent(new Event('input',{bubbles:true})); });
await p.evaluate(()=>{ let v=1.1; window.__iv=setInterval(()=>{ v=v>1.3?1.1:v+.02; const s=document.getElementById('s-grain'); s.value=v; s.dispatchEvent(new Event('input',{bubbles:true})); },150); });
await p.waitForTimeout(3000);
const w=await p.evaluate(()=>document.getElementById('view').width);
await p.locator('.frame').screenshot({path:`/tmp/drag_${f.replace('.html','')}.png`}); console.log(f,'preview px',w);}
await b.close();})();
