// Clean start: opened photo renders as the original; one slider adds only that effect; stock/reroll bring the recipe.
const {chromium}=require('playwright');
(async()=>{ const b=await chromium.launch(); const errs=[];
 const p=await (await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true})).newPage();
 p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file:///home/claude/test.html?clean'); await p.waitForTimeout(800);
 const res={}; res.emptyAtStart=await p.evaluate(()=>document.querySelector('.frame').classList.contains('empty')&&document.getElementById('save').disabled);
 await p.setInputFiles('#file', process.argv[2]||'/home/claude/room.jpg'); await p.waitForTimeout(2500);
 const grab=()=>p.evaluate(()=>{ const v=document.getElementById('view'); return Array.from(v.getContext('2d').getImageData(0,0,v.width,v.height).data); });
 const diff=(a,c)=>{ let s=0,mx=0,n=0; for(let i=0;i<a.length;i+=4) for(let k=0;k<3;k++){ const d=Math.abs(a[i+k]-c[i+k]); s+=d; if(d>mx) mx=d; n++; } return {mean:+(s/n).toFixed(2),max:mx}; };
 const shown=await grab();
 await p.evaluate(()=>{ __T.state.raw; window.__cmp=true; }); 
 const orig=await p.evaluate(()=>{ const T=__T, o=T.cropCanvas(T.src.prev,true); const c=o.getContext('2d'); return Array.from(c.getImageData(0,0,o.width,o.height).data); });
 res.cleanVsOriginal=diff(shown,orig);
 res.stockPressed=await p.$$eval('#stocks .stock[aria-pressed=true]',e=>e.length);
 res.tabDots=await p.$$eval('#tabs button[data-dot]',e=>e.map(x=>x.dataset.tab));
 const nonzero=await p.evaluate(()=>{ const P=__T.state.P; return ['grain','fog','fade','shift','dust','fib','scratch','vig','hal','leak','stains','edgeFog','border'].filter(k=>P[k]>0); });
 res.nonzeroEffects=nonzero;
 // touch grain only
 await p.evaluate(()=>{ const s=document.getElementById('s-grain'); s.value=.8; s.dispatchEvent(new Event('input',{bubbles:true})); s.dispatchEvent(new Event('change',{bubbles:true})); });
 await p.waitForTimeout(1800);
 res.afterGrain={raw:await p.evaluate(()=>__T.state.raw), others:await p.evaluate(()=>{ const P=__T.state.P; return ['fog','fade','shift','dust','vig'].filter(k=>P[k]>0); }), vsOrig:diff(await grab(),orig), dots:await p.$$eval('#tabs button[data-dot]',e=>e.map(x=>x.dataset.tab))};
 // double-tap reset goes back to 0
 await p.evaluate(()=>__T.resetSlider(__T.SLIDERS.find(s=>s.k==='grain'),document.getElementById('s-grain').closest('.row')));
 await p.waitForTimeout(1500); res.afterReset=diff(await grab(),orig);
 // reroll brings the recipe
 await p.click('#reroll'); await p.waitForTimeout(2000);
 res.afterReroll={raw:await p.evaluate(()=>__T.state.raw), vsOrig:diff(await grab(),orig), pressed:await p.$$eval('#stocks .stock[aria-pressed=true]',e=>e.map(x=>x.dataset.id))};
 // open again: clean again
 await p.setInputFiles('#file', '/home/claude/sea.jpg'); await p.waitForTimeout(2500);
 res.reopen={raw:await p.evaluate(()=>__T.state.raw), dust:await p.evaluate(()=>__T.state.P.dust)};
 // a stock brings its recipe
 await p.click('.tabs [data-tab=film]'); await p.click('#stocks .stock[data-id=superior]'); await p.waitForTimeout(1500);
 res.afterStock={raw:await p.evaluate(()=>__T.state.raw), fog:await p.evaluate(()=>__T.state.P.fog)};
 console.log(JSON.stringify(res,null,1)); console.log('errors:',errs.length?errs:'none'); await b.close(); })();
