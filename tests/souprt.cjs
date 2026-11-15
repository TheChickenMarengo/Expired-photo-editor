// soup survives profile save/apply, clean start, and turns off cleanly
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/claude/test.html?clean');await p.waitForTimeout(600);await p.setInputFiles('#file','/home/claude/room.jpg');await p.waitForTimeout(2500);
const r=await p.evaluate(()=>{const T=__T; Object.assign(T.state.P,{soup:.6,soupHeat:.8,soupIng:'salt',soupHow:'brush'}); const sn=T.takeSnapshot();
 T.startClean(); const cleared={soup:T.state.P.soup,ing:T.state.P.soupIng};
 T.applySnapshot(sn); const back={soup:T.state.P.soup,heat:T.state.P.soupHeat,ing:T.state.P.soupIng,how:T.state.P.soupHow};
 const pressed=[...document.querySelectorAll('#soupIngSeg [aria-pressed=true],#soupHowSeg [aria-pressed=true]')].map(b=>b.dataset.k);
 return {cleared,back,pressed};});
console.log(JSON.stringify(r), errs.length?errs:'no errors'); await b.close();})();
