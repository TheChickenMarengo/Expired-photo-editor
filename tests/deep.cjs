const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(e.stack.split('\n').slice(0,3).join(' | ')));
await p.goto('file:///home/claude/test.html');await p.waitForTimeout(1200);
await p.evaluate(()=>document.getElementById('cta').style.display='none');
const r=await p.evaluate(()=>{ const T=window.__T, bad=[], info={typeable:0,notTypeable:[]};
  // 1. every typeable slider: typing what a position displays gives a position that displays the same thing
  for(const s of T.SLIDERS){ if(!T.canType(s)){ info.notTypeable.push(s.k); continue; } info.typeable++;
    const N=Math.round((s.max-s.min)/s.step); for(let i=0;i<=N;i+=Math.max(1,Math.floor(N/40))){ const v=+(s.min+i*s.step).toFixed(6), shown=T.shown(s,v), n=T.numIn(shown), v2=T.valueFor(s,n);
      if(v2===null||v2<s.min-1e-9||v2>s.max+1e-9) bad.push(`${s.k}: typed ${n} gave ${v2}`); else if(T.shown(s,v2)!==shown) bad.push(`${s.k}: typed ${n} (from "${shown}") shows "${T.shown(s,v2)}"`); }
    // typing a number far outside the range lands on an end, never outside
    for(const n of [-1e6,1e6,0]){ const v=T.valueFor(s,n); if(v===null||v<s.min-1e-9||v>s.max+1e-9) bad.push(`${s.k}: typed ${n} gave ${v}`); } }
  // 2. defaults: every slider has a numeric starting value inside its range, for every stock
  for(const st of T.STOCKS){ T.state.stock=st; T.state.iso=st.iso; T.state.P=null; T.resetParams(); const D=T.defs();
    for(const s of T.SLIDERS){ if(typeof D[s.k]!=="number"||isNaN(D[s.k])) bad.push(`default of ${s.k} on ${st.id} is ${D[s.k]}`); else if(D[s.k]<s.min-1e-9||D[s.k]>s.max+1e-9) bad.push(`default of ${s.k} on ${st.id} (${D[s.k]}) is outside ${s.min}..${s.max}`); }
    // a freshly reset stock shows no edited tabs
    T.updateTabDots(); const dots=[...document.querySelectorAll('#tabs button')].filter(b=>b.hasAttribute('data-dot')).map(b=>b.dataset.tab);
    if(dots.filter(d=>d!=='film').length) bad.push(`dots on untouched ${st.id}: ${dots}`); }
  // 3. reset puts every slider back to its starting value (and the dot goes away)
  T.state.stock=T.STOCKS[0]; T.state.P=null; T.resetParams(); const D0=T.defs();
  for(const s of T.SLIDERS){ T.state.P[s.k]=s.max; T.resetSlider(s,document.body); if(Math.abs(T.state.P[s.k]-D0[s.k])>1e-9) bad.push(`reset ${s.k}: ${T.state.P[s.k]} vs ${D0[s.k]}`); }
  // 4. looks: strength slider typed -> look is rebuilt
  T.applyLook('stairwell',1); const g1=T.state.P.grain; const ls=T.SLIDERS.find(z=>z.k==='lookAmt'); T.setSliderValue(ls,.5); const g2=T.state.P.grain;
  if(!(Math.abs(g1-g2)>.01)) bad.push(`look strength typed did not change the look: grain ${g1} -> ${g2}`);
  return {bad,info}; });
console.log('typeable sliders:',r.info.typeable,'| not typeable (words or times):',r.info.notTypeable.join(', '));
console.log(r.bad.length?('PROBLEMS ('+r.bad.length+'):\n'+r.bad.slice(0,30).join('\n')):'all checks passed');
console.log(errs.join('\n')||'no page errors'); await b.close();})();
