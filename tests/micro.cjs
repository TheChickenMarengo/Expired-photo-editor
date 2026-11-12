const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});
await p.goto('file:///home/claude/test.html');await p.waitForTimeout(1200);
const r=await p.evaluate(()=>{ const T=window.__T; const time=(f,n)=>{ const t=performance.now(); for(let i=0;i<n;i++) f(); return ((performance.now()-t)/n*1000).toFixed(1)+' µs'; };
  const s=T.SLIDERS.find(z=>z.k==='grain'), el=T.inputs.grain;
  return { defs_cached: time(()=>T.defs(),20000), updateTabDots: time(()=>T.updateTabDots(),2000), valueFor: time(()=>T.valueFor(s,.5),2000),
    inputEventTotal: time(()=>{ el.value=(Math.random()*2).toFixed(2); el.dispatchEvent(new Event('input')); },500) }; });
console.log(r); await b.close();})();
