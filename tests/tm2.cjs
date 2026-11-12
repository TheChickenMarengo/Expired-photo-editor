const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:process.argv[2]?['--js-flags='+process.argv[2]]:[]});const p=await b.newPage({viewport:{width:1280,height:800}});
await p.goto('file:///home/claude/test.html');await p.waitForTimeout(1200);
const r=await p.evaluate(()=>{ const T=window.__T; T.state.stock=T.STOCKS[0]; T.state.P=null; const P0=T.derive(); const o=document.createElement('canvas'); const res={};
  const cases={base:{},flash:{flashType:'direct'},dev:{devT:.6},base2:{}};
  for(const k in cases){ const P=Object.assign({},P0,cases[k]); for(let i=0;i<3;i++) T.develop(T.src.prev,o,P,T.STOCKS[0],T.state.seeds,false); const t0=performance.now(); for(let i=0;i<6;i++){ P.grain=.3+i*.001; T.develop(T.src.prev,o,P,T.STOCKS[0],T.state.seeds,false);} res[k]=((performance.now()-t0)/6).toFixed(0); }
  return res; });
console.log(process.argv[2]||'default',r); await b.close();})();
