const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,hasTouch:true,isMobile:true}); const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/claude/test.html');await p.waitForTimeout(900);
await p.evaluate(()=>document.getElementById('cta').style.display='none');
await p.evaluate(()=>document.querySelector('#tabs button[data-tab=camera]').click()); await p.evaluate(()=>document.querySelector('#flashSeg button[data-k=direct]').click()); await p.waitForTimeout(600);
await p.evaluate(()=>document.getElementById('s-flashPow').scrollIntoView({block:'center'})); await p.waitForTimeout(300);
const size=()=>p.evaluate(()=>{const c=document.getElementById('view'); return c.width+'x'+c.height;});
console.log('idle size',await size());
const cdp=await ctx.newCDPSession(p);
const bb=await p.evaluate(()=>{const r=document.getElementById('s-flashPow').getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height};}); const cy=bb.y+bb.h/2;
const T=(type,x,y)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x,y}]});
const x0=bb.x+16+(bb.w-32)*.75; await T('touchStart',x0,cy); const sizes=new Set();
for(let i=1;i<=30;i++){ await T('touchMove',x0-i*8,cy); await p.waitForTimeout(16); sizes.add(await size()); }
console.log('sizes seen DURING the drag:',[...sizes].join(', '));
await T('touchEnd'); await p.waitForTimeout(500); console.log('after release',await size());
// simulate a phone that never sends "change": block it, drag, lift
await p.evaluate(()=>{ document.getElementById('s-flashPow').addEventListener('change',e=>e.stopImmediatePropagation(),true); });
await T('touchStart',x0-240,cy); for(let i=1;i<=10;i++){ await T('touchMove',x0-240+i*6,cy); await p.waitForTimeout(16);} const dur=await size(); await T('touchEnd'); await p.waitForTimeout(600);
console.log('no-change-event case: during',dur,'-> 600ms after lift',await size());
console.log(errs.join('\n')||'no errors'); await b.close();})();
