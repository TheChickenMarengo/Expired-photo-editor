# Builds expired-app/index.html (standalone installable version) from past-due.html (Claude artifact version)
src=open('past-due.html').read(); s=src
def R(a,b,c=1):
    global s; assert s.count(a)==c,(a[:80],s.count(a)); s=s.replace(a,b)
R('<meta name="viewport" content="width=device-width, initial-scale=1">','''<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="Expired: give your digital photos the look of expired film.">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" sizes="32x32" href="favicon.png">
<link rel="icon" type="image/png" sizes="192x192" href="icons/icon-192.png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0b0b0b" media="(prefers-color-scheme: dark)">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Expired">
<meta name="apple-mobile-web-app-status-bar-style" content="default">''')
R(".sec[hidden]{display:none}",""".sec[hidden]{display:none}
header{padding-top:max(14px,env(safe-area-inset-top));padding-left:max(16px,env(safe-area-inset-left));padding-right:max(16px,env(safe-area-inset-right))}
.panel{padding-bottom:max(40px,calc(env(safe-area-inset-bottom) + 24px))}
.stage,.tabs{padding-left:max(16px,env(safe-area-inset-left));padding-right:max(16px,env(safe-area-inset-right))}""")
a=s.index('<div class="banner" id="banner" role="alert">'); b=s.index('</div>\n</div>',a)+len('</div>\n</div>'); s=s[:a]+s[b:]
a=s.index('// Detect a picker that never opens'); b=s.index('document.querySelectorAll(".picker input[type=file]:not(#file2):not(#profImport)")',a); s=s[:a]+s[b:]
R('''  inp.addEventListener("click",()=>{
    leftPage=false; cancelPick();
    pickTimer=setTimeout(()=>{ if(!leftPage) $("banner").classList.add("on"); },2500);
  });
''','')
R('''    cancelPick(); $("banner").classList.remove("on");\n''','')
R('''$("bannerClose").addEventListener("click",()=>$("banner").classList.remove("on"));\n''','')
R('''let downloads=null;
if(window.claude && typeof window.claude.use==="function"){
  window.claude.use("downloads").then(d=>{downloads=d;}).catch(()=>{});
}''','''// Saving: on phones the share sheet offers "Save Image" (to Photos / Gallery); elsewhere it downloads.
async function saveBlob(blob,fname){
  const file=new File([blob],fname,{type:"image/jpeg"});
  const touch=matchMedia("(pointer:coarse)").matches;
  if(touch && navigator.canShare && navigator.canShare({files:[file]})){
    try{ await navigator.share({files:[file],title:"Expired"}); return "shared"; }
    catch(e){ if(e && e.name==="AbortError") return "cancelled"; }
  }
  try{ const u=URL.createObjectURL(blob), a=document.createElement("a"); a.href=u; a.download=fname; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(u),4000); return "downloaded"; }catch(e){ return "failed"; }
}''')
R('''      if(downloads){
        try{ await downloads.save({filename:fname, data:blob}); toast("Saved."); return; }
        catch(err){
          if(err && err.code==="declined") return;
          if(err && err.code==="rate_limited"){toast("A save prompt is already open."); return;}
        }
      }
      showModal(blob,"Press and hold the photo to save it to your device.");''','''      const res=await saveBlob(blob,fname);
      if(res==="downloaded") toast("Saved to your downloads.");
      else if(res==="failed") showModal(blob,"Press and hold the photo to save it to your device.");''')
R("// Init\n","""// ---- Offline support and install
if("serviceWorker" in navigator){ addEventListener("load",()=>{ navigator.serviceWorker.register("sw.js").catch(()=>{}); }); }

// Init
""")
assert "claude.ai" not in s and "claude.use" not in s
open('expired-app/index.html','w').write(s)
