const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:800}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/claude/test.html');await p.waitForTimeout(900);
await p.evaluate(()=>document.getElementById('cta').style.display='none');
const img=process.argv[2]; if(img){ await p.setInputFiles('.picker input[type=file]:not(#file2):not(#profImport)', img); await p.waitForTimeout(1500); }
const set=async(k,v)=>{await p.evaluate(([k,v])=>{const e=document.getElementById('s-'+k); e.value=v; e.dispatchEvent(new Event('input')); e.dispatchEvent(new Event('change'));},[k,v]);await p.waitForTimeout(250);};
const shot=n=>p.locator('#view').screenshot({path:n+'.png'});
for(const k of ['leak','dust','fib','scratch','stains']) await set(k,'0');
await p.click('#tabs button[data-tab=camera]');
const pw=process.argv[3]||'0.6'; await set('flashPow',pw); if(process.argv[4]) await set('flashOrbs',process.argv[4]);
for(const t of ['off','direct','instant','bounce','slow']){ await p.click(`#flashSeg button[data-k=${t}]`); await p.waitForTimeout(600); await shot('fx_'+t); }
console.log(errs.join('\n')||'ok');await b.close();})();
