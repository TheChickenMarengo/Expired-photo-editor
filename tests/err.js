const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
p.on('pageerror',e=>console.log('ERR',e.stack));p.on('console',m=>{if(m.type()==='error')console.log('CON',m.text())});
await p.goto('file:///home/claude/test.html');await p.waitForTimeout(1200);await b.close();})();
