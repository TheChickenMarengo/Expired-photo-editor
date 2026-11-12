import sys
from PIL import Image
n=['static','stairwell','hotroad','cine16','nightlamp']
ims=[Image.open(f'L_{t}.png') for t in n]; w,h=ims[0].size; w2,h2=int(w*.6),int(h*.6)
s=Image.new('RGB',(w2*3,h2*2))
for i,im in enumerate(ims): s.paste(im.resize((w2,h2)),((i%3)*w2,(i//3)*h2))
s.save(sys.argv[1])
