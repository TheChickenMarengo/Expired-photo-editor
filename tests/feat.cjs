const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,hasTouch:true,isMobile:true}); const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.stack.split('\n').slice(0,3).join(' | ')));
await p.goto('file:///home/claude/test.html');await p.waitForTimeout(1000);
await p.evaluate(()=>document.getElementById('cta').style.display='none');
const tab=async t=>{ await p.evaluate(t=>document.querySelector(`#tabs button[data-tab=${t}]`).click(),t); await p.waitForTimeout(250); };
const val=id=>p.evaluate(id=>({v:document.getElementById(id).value,o:document.getElementById('o-'+id.slice(2)).textContent}),id);
const dots=()=>p.evaluate(()=>[...document.querySelectorAll('#tabs button')].filter(b=>b.hasAttribute('data-dot')).map(b=>b.dataset.tab).join(',')||'none');
const ok=(name,c,extra='')=>console.log((c?'PASS':'FAIL').padEnd(5),name,extra);
// layout: which sections are on which tab
const secs=await p.evaluate(()=>{const o={}; document.querySelectorAll('#panel .sec').forEach(s=>{ (o[s.dataset.tab]=o[s.dataset.tab]||[]).push(s.querySelector('h2').firstChild.textContent.trim()); }); return o;});
console.log('TABS',JSON.stringify(secs));
// ---- dots
ok('no dots on a fresh photo',(await dots())==='none',await dots());
await tab('light'); await p.evaluate(()=>{const e=document.getElementById('s-ucon'); e.value=.5; e.dispatchEvent(new Event('input')); e.dispatchEvent(new Event('change'));}); await p.waitForTimeout(500);
ok('dot appears on Light after changing contrast',(await dots()).includes('light'),await dots());
// ---- double tap label resets
const cdp=await ctx.newCDPSession(p);
const lab=await p.evaluate(()=>{const r=document.querySelector('label[for=s-ucon]').getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; });
await p.evaluate(()=>document.querySelector('label[for=s-ucon]').scrollIntoView({block:'center'})); await p.waitForTimeout(200);
const lab2=await p.evaluate(()=>{const r=document.querySelector('label[for=s-ucon]').getBoundingClientRect(); return {x:r.x+10,y:r.y+r.height/2}; });
const tap=async(x,y,hold=60)=>{ await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]}); await new Promise(r=>setTimeout(r,hold)); await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]}); };
await tap(lab2.x,lab2.y); await new Promise(r=>setTimeout(r,120)); ok('single tap does not reset',(await val('s-ucon')).v!=='0',JSON.stringify(await val('s-ucon')));
await tap(lab2.x,lab2.y); await new Promise(r=>setTimeout(r,200)); ok('double tap resets contrast to 0',+(await val('s-ucon')).v===0,JSON.stringify(await val('s-ucon')));
await p.waitForTimeout(500); ok('dot clears again',!(await dots()).includes('light'),await dots());
// long press still does the before/after peek
await tap(lab2.x,lab2.y,400); await p.waitForTimeout(100); ok('long press leaves value alone',+(await val('s-ucon')).v===0);
// ---- type a number
await p.evaluate(()=>document.getElementById('s-ucon').scrollIntoView({block:'center'})); await p.waitForTimeout(200);
const out=await p.evaluate(()=>{const r=document.getElementById('o-ucon').getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; });
await tap(out.x,out.y,40); await p.waitForTimeout(250);
const hasInput=await p.evaluate(()=>!!document.querySelector('#o-ucon input')); ok('tapping the number opens a text box',hasInput);
await p.keyboard.type('-35'); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
ok('typing -35 sets contrast to -0.35',Math.abs(+(await val('s-ucon')).v+.35)<.011,JSON.stringify(await val('s-ucon')));
// words-only slider is not typeable
await tab('film'); const ageing=await p.evaluate(()=>[...document.querySelectorAll('.row output')].filter(o=>o.classList.contains('tap')).length+'/'+document.querySelectorAll('.row output').length);
console.log('      tappable numbers:',ageing,'(the rest show words or times, which cannot be typed)');
// exposure (EV), warm/cool, temperature, flash angle
await tab('light'); 
for(const [id,typed,expect] of [['s-exp','1','0.5'],['s-wbT','30','0.3'],['s-wbT','-30','-0.3'],['s-dehaze','-20','-0.2']]){
  await p.evaluate(id=>document.getElementById(id).scrollIntoView({block:'center'}),id); await p.waitForTimeout(150);
  const o=await p.evaluate(id=>{const r=document.getElementById('o-'+id.slice(2)).getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; },id);
  await tap(o.x,o.y,40); await p.waitForTimeout(200); await p.keyboard.type(typed); await p.keyboard.press('Enter'); await p.waitForTimeout(250);
  const r=await val(id); ok(`type ${typed} into ${id}`,Math.abs(+r.v-+expect)<.011,JSON.stringify(r)); }
// Escape cancels
{ const id='s-exp'; await p.evaluate(()=>document.getElementById('s-exp').scrollIntoView({block:'center'})); const before=await val(id);
  const o=await p.evaluate(()=>{const r=document.getElementById('o-exp').getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; }); await tap(o.x,o.y,40); await p.waitForTimeout(150); await p.keyboard.type('9'); await p.keyboard.press('Escape'); await p.waitForTimeout(200);
  ok('Escape cancels typing',(await val(id)).v===before.v,JSON.stringify(await val(id))); }
// ---- snapping: drag the dot near zero and see it stick
await p.evaluate(()=>{const e=document.getElementById('s-ucon'); e.value=0; e.dispatchEvent(new Event('input')); e.dispatchEvent(new Event('change'));}); await p.waitForTimeout(300);
await p.evaluate(()=>document.getElementById('s-ucon').scrollIntoView({block:'center'})); await p.waitForTimeout(200);
const bb=await p.evaluate(()=>{const r=document.getElementById('s-ucon').getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height};}); const cy=bb.y+bb.h/2;
const T=(type,x)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x,y:cy}]});
const x0=bb.x+16+(bb.w-32)*.5; await T('touchStart',x0); const seen=[]; for(let i=1;i<=24;i++){ await T('touchMove',x0+i*2.5); await new Promise(r=>setTimeout(r,16)); seen.push(+(await val('s-ucon')).v); } await T('touchEnd');
const atZero=seen.filter(v=>v===0).length; ok('dragging past zero sticks at 0 for a moment',atZero>=3&&seen[seen.length-1]>0,`${atZero} of 24 steps held at 0, finished at ${seen[seen.length-1]}`);
// ---- tick mark exists
const dv=await p.evaluate(()=>document.getElementById('s-ucon').style.getPropertyValue('--dv')); ok('tick mark at zero on a two-way slider',Math.abs(+dv-.5)<.01,'--dv='+dv);
const dv2=await p.evaluate(()=>document.getElementById('s-grain').style.getPropertyValue('--dv')); ok('tick mark at the stock default on grain',+dv2>.03,'--dv='+dv2);
// ---- tab dots for non-slider things
await tab('camera'); await p.evaluate(()=>document.querySelector('#flashSeg button[data-k=direct]').click()); await p.waitForTimeout(500); ok('Camera dot after turning flash on',(await dots()).includes('camera'),await dots());
await p.evaluate(()=>document.querySelector('#flashSeg button[data-k=off]').click()); await p.waitForTimeout(500); ok('Camera dot clears when flash goes off',!(await dots()).includes('camera'),await dots());
await tab('film'); await p.evaluate(()=>document.querySelector('.stock[data-id=mono]').click()); await p.waitForTimeout(600); ok('Film dot after changing stock',(await dots()).includes('film'),await dots());
console.log(errs.join('\n')||'no page errors'); await b.close();})();
