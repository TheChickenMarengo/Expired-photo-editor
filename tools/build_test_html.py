# Makes /home/claude/test.html: a copy of past-due.html with window.__T exposing internals, for the test scripts.
# Run from /home/claude. Never publish test.html.
s=open('past-due.html').read(); i=s.rindex("})();")
hook=("window.__T={state,develop,STOCKS,LOOKS,SLIDERS,draw,effP,src,POOL,LCACHE,FCACHE,HCACHE,CCACHE,setSource,derive,resetParams,"
      "applyLook,takeSnapshot,applySnapshot,cropCanvas,healedSource,inputs,upscaleCanvas,upFactor,src2,cropIsIdentity,releaseBig,"
      "defs,valueFor,shown,numIn,canType,setSliderValue,resetSlider,updateTabDots,syncControls,showTab};\n")
# the app opens empty; tests start on the generated sample photo with the full stock recipe (as before the clean start),
# unless the page URL has ?clean, which keeps the app's real clean start.
samp=open('sample_scene.js').read()+("if(!/[?&]clean/.test(location.search)){ setSource(sampleScene(),'sample'); setEmpty(false);"
      " state.raw=false; resetParams(); syncStockUI(); }\n")
hook=hook.replace("showTab};","showTab,startClean,stockFor,baseP,setEmpty};")
open('test.html','w').write(s[:i]+samp+hook+s[i:])
print("wrote test.html")
