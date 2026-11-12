const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:800}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/claude/test.html');await p.waitForTimeout(900);
await p.evaluate(()=>document.getElementById('cta').style.display='none');
const img=process.argv[2]; if(img){ await p.setInputFiles('.picker input[type=file]:not(#file2):not(#profImport)', img); await p.waitForTimeout(1500); }
const set=async(k,v)=>{await p.evaluate(([k,v])=>{const e=document.getElementById('s-'+k); e.value=v; e.dispatchEvent(new Event('input')); e.dispatchEvent(new Event('change'));},[k,v]);await p.waitForTimeout(250);};
const shot=n=>p.locator('#view').screenshot({path:n+'.png'});
const clean=async()=>{for(const k of ['leak','dust','fib','scratch','stains']) await set(k,'0');};
await clean(); await shot('c_std');
for(const id of ['party','quick','sport','monosnap']){ await p.click(`.stock[data-id=${id}]`); await p.waitForTimeout(700); await clean(); await shot('c_'+id); }
await p.click('.stock[data-id=gold]'); await p.waitForTimeout(500); await clean();
await p.click('#tabs button[data-tab=camera]'); await p.click('#camSeg button[data-k=pinhole]'); await p.waitForTimeout(700); await shot('c_pin');
await set('pinMove','.8'); await shot('c_pin2');
await p.locator('#panel').screenshot({path:'c_panel.png'});
console.log(errs.join('\n')||'ok');await b.close();})();
