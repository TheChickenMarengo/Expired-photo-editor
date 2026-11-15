const {chromium}=require('playwright');(async()=>{const [photo,out,json]=process.argv.slice(2);const b=await chromium.launch();const p=await b.newPage({viewport:{width:1500,height:900}});const e=[];p.on('pageerror',x=>e.push(x.message));
await p.goto('file:///home/claude/test.html?clean');await p.waitForTimeout(600);await p.setInputFiles('#file',photo);await p.waitForTimeout(2500);
const sets=eval("("+json+")");const tiles=[];
for(const o of sets){tiles.push(await p.evaluate(o=>{const T=__T;Object.assign(T.state.P,{soup:0,soupHue:0,soupVar:.5},o);T.state.dragging=false;T.draw();const v=document.getElementById('view'),c=document.createElement('canvas');c.width=480;c.height=Math.round(v.height*480/v.width);c.getContext('2d').drawImage(v,0,0,c.width,c.height);return c.toDataURL('image/png');},o));}
await p.setContent('<body style="margin:0"><div id=g style="display:grid;grid-template-columns:repeat(3,480px);gap:4px"></div></body>');
await p.evaluate(t=>{g.innerHTML=t.map(u=>`<img src="${u}">`).join('')},tiles);await p.waitForTimeout(300);await (await p.$('#g')).screenshot({path:out});console.log('ok',e);await b.close();})();
