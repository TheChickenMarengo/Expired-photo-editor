// node soupgrid.cjs <photo> <out.png> [how]   grid: rows = ingredients, cols = (soak,heat) combos
const {chromium}=require('playwright'); const fs=require('fs');
(async()=>{ const [photo,out,how]=process.argv.slice(2); const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1560,height:900}});
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/claude/test.html?clean'); await p.waitForTimeout(600); await p.setInputFiles('#file',photo); await p.waitForTimeout(2500);
const combos=[[.3,.35],[.55,.5],[.8,.7],[.9,.95]];
const ings=(process.env.INGS||'water,tea,citrus,soap,salt,alcohol,tea+citrus+soap').split(',');
const tiles=[];
for(const ing of ings) for(const [t,h] of combos){
  const url=await p.evaluate(([ing,t,h,how])=>{ const T=__T; Object.assign(T.state.P,{soup:t,soupHeat:h,soupIng:ing,soupHow:how||'tank'}); T.state.dragging=false; T.draw();
    const v=document.getElementById('view'), c=document.createElement('canvas'); const w=360, hh=Math.round(v.height*w/v.width); c.width=w; c.height=hh; c.getContext('2d').drawImage(v,0,0,w,hh); return c.toDataURL('image/png'); },[ing,t,h,how]);
  tiles.push(url); }
await p.setContent('<body style="margin:0;background:#fff;font:11px sans-serif"><div id=g style="display:grid;grid-template-columns:70px repeat(4,360px);gap:4px"></div></body>');
await p.evaluate(([tiles,ings,combos])=>{ const g=document.getElementById('g'); g.innerHTML='<div></div>'+combos.map(c=>`<div>soak ${c[0]} heat ${c[1]}</div>`).join('');
  ings.forEach((ing,i)=>{ g.innerHTML+=`<div>${ing}</div>`+combos.map((c,k)=>`<img src="${tiles[i*4+k]}">`).join(''); }); },[tiles,ings,combos]);
await p.waitForTimeout(300); await (await p.$('#g')).screenshot({path:out}); console.log('ok',errs.length?errs:''); await b.close(); })();
