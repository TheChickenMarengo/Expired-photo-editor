function sampleScene(){
  const W=1500,H=1000,c=document.createElement("canvas");c.width=W;c.height=H;const x=c.getContext("2d");
  let g=x.createLinearGradient(0,0,0,560); g.addColorStop(0,"#3f78bd"); g.addColorStop(.7,"#9cc0de"); g.addColorStop(1,"#f3dcc0");
  x.fillStyle=g; x.fillRect(0,0,W,560);
  g=x.createRadialGradient(1120,420,10,1120,420,260); g.addColorStop(0,"rgba(255,250,235,1)"); g.addColorStop(.12,"rgba(255,240,210,.95)"); g.addColorStop(1,"rgba(255,220,180,0)");
  x.fillStyle=g; x.fillRect(0,0,W,700);
  x.fillStyle="rgba(255,255,255,.55)";
  [[260,150,90],[340,170,70],[420,140,60],[780,110,70],[850,125,55]].forEach(([a,b,r])=>{x.beginPath();x.ellipse(a,b,r,r*.45,0,0,6.283);x.fill();});
  x.fillStyle="#2f4a3f"; x.beginPath(); x.moveTo(0,560); x.lineTo(0,430); x.bezierCurveTo(120,400,220,450,330,470); x.bezierCurveTo(420,490,480,520,560,560); x.fill();
  g=x.createLinearGradient(0,560,0,700); g.addColorStop(0,"#3c6f8f"); g.addColorStop(1,"#6fa2b0"); x.fillStyle=g; x.fillRect(0,560,W,140);
  x.fillStyle="rgba(255,245,220,.6)"; for(let i=0;i<40;i++){x.fillRect(980+Math.random()*280,570+Math.random()*60,30+Math.random()*60,2);}
  g=x.createLinearGradient(0,700,0,H); g.addColorStop(0,"#e2cfab"); g.addColorStop(1,"#bf9f74"); x.fillStyle=g; x.fillRect(0,700,W,300);
  const boxes=[["#c8352b","#f4efe6"],["#f2c230","#2c5aa0"],["#2c5aa0","#f4efe6"],["#2f8f5b","#f4efe6"],["#f4efe6","#c8352b"]];
  boxes.forEach(([a,b],i)=>{
    const bx=180+i*240, by=640, bw=170, bh=180;
    x.fillStyle="rgba(60,40,20,.25)"; x.fillRect(bx+20,by+bh,bw+40,22);
    for(let s=0;s<bw;s+=24){x.fillStyle=(s/24)%2?b:a; x.fillRect(bx+s,by,Math.min(24,bw-s),bh);}
    x.fillStyle=b; x.beginPath(); x.moveTo(bx-14,by); x.lineTo(bx+bw/2,by-70); x.lineTo(bx+bw+14,by); x.fill();
    x.fillStyle="#3b2a1e"; x.fillRect(bx+bw/2-28,by+70,56,110);
  });
  return c;
}
