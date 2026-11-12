import sys
from PIL import Image
ims=[Image.open(f'fx_{t}.png') for t in ['off','direct','instant','bounce','slow']]
w,h=ims[0].size; s=Image.new('RGB',(w*3//2,h))
for i,im in enumerate(ims): s.paste(im.resize((w//2,h//2)),((i%3)*w//2,(i//3)*h//2))
s.save(sys.argv[1])
