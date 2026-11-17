const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/claude/test.html?clean');await p.waitForTimeout(600);await p.setInputFiles('#file','room.jpg');await p.waitForTimeout(2500);
const r=await p.evaluate(()=>{const T=__T;const st=T.STOCKS.find(s=>s.id==='gold');T.state.stock=st;const base=Object.assign({},T.derive());
const W=360,H=270;const src=document.createElement('canvas');src.width=W;src.height=H;src.getContext('2d').drawImage(T.src.prev,0,0,W,H);
const run=P=>{const o=document.createElement('canvas');T.develop(src,o,P,st,T.state.seeds,false);return o.getContext('2d').getImageData(0,0,o.width,o.height).data;};
const diff=(a,b)=>{if(a.length!==b.length)return 999;let s=0,n=0;for(let i=0;i<a.length;i+=4*3){s+=Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2]);n+=3;}return s/n;};
const KIDS=new Set(['gsize','rollFogI','mouldI','flashFall','flashAngle','surgeI','bromideI','airbellI','kinkI','waterI','sabLines','burnSize','dodgeSize','fixerI','dichroicI','dustI','fibI','scratchI']);const zero=Object.assign({},base);for(const s of T.SLIDERS){if(s.min<0||KIDS.has(s.k))continue;if(s.k.startsWith('dev')||s.k==='pframe')continue;zero[s.k]=0;}
const out={nondet:[],jumps:[],noop:[]};
const z0=run(zero);
for(const s of T.SLIDERS){ if(s.k.startsWith('dev')||s.k==='pframe')continue;
 const lo=s.min<0?s.min:0,hi=s.max,N=12;const frames=[];
 for(let i=0;i<=N;i++){const P=Object.assign({},zero);P[s.k]=lo+(hi-lo)*i/N;if(s.k==='soupHeat'||s.k==='soupHue'||s.k==='soupVar'){P.soup=.6;} if(KIDS.has(s.k)){const par={gsize:'grain',rollFogI:'rollFog',mouldI:'mould',flashFall:'flashPow',flashAngle:'flashTrail',surgeI:'surge',bromideI:'bromide',airbellI:'airbell',kinkI:'kink',waterI:'water',sabLines:'sabattier',burnSize:'burn',dodgeSize:'dodge',fixerI:'fixer',dichroicI:'dichroic',dustI:'dust',fibI:'fib',scratchI:'scratch'}[s.k];P[par]=.7;} frames.push(run(P));}
 const d=[];for(let i=1;i<=N;i++)d.push(diff(frames[i-1],frames[i]));
 const tot=diff(frames[0],frames[N]);
 if(tot<.3&&s.min>=0)out.noop.push([s.k,+tot.toFixed(2)]);
 const mean=d.reduce((a,b)=>a+b,0)/d.length;const mx=Math.max(...d);
 if(mx>mean*3.2&&mx>4)out.jumps.push([s.k,d.map(x=>+x.toFixed(1)).join(' ')]);
 // determinism
 const P=Object.assign({},zero);P[s.k]=hi*.6; const a=run(P),b=run(P); if(diff(a,b)>0)out.nondet.push(s.k);
}
return out;});
console.log(JSON.stringify(r,null,1),errs.slice(0,3));await b.close();})();
