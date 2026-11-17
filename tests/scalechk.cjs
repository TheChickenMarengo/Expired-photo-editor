const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/claude/test.html?clean');await p.waitForTimeout(600);await p.setInputFiles('#file','r_coffee.jpg');await p.waitForTimeout(2500);
const r=await p.evaluate(()=>{const T=__T;const st=T.STOCKS.find(s=>s.id==='gold');T.state.stock=st;const base=Object.assign({},T.derive());
const mk=w=>{const c=document.createElement('canvas');c.width=w;c.height=Math.round(w*T.src.prev.height/T.src.prev.width);const x=c.getContext('2d');x.imageSmoothingQuality='high';x.drawImage(T.src.prev,0,0,c.width,c.height);return c;};
const A=mk(1000),B=mk(2000);
const run=(src,P)=>{const o=document.createElement('canvas');T.develop(src,o,P,st,T.state.seeds,false);return o;};
const low=(c)=>{const t=document.createElement('canvas');t.width=32;t.height=20;const x=t.getContext('2d');x.imageSmoothingQuality='high';x.drawImage(c,0,0,32,20);return x.getImageData(0,0,32,20).data;};
const hf=(c)=>{const w=500,h=Math.round(c.height*500/c.width);const t=document.createElement('canvas');t.width=w;t.height=h;const x=t.getContext('2d');x.imageSmoothingQuality='high';x.drawImage(c,0,0,w,h);const d=x.getImageData(0,0,w,h).data;let s=0,n=0;for(let y=1;y<h;y++)for(let xx=1;xx<w;xx++){const i=(y*w+xx)*4,j=i-4;s+=Math.abs(d[i+1]-d[j+1]);n++;}return s/n;};
const diff=(a,b)=>{let s=0;for(let i=0;i<a.length;i++)s+=Math.abs(a[i]-b[i]);return s/a.length;};
const out=[];const KIDS={gsize:'grain',rollFogI:'rollFog',mouldI:'mould',surgeI:'surge',bromideI:'bromide',airbellI:'airbell',kinkI:'kink',waterI:'water',dustI:'dust',fibI:'fib',scratchI:'scratch',fixerI:'fixer',dichroicI:'dichroic'};
const zero=Object.assign({},base);for(const s of T.SLIDERS){if(s.min<0||KIDS[s.k]||s.k.startsWith('dev')||s.k==='pframe')continue;zero[s.k]=0;}
const cmp=(name,P)=>{const a=run(A,P),b=run(B,P);const l=diff(low(a),low(b));const ha=hf(a),hb=hf(b);out.push([name,+l.toFixed(2),+ha.toFixed(2),+hb.toFixed(2),+(hb/ha).toFixed(2)]);};
cmp('zero',zero);
for(const s of T.SLIDERS){ if(s.k.startsWith('dev')||s.k==='pframe'||KIDS[s.k])continue; if(s.min<0)continue; const P=Object.assign({},zero);P[s.k]=s.max*.7;if(s.k==='soupHeat'||s.k==='soupVar')P.soup=.7;cmp(s.k,P);}
return out;});
console.log(r.filter(x=>x[1]>2.5||x[4]>1.25||x[4]<.8).map(x=>x.join(' ')).join('\n'));console.log('zero',r[0].join(' '),errs.slice(0,2));await b.close();})();
