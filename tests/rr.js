const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/claude/test.html');await p.waitForTimeout(900);
const st=async()=>p.evaluate(()=>[document.querySelector('#debris [aria-pressed=true]').dataset.k,...['dust','dustI','fib','fibI','scratch','scratchI'].map(k=>document.getElementById('s-'+k).value)].join(' '));
console.log('start', await st());
const seen=new Set();
for(let i=0;i<8;i++){ await p.click('#reroll'); await p.waitForTimeout(250); const v=await st(); seen.add(v.split(' ')[0]); if(i<3) console.log('roll',v); }
console.log('modes seen',[...seen].join(','));
await p.click('.stock[data-id=gold]'); await p.waitForTimeout(300); console.log('after stock change', (await st()).split(' ')[0]);
console.log(errs.join('\n')||'ok');await b.close();})();
