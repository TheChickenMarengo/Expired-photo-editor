const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
const rate=+(process.argv[3]||4);
const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,hasTouch:true,isMobile:true}); const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message));
const cdp0=await ctx.newCDPSession(p); await cdp0.send('Emulation.setCPUThrottlingRate',{rate});
await p.goto('file:///home/claude/'+(process.argv[2]||'test.html'));await p.waitForTimeout(3000);
await p.evaluate(()=>document.getElementById('cta').style.display='none');
const cdp=await ctx.newCDPSession(p);
const cases=[['film','years'],['light','s-ucon'],['light','s-grain'],['camera','s-flashPow',true],['dark','s-sabattier']];
for(const [tab,id,flash] of cases){
  await p.evaluate(t=>document.querySelector(`#tabs button[data-tab=${t}]`).click(),tab);
  if(flash) await p.evaluate(()=>document.querySelector('#flashSeg button[data-k=direct]').click());
  await p.evaluate(id=>document.getElementById(id).scrollIntoView({block:'center'}),id); await p.waitForTimeout(2500);
  const bb=await p.evaluate(id=>{const r=document.getElementById(id).getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height};},id); const cy=bb.y+bb.h/2;
  await p.evaluate(()=>{ window.__fr=[]; let last=performance.now(); window.__run=true; const tick=()=>{ const n=performance.now(); window.__fr.push(n-last); last=n; if(window.__run) requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
  const T=(type,x)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x,y:cy}]});
  const fr0=await p.evaluate(id=>{const e=document.getElementById(id); return (+e.value-(+e.min))/((+e.max)-(+e.min)||1);},id); const x0=bb.x+16+(bb.w-32)*fr0; const t0=Date.now(); await T('touchStart',x0);
  for(let i=1;i<=60;i++){ await T('touchMove',Math.min(bb.x+bb.w-16,Math.max(bb.x+16,x0+(fr0<.5?1:-1)*i*(bb.w-60)/60))); await new Promise(r=>setTimeout(r,16)); }
  const dur=Date.now()-t0; await T('touchEnd');
  const moved=await p.evaluate(id=>+document.getElementById(id).value,id); const fr=await p.evaluate(()=>{ window.__run=false; return window.__fr.slice(2); });
  const f=[...fr].sort((a,b)=>a-b); const over=th=>Math.round(100*f.filter(x=>x>th).length/f.length);
  console.log(id.padEnd(11),`frame median ${f[f.length>>1].toFixed(0)}ms  p90 ${f[Math.floor(f.length*.9)].toFixed(0)}ms  worst ${f[f.length-1].toFixed(0)}ms | frames >34ms: ${over(34)}%  >50ms: ${over(50)}% | 60-move gesture took ${dur}ms (ideal ~1000) | value moved ${(fr0).toFixed(2)}→${((moved-0)).toFixed(2)}`);
  await p.waitForTimeout(800);
}
console.log(errs.join('\n')||'no errors'); await b.close();})();
