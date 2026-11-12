const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,hasTouch:true,isMobile:true}); const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/claude/'+(process.argv[2]||'past-due.html'));await p.waitForTimeout(1000);
await p.evaluate(()=>document.getElementById('cta').style.display='none');
const cases=[['film','years'],['film','isoSl'],['film','rateSl'],['light','s-ucon'],['light','s-grain'],['camera','s-flashPow',true],['dark','s-sabattier']];
for(const [tab,id,flash] of cases){
  await p.evaluate(t=>document.querySelector(`#tabs button[data-tab=${t}]`).click(),tab);
  if(flash) await p.evaluate(()=>document.querySelector('#flashSeg button[data-k=direct]').click());
  await p.waitForTimeout(1200);   // let the pre-warm run, as it would while you look at the photo
  const r=await p.evaluate(async(id)=>{ const e=document.getElementById(id), v=document.getElementById('view'); const mn=+e.min,mx=+e.max;
    const box=()=>{const r=v.getBoundingClientRect(); return Math.round(r.width)+'x'+Math.round(r.height);};
    const before=box(); const boxes=new Set(), px=new Set(); const frames=[]; let last=performance.now(), run=true; const tick=()=>{ const n=performance.now(); frames.push(n-last); last=n; if(run) requestAnimationFrame(tick); }; requestAnimationFrame(tick);
    for(let i=0;i<70;i++){ e.value=mn+(mx-mn)*(i/69); e.dispatchEvent(new Event('input')); await new Promise(r=>setTimeout(r,16)); boxes.add(box()); px.add(v.width+'x'+v.height); }
    e.dispatchEvent(new Event('change')); await new Promise(r=>setTimeout(r,500)); run=false; const after=box();
    const f=frames.slice(2).sort((a,b)=>a-b);
    return {before,duringShown:[...boxes].join(' '),after,pixelSizesDuring:[...px].join(' '),median:f[f.length>>1].toFixed(0),p90:f[Math.floor(f.length*.9)].toFixed(0),max:f[f.length-1].toFixed(0),over50:f.filter(x=>x>50).length+'/'+f.length}; },id);
  console.log(id.padEnd(10),JSON.stringify(r));
}
console.log(errs.join('\n')||'no errors'); await b.close();})();
