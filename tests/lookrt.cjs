const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/claude/test.html?clean');await p.waitForTimeout(600);await p.setInputFiles('#file','/home/claude/room.jpg');await p.waitForTimeout(2500);
await p.click('#looks .stock >> nth=0');await p.waitForTimeout(1500);const a=await p.evaluate(()=>__T.state.raw);
await p.click('#lookOff');await p.waitForTimeout(1500);
const r=await p.evaluate(()=>{const v=document.getElementById('view'),x=v.getContext('2d').getImageData(0,0,v.width,v.height).data,o=__T.cropCanvas(__T.src.prev,true),y=o.getContext('2d').getImageData(0,0,o.width,o.height).data;let m=0;for(let i=0;i<x.length;i++)m=Math.max(m,Math.abs(x[i]-y[i]));return {raw:__T.state.raw,maxDiff:m,pressed:document.querySelectorAll('#stocks .stock[aria-pressed=true]').length};});
console.log('look on raw:',a,'after removing:',JSON.stringify(r),errs.length?errs:'no errors');await b.close();})();
