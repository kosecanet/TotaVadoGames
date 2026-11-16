"use strict";
/* Bloque 2: Fruit merge, Wheelie, Snakes, Nuts and bolts, Brainrot/Animal stack, Ball run, Archery, Stampede, Toca empareja, Target practice, Gravity run, Brick blast, Bloques, Tennis */

/* ---- FRUIT MERGE (1 jugador, estilo "sandía") ---- */
const FRUITS=[
  {n:'arándano',c:'#3a7bd5',d:'#2457a3'},{n:'fresa',c:'#e8413c',d:'#b52a26'},{n:'frambuesa',c:'#d6336c',d:'#a51f4f'},{n:'melocotón',c:'#f8a58f',d:'#d97a63'},
  {n:'limón',c:'#f7dc4a',d:'#d4b42a'},{n:'ciruela',c:'#7d3f8f',d:'#5a2a68'},{n:'naranja',c:'#f7931e',d:'#d0720b'},{n:'manzana',c:'#e53935',d:'#b71c1c'},
  {n:'piña',c:'#f5c431',d:'#d19c12'},{n:'melón',c:'#b3d96b',d:'#86ad44'},{n:'sandía',c:'#2f8f3a',d:'#1d6b27'}];
function drawFruit(l,x,y,r,face){const f=FRUITS[l];ctx.save();ctx.translate(x,y);
  if(l==8){ctx.fillStyle='#4caf50';for(let i=-1;i<=1;i++){ctx.beginPath();ctx.ellipse(i*r*.22,-r*1.0,r*.12,r*.35,i*.4,0,7);ctx.fill();}}
  circle(0,0,r,f.d);circle(0,-r*.04,r*.93,f.c);
  ctx.save();ctx.beginPath();ctx.arc(0,-r*.04,r*.93,0,7);ctx.clip();
  if(l==10){ctx.strokeStyle='#1b5e20';ctx.lineWidth=r*.09;for(let i=-2;i<=2;i++){ctx.beginPath();ctx.ellipse(i*r*.32,0,r*.12,r*.88,0,0,7);ctx.stroke();}}
  if(l==9){ctx.strokeStyle='rgba(255,255,255,.45)';ctx.lineWidth=r*.04;for(let i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(i*r*.3-r*.5,-r*.8);ctx.lineTo(i*r*.3+r*.5,r*.8);ctx.moveTo(i*r*.3+r*.5,-r*.8);ctx.lineTo(i*r*.3-r*.5,r*.8);ctx.stroke();}}
  if(l==8){ctx.strokeStyle='rgba(160,100,0,.45)';ctx.lineWidth=r*.05;for(let i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(i*r*.3-r*.6,-r*.8);ctx.lineTo(i*r*.3+r*.6,r*.8);ctx.stroke();}}
  if(l==1||l==2)for(let i=0;i<7;i++){const a=i*2.4,d=r*(.35+.4*((i*37)%10)/10);circle(Math.cos(a)*d,Math.sin(a)*d+r*.15,r*.05,'rgba(255,240,180,.8)');}
  circle(-r*.38,-r*.42,r*.3,'rgba(255,255,255,.28)');ctx.restore();
  if(l==0){ctx.fillStyle=f.d;ctx.beginPath();for(let i=0;i<5;i++){const a=i/5*Math.PI*2-Math.PI/2;ctx.lineTo(Math.cos(a)*r*.32,-r*.78+Math.sin(a)*r*.16);}ctx.fill();}
  if([1,3,6,7].includes(l)){ctx.fillStyle=l==1?'#2e7d32':'#4caf50';ctx.beginPath();ctx.ellipse(r*.18,-r*.95,r*.28,r*.12,-.5,0,7);ctx.fill();if(l==1){ctx.beginPath();ctx.ellipse(-r*.18,-r*.95,r*.28,r*.12,.5,0,7);ctx.fill();}}
  if(face!==false){const e=Math.max(1.5,r*.075),ey=-r*.02;circle(-r*.28,ey,e,'#2b1d14');circle(r*.28,ey,e,'#2b1d14');
    ctx.strokeStyle='#2b1d14';ctx.lineWidth=Math.max(1.5,r*.06);ctx.lineCap='round';ctx.beginPath();ctx.arc(0,ey+r*.1,r*.14,.15*Math.PI,.85*Math.PI);ctx.stroke();
    circle(-r*.48,ey+r*.2,r*.1,'rgba(255,120,120,.35)');circle(r*.48,ey+r*.2,r*.1,'rgba(255,120,120,.35)');}
  ctx.restore();}
def('fruit','Fruit merge','🍉','#e0a83c',()=>{
  const RF=[.034,.046,.056,.069,.083,.097,.112,.128,.146,.166,.19];
  let fr,queue,cur,aimX,score,best,x0,x1,yb,lineY,cool,over,pops;
  const rad=l=>RF[l]*W;
  const rndL=()=>{const r=Math.random();return r<.35?0:r<.6?1:r<.8?2:r<.93?3:4;};
  return{
    init(){x0=W*.06;x1=W*.94;yb=H*.83;lineY=H*.31;fr=[];queue=[rndL(),rndL(),rndL()];cur=rndL();aimX=W/2;score=0;best=load('tv_fruit_best',0);cool=0;over=0;pops=[];},
    down(id,x,y){if(y<H*.2&&x>W*.78){this.init();return;}aimX=x;},move(id,x){aimX=x;},
    up(id,x,y){if(y<H*.2||cool>0||cur<0)return;const r=rad(cur);fr.push({x:clamp(x,x0+r,x1-r),y:lineY-r-6,vx:0,vy:0,r,l:cur,age:0,sc:1});cur=-1;cool=.55;beep(500,.04,'sine',.06);},
    update(dt){if(cool>0){cool-=dt;if(cool<=0){cur=queue.shift();queue.push(rndL());}}
      const N=6,h=dt/N;
      for(let s=0;s<N;s++){
        for(const f of fr){f.vy+=1500*h;f.x+=f.vx*h;f.y+=f.vy*h;f.vx*=.9995;}
        for(let it=0;it<3;it++){
          for(let i=0;i<fr.length;i++)for(let j=i+1;j<fr.length;j++){const a=fr[i],b=fr[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||.01,md=a.r+b.r;if(d>=md)continue;
            const nx=dx/d,ny=dy/d,ma=a.r*a.r,mb=b.r*b.r,ov=md-d;a.x-=nx*ov*mb/(ma+mb);a.y-=ny*ov*mb/(ma+mb);b.x+=nx*ov*ma/(ma+mb);b.y+=ny*ov*ma/(ma+mb);
            const rv=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(rv<0){const imp=-1.1*rv/(1/ma+1/mb);a.vx-=imp/ma*nx;a.vy-=imp/ma*ny;b.vx+=imp/mb*nx;b.vy+=imp/mb*ny;
              const tx=-ny,ty=nx,rt=(b.vx-a.vx)*tx+(b.vy-a.vy)*ty,ti=-rt*.05/(1/ma+1/mb);a.vx-=ti/ma*tx;a.vy-=ti/ma*ty;b.vx+=ti/mb*tx;b.vy+=ti/mb*ty;}}
          for(const f of fr){if(f.x<x0+f.r){f.x=x0+f.r;if(f.vx<0)f.vx*=-.15;}if(f.x>x1-f.r){f.x=x1-f.r;if(f.vx>0)f.vx*=-.15;}if(f.y>yb-f.r){f.y=yb-f.r;if(f.vy>0)f.vy*=-.1;f.vx*=.985;}}}}
      // fusiones
      outer:for(let i=0;i<fr.length;i++)for(let j=i+1;j<fr.length;j++){const a=fr[i],b=fr[j];if(a.l!=b.l||Math.hypot(a.x-b.x,a.y-b.y)>a.r+b.r+1)continue;
        fr.splice(j,1);fr.splice(i,1);const l=a.l+1;score+=(l+1)*(l+2)/2;
        if(l<FRUITS.length){const r=rad(l);fr.push({x:(a.x+b.x)/2,y:(a.y+b.y)/2,vx:(a.vx+b.vx)/2,vy:Math.min(a.vy,b.vy,0)-40,r,l,age:1,sc:.6});}else score+=100;
        pops.push({x:(a.x+b.x)/2,y:(a.y+b.y)/2,r:a.r*1.6,t:.3,c:FRUITS[Math.min(l,10)].c});beep(380+l*70,.1,'sine',.1);buzz(15);break outer;}
      for(const f of fr){f.age+=dt;if(f.sc<1)f.sc=Math.min(1,f.sc+dt*4);}for(const p of pops)p.t-=dt;pops=pops.filter(p=>p.t>0);
      const danger=fr.some(f=>f.age>1.2&&f.y-f.r<lineY);over=danger?over+dt:Math.max(0,over-dt*2);
      if(score>best){best=score;save('tv_fruit_best',best);}
      if(over>2.2)endSolo(false,`Puntos: ${score} · Récord: ${best}`);},
    draw(){ctx.fillStyle='#bfdfc4';ctx.fillRect(0,0,W,H);
      // marcadores
      const bw=W*.25,by=H*.045;ctx.fillStyle='#4a5248';rrect(W*.22,by,bw,H*.055,12);ctx.fill();rrect(W*.52,by,bw,H*.055,12);ctx.fill();
      T('PUNTOS',W*.22+bw/2,by+H*.016,13,'#fff');T(String(score),W*.22+bw/2,by+H*.037,22,'#fff');T('RÉCORD',W*.52+bw/2,by+H*.016,13,'#5fe0b0');T(String(best),W*.52+bw/2,by+H*.037,22,'#5fe0b0');
      circle(W*.88,by+H*.027,H*.033,'#fff');T('↻',W*.88,by+H*.03,H*.04,'#d77fa1');
      // cola de siguientes
      ctx.fillStyle='rgba(255,255,255,.45)';rrect(W*.52,H*.125,W*.42,H*.065,H*.033);ctx.fill();queue.forEach((l,i)=>drawFruit(l,W*.6+i*W*.12,H*.158,Math.min(rad(l),H*.026)));T('Siguientes',W*.3,H*.158,16,'#4a6a4f');
      // caja
      ctx.fillStyle='#fbe3b0';ctx.fillRect(x0,lineY-H*.015,x1-x0,yb-lineY+H*.015);ctx.fillStyle='rgba(247,200,140,.35)';const cs=(x1-x0)/14;
      for(let i=0;i<14;i++)if(i%2)ctx.fillRect(x0+i*cs,lineY-H*.015,cs,yb-lineY+H*.015);for(let y=lineY;y<yb;y+=cs*2)ctx.fillRect(x0,y,x1-x0,cs);
      ctx.fillStyle='#c8643f';rrect(x0-W*.045,lineY-H*.03,W*.045,yb-lineY+H*.07,W*.02);ctx.fill();rrect(x1,lineY-H*.03,W*.045,yb-lineY+H*.07,W*.02);ctx.fill();ctx.fillRect(x0-W*.045,yb,x1-x0+W*.09,H*.035);
      ctx.strokeStyle=over>0?`rgba(220,40,40,${.5+.5*Math.sin(performance.now()/90)})`:'#e8875e';ctx.lineWidth=5;ctx.setLineDash([18,14]);ctx.beginPath();ctx.moveTo(x0+6,lineY);ctx.lineTo(x1-6,lineY);ctx.stroke();ctx.setLineDash([]);
      // fruta actual + guía
      if(cur>=0){const r=rad(cur),ax=clamp(aimX,x0+r,x1-r);for(let y=lineY+14;y<yb;y+=H*.028)circle(ax,y,3.5,'#5b84b1');drawFruit(cur,ax,lineY-r-6,r);}
      for(const f of fr)drawFruit(f.l,f.x,f.y,f.r*f.sc);for(const p of pops){ring(p.x,p.y,p.r*(1.3-p.t),p.c,4);}
      // evolución
      ctx.fillStyle='rgba(255,255,255,.45)';rrect(W*.03,H*.9,W*.94,H*.06,H*.03);ctx.fill();const step=W*.94/11;for(let l=0;l<11;l++)drawFruit(l,W*.03+step*(l+.5),H*.93,Math.min(step*.42,H*.022)*(.7+l*.03));}
  };
},{cd:false,solo:true});

/* ---- WHEELIE (cada uno en su mitad) ---- */
def('wheelie','Wheelie','🏍️','#6c7a89',()=>{
  let pl,t=0,held=new Map();const TL=20;
  return{
    init(){pl=[0,1].map(()=>({a:0,av:0,pts:0,crash:false,road:0}));},
    down(id,x,y,live){if(live)held.set(id,sideOf(y));},up(id){held.delete(id);},
    update(dt){t+=dt;const on=[false,false];for(const p of held.values())on[p]=true;
      pl.forEach((q,p)=>{if(q.crash)return;q.road+=dt*300;const ar=q.a*Math.PI/180;q.av+=((on[p]?520:0)-330*Math.cos(ar)-(q.a>30?q.a*2:0))*dt;q.a+=q.av*dt;
        if(q.a<=0){q.a=0;q.av=Math.max(0,q.av);}if(q.a>8)q.pts+=dt*(q.a>45?2:1)*10;if(q.a>=88){q.crash=true;beep(100,.4,'sawtooth',.1);buzz(150);}});
      if(t>=TL||pl.every(q=>q.crash)){const a=Math.floor(pl[0].pts),b=Math.floor(pl[1].pts);endRound(a==b?-1:a>b?0:1,`Azul ${a} m – Rojo ${b} m`);}},
    draw(){for(let p=0;p<2;p++)inHalf(p,()=>{const q=pl[p];ctx.fillStyle='#a8d8f0';ctx.fillRect(0,H/2,W,H/2);ctx.fillStyle='#555';ctx.fillRect(0,H*.88,W,H*.12);
        ctx.fillStyle='#ddd';for(let x=-(q.road%80);x<W;x+=80)ctx.fillRect(x,H*.935,40,5);ctx.fillStyle='#8a8a8a';ctx.fillRect(0,H*.86,W,8);
        const rx=W*.32,ry=H*.88-18;ctx.save();ctx.translate(rx,ry);ctx.rotate(-q.a*Math.PI/180);
        const wheel=(x)=>{circle(x,0,18,'#222');circle(x,0,8,'#999');};wheel(0);wheel(80);ctx.fillStyle=q.crash?'#777':COL[p];ctx.beginPath();ctx.moveTo(-5,-10);ctx.lineTo(80,-14);ctx.lineTo(60,-34);ctx.lineTo(10,-30);ctx.closePath();ctx.fill();
        circle(30,-58,13,'#fff');ctx.fillStyle=q.crash?'#777':COL[p];ctx.fillRect(22,-50,16,22);ctx.restore();if(q.crash)E('💥',rx+40,ry-30,50);
        TS(`${Math.floor(q.pts)} m`,W/2,H*.56,32,'#1b3a57');TS(q.crash?'¡Caíste!':'Mantén pulsado para levantar la rueda',W/2,H*.62,16,'#1b3a57');TS(`⏱ ${Math.ceil(Math.max(0,TL-t))}`,W-40,H*.56,22,'#1b3a57');});
      ctx.fillStyle='#fff';ctx.fillRect(0,H/2-2,W,4);}
  };
},{help:'Mantén para hacer el caballito'});

/* ---- SNAKES (1 jugador, clásico) ---- */
def('snakes1','Snakes','🐍','#1d1f2b',()=>{
  const C=16;let R,cs,oy,s,dir,nd,food,acc=0,score=0;
  const place=()=>{do food={c:ri(0,C-1),r:ri(0,R-1)};while(s.some(q=>q.c==food.c&&q.r==food.r));};
  return{
    init(){cs=W/C;R=Math.floor((H-110)/cs);oy=90;s=[{c:8,r:R-4},{c:8,r:R-3},{c:8,r:R-2}];dir=nd=[0,-1];place();},
    up(id,x,y,i){const d=swipeDir(i);if(!d)return;const v={L:[-1,0],R:[1,0],U:[0,-1],D:[0,1]}[d];if(v[0]!=-dir[0]||v[1]!=-dir[1])nd=v;},
    update(dt){acc+=dt;const step=Math.max(.06,.16-score*.003);if(acc<step)return;acc=0;dir=nd;const h={c:s[0].c+dir[0],r:s[0].r+dir[1]};
      if(h.c<0||h.c>=C||h.r<0||h.r>=R||s.some(q=>q.c==h.c&&q.r==h.r)){endSolo(false,`Puntos: ${score}`);return;}
      s.unshift(h);if(h.c==food.c&&h.r==food.r){score++;beep(700,.05,'sine',.1);place();}else s.pop();},
    draw(){ctx.fillStyle='#14161f';ctx.fillRect(0,0,W,H);ctx.fillStyle='#1c1f2c';for(let r=0;r<R;r++)for(let c=0;c<C;c++)if((r+c)%2)ctx.fillRect(c*cs,oy+r*cs,cs,cs);
      E('🍎',(food.c+.5)*cs,oy+(food.r+.5)*cs,cs*.9);s.forEach((q,i)=>{const hue=(i*12)%360;circle((q.c+.5)*cs,oy+(q.r+.5)*cs,cs*.48,`hsl(${hue},80%,60%)`);});
      const h=s[0];circle((h.c+.35)*cs,oy+(h.r+.35)*cs,3,'#000');circle((h.c+.65)*cs,oy+(h.r+.35)*cs,3,'#000');TS(`Puntos: ${score}`,W/2,45,26,'#fff');T('Desliza para girar',W/2,H-12,14,'rgba(255,255,255,.5)');}
  };
},{cd:false,solo:true});

/* ---- NUTS AND BOLTS (1 jugador) ---- */
def('nuts','Nuts and bolts','🔩','#2a2238',()=>{
  const CAP=4,CL=['#e74c3c','#2ecc71','#f1c40f','#3498db','#9b59b6','#e67e22','#1abc9c'];persist.nb=persist.nb||{lvl:1};let bolts,sel=-1,nc,moves=0;
  const geo=i=>{const n=bolts.length,perRow=Math.min(n,5),rows=Math.ceil(n/perRow),row=Math.floor(i/perRow),col=i%perRow,cnt=Math.min(perRow,n-row*perRow),w=W/(perRow+.5);return{x:W/2+(col-(cnt-1)/2)*w,y:H*.32+row*H*.33,w};};
  const solved=()=>bolts.every(b=>b.length==0||(b.length==CAP&&b.every(c=>c==b[0])));
  return{
    init(){nc=Math.min(3+persist.nb.lvl,7);const all=[];for(let c=0;c<nc;c++)for(let k=0;k<CAP;k++)all.push(c);shuffle(all);bolts=[];for(let i=0;i<nc;i++)bolts.push(all.slice(i*CAP,i*CAP+CAP));bolts.push([],[]);if(solved())this.init();},
    down(id,x,y){if(y>H-50){this.init();sel=-1;moves=0;return;}for(let i=0;i<bolts.length;i++){const g=geo(i);if(Math.abs(x-g.x)<g.w/2&&Math.abs(y-g.y)<H*.15){
      if(sel<0){if(bolts[i].length){sel=i;beep(500,.03);}return;}
      if(i==sel){sel=-1;return;}const a=bolts[sel],b=bolts[i],c=a[a.length-1];let n=0;while(a.length&&a[a.length-1]==c&&b.length<CAP&&(!b.length||b[b.length-1]==c)){b.push(a.pop());n++;}
      sel=-1;if(n){moves++;beep(700,.05,'sine',.08);if(solved()){persist.nb.lvl++;endSolo(true,`Nivel ${persist.nb.lvl-1} en ${moves} movimientos`);}}else beep(150,.1,'sawtooth',.05);return;}}},
    draw(){ctx.fillStyle='#231c30';ctx.fillRect(0,0,W,H);TS(`Nivel ${persist.nb.lvl}`,W/2,50,28,'#fff');T('Toca un tornillo y luego otro para mover las tuercas',W/2,84,14,'rgba(255,255,255,.6)');
      bolts.forEach((b,i)=>{const g=geo(i),nh=26,base=g.y+H*.12;ctx.fillStyle='#9aa4b1';ctx.fillRect(g.x-5,base-CAP*nh-30,10,CAP*nh+30);ctx.fillStyle='#5b6573';rrect(g.x-g.w*.38,base,g.w*.76,12,6);ctx.fill();
        b.forEach((c,k)=>{const lift=(i==sel&&k==b.length-1)?-30:0;ctx.fillStyle=CL[c];rrect(g.x-g.w*.33,base-(k+1)*nh+lift,g.w*.66,nh-3,7);ctx.fill();ctx.fillStyle='rgba(255,255,255,.3)';ctx.fillRect(g.x-g.w*.3,base-(k+1)*nh+3+lift,g.w*.6,5);});});
      T('↻ toca aquí para reiniciar',W/2,H-24,14,'rgba(255,255,255,.4)');}
  };
},{cd:false,solo:true});

/* ---- Apilar por turnos (Brainrot stack y Animal stack) ---- */
function stackGame(o){return()=>{
  let tower,cur,turn=0,cam=0,falling=[],bh=40,base;
  function spawn(){const t=tower[tower.length-1];cur={x:-t.w,w:t.w,dir:1,e:pick(o.em),y:t.y-bh};}
  return{
    init(){base=H*.75;tower=[{x:W/2-W*.3,w:W*.6,y:base,e:o.base}];spawn();},
    update(dt){const sp=(o.speed+tower.length*12);cur.x+=cur.dir*sp*dt;if(cur.x+cur.w>W+20)cur.dir=-1;if(cur.x<-20)cur.dir=1;
      const target=tower[tower.length-1].y-H*.35;cam+=(Math.max(0,base-H*.3-target)-cam)*Math.min(1,dt*4);for(const f of falling){f.vy+=1500*dt;f.y+=f.vy*dt;}},
    down(id,x,y,live){if(!live||sideOf(y)!=turn||ended)return;const t=tower[tower.length-1],l=Math.max(cur.x,t.x),r=Math.min(cur.x+cur.w,t.x+t.w);
      if(r-l<=4){falling.push({...cur,vy:0});beep(120,.4,'sawtooth',.1);buzz(150);const w=1-turn;later(()=>endRound(w,`¡${NAMES[turn]} tiró la pieza! Altura: ${tower.length-1}`),900);cur.w=0;return;}
      if(cur.x<l)falling.push({x:cur.x,w:l-cur.x,y:cur.y,e:'',vy:0});if(cur.x+cur.w>r)falling.push({x:r,w:cur.x+cur.w-r,y:cur.y,e:'',vy:0});
      tower.push({x:l,w:r-l,y:cur.y,e:cur.e,p:turn});beep(300+tower.length*20,.06,'square',.06);turn^=1;spawn();},
    draw(){ctx.fillStyle=o.bg;ctx.fillRect(0,0,W,H);ctx.save();ctx.translate(0,cam);ctx.fillStyle=o.ground;ctx.fillRect(0,base+bh,W,H);
      const blk=(b,c)=>{if(b.w<=0)return;ctx.fillStyle=c;rrect(b.x,b.y,b.w,bh-2,8);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=3;ctx.stroke();if(b.e&&b.w>24)E(b.e,b.x+b.w/2,b.y+bh/2,Math.min(bh*.9,b.w*.8));};
      tower.forEach((b,i)=>blk(b,i==0?'#795548':COL[b.p]));for(const f of falling)blk(f,'#999');blk(cur,COL[turn]);ctx.restore();
      turnLabels(turn,H*.94,'¡Tu turno! Toca para soltar');TS(`Altura: ${tower.length-1}`,W/2,H/2,22,'rgba(255,255,255,.6)');}
  };};}
def('brainrot','Brainrot stack','🦈','#5c6fd6',stackGame({em:['🦈','🐊','🥥','🍌','🐸','🦆','🧃','🛞','🦖','🍝','🐒','☕'],base:'',speed:200,bg:'#6f7fe0',ground:'#3fbf5f'}),{cd:false});

/* ---- BALL RUN (1 jugador) ---- */
def('ballrun','Ball run','🔮','#3a1060',()=>{
  let lane=1,x=0,obs=[],t=0,spd=420,next=0,score=0;const L=3;
  const lx=i=>W/2+(i-1)*W*.28;
  return{
    init(){x=lx(1);},
    down(id,X){lane=clamp(lane+(X<W/2?-1:1),0,L-1);beep(500,.03);},
    update(dt){t+=dt;spd+=dt*12;score+=dt*spd/100;x+=(lx(lane)-x)*Math.min(1,dt*14);next-=dt;
      if(next<=0){next=rnd(.45,.9)*420/spd*1.6;const free=ri(0,2);for(let i=0;i<3;i++)if(i!=free&&Math.random()<.7)obs.push({l:i,y:-40});}
      for(const o of obs)o.y+=spd*dt;obs=obs.filter(o=>o.y<H+50);
      for(const o of obs)if(Math.abs(o.y-(H-140))<34&&Math.abs(lx(o.l)-x)<W*.12){endSolo(false,`Distancia: ${Math.floor(score)} m`);return;}},
    draw(){ctx.fillStyle='#14051f';ctx.fillRect(0,0,W,H);ctx.strokeStyle='rgba(180,60,255,.35)';ctx.lineWidth=2;for(let y=(t*spd)%60;y<H;y+=60){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
      for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(W/2+(i-1.5)*W*.28,0);ctx.lineTo(W/2+(i-1.5)*W*.28,H);ctx.stroke();}
      for(const o of obs){ctx.fillStyle='#ff2bd6';ctx.shadowColor='#ff2bd6';ctx.shadowBlur=14;rrect(lx(o.l)-W*.1,o.y-22,W*.2,44,8);ctx.fill();ctx.shadowBlur=0;}
      circle(x,H-140,26,'#c026d3');circle(x-8,H-148,8,'rgba(255,255,255,.5)');TS(`${Math.floor(score)} m`,W/2,50,30,'#fff');T('Toca izquierda / derecha para cambiar de carril',W/2,H-30,14,'rgba(255,255,255,.6)');}
  };
},{cd:false,solo:true});

/* ---- SLOT CARS = coches de carreras de circuito (ya existe 'cars') ---- */

/* ---- ARCHERY (cada uno su diana) ---- */
def('archery','Archery','🏹','#4f9a3b',()=>{
  let pl,t=0,wind;const ARROWS=5;
  const geo=()=>({cx:W/2,cy:H*.68,R:Math.min(W*.34,H*.15)});
  return{
    init(){wind=rnd(-1,1);pl=[0,1].map(p=>({arrows:[],sc:0,ph:p*1.7}));},
    update(dt){t+=dt;if(pl.every(q=>q.arrows.length>=ARROWS)){const a=pl[0].sc,b=pl[1].sc;endRound(a==b?-1:a>b?0:1,`Azul ${a} – Rojo ${b}`);}},
    down(id,x,y,live){if(!live)return;const p=sideOf(y),q=pl[p];if(q.arrows.length>=ARROWS)return;const g=geo(),k=1+q.arrows.length*.15,
      ax=g.cx+g.R*.8*Math.sin(t*1.7*k+q.ph)+wind*g.R*.25,ay=g.cy+g.R*.8*Math.sin(t*2.3*k+q.ph*2),d=Math.hypot(ax-g.cx,ay-g.cy)/g.R,pts=d>1?0:10-Math.floor(d*10);
      q.arrows.push({x:ax,y:ay});q.sc+=pts;q.last=pts;beep(pts>=9?1000:500,.06);},
    draw(){for(let p=0;p<2;p++)inHalf(p,()=>{const q=pl[p],g=geo();ctx.fillStyle='#8fd36a';ctx.fillRect(0,H/2,W,H/2);ctx.fillStyle='#6fb34b';for(let i=0;i<8;i++)ctx.fillRect(0,H/2+i*H/16,W,H/32);
        const C=['#fff','#fff','#222','#222','#3b82f6','#3b82f6','#ef4444','#ef4444','#facc15','#facc15'];for(let i=0;i<10;i++)circle(g.cx,g.cy,g.R*(1-i/10),C[i]);ring(g.cx,g.cy,g.R,'#555',2);
        for(const a of q.arrows){ctx.strokeStyle='#5b3a1c';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(a.x+14,a.y+22);ctx.stroke();circle(a.x,a.y,4,COL[p]);}
        if(q.arrows.length<ARROWS){const k=1+q.arrows.length*.15,ax=g.cx+g.R*.8*Math.sin(t*1.7*k+q.ph)+wind*g.R*.25,ay=g.cy+g.R*.8*Math.sin(t*2.3*k+q.ph*2);ring(ax,ay,12,COL[p],3);ctx.strokeStyle=COL[p];ctx.beginPath();ctx.moveTo(ax-20,ay);ctx.lineTo(ax+20,ay);ctx.moveTo(ax,ay-20);ctx.lineTo(ax,ay+20);ctx.stroke();}
        TS(`${q.sc} pts · flechas ${ARROWS-q.arrows.length}`,W/2,H*.53,20,'#1d3b12');TS(`Viento ${wind>0?'→':'←'} · toca para disparar`,W/2,H*.96,15,'#1d3b12');});
      ctx.fillStyle='#fff';ctx.fillRect(0,H/2-2,W,4);}
  };
},{help:'5 flechas · más puntos gana'});

/* ---- ANIMAL STACK ---- */
def('animalstack','Animal stack','🐄','#1aa0d8',stackGame({em:['🐄','🐨','🐬','🐆','🐒','🐘','🐷','🦒','🐻','🐧','🦁','🐑'],base:'',speed:170,bg:'#7fd0f5',ground:'#6cc24a'}),{cd:false});

/* ---- Corredores en su mitad (Stampede y Gravity run) ---- */
function runnerGame(o){return()=>{
  let pl,t=0,rng,next=0,obs=[];const GY=()=>H*.9;
  return{
    init(){rng=seeded(ri(1,1e9));pl=[0,1].map(()=>({y:0,vy:0,lives:3,inv:0,g:1}));},
    down(id,x,y,live){if(!live)return;const q=pl[sideOf(y)];if(q.lives<=0)return;if(o.flip){q.g*=-1;beep(600,.04);}else if(q.y>=0){q.vy=-640;beep(500,.04);}},
    update(dt){t+=dt;const spd=260+t*8;next-=dt;if(next<=0){next=.7+rng()*1.1;obs.push({x:W+30,top:o.flip?rng()<.5:false});}
      for(const b of obs)b.x-=spd*dt;obs=obs.filter(b=>b.x>-40);const hh=H/2-80;
      pl.forEach(q=>{if(q.lives<=0)return;q.inv-=dt;if(o.flip){q.vy+=q.g*2200*dt;q.y+=q.vy*dt;if(q.y>0){q.y=0;q.vy=0;}if(q.y<-hh){q.y=-hh;q.vy=0;}}
        else{q.vy+=1900*dt;q.y+=q.vy*dt;if(q.y>0){q.y=0;q.vy=0;}}
        for(const b of obs)if(Math.abs(b.x-W*.25)<24&&q.inv<=0){const onTop=q.y<-hh+40;if((!b.top&&q.y>-40)||(b.top&&onTop)){q.lives--;q.inv=1;beep(120,.3,'sawtooth',.08);buzz(100);}}});
      const a=pl[0].lives<=0,b=pl[1].lives<=0;if(a||b)endRound(a&&b?-1:a?1:0,`Tiempo: ${Math.floor(t)} s`);},
    draw(){const hh=H/2-80;for(let p=0;p<2;p++)inHalf(p,()=>{const q=pl[p];ctx.fillStyle=o.sky;ctx.fillRect(0,H/2,W,H/2);ctx.fillStyle=o.ground;ctx.fillRect(0,GY()+20,W,H);if(o.flip)ctx.fillRect(0,H/2,W,GY()-hh-H/2-20);
        for(const b of obs){const by=b.top?GY()-hh-10:GY()-6;E(o.ob,b.x,by,44,b.top?Math.PI:0);}
        if(q.lives>0&&!(q.inv>0&&Math.floor(t*10)%2))E(o.hero,W*.25,GY()-6+q.y,40,o.flip&&q.g<0?Math.PI:0);
        hearts(Math.max(0,q.lives),24,H/2+24,20);TS(o.tip,W/2,H/2+24,15,'#222');});ctx.fillStyle='#fff';ctx.fillRect(0,H/2-2,W,4);}
  };};}
def('stampede','Stampede','🦬','#d79a3e',runnerGame({hero:'🏃',ob:'🦬',sky:'#f7d9a0',ground:'#c98b42',tip:'Toca para saltar',flip:false}),{help:'Salta los bisontes · 3 vidas'});

/* ---- TOCA EMPAREJA (1 jugador) ---- */
def('tilematch','Toca empareja','🍉','#e0574f',()=>{
  const EM=['🍉','🫐','🍓','🍋','🍇','🍒','🥝','🍑','🍍','🥕','🍄','🌽'];let tiles,tray=[],cs,ox,oy;
  const geo=()=>{cs=Math.min(W/6.6,H*.6/7);ox=(W-cs*6)/2;oy=H*.12;};
  const covered=t=>tiles.some(u=>u.z>t.z&&!u.gone&&Math.abs(u.x-t.x)<cs*.95&&Math.abs(u.y-t.y)<cs*.95);
  return{
    init(){geo();const pool=[];EM.forEach(e=>{for(let k=0;k<3;k++)pool.push(e);});shuffle(pool);tiles=[];let k=0;
      for(let r=0;r<5;r++)for(let c=0;c<6;c++)tiles.push({e:pool[k++],x:ox+c*cs,y:oy+r*cs,z:0});
      for(let i=0;i<6;i++)tiles.push({e:pool[k++],x:ox+((i%3)*2+.5)*cs,y:oy+(Math.floor(i/3)*2+.5+1)*cs,z:1});},resize:geo,
    down(id,x,y){if(tray.length>=7)return;const cand=tiles.filter(t=>!t.gone&&x>=t.x&&x<=t.x+cs&&y>=t.y&&y<=t.y+cs&&!covered(t)).sort((a,b)=>b.z-a.z);const t=cand[0];if(!t)return;
      t.gone=true;let i=tray.map(q=>q).lastIndexOf(t.e);tray.splice(i<0?tray.length:i+1,0,t.e);beep(600,.03);
      const n=tray.filter(e=>e==t.e).length;if(n==3){tray=tray.filter(e=>e!=t.e);beep(900,.1,'sine',.1);}
      if(tiles.every(q=>q.gone)&&!tray.length)endSolo(true,'¡Tablero limpio!');else if(tray.length>=7)endSolo(false,'La bandeja se llenó');},
    draw(){ctx.fillStyle='#f6d7c3';ctx.fillRect(0,0,W,H);TS('Junta 3 iguales en la bandeja',W/2,40,22,'#9c3d2f');
      for(const t of tiles.slice().sort((a,b)=>a.z-b.z)){if(t.gone)continue;const cov=covered(t);ctx.fillStyle='rgba(0,0,0,.25)';rrect(t.x+2,t.y+5,cs-4,cs-4,10);ctx.fill();ctx.fillStyle=cov?'#c9b9ad':'#fff';rrect(t.x+2,t.y+2,cs-4,cs-4,10);ctx.fill();ctx.globalAlpha=cov?.45:1;E(t.e,t.x+cs/2,t.y+cs/2,cs*.6);ctx.globalAlpha=1;}
      const ty=H-cs-40,tw=W/7.3;ctx.fillStyle='#7b3b2b';rrect(10,ty-8,W-20,tw+16,14);ctx.fill();for(let i=0;i<7;i++){ctx.fillStyle='#a5584a';rrect(14+i*(W-28)/7,ty,(W-28)/7-4,tw,8);ctx.fill();if(tray[i])E(tray[i],14+i*(W-28)/7+((W-28)/7-4)/2,ty+tw/2,tw*.6);}}
  };
},{cd:false,solo:true});

/* ---- TARGET PRACTICE ---- */
def('target','Target practice','🎯','#2e8b3d',()=>{
  let tg=[[],[]],sc=[0,0],t=0,next=0,rng;const TL=30;
  return{
    init(){rng=seeded(ri(1,1e9));},
    update(dt){t+=dt;next-=dt;if(next<=0){next=.5+rng()*.5;const y=H*(.56+rng()*.34),dir=rng()<.5?1:-1,sp=80+rng()*120,life=2.2;for(let p=0;p<2;p++)tg[p].push({x:dir>0?-30:W+30,y,dir,sp,life,r:28});}
      for(const a of tg)for(const q of a){q.x+=q.dir*q.sp*dt;q.life-=dt;}for(let p=0;p<2;p++)tg[p]=tg[p].filter(q=>q.life>0&&!q.hit);
      if(t>=TL){endRound(sc[0]==sc[1]?-1:sc[0]>sc[1]?0:1,`${sc[0]} – ${sc[1]}`);}},
    down(id,x,y,live){if(!live)return;const p=sideOf(y),l=local(p,x,y);for(const q of tg[p]){const d=Math.hypot(l.x-q.x,l.y-q.y);if(d<q.r){q.hit=true;const pts=d<q.r*.35?3:1;sc[p]+=pts;beep(pts==3?1100:700,.05);return;}}sc[p]=Math.max(0,sc[p]-1);beep(150,.05);},
    draw(){for(let p=0;p<2;p++)inHalf(p,()=>{ctx.fillStyle='#bfe3a8';ctx.fillRect(0,H/2,W,H/2);ctx.fillStyle='#8a6a3a';ctx.fillRect(0,H*.53,W,6);
        for(const q of tg[p]){circle(q.x,q.y,q.r,'#fff');circle(q.x,q.y,q.r*.75,'#e53935');circle(q.x,q.y,q.r*.5,'#fff');circle(q.x,q.y,q.r*.3,'#e53935');}
        TS(`${sc[p]} pts`,50,H*.97-6,24,COL[p]);TS(`⏱ ${Math.ceil(Math.max(0,TL-t))}`,W-40,H*.97-6,22,'#1d3b12');});ctx.fillStyle='#fff';ctx.fillRect(0,H/2-2,W,4);}
  };
},{help:'Centro = 3 · fallar resta 1'});

def('gravity','Gravity run','🙃','#22b5e8',runnerGame({hero:'🥷',ob:'🔺',sky:'#7fd6f5',ground:'#6b4a2b',tip:'Toca para invertir la gravedad',flip:true}),{help:'Toca para cambiar suelo/techo'});

/* ---- BRICK BLAST ---- */
def('brick','Brick blast','🧱','#222a35',()=>{
  let px=[0,0],balls,bricks,sc=[0,0],pw;const BR=9;
  const py=p=>p==0?H-60:60;
  return{
    init(){pw=W*.24;px=[W/2,W/2];bricks=[];const cols=7,bw=W/cols,bh=22;for(let r=0;r<6;r++)for(let c=0;c<cols;c++)bricks.push({x:c*bw+3,y:H/2-3*bh+r*bh+2,w:bw-6,h:bh-4});
      balls=[0,1].map(p=>({x:W/2,y:p==0?H-90:90,vx:rnd(-150,150),vy:p==0?-380:380,p}));},
    down(id,x,y){px[sideOf(y)]=clamp(x,pw/2,W-pw/2);},move(id,x,y){px[sideOf(y)]=clamp(x,pw/2,W-pw/2);},
    update(dt){const N=4,h=dt/N;for(let s=0;s<N;s++)for(const b of balls){b.x+=b.vx*h;b.y+=b.vy*h;if(b.x<BR||b.x>W-BR)b.vx*=-1,b.x=clamp(b.x,BR,W-BR);
      for(let p=0;p<2;p++){const yy=py(p),dir=p==0?1:-1;if(b.vy*dir>0&&Math.abs(b.y-yy)<BR+8&&Math.abs(b.x-px[p])<pw/2+BR){const off=(b.x-px[p])/(pw/2),sp=Math.min(Math.hypot(b.vx,b.vy)*1.03,900);b.vx=off*sp*.7;b.vy=-dir*Math.sqrt(Math.max(sp*sp-b.vx*b.vx,100));b.p=p;beep(500,.03);}}
      for(let i=bricks.length-1;i>=0;i--){const k=bricks[i];if(b.x>k.x-BR&&b.x<k.x+k.w+BR&&b.y>k.y-BR&&b.y<k.y+k.h+BR){bricks.splice(i,1);sc[b.p]++;b.vy*=-1;beep(800,.03,'sine',.08);break;}}
      if(b.y>H+20||b.y<-20){const loser=b.y>H?0:1;sc[loser]=Math.max(0,sc[loser]-2);b.x=px[loser];b.y=py(loser)+(loser?30:-30);b.vx=rnd(-150,150);b.vy=loser?380:-380;b.p=loser;beep(150,.2,'sawtooth',.06);}}
      if(!bricks.length)endRound(sc[0]==sc[1]?-1:sc[0]>sc[1]?0:1,`${sc[0]} – ${sc[1]}`);},
    draw(){ctx.fillStyle='#1b2028';ctx.fillRect(0,0,W,H);const hue=['#ff6b6b','#ffa94d','#ffd43b','#69db7c','#4dabf7','#9775fa'];
      bricks.forEach(k=>{ctx.fillStyle=hue[Math.floor((k.y-(H/2-66))/22)%6]||'#aaa';rrect(k.x,k.y,k.w,k.h,5);ctx.fill();});
      for(let p=0;p<2;p++){ctx.fillStyle=COL[p];rrect(px[p]-pw/2,py(p)-8,pw,16,8);ctx.fill();}for(const b of balls){circle(b.x,b.y,BR,COL[b.p]);ring(b.x,b.y,BR,'#fff',2);}
      scoreSide(sc);}
  };
},{help:'Rompe más ladrillos · si se te escapa, −2'});

/* ---- BLOQUES (1 jugador) ---- */
def('blocks','Bloques','🟧','#6a3f2e',()=>{
  const SH=[[[0,0]],[[0,0],[1,0]],[[0,0],[0,1]],[[0,0],[1,0],[2,0]],[[0,0],[0,1],[0,2]],[[0,0],[1,0],[0,1],[1,1]],[[0,0],[1,0],[2,0],[3,0]],[[0,0],[0,1],[0,2],[0,3]],[[0,0],[0,1],[1,1]],[[1,0],[0,1],[1,1]],[[0,0],[1,0],[1,1]],[[0,0],[1,0],[0,1]],[[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[0,2],[1,2],[2,2]],[[0,0],[1,0],[2,0],[2,1],[2,2]],[[0,0],[0,1],[0,2],[1,2],[2,2]]];
  const CL=['#f59e0b','#ef4444','#22c55e','#3b82f6','#a855f7','#ec4899'];let b,pieces,drag=null,score=0,cs,ox,oy;
  const geo=()=>{cs=Math.min(W*.94/8,H*.5/8);ox=(W-cs*8)/2;oy=H*.14;};
  const fits=(s,c,r)=>s.every(([x,y])=>c+x>=0&&c+x<8&&r+y>=0&&r+y<8&&b[(r+y)*8+c+x]<0);
  const deal=()=>{pieces=[0,1,2].map(i=>({s:pick(SH),c:ri(0,CL.length-1),i}));};
  const slot=i=>({x:W*(.18+i*.32),y:H*.8});
  const anyFit=()=>pieces.some(p=>p&&[...Array(64).keys()].some(k=>fits(p.s,k%8,Math.floor(k/8))));
  return{
    init(){geo();b=Array(64).fill(-1);deal();},resize:geo,
    down(id,x,y){for(const p of pieces){if(!p)continue;const q=slot(p.i);if(Math.abs(x-q.x)<W*.15&&Math.abs(y-q.y)<H*.1){drag={p,x,y};return;}}},
    move(id,x,y){if(drag){drag.x=x;drag.y=y;}},
    up(){if(!drag)return;const p=drag.p,c=Math.round((drag.x-ox)/cs-1),r=Math.round((drag.y-H*.1-oy)/cs-1);
      if(fits(p.s,c,r)){p.s.forEach(([x,y])=>b[(r+y)*8+c+x]=p.c);score+=p.s.length;pieces[p.i]=null;beep(500,.04);
        const full=[];for(let i=0;i<8;i++){if([...Array(8).keys()].every(k=>b[i*8+k]>=0))for(let k=0;k<8;k++)full.push(i*8+k);if([...Array(8).keys()].every(k=>b[k*8+i]>=0))for(let k=0;k<8;k++)full.push(k*8+i);}
        if(full.length){new Set(full).forEach(i=>b[i]=-1);score+=full.length*2;beep(900,.12,'sine',.1);}
        if(pieces.every(q=>!q))deal();if(!anyFit())endSolo(false,`Puntos: ${score}`);}
      drag=null;},
    draw(){ctx.fillStyle='#4a2c20';ctx.fillRect(0,0,W,H);TS(`Puntos: ${score}`,W/2,H*.07,28,'#fff');
      for(let i=0;i<64;i++){const x=ox+(i%8)*cs,y=oy+Math.floor(i/8)*cs;ctx.fillStyle=b[i]<0?'#6b4636':CL[b[i]];rrect(x+2,y+2,cs-4,cs-4,6);ctx.fill();}
      for(const p of pieces){if(!p||(drag&&drag.p==p))continue;const q=slot(p.i),s=cs*.5;p.s.forEach(([x,y])=>{ctx.fillStyle=CL[p.c];rrect(q.x-s+x*s,q.y-s+y*s,s-2,s-2,4);ctx.fill();});}
      if(drag){const p=drag.p;p.s.forEach(([x,y])=>{ctx.fillStyle=CL[p.c];ctx.globalAlpha=.85;rrect(drag.x-cs+x*cs,drag.y-H*.1-cs+y*cs,cs-4,cs-4,6);ctx.fill();ctx.globalAlpha=1;});}
      T('Arrastra las piezas al tablero',W/2,H*.95,15,'rgba(255,255,255,.6)');}
  };
},{cd:false,solo:true});

/* ---- TENNIS ---- */
def('tennis','Tennis','🎾','#2f8f46',()=>{
  let pl,ball,sc=[0,0],wait=1,serve=0;const PTS=5,PR=34;
  function srv(){ball={x:W/2,y:serve==0?H*.7:H*.3,vx:0,vy:0,z:0};wait=.8;}
  return{
    init(){pl=[{x:W/2,y:H*.85,tx:W/2,ty:H*.85},{x:W/2,y:H*.15,tx:W/2,ty:H*.15}];srv();},
    down(id,x,y){const p=sideOf(y);pl[p].tx=x;pl[p].ty=p==0?clamp(y,H/2+40,H-20):clamp(y,20,H/2-40);},move(id,x,y){this.down(id,x,y);},
    update(dt){for(const q of pl){q.x+=clamp(q.tx-q.x,-600*dt,600*dt);q.y+=clamp(q.ty-q.y,-600*dt,600*dt);}
      if(wait>0){wait-=dt;if(wait<=0){ball.vy=serve==0?-420:420;ball.vx=rnd(-120,120);}return;}
      ball.x+=ball.vx*dt;ball.y+=ball.vy*dt;if(ball.x<12||ball.x>W-12){ball.vx*=-1;ball.x=clamp(ball.x,12,W-12);}
      for(let p=0;p<2;p++){const q=pl[p],dir=p==0?1:-1;if(ball.vy*dir>0&&Math.hypot(ball.x-q.x,ball.y-q.y)<PR+10){const sp=Math.min(Math.hypot(ball.vx,ball.vy)*1.05+20,950);ball.vx=(ball.x-q.x)*8+rnd(-60,60);ball.vy=-dir*Math.sqrt(Math.max(sp*sp-ball.vx*ball.vx,90000));beep(600,.04,'square',.06);}}
      if(ball.y>H+15||ball.y<-15){const w=ball.y>H?1:0;sc[w]++;serve=1-w;beep(w?330:660,.2,'triangle',.08);if(sc[w]>=PTS){wait=99;later(()=>endRound(w,`${sc[0]} – ${sc[1]}`),500);}else srv();}},
    draw(){ctx.fillStyle='#2f8f46';ctx.fillRect(0,0,W,H);ctx.fillStyle='#3aa556';ctx.fillRect(W*.08,20,W*.84,H-40);ctx.strokeStyle='#fff';ctx.lineWidth=4;ctx.strokeRect(W*.08,20,W*.84,H-40);
      ctx.beginPath();ctx.moveTo(W/2,H*.3);ctx.lineTo(W/2,H*.7);ctx.moveTo(W*.08,H*.3);ctx.lineTo(W*.92,H*.3);ctx.moveTo(W*.08,H*.7);ctx.lineTo(W*.92,H*.7);ctx.stroke();ctx.fillStyle='#eee';ctx.fillRect(0,H/2-3,W,6);
      pl.forEach((q,p)=>{circle(q.x,q.y,22,COL[p]);ctx.strokeStyle='#333';ctx.lineWidth=4;ring(q.x+(p?-22:22),q.y+(p?18:-18),14,'#333',4);});
      circle(ball.x,ball.y,9,'#d4f53c');scoreSide(sc);for(let p=0;p<2;p++)inHalf(p,()=>T('Mueve el dedo: devuelves la bola al tocarla',W/2,H-8,13,'rgba(255,255,255,.8)'));}
  };
},{help:'Muévete para devolver la bola'});
