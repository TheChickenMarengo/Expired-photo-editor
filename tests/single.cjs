const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.goto('file:///home/claude/test.html?clean');await p.waitForTimeout(600);await p.setInputFiles('#file','/home/claude/room.jpg');await p.waitForTimeout(2500);
const g=()=>p.evaluate(()=>{const v=document.getElementById('view');return Array.from(v.getContext('2d').getImageData(0,0,v.width,v.height).data.slice(0,400000));});
const a=await g(); const out={};
for(const k of __K=['shift','fog','fade','stains','vig','hal','leak','dust','edgeFog','border','tint','under','mottle','layer','soft','haze','bloom']){
 await p.evaluate(k=>{const s=document.getElementById('s-'+k); s.value=(+s.min+(+s.max-+s.min)*.7); s.dispatchEvent(new Event('input',{bubbles:true})); s.dispatchEvent(new Event('change',{bubbles:true}));},k);
 await p.waitForTimeout(900); const c=await g(); let d=0; for(let i=0;i<a.length;i++) d+=Math.abs(a[i]-c[i]); out[k]=+(d/a.length).toFixed(2);
 await p.evaluate(k=>{const s=document.getElementById('s-'+k); s.value=(+s.min<0?0:+s.min); s.dispatchEvent(new Event('input',{bubbles:true})); s.dispatchEvent(new Event('change',{bubbles:true}));},k); await p.waitForTimeout(700);
}
console.log(JSON.stringify(out));await b.close();})();
