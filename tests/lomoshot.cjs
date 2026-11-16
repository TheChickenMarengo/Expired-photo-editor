const {chromium}=require('playwright');(async()=>{const [photo,out]=process.argv.slice(2);const b=await chromium.launch();const p=await b.newPage({viewport:{width:1500,height:900}});const e=[];p.on('pageerror',x=>e.push(x.message));
await p.goto('file:///home/claude/test.html?clean');await p.waitForTimeout(600);await p.setInputFiles('#file',photo);await p.waitForTimeout(2500);
const steps=[["orig",null],["violet","violet"],["teal","teal"],["noir","noir"],["redscale","redscale"],["gold+lomo","gold","lomo"]];const tiles=[];
for(const [n,id,cam] of steps){
  if(id){ await p.evaluate(id=>{document.querySelector(`#stocks .stock[data-id=${id}]`).click(); const y=document.getElementById('years'); y.value=1; y.dispatchEvent(new Event('input',{bubbles:true})); y.dispatchEvent(new Event('change',{bubbles:true}));},id); await p.waitForTimeout(900);}
  if(cam) await p.evaluate(()=>document.querySelector('#camSeg [data-k=lomo]').click());
  else await p.evaluate(()=>{const c=document.querySelector('#camSeg [data-k=standard]'); if(c) c.click();});
  await p.waitForTimeout(1500);
  tiles.push(await p.evaluate(()=>{const v=document.getElementById('view'),c=document.createElement('canvas');c.width=480;c.height=Math.round(v.height*480/v.width);c.getContext('2d').drawImage(v,0,0,c.width,c.height);return c.toDataURL('image/png');}));
}
await p.setContent('<body style="margin:0"><div id=g style="display:grid;grid-template-columns:repeat(3,480px);gap:4px"></div></body>');
await p.evaluate(t=>{g.innerHTML=t.map(u=>`<img src="${u}">`).join('')},tiles);await p.waitForTimeout(300);await (await p.$('#g')).screenshot({path:out});console.log('ok',e);await b.close();})();
