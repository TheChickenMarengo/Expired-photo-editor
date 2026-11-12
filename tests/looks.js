const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:800}});
const errs=[];p.on('pageerror',e=>errs.push(e.stack));
await p.goto('file:///home/claude/test.html');await p.waitForTimeout(900);
await p.evaluate(()=>document.getElementById('cta').style.display='none');
const img=process.argv[2]; if(img){ await p.setInputFiles('.picker input[type=file]:not(#file2):not(#profImport)', img); await p.waitForTimeout(1500); }
await p.click('#tabs button[data-tab=film]');
for(const id of ['static','stairwell','hotroad','cine16','nightlamp']){ await p.click(`#looks .stock[data-id=${id}]`); await p.waitForTimeout(900); await p.locator('#view').screenshot({path:'L_'+id+'.png'}); }
await p.locator('#panel').screenshot({path:'L_panel.png'});
console.log(errs.join('\n')||'ok');await b.close();})();
