const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--enable-precise-memory-info','--js-flags=--expose-gc']});const p=await b.newPage({viewport:{width:1280,height:800}});
const errs=[];p.on('pageerror',e=>errs.push(e.stack.split('\n').slice(0,3).join(' | ')));
await p.goto('file:///home/claude/test.html');await p.waitForTimeout(1200);
const r=await p.evaluate(async()=>{
  const T=window.__T, out=[], bad=[];
  const stat=c=>{ const x=c.getContext('2d'), d=x.getImageData(0,0,c.width,c.height).data; let s=0,s2=0,n=0,mn=255,mx=0;
    for(let i=0;i<d.length;i+=4*37){ const l=(d[i]+d[i+1]+d[i+2])/3; s+=l; s2+=l*l; n++; if(l<mn)mn=l; if(l>mx)mx=l; } const m=s/n; return {m, sd:Math.sqrt(Math.max(0,s2/n-m*m)), mn, mx, W:c.width, H:c.height}; };
  const base=T.src.prev, outC=document.createElement('canvas');
  const run=(P,stock,tag,srcC)=>{ const t0=performance.now(); try{ T.develop(srcC||base,outC,P,stock,T.state.seeds,false);}catch(e){ bad.push(tag+': THROW '+e.message); return; }
    const dt=performance.now()-t0, st=stat(outC); if(!(st.sd>1.5) || isNaN(st.m)) bad.push(tag+': flat output m='+st.m.toFixed(1)+' sd='+st.sd.toFixed(2)); return dt; };
  // A: stocks x camera x flash
  let times=[];
  for(const s of T.STOCKS){ T.state.stock=s; T.state.iso=s.iso; T.state.P=null; const P0=T.derive();
    for(const ct of ['standard','disposable','pinhole']) for(const fl of ['off','direct','instant','bounce','slow']){
      const P=Object.assign({},P0,{camType:ct,flashType:fl,pinPaper:ct==='pinhole'&&fl==='bounce',flashOrbs:fl==='direct'?.5:0}); const dt=run(P,s,`A ${s.id}/${ct}/${fl}`); if(dt) times.push(dt); } }
  out.push('A combos '+times.length+' avg '+(times.reduce((a,b)=>a+b,0)/times.length).toFixed(0)+'ms max '+Math.max(...times).toFixed(0));
  // B: each slider at min and max
  T.state.stock=T.STOCKS[0]; T.state.P=null; const PB=T.derive();
  for(const sl of T.SLIDERS){ for(const v of [sl.min,sl.max]){ const P=Object.assign({},PB,{[sl.k]:v}); run(P,T.STOCKS[0],`B ${sl.k}=${v}`); } }
  out.push('B sliders '+T.SLIDERS.length);
  // C: everything maxed, everything min
  const Pmax=Object.assign({},PB), Pmin=Object.assign({},PB); T.SLIDERS.forEach(sl=>{Pmax[sl.k]=sl.max; Pmin[sl.k]=sl.min;});
  Pmax.devT=1; Pmin.devT=1; run(Pmax,T.STOCKS[0],'C all max'); run(Pmin,T.STOCKS[0],'C all min');
  // D: random combos
  let seed=1; const R=()=>{seed=(seed*16807)%2147483647; return seed/2147483647;};
  const opts={flashType:['off','direct','instant','bounce','slow'],camType:['standard','disposable','pinhole'],debris:['camera','scanner','both'],devType:['standard','soft','lith'],toneK:['sepia','selenium','gold','blue'],paperBase:['neutral','warm','cool'],paperSurf:['glossy','fibre','matte']};
  for(let k=0;k<60;k++){ const s=T.STOCKS[Math.floor(R()*T.STOCKS.length)]; const P=Object.assign({},PB);
    T.SLIDERS.forEach(sl=>{ if(R()<.5) P[sl.k]=sl.min+(sl.max-sl.min)*R(); }); for(const o in opts) P[o]=opts[o][Math.floor(R()*opts[o].length)];
    P.devStop=R()<.7; P.devDry=R()<.2; P.frame=R()<.3; P.pinPaper=R()<.3; P.devT=Math.max(.3,P.devT); run(P,s,'D random '+k); }
  out.push('D random 60');
  // E: odd sizes
  const mk=(w,h)=>{const c=document.createElement('canvas'); c.width=w; c.height=h; const x=c.getContext('2d'); const g=x.createLinearGradient(0,0,w,h); g.addColorStop(0,'#234'); g.addColorStop(1,'#fc8'); x.fillStyle=g; x.fillRect(0,0,w,h); x.fillStyle='#fff'; x.fillRect(w*.3,h*.3,w*.2,h*.2); return c;};
  for(const [w,h] of [[1,1],[2,2],[7,5],[3,1000],[1000,3],[50,50],[640,1600],[2000,9]]){ for(const ct of ['standard','disposable','pinhole']){ const P=Object.assign({},PB,{camType:ct,flashType:'direct',bloom:.5,hal:.5}); const c=mk(w,h); try{ T.develop(c,outC,P,T.STOCKS[0],T.state.seeds,true); }catch(e){ bad.push(`E ${w}x${h} ${ct}: THROW ${e.message}`);} } }
  out.push('E odd sizes');
  // F: big export timing (12MP and 24MP)
  for(const [w,h] of [[4000,3000],[6000,4000]]){ const c=mk(w,h); for(const ct of ['standard','pinhole']){ const P=Object.assign({},PB,{camType:ct,flashType:'direct',bloom:.4,dust:.5,fib:.5,scratch:.5});
    const t0=performance.now(); try{ T.develop(c,outC,P,T.STOCKS[0],T.state.seeds,true); out.push(`F ${w}x${h} ${ct} ${(performance.now()-t0).toFixed(0)}ms`);}catch(e){bad.push(`F ${w}x${h}: THROW ${e.message}`);} } }
  // G: memory / cache growth after many renders
  const m0=performance.memory.usedJSHeapSize;
  for(let k=0;k<80;k++){ const P=Object.assign({},PB,{grain:R(),dust:R(),stains:R(),leak:R(),camType:k%3?'standard':'pinhole'}); T.state.seeds.dust=k; T.state.seeds.leak=k; run(P,T.STOCKS[k%T.STOCKS.length],'G '+k); }
  if(window.gc) gc(); const m1=performance.memory.usedJSHeapSize;
  out.push(`G heap ${(m0/1e6).toFixed(0)}MB -> ${(m1/1e6).toFixed(0)}MB  POOL ${T.POOL.size} LCACHE ${T.LCACHE.size} FCACHE ${T.FCACHE.size} HCACHE ${T.HCACHE.size} CCACHE ${T.CCACHE.size}`);
  return {out,bad};
});
console.log(r.out.join('\n')); console.log('BAD ('+r.bad.length+'):\n'+r.bad.slice(0,60).join('\n'));
console.log('pageerrors:',errs.slice(0,10).join('\n')||'none');await b.close();})();
