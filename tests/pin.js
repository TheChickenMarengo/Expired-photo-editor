const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:800}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/claude/test.html');await p.waitForTimeout(900);
await p.evaluate(()=>document.getElementById('cta').style.display='none');
const img=process.argv[2]; if(img){ await p.setInputFiles('.picker input[type=file]:not(#file2):not(#profImport)', img); await p.waitForTimeout(1500); }
const set=async(k,v)=>{await p.evaluate(([k,v])=>{const e=document.getElementById('s-'+k); e.value=v; e.dispatchEvent(new Event('input')); e.dispatchEvent(new Event('change'));},[k,v]);await p.waitForTimeout(300);};
const shot=n=>p.locator('#view').screenshot({path:n+'.png'});
for(const k of ['leak','dust','fib','scratch','stains']) await set(k,'0');
await shot('p_std');
await p.click('#tabs button[data-tab=camera]'); await p.click('#camSeg button[data-k=pinhole]'); await p.waitForTimeout(800); await shot('p_def');
await set('pinMove','.7'); await shot('p_move'); await set('pinMove','.2');
await set('pinSize','1'); await set('pinGlow','1'); await shot('p_soft'); await set('pinSize','.5'); await set('pinGlow','.4');
await p.click('#pinPaper'); await p.waitForTimeout(800); await shot('p_paper');
console.log(errs.join('\n')||'ok');await b.close();})();
