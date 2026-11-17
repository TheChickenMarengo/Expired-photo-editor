const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const res={};
for(const v of ['old','new']){const p=await b.newPage();await p.goto(`file:///home/claude/test_${v}.html?clean`);await p.waitForTimeout(600);await p.setInputFiles('#file','r_chelsea.jpg');await p.waitForTimeout(2500);
res[v]=await p.evaluate(()=>{const T=__T;const out={};for(const id of ['mono','gold']){const st=T.STOCKS.find(s=>s.id===id);T.state.stock=st;const src=document.createElement('canvas');src.width=600;src.height=400;const x=src.getContext('2d');x.fillStyle='#808080';x.fillRect(0,0,600,400);
for(const [gr,gs] of [[.3,.35],[.6,.35],[.5,0],[.5,1]]){const P=Object.assign({},T.derive());for(const s of T.SLIDERS){if(s.min<0||s.k.startsWith('dev')||s.k==='pframe')continue;if(!/^(I|gsize)$/.test(s.k)&&!/I$/.test(s.k))P[s.k]=0;}P.grain=gr;P.gsize=gs;P.fog=0;P.fade=0;
const o=document.createElement('canvas');T.develop(src,o,P,Object.assign({},st,{sat:1,con:1,fogC:[0,0,0],sh:[0,0,0],hi:[0,0,0],hal:0,leak:0,stain:0,mono:st.mono,mx:null,pop:0}),T.state.seeds,false);
const d=o.getContext('2d').getImageData(0,0,o.width,o.height).data;let n=0,sl=0,sl2=0,sc=0,sc2=0;for(let i=0;i<d.length;i+=4){const l=(d[i]+d[i+1]+d[i+2])/3;sl+=l;sl2+=l*l;const c=d[i]-d[i+2];sc+=c;sc2+=c*c;n++;}
const ml=sl/n;const sdl=Math.sqrt(sl2/n-ml*ml);const mc=sc/n;const sdc=Math.sqrt(sc2/n-mc*mc);
// lag-1 autocorr of luma along x
let a=0,v=0;for(let y=0;y<o.height;y++)for(let x2=0;x2<o.width-1;x2++){const i=(y*o.width+x2)*4,k=i+4;const l1=(d[i]+d[i+1]+d[i+2])/3-ml,l2=(d[k]+d[k+1]+d[k+2])/3-ml;a+=l1*l2;v+=l1*l1;}
out[id+' g'+gr+' s'+gs]=[+sdl.toFixed(2),+sdc.toFixed(2),+(a/v).toFixed(2)];}}return out;});await p.close();}
for(const k of Object.keys(res.old))console.log(k.padEnd(18),'old',res.old[k].join(' '),'| new',res.new[k].join(' '));await b.close();})();
