const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:800}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/claude/test.html');await p.waitForTimeout(900);
await p.evaluate(()=>document.getElementById('cta').style.display='none');
const dims=async()=>p.evaluate(()=>{const c=document.getElementById('view');return c.width+'x'+c.height;});
console.log('gold',await dims());
await p.click('.stock[data-id=integral]'); await p.waitForTimeout(800); console.log('integral',await dims());
await p.click('.stock[data-id=party]'); await p.waitForTimeout(800); console.log('party',await dims());
await p.click('.stock[data-id=integral]'); await p.waitForTimeout(800); await p.click('.stock[data-id=instant]'); await p.waitForTimeout(800); console.log('instant',await dims());
// manual crop kept
await p.click('#tabs button[data-tab=crop]'); await p.click('button[data-k="1:1"]').catch(()=>{}); await p.waitForTimeout(500);
await p.click('#tabs button[data-tab=film]'); await p.click('.stock[data-id=gold]'); await p.waitForTimeout(800); console.log('manual kept',await dims());
console.log(errs.join('\n')||'ok');await b.close();})();
