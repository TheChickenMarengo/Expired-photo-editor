const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:800}});
await p.goto('file:///home/claude/test.html');await p.waitForTimeout(1200);
const cdp=await p.context().newCDPSession(p); await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval',{interval:200});
const mode=process.argv[2]||'prev';
await cdp.send('Profiler.start');
const t=await p.evaluate((mode)=>{ const T=window.__T; T.state.stock=T.STOCKS[0]; T.state.P=null; const P=T.derive(); if(mode!=='base') Object.assign(P,{flashType:'direct',bloom:.3});
  let srcC=T.src.prev; if(mode==='big'){ srcC=document.createElement('canvas'); srcC.width=4000; srcC.height=3000; const x=srcC.getContext('2d'); x.drawImage(T.src.full,0,0,4000,3000); }
  if(mode==='pin') P.camType='pinhole'; if(mode==='disp') P.camType='disposable';
  const o=document.createElement('canvas'); const t0=performance.now(); const n=mode==='big'?1:8;
  for(let i=0;i<n;i++){ P.grain=.3+i*.01; T.develop(srcC,o,P,T.STOCKS[0],T.state.seeds,false); } return (performance.now()-t0)/n; },mode);
const {profile}=await cdp.send('Profiler.stop');
const self={}; const byId={}; profile.nodes.forEach(n=>byId[n.id]=n);
const dt=profile.timeDeltas; const cnt={}; profile.samples.forEach((id,i)=>{cnt[id]=(cnt[id]||0)+(dt[i]||0);});
for(const id in cnt){ const n=byId[id]; const k=n.callFrame.functionName+':'+n.callFrame.lineNumber; self[k]=(self[k]||0)+cnt[id]; }
const tot=Object.values(self).reduce((a,b)=>a+b,0);
console.log(mode,'ms per render',t.toFixed(0));
Object.entries(self).sort((a,b)=>b[1]-a[1]).slice(0,16).forEach(([k,v])=>console.log((v/tot*100).toFixed(1).padStart(5)+'%',k));
await b.close();})();
