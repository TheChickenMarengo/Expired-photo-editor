const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,hasTouch:true});
const errs=[];p.on('pageerror',e=>errs.push(e.stack.split('\n').slice(0,2).join(' | ')));
await p.goto('file:///home/claude/test.html');await p.waitForTimeout(900);
await p.evaluate(()=>document.getElementById('cta').style.display='none');
let seed=7; const R=()=>{seed=(seed*16807)%2147483647; return seed/2147483647;};
const tabs=await p.$$eval('#tabs button',bs=>bs.map(b=>b.dataset.tab));
for(let i=0;i<500;i++){
  const tab=tabs[Math.floor(R()*tabs.length)];
  await p.evaluate(t=>document.querySelector(`#tabs button[data-tab=${t}]`).click(),tab);
  const act=await p.evaluate(([r1,r2,r3])=>{
    const vis=[...document.querySelectorAll('#panel .sec')].filter(s=>s.offsetParent!==null);
    const ctr=vis.flatMap(s=>[...s.querySelectorAll('input[type=range],button,input[type=checkbox]')]).filter(e=>e.offsetParent!==null && !e.disabled && !['save','profBtn'].includes(e.id) && !e.closest('.picker'));
    if(!ctr.length) return 'none';
    const e=ctr[Math.floor(r1*ctr.length)];
    if(e.type==='range'){ const mn=+e.min, mx=+e.max; e.value=mn+(mx-mn)*r2; e.dispatchEvent(new Event('input')); if(r3<.7) e.dispatchEvent(new Event('change')); return 'range '+e.id; }
    e.click(); return 'click '+(e.id||e.dataset.k||e.dataset.id||e.textContent.slice(0,12));
  },[R(),R(),R()]);
  if(i%25===0) await p.waitForTimeout(120); else await p.waitForTimeout(5);
  if(errs.length){ console.log('error after action',i,act); break; }
}
await p.waitForTimeout(1500);
const st=await p.evaluate(()=>{ const c=document.getElementById('view'), d=c.getContext('2d').getImageData(0,0,c.width,c.height).data; let s=0,s2=0,n=0; for(let i=0;i<d.length;i+=400){const l=d[i]; s+=l; s2+=l*l; n++;} const m=s/n; return {W:c.width,H:c.height,m:m.toFixed(1),sd:Math.sqrt(s2/n-m*m).toFixed(1)}; });
console.log('final canvas',st); console.log(errs.join('\n')||'no errors'); await p.screenshot({path:'monkey.png'}); await b.close();})();
