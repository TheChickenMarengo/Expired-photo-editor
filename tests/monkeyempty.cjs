const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
const seed0=+(process.argv[2]||7), steps=+(process.argv[3]||450);
const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,hasTouch:true,isMobile:true}); const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.stack.split('\n').slice(0,3).join(' | ')));
await p.goto('file:///home/claude/test.html?clean');await p.waitForTimeout(900);
await p.evaluate(()=>document.getElementById('cta').style.display='none');
let seed=seed0; const R=()=>{seed=(seed*16807)%2147483647; return seed/2147483647;};
const tabs=await p.$$eval('#tabs button',bs=>bs.map(b=>b.dataset.tab));
const junk=['','abc','-','1e9','--5','0','999999','-999999','.5',' 7 ','50','-12.5','٣','Infinity','NaN','1,5','−20'];
const counts={};
for(let i=0;i<steps;i++){
  const tab=tabs[Math.floor(R()*tabs.length)];
  await p.evaluate(t=>document.querySelector(`#tabs button[data-tab=${t}]`).click(),tab);
  const kind=R();
  const act=await p.evaluate(([r1,r2,r3,kind,junkV])=>{
    const vis=[...document.querySelectorAll('#panel .sec')].filter(s=>!s.hidden);
    const rows=vis.flatMap(s=>[...s.querySelectorAll('.row')]).filter(r=>r.offsetParent!==null);
    const ctr=vis.flatMap(s=>[...s.querySelectorAll('input[type=range],button,input[type=checkbox]')]).filter(e=>e.offsetParent!==null&&!e.disabled&&!['save','profBtn'].includes(e.id)&&!e.closest('.picker'));
    const pick=a=>a[Math.floor(r1*a.length)];
    if(kind<.2 && rows.length){ const row=pick(rows), out=row.querySelector('output'); if(out&&out.classList.contains('tap')){ out.click(); const inp=out.querySelector('input'); if(inp){ inp.value=junkV; const how=r3; inp.dispatchEvent(new KeyboardEvent('keydown',{key:how<.6?'Enter':how<.8?'Escape':'Tab',bubbles:true})); if(how>=.8) inp.blur(); } return 'type'; } return 'none'; }
    if(kind<.32 && rows.length){ const lab=pick(rows).querySelector('label'); if(!lab) return 'none'; const fire=t=>lab.dispatchEvent(new PointerEvent(t,{bubbles:true,pointerType:'touch'})); fire('pointerdown'); setTimeout(()=>{ fire('pointerup'); fire('pointerdown'); setTimeout(()=>fire('pointerup'),30); },40); return 'dbltap'; }
    if(!ctr.length) return 'none';
    const e=pick(ctr);
    if(e.type==='range'){ const mn=+e.min, mx=+e.max; e.value=mn+(mx-mn)*r2; e.dispatchEvent(new Event('input')); if(r3<.7) e.dispatchEvent(new Event('change')); return 'range'; }
    e.click(); return 'click'; },[R(),R(),R(),kind,junk[Math.floor(R()*junk.length)]]);
  counts[act]=(counts[act]||0)+1;
  await p.waitForTimeout(i%20===0?150:6);
  if(errs.length){ console.log('ERROR after step',i,act,'\n'+errs.join('\n')); break; }
}
await p.waitForTimeout(1500);
const st=await p.evaluate(()=>{ const T=window.__T, bad=[]; for(const [k,v] of Object.entries(T.state.P)){ if(typeof v==='number'&&!isFinite(v)) bad.push(k+'='+v); }
  for(const s of T.SLIDERS){ const v=T.state.P[s.k]; if(typeof v==='number'&&(v<s.min-1e-6||v>s.max+1e-6)) bad.push(`${s.k}=${v} outside ${s.min}..${s.max}`); }
  const c=document.getElementById('view'), d=c.getContext('2d').getImageData(0,0,c.width,c.height).data; let s=0,s2=0,n=0; for(let i=0;i<d.length;i+=400){const l=d[i]; s+=l; s2+=l*l; n++;} const m=s/n;
  return {bad,W:c.width,H:c.height,sd:Math.sqrt(Math.max(0,s2/n-m*m)).toFixed(1),dragging:!!T.state.dragging}; });
console.log('seed',seed0,JSON.stringify(counts),'| canvas',st.W+'x'+st.H,'sd',st.sd,'| stuck dragging:',st.dragging,'| invalid values:',st.bad.length?st.bad.join('; '):'none');
console.log(errs.join('\n')||'  no page errors'); await b.close();})();
