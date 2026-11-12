const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:800}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/claude/test.html');await p.waitForTimeout(900);
await p.setInputFiles('#file',{name:'streak.png',mimeType:'image/png',buffer:require('fs').readFileSync('streak.png')});await p.waitForTimeout(1200);
const set=async(k,v)=>{await p.evaluate(([k,v])=>{const e=document.getElementById('s-'+k); e.value=v; e.dispatchEvent(new Event('input')); e.dispatchEvent(new Event('change'));},[k,v]);await p.waitForTimeout(150);};
for(const k of ['leak','dust','fib','scratch','stains']) await set(k,'0');
await p.click('#tabs button[data-tab=crop]'); await p.waitForTimeout(300);
await p.click('#ratioSeg button[data-k="1:1"]'); await p.waitForTimeout(400);
await p.evaluate(()=>{const e=document.getElementById('cropAngle'); e.value=5; e.dispatchEvent(new Event('input')); e.dispatchEvent(new Event('change'));}); await p.waitForTimeout(500);
const bb=await p.locator('#view').boundingBox(); await p.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2); await p.mouse.down(); await p.mouse.move(bb.x+bb.width/2+150,bb.y+bb.height/2,{steps:6}); await p.mouse.up(); await p.waitForTimeout(500);
await p.click('#tabs button[data-tab=light]'); await p.click('#healBtn');
await p.evaluate(()=>{const e=document.getElementById('spotSize'); e.value=0.025; e.dispatchEvent(new Event('input'));});
await p.waitForTimeout(300);
const a=[235,243], z=[512,428]; await p.mouse.move(a[0],a[1]); await p.mouse.down();
for(let i=1;i<=24;i++){ await p.mouse.move(a[0]+(z[0]-a[0])*i/24, a[1]+(z[1]-a[1])*i/24); }
await p.mouse.up(); await p.waitForTimeout(800);
await p.click('#healBtn'); await p.waitForTimeout(600);
await p.screenshot({path:'c_painted.png'});
// back to crop tab, reset crop: the repair should stay on the streak in the uncropped photo
await p.click('#tabs button[data-tab=crop]'); await p.click('#cropReset'); await p.waitForTimeout(600);
await p.locator('#view').screenshot({path:'c_uncropped.png'});
console.log(errs.join('\n')||'ok');await b.close();})();
