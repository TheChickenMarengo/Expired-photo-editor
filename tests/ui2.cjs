const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const w of [412,390,375,360]){
  const ctx=await b.newContext({viewport:{width:w,height:800},deviceScaleFactor:2,hasTouch:true,isMobile:true}); const p=await ctx.newPage();
  await p.goto('file:///home/claude/test.html');await p.waitForTimeout(900);
  await p.addStyleTag({content:'body,button,input{font-family:"Liberation Sans",Arial,Helvetica,sans-serif !important}'}); await p.waitForTimeout(200);
  await p.evaluate(()=>document.getElementById('cta').style.display='none');
  const info=await p.evaluate(()=>{const t=document.getElementById('tabs'); return {scrollW:t.scrollWidth, clientW:t.clientWidth}; });
  console.log(w+'px wide: tab content',info.scrollW,'visible',info.clientW, info.scrollW>info.clientW+1?'(scrolls)':'(fits)');
  if(w===390){ await p.evaluate(()=>{document.querySelector('#tabs button[data-tab=damage]').setAttribute('data-dot','');document.querySelector('#tabs button[data-tab=camera]').setAttribute('data-dot','');}); await p.locator('.stage').screenshot({path:'stage390.png'}); await p.locator('#tabs').screenshot({path:'tabs390.png'}); }
  await ctx.close(); }
await b.close();})();
