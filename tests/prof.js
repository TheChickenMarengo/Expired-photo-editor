const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/claude/test.html');await p.waitForTimeout(900);
const set=async(k,v)=>{await p.evaluate(([k,v])=>{const e=document.getElementById('s-'+k); e.value=v; e.dispatchEvent(new Event('input')); e.dispatchEvent(new Event('change'));},[k,v]);await p.waitForTimeout(150);};
// build a look: mono stock, grain .9, leaks off switch
await p.click('.stock[data-id=mono]'); await p.waitForTimeout(300); await set('grain','0.9'); await set('tint','0.5');
await p.evaluate(()=>{ document.querySelector('#s-leak').closest('.row').querySelector('.sw2').click(); });
await p.click('#profBtn'); await p.fill('#profName','Grainy mono'); await p.click('#profForm button[type=submit]'); await p.waitForTimeout(600);
await p.screenshot({path:'pf_sheet.png'});
await p.click('#profList .def'); await p.waitForTimeout(200);
await p.click('#profClose');
// change things
await p.click('.stock[data-id=gold]'); await p.waitForTimeout(300); await set('grain','0.1');
const before=await p.evaluate(()=>[document.querySelector('.stock[aria-pressed=true]').dataset.id, document.getElementById('s-grain').value]);
// open new photo -> default profile applies
await p.setInputFiles('#file',{name:'x.png',mimeType:'image/png',buffer:require('fs').readFileSync('small.png')}); await p.waitForTimeout(1500);
const after=await p.evaluate(()=>[document.querySelector('.stock[aria-pressed=true]').dataset.id, document.getElementById('s-grain').value, document.getElementById('s-tint').value, document.querySelector('#s-leak').closest('.row').classList.contains('off')]);
// reload: default applied at start
await p.reload(); await p.waitForTimeout(1500);
const reload=await p.evaluate(()=>[document.querySelector('.stock[aria-pressed=true]').dataset.id, document.getElementById('s-grain').value]);
console.log({before,after,reload});
console.log(errs.join('\n')||'ok');await b.close();})();
