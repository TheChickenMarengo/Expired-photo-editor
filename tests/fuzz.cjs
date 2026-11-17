const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/claude/test.html?clean');await p.waitForTimeout(600);await p.setInputFiles('#file','room.jpg');await p.waitForTimeout(2500);
const res=await p.evaluate(()=>{const T=__T;let seed=12345;const R=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
const out={bad:[],n:0,slow:[]};const sizes=[[1,1],[2,3],[7,5],[64,48],[200,130],[333,500],[640,480],[900,300],[320,1200]];
for(let it=0;it<260;it++){const st=T.STOCKS[Math.floor(R()*T.STOCKS.length)];const [w,h]=sizes[Math.floor(R()*sizes.length)];
 const P=Object.assign({},T.derive?T.derive():T.effP());T.state.stock=st;const D=T.derive();Object.assign(P,D);
 for(const s of T.SLIDERS){ if(R()<.45) continue; if(s.min==null)continue; P[s.k]=+(s.min+R()*(s.max-s.min)).toFixed(3); if(R()<.2)P[s.k]=R()<.5?s.min:s.max; }
 for(const k of ['frame','devStop','devDry']) if(R()<.4) P[k]=!P[k];
 P.camType=['standard','disposable','lomo'][Math.floor(R()*3)];P.soupWhen=['before','after','developed'][Math.floor(R()*3)];
 P.debris=['scanner','camera','both'][Math.floor(R()*3)];
 const src=document.createElement('canvas');src.width=w;src.height=h;const x=src.getContext('2d');const g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,'#c33');g.addColorStop(.5,'#3a3');g.addColorStop(1,'#33c');x.fillStyle=g;x.fillRect(0,0,w,h);
 const o=document.createElement('canvas');const t0=performance.now();
 try{T.develop(src,o,P,st,Object.assign({},T.state.seeds,{leak:Math.floor(R()*999),soup:Math.floor(R()*999)}),R()<.3);}catch(e){out.bad.push([st.id,w,h,String(e.stack).split('\n').slice(0,2).join('|')]);continue;}
 const dt=performance.now()-t0;out.n++;if(dt>1500)out.slow.push([st.id,w,h,Math.round(dt)]);
 if(o.width<1||o.height<1)out.bad.push(['dims',st.id,w,h,o.width,o.height]);
 else if(w>=64){const d=o.getContext('2d').getImageData(0,0,o.width,o.height).data;let nz=0;for(let i=0;i<d.length;i+=4*7){if(d[i]+d[i+1]+d[i+2]>3)nz++;}if(nz===0)out.bad.push(['allblack',st.id,w,h]);}
}
return out;});
console.log(JSON.stringify(res,null,0).slice(0,3000),errs.slice(0,5));await b.close();})();
