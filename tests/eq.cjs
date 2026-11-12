const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
const render=async(f)=>{ const p=await b.newPage(); await p.addInitScript(()=>{ let s=12345; Math.random=()=>{ s=(s*16807)%2147483647; return s/2147483647; }; }); await p.goto('file:///home/claude/'+f); await p.waitForTimeout(1200);
  const r=await p.evaluate(()=>{ const T=window.__T; const out={}; const cases={flash:{flashType:'direct'},inst:{flashType:'instant'},slow:{flashType:'slow'},bounce:{flashType:'bounce'},dev:{devT:.6,devAg:.2,devExp:16,devGrade:3.5},lith:{devType:'lith',devTemp:.5},sab:{sabattier:.6},base:{}};
    for(const k in cases){ T.state.stock=T.STOCKS[0]; T.state.P=null; const P=Object.assign(T.derive(),cases[k]); const o=document.createElement('canvas'); T.develop(T.src.prev,o,P,T.STOCKS[0],T.state.seeds,false);
      { const dd=o.getContext('2d').getImageData(0,0,o.width,o.height).data; const s=new Uint8Array(Math.ceil(dd.length/4/5)*3); for(let i=0,j=0;i<dd.length;i+=20){ s[j++]=dd[i]; s[j++]=dd[i+1]; s[j++]=dd[i+2]; } let str=''; for(let i=0;i<s.length;i+=8192) str+=String.fromCharCode.apply(null,s.subarray(i,i+8192)); out[k]=btoa(str); } } return out; });
  await p.close(); return r; };
const A=await render('old.html'), B=await render('test.html');
for(const k in A){ const a=Buffer.from(A[k],'base64'), c=Buffer.from(B[k],'base64'); let mx=0, sum=0, n=0; for(let i=0;i<a.length;i++){ const d=Math.abs(a[i]-c[i]); if(d>mx) mx=d; sum+=d; n++; } console.log(k.padEnd(7),'mean diff',(sum/n).toFixed(3),'max',mx); }
await b.close();})();
