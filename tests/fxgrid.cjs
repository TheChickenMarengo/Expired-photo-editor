// usage: node fxgrid.cjs image out.png cols tileW 'stockId' 'label|{json overrides}' ...
const {chromium}=require('playwright');(async()=>{const [img,out,cols,tw,stockId,...specs]=process.argv.slice(2);const b=await chromium.launch();const p=await b.newPage({viewport:{width:1500,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/claude/test.html?clean');await p.waitForTimeout(600);await p.setInputFiles('#file',img);await p.waitForTimeout(2500);
const tiles=await p.evaluate(([specs,stockId,tw])=>{const T=__T;const out=[];
for(const sp of specs){const [label,js]=sp.split('|');const o=(new Function("return ("+(js||"{}")+")"))();const st=T.STOCKS.find(s=>s.id===(o._stock||stockId))||T.STOCKS[0];T.state.stock=st;if(o._years!=null)T.state.years=o._years;else T.state.years=12;
 const base=T.derive();const P=Object.assign({},base,o);const src=T.src.prev;
 const c=document.createElement('canvas');const SD=Object.assign({},T.state.seeds,o._seeds||{});T.develop(src,c,P,st,SD,!!o._stamp);
 let sx=0,sy=0,sw=c.width,sh=c.height;if(o._crop){[sx,sy,sw,sh]=o._crop.map((v,i)=>v*(i%2?c.height:c.width));}
 const t=document.createElement('canvas');t.width=+tw;t.height=Math.round(sh*tw/sw);const x=t.getContext('2d');x.imageSmoothingQuality='high';x.drawImage(c,sx,sy,sw,sh,0,0,t.width,t.height);
 x.fillStyle='rgba(0,0,0,.6)';x.fillRect(0,0,x.measureText(label).width+14,16);x.fillStyle='#fff';x.font='12px sans-serif';x.fillText(label,6,12);
 out.push(t.toDataURL('image/jpeg',.9));}return out;},[specs,stockId,tw]);
await p.setContent(`<body style="margin:0;background:#222"><div id=g style="display:grid;grid-template-columns:repeat(${cols},${tw}px);gap:3px"></div></body>`);
await p.evaluate(t=>{g.innerHTML=t.map(u=>`<img src="${u}">`).join('')},tiles);await p.waitForTimeout(400);await (await p.$('#g')).screenshot({path:out});console.log('ok',errs.slice(0,3));await b.close();})();
