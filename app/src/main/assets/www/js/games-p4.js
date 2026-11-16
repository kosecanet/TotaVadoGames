"use strict";
/* Bloque 4: Baloncesto, Lanzaespadas, Minigolf, Batalla naval, El último sashimi, Minifútbol, Bambú shuriken, Vóley cangrejo,
   Pesca injusta, Guarda y ladrón, Batalla de ranas, Arena robot, Festival explosivo, Batalla disco, Picos helados, Sitio fatal, Bolos */

/* ---- BALONCESTO (cada uno su canasta) ---- */
def('basket','Baloncesto','🏀','#2f4f6b',()=>{
  let pl,t=0;const TL=30;
  const hoopX=(p)=>W/2+Math.sin(t*(1+p*.0)*1.3+p)*W*.3,HY=()=>H*.6;
  return{
    init(){pl=[0,1].map(()=>({b:null,sc:0,msg:'',mt:0}));},
    up(id,x,y,i){const p=sideOf(i.sy),q=pl[p];if(q.b)return;const dy=p==0?i.dy:-i.dy,dx=p==0?i.dx:-i.dx;if(dy>-40)return;q.b={x0:W/2,tx:W/2+dx*1.4,t:0};beep(300,.04);},
    update(dt){t+=dt;for(let p=0;p<2;p++){const q=pl[p];q.mt-=dt;if(q.b){q.b.t+=dt/.7;if(q.b.t>=1){const ok=Math.abs(q.b.tx-hoopX(p))<W*.075;if(ok){q.sc++;q.msg='¡Canasta!';beep(900,.12,'triangle',.1);}else{q.msg='Fallo';beep(200,.08);}q.mt=.6;q.b=null;}}}
      if(t>=TL){const a=pl[0].sc,b=pl[1].sc;endRound(a==b?-1:a>b?0:1,`${a} – ${b}`);}},
    draw(){for(let p=0;p<2;p++)inHalf(p,()=>{const q=pl[p];ctx.fillStyle='#e8a352';ctx.fillRect(0,H/2,W,H/2);ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(W/2,H,W*.3,Math.PI,0);ctx.stroke();
        const hx=hoopX(p),hy=HY();ctx.fillStyle='#fff';rrect(hx-W*.13,hy-60,W*.26,46,4);ctx.fill();ctx.strokeStyle='#e53935';ctx.lineWidth=3;ctx.strokeRect(hx-W*.05,hy-50,W*.1,26);
        ctx.strokeStyle='#e53935';ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(hx,hy-8,W*.075,8,0,0,7);ctx.stroke();ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=2;for(let i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(hx+i*W*.02,hy-4);ctx.lineTo(hx+i*W*.012,hy+22);ctx.stroke();}
        if(q.b){const k=q.b.t,x=q.b.x0+(q.b.tx-q.b.x0)*k,y=(H-90)+(hy-8-(H-90))*k-Math.sin(k*Math.PI)*90;E('🏀',x,y,40-k*14);}else E('🏀',W/2,H-90,40);
        TS(`${q.sc}`,40,H*.55,32,COL[p]);TS(`⏱ ${Math.ceil(Math.max(0,TL-t))}`,W-44,H*.55,22,'#fff');if(q.mt>0)TS(q.msg,W/2,H*.75,30,'#fff');else T('Desliza hacia arriba para lanzar',W/2,H-24,15,'#fff');});
      ctx.fillStyle='#fff';ctx.fillRect(0,H/2-2,W,4);}
  };
},{help:'Más canastas en 30 s'});

/* ---- LANZAESPADAS ---- */
def('swords','Lanzaespadas','🗡️','#a0522d',()=>{
  let sw=[],dum=[],sc=[0,0],cool=[0,0],next=0;const PTS=10;
  return{
    update(dt){cool[0]-=dt;cool[1]-=dt;next-=dt;if(next<=0){next=rnd(.6,1.2);const dir=Math.random()<.5?1:-1;dum.push({x:dir>0?-30:W+30,y:H/2+rnd(-H*.12,H*.12),dir,sp:rnd(80,180)});}
      for(const d of dum)d.x+=d.dir*d.sp*dt;dum=dum.filter(d=>d.x>-50&&d.x<W+50&&!d.hit);
      for(const s of sw){s.y+=s.vy*dt;}
      for(const s of sw){if(s.gone)continue;for(const d of dum)if(!d.hit&&Math.abs(s.x-d.x)<26&&Math.abs(s.y-d.y)<30){d.hit=true;s.gone=true;sc[s.p]++;beep(800,.06,'square',.07);if(sc[s.p]>=PTS)later(()=>endRound(s.p,`${sc[0]} – ${sc[1]}`),300);}
        for(const o of sw)if(o!==s&&!o.gone&&o.p!=s.p&&Math.abs(o.x-s.x)<14&&Math.abs(o.y-s.y)<26){o.gone=s.gone=true;beep(1500,.05,'square',.05);}}
      sw=sw.filter(s=>!s.gone&&s.y>-60&&s.y<H+60);},
    down(id,x,y,live){if(!live)return;const p=sideOf(y);if(cool[p]>0)return;cool[p]=.35;sw.push({x,y:p==0?H-40:40,vy:p==0?-700:700,p});beep(400,.03);},
    draw(){halves('#7a4426','#7a4426');ctx.fillStyle='#5b3018';ctx.fillRect(0,H/2-H*.16,W,H*.32);
      for(const d of dum){ctx.fillStyle='#d2a679';rrect(d.x-18,d.y-26,36,52,10);ctx.fill();circle(d.x,d.y,10,'#e53935');circle(d.x,d.y,5,'#fff');}
      for(const s of sw){ctx.save();ctx.translate(s.x,s.y);if(s.p==1)ctx.rotate(Math.PI);ctx.fillStyle='#dfe6ee';ctx.beginPath();ctx.moveTo(0,-26);ctx.lineTo(6,0);ctx.lineTo(-6,0);ctx.fill();ctx.fillStyle=COL[s.p];ctx.fillRect(-10,0,20,5);ctx.fillRect(-3,5,6,12);ctx.restore();}
      scoreSide(sc);for(let p=0;p<2;p++)inHalf(p,()=>T('Toca para lanzar espadas a los muñecos',W/2,H-16,14,'#fff'));}
  };
},{help:'10 impactos gana'});

/* ---- MINIGOLF (cada uno su copia del hoyo) ---- */
def('minigolf','Minigolf','⛳','#14a0c8',()=>{
  const HOLES=[{s:[.5,.9],h:[.5,.6],w:[[.2,.75,.6,.03]]},{s:[.2,.92],h:[.8,.6],w:[[0,.76,.65,.03],[.35,.66,.65,.03]]},{s:[.5,.92],h:[.5,.58],w:[[.15,.7,.3,.03],[.55,.7,.3,.03],[.38,.8,.24,.03]]}];
  let hole=0,pl;
  const rect=a=>({x:a[0]*W,y:H/2+(a[1]-.5)*H,w:a[2]*W,h:a[3]*H});
  function newHole(){const d=HOLES[hole];for(const q of pl){q.b={x:d.s[0]*W,y:H/2+(d.s[1]-.5)*H,vx:0,vy:0,r:8};q.done=false;}}
  return{
    init(){pl=[0,1].map(()=>({strokes:0,aim:null}));newHole();},
    down(id,x,y){const p=sideOf(y),q=pl[p];if(q.done||q.aim||Math.hypot(q.b.vx,q.b.vy)>0)return;const l=local(p,x,y);q.aim={id,sx:l.x,sy:l.y,x:l.x,y:l.y};},
    move(id,x,y){for(let p=0;p<2;p++){const a=pl[p].aim;if(a&&a.id===id){const l=local(p,x,y);a.x=l.x;a.y=l.y;}}},
    up(id){for(const q of pl){const a=q.aim;if(a&&a.id===id){q.aim=null;const dx=a.sx-a.x,dy=a.sy-a.y,l=Math.hypot(dx,dy);if(l<8)continue;const pw=Math.min(l,130)/130*900;q.b.vx=dx/l*pw;q.b.vy=dy/l*pw;q.strokes++;beep(400,.04);}}},
    update(dt){const d=HOLES[hole],hx=d.h[0]*W,hy=H/2+(d.h[1]-.5)*H;
      for(const q of pl){if(q.done)continue;const b=q.b,N=4,h=dt/N;for(let s=0;s<N;s++){moveDiscs([b],h,.45);bounceBox(b,8,H/2+8,W-8,H-8,.75);
          for(const w of d.w){const r=rect(w),cx=clamp(b.x,r.x,r.x+r.w),cy=clamp(b.y,r.y,r.y+r.h),dx=b.x-cx,dy=b.y-cy,dd=Math.hypot(dx,dy);if(dd<b.r&&dd>0){const nx=dx/dd,ny=dy/dd;b.x=cx+nx*b.r;b.y=cy+ny*b.r;const vn=b.vx*nx+b.vy*ny;if(vn<0){b.vx-=1.75*vn*nx;b.vy-=1.75*vn*ny;}beep(900,.02);}}
          if(Math.hypot(b.x-hx,b.y-hy)<12&&Math.hypot(b.vx,b.vy)<500){q.done=true;b.vx=b.vy=0;b.x=hx;b.y=hy;beep(880,.2,'triangle',.1);}}}
      if(pl.every(q=>q.done)){hole++;if(hole>=HOLES.length){const a=pl[0].strokes,b=pl[1].strokes;endRound(a==b?-1:a<b?0:1,`Golpes: Azul ${a} – Rojo ${b}`);}else newHole();}},
    draw(){const d=HOLES[Math.min(hole,HOLES.length-1)],hx=d.h[0]*W,hy=H/2+(d.h[1]-.5)*H;
      for(let p=0;p<2;p++)inHalf(p,()=>{const q=pl[p];ctx.fillStyle='#0f7fa3';ctx.fillRect(0,H/2,W,H/2);ctx.fillStyle='#6cc24a';rrect(8,H/2+8,W-16,H/2-16,16);ctx.fill();ctx.fillStyle='rgba(255,255,255,.06)';for(let y=H/2;y<H;y+=24)ctx.fillRect(8,y,W-16,12);
        ctx.fillStyle='#8d5a35';for(const w of d.w){const r=rect(w);rrect(r.x,r.y,r.w,r.h,4);ctx.fill();}circle(hx,hy,11,'#1b1b1b');ctx.fillStyle='#fff';ctx.fillRect(hx-1,hy-40,3,40);ctx.fillStyle=COL[p];ctx.beginPath();ctx.moveTo(hx+2,hy-40);ctx.lineTo(hx+22,hy-33);ctx.lineTo(hx+2,hy-26);ctx.fill();
        circle(q.b.x,q.b.y,q.b.r,'#fff');ring(q.b.x,q.b.y,q.b.r,COL[p],2);
        if(q.aim){const dx=q.aim.sx-q.aim.x,dy=q.aim.sy-q.aim.y,l=Math.hypot(dx,dy)||1,pw=Math.min(l,130);ctx.strokeStyle='#fff';ctx.setLineDash([6,6]);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(q.b.x,q.b.y);ctx.lineTo(q.b.x+dx/l*pw,q.b.y+dy/l*pw);ctx.stroke();ctx.setLineDash([]);}
        TS(`Hoyo ${Math.min(hole+1,3)}/3 · Golpes ${q.strokes}`,W/2,H/2+26,18,'#fff');if(q.done)TS('¡Dentro! Espera...',W/2,H/2+50,16,'#ffe066');});ctx.fillStyle='#fff';ctx.fillRect(0,H/2-2,W,4);}
  };
},{help:'Arrastra hacia atrás · menos golpes gana'});

/* ---- BATALLA NAVAL (en tiempo real, cañonazos) ---- */
def('shipbattle','Batalla naval','⛵','#1e4d7a',()=>{
  let sh,shots=[],hp=[3,3],cool=[0,0],isl;
  return{
    init(){sh=[{x:W/2,dir:1,y:H-70},{x:W/2,dir:-1,y:70}];isl=[{x:W*.25,y:H/2,r:30},{x:W*.75,y:H/2,r:24}];},
    update(dt){for(const s of sh){s.x+=s.dir*90*dt;if(s.x<40||s.x>W-40)s.dir*=-1;}cool[0]-=dt;cool[1]-=dt;
      for(const b of shots){b.t+=dt/b.T;}for(const b of shots)if(b.t>=1&&!b.done){b.done=true;const o=sh[1-b.p];if(Math.hypot(b.tx-o.x,b.ty-o.y)<34){hp[1-b.p]--;b.hit=true;beep(100,.4,'sawtooth',.1);buzz(120);if(hp[1-b.p]<=0)later(()=>endRound(b.p,'¡Barco hundido!'),700);}else beep(300,.1,'sine',.06);b.end=.5;}
      for(const b of shots)if(b.done)b.end-=dt;shots=shots.filter(b=>!b.done||b.end>0);},
    down(id,x,y,live){if(!live)return;const p=sideOf(y);if(cool[p]>0)return;cool[p]=1;const s=sh[p];const tx=x,ty=p==0?Math.min(y,H/2)-H*.0:Math.max(y,H/2);
      const aimY=p==0?clamp(H-y,0,H)*0+70:H-70;shots.push({p,sx:s.x,sy:s.y,tx:x,ty:aimY,t:0,T:1});beep(150,.15,'sawtooth',.08);},
    draw(){ctx.fillStyle='#1e5a8c';ctx.fillRect(0,0,W,H);ctx.strokeStyle='rgba(255,255,255,.12)';ctx.lineWidth=2;for(let y=20;y<H;y+=40){ctx.beginPath();for(let x=0;x<=W;x+=20)ctx.lineTo(x,y+Math.sin(x/30+y)*4);ctx.stroke();}
      for(const i of isl){circle(i.x,i.y,i.r,'#e7c97a');E('🌴',i.x,i.y-6,i.r*1.3);}
      sh.forEach((s,p)=>{ctx.save();ctx.translate(s.x,s.y);if(p)ctx.rotate(Math.PI);ctx.fillStyle='#7a4a24';ctx.beginPath();ctx.moveTo(-34,0);ctx.lineTo(34,0);ctx.lineTo(24,16);ctx.lineTo(-24,16);ctx.fill();ctx.fillStyle=COL[p];ctx.beginPath();ctx.moveTo(0,-34);ctx.lineTo(24,-4);ctx.lineTo(0,-4);ctx.fill();ctx.fillStyle='#fff';ctx.fillRect(-2,-36,3,36);ctx.restore();});
      for(const b of shots){if(!b.done){const k=b.t,x=b.sx+(b.tx-b.sx)*k,y=b.sy+(b.ty-b.sy)*k;circle(x,y,6+Math.sin(k*Math.PI)*6,'#222');}else E(b.hit?'💥':'💦',b.tx,b.ty,40);}
      for(let p=0;p<2;p++)inHalf(p,()=>{hearts(hp[p],24,H/2+30,20);T('Toca donde quieras disparar (tarda 1 s)',W/2,H/2+60,14,'#fff');});}
  };
},{help:'Adelanta el disparo al barco rival'});

/* ---- EL ÚLTIMO SASHIMI ---- */
def('sashimi','El último sashimi','🍣','#e04a3f',()=>{
  let it=[],sc=[0,0],lock=[0,0],R,wait=0;const PTS=5,DEC=['🍤','🍙','🥟','🍥','🍡'];
  function round(){it=[{e:'🍣',s:true}];for(let i=0;i<4;i++)it.push({e:pick(DEC)});const sp=140+(sc[0]+sc[1])*25;it.forEach(o=>{const a=rnd(0,6);o.x=W/2+rnd(-R*.5,R*.5);o.y=H/2+rnd(-R*.5,R*.5);o.vx=Math.cos(a)*sp;o.vy=Math.sin(a)*sp;});}
  return{
    init(){R=Math.min(W,H)*.42;round();},
    update(dt){lock[0]-=dt;lock[1]-=dt;if(wait>0){wait-=dt;if(wait<=0)round();return;}for(const o of it){o.x+=o.vx*dt;o.y+=o.vy*dt;const dx=o.x-W/2,dy=o.y-H/2,d=Math.hypot(dx,dy);if(d>R-24){const nx=dx/d,ny=dy/d,vn=o.vx*nx+o.vy*ny;o.vx-=2*vn*nx;o.vy-=2*vn*ny;o.x=W/2+nx*(R-24);o.y=H/2+ny*(R-24);}}},
    down(id,x,y,live){if(!live||wait>0)return;const p=sideOf(y);if(lock[p]>0)return;let best=null,bd=40;for(const o of it){const d=Math.hypot(o.x-x,o.y-y);if(d<bd){bd=d;best=o;}}if(!best)return;
      if(best.s){sc[p]++;wait=.9;best.who=p;beep(900,.12,'triangle',.1);if(sc[p]>=PTS){wait=99;later(()=>endRound(p,`${sc[0]} – ${sc[1]}`),600);}}else{lock[p]=.8;beep(150,.2,'sawtooth',.06);buzz(50);}},
    draw(){halves('#b83a30','#b83a30');circle(W/2,H/2+6,R,'rgba(0,0,0,.25)');circle(W/2,H/2,R,'#fff');ring(W/2,H/2,R*.9,'#2c5aa0',4);
      for(const o of it){if(o.s&&o.who!=null&&wait>0)circle(o.x,o.y,28,COL[o.who]);E(o.e,o.x,o.y,40);}
      for(let p=0;p<2;p++)inHalf(p,()=>{TS(String(sc[p]),W*.12,H*.95,30,'#fff');TS(lock[p]>0?'¡Eso no es sashimi!':'¡Atrapa el 🍣 con los palillos!',W/2,H*.95,17,'#ffe066');});}
  };
},{help:'Toca solo el 🍣'});

/* ---- MINIFÚTBOL ---- */
def('minisoccer','Minifútbol','⚽','#3a9d3e',()=>{
  const J=Joys();let pl,ball,sc=[0,0],gw,wait=0;const PTS=3;
  function reset(){pl=[{x:W/2,y:H*.8,vx:0,vy:0,r:24,m:3},{x:W/2,y:H*.2,vx:0,vy:0,r:24,m:3}];ball={x:W/2,y:H/2,vx:0,vy:0,r:13,m:1};}
  return{
    init(){gw=W*.4;reset();},down:(i,x,y)=>J.down(i,x,y),move:(i,x,y)=>J.move(i,x,y),up:i=>J.up(i),
    update(dt){if(wait>0){wait-=dt;if(wait<=0)reset();return;}for(let p=0;p<2;p++){const v=J.vec(p);pl[p].vx+=v.x*1100*dt;pl[p].vy+=v.y*1100*dt;}
      const all=[...pl,ball],N=3,h=dt/N;for(let s=0;s<N;s++){moveDiscs(pl,h,.2);moveDiscs([ball],h,.6);for(const k of pl)bounceBox(k,0,0,W,H,.4);
        const inM=Math.abs(ball.x-W/2)<gw/2;if(ball.x<ball.r||ball.x>W-ball.r){ball.vx*=-.8;ball.x=clamp(ball.x,ball.r,W-ball.r);}if(!inM){if(ball.y<ball.r){ball.y=ball.r;ball.vy=Math.abs(ball.vy)*.8;}if(ball.y>H-ball.r){ball.y=H-ball.r;ball.vy=-Math.abs(ball.vy)*.8;}}
        if(collideAll(all,.9))beep(500,.02);
        if(ball.y<-ball.r||ball.y>H+ball.r){const w=ball.y<0?0:1;sc[w]++;beep(900,.3,'triangle',.1);buzz(80);wait=1;if(sc[w]>=PTS){wait=99;later(()=>endRound(w,`${sc[0]} – ${sc[1]}`),800);}return;}}},
    draw(){ctx.fillStyle='#43a047';ctx.fillRect(0,0,W,H);ctx.fillStyle='rgba(255,255,255,.07)';for(let y=0;y<H;y+=50)ctx.fillRect(0,y,W,25);ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,H/2);ctx.lineTo(W,H/2);ctx.stroke();ring(W/2,H/2,W*.15,'#fff',3);
      ctx.fillStyle=RED;ctx.fillRect(W/2-gw/2,0,gw,6);ctx.fillStyle=BLUE;ctx.fillRect(W/2-gw/2,H-6,gw,6);
      pl.forEach((k,p)=>{circle(k.x,k.y,k.r,COL[p]);E('🏃',k.x,k.y,k.r*1.3,p?Math.PI:0);});E('⚽',ball.x,ball.y,ball.r*2.2);J.draw();scoreSide(sc);if(wait>0&&wait<5)for(let p=0;p<2;p++)TP(p,'¡GOOOL!',H*.7,48,'#ffe066');}
  };
},{help:'Arrastra para mover · 3 goles'});

/* ---- BAMBÚ SHURIKEN ---- */
def('bamboo','Bambú shuriken','🎋','#8a5a2b',()=>{
  let st=[],sh=[],sc=[0,0],t=0,next=0,cool=[0,0];const TL=30;
  return{
    update(dt){t+=dt;cool[0]-=dt;cool[1]-=dt;next-=dt;if(next<=0){next=rnd(.4,.9);st.push({x:rnd(30,W-30),h:0,grow:rnd(60,120),life:2.5});}
      for(const s of st){s.h=Math.min(H*.14,s.h+s.grow*dt);s.life-=dt;}st=st.filter(s=>s.life>0&&!s.cut);
      for(const k of sh){k.x+=k.vx*dt;k.y+=k.vy*dt;k.r+=dt*20;for(const s of st)if(!s.cut&&Math.abs(k.x-s.x)<12&&Math.abs(k.y-H/2)<s.h){s.cut=true;k.gone=true;sc[k.p]++;beep(1000,.05,'square',.06);}}
      sh=sh.filter(k=>!k.gone&&k.y>-30&&k.y<H+30&&k.x>-30&&k.x<W+30);if(t>=TL)endRound(sc[0]==sc[1]?-1:sc[0]>sc[1]?0:1,`${sc[0]} – ${sc[1]} bambús`);},
    down(id,x,y,live){if(!live)return;const p=sideOf(y);if(cool[p]>0)return;cool[p]=.3;const sx=W/2,sy=p==0?H-40:40,dx=x-sx,dy=(H/2)-sy,l=Math.hypot(dx,dy)||1;sh.push({x:sx,y:sy,vx:dx/l*650,vy:dy/l*650,p,r:0});beep(500,.03);},
    draw(){halves('#5e3b1d','#5e3b1d');ctx.fillStyle='#d9c08a';ctx.fillRect(0,H/2-H*.15,W,H*.3);
      for(const s of st){ctx.fillStyle='#5aa83a';ctx.fillRect(s.x-7,H/2-s.h,14,s.h*2);ctx.fillStyle='#3d7a25';for(let y=-s.h;y<s.h;y+=22)ctx.fillRect(s.x-8,H/2+y,16,3);}
      for(const k of sh){ctx.save();ctx.translate(k.x,k.y);ctx.rotate(k.r);ctx.fillStyle=COL[k.p];for(let i=0;i<4;i++){ctx.rotate(Math.PI/2);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(4,-4);ctx.lineTo(0,-14);ctx.lineTo(-4,-4);ctx.fill();}ctx.restore();}
      for(let p=0;p<2;p++)inHalf(p,()=>{circle(W/2,H-40,16,COL[p]);TS(String(sc[p]),40,H-40,28,'#fff');TS(`⏱ ${Math.ceil(Math.max(0,TL-t))}`,W-44,H-40,20,'#fff');T('Toca donde quieras lanzar',W/2,H-10,13,'rgba(255,255,255,.7)');});}
  };
},{help:'Corta más bambús en 30 s'});

/* ---- VÓLEY CANGREJO (gravedad hacia la izquierda: los dos lo ven de lado) ---- */
def('crabvolley','Vóley cangrejo','🦀','#f2b134',()=>{
  let cr,ball,sc=[0,0],wait=1,serve=0,netH;const GR=650,PTS=5;
  function srv(){ball={x:W*.75,y:serve==0?H*.75:H*.25,vx:0,vy:0,r:16};wait=.8;}
  return{
    init(){netH=W*.32;cr=[{y:H*.75,ty:H*.75,x:24,vx:0},{y:H*.25,ty:H*.25,x:24,vx:0}];srv();},
    down(id,x,y){const p=sideOf(y);cr[p].ty=p==0?clamp(y,H/2+30,H-30):clamp(y,30,H/2-30);if(cr[p].x<=26)cr[p].vx=520;},
    move(id,x,y){const p=sideOf(y);cr[p].ty=p==0?clamp(y,H/2+30,H-30):clamp(y,30,H/2-30);},
    update(dt){for(const c of cr){c.y+=clamp(c.ty-c.y,-520*dt,520*dt);c.vx-=GR*1.3*dt;c.x+=c.vx*dt;if(c.x<24){c.x=24;c.vx=0;}}
      if(wait>0){wait-=dt;return;}const N=4,h=dt/N;
      for(let s=0;s<N;s++){ball.vx-=GR*h;ball.x+=ball.vx*h;ball.y+=ball.vy*h;if(ball.y<ball.r||ball.y>H-ball.r){ball.vy*=-1;ball.y=clamp(ball.y,ball.r,H-ball.r);}if(ball.x>W-ball.r){ball.x=W-ball.r;ball.vx=-Math.abs(ball.vx);}
        if(ball.x<netH&&Math.abs(ball.y-H/2)<ball.r+5){ball.vy=(ball.y<H/2?-1:1)*Math.abs(ball.vy)*.9;ball.y=H/2+(ball.y<H/2?-1:1)*(ball.r+5);}
        for(const c of cr){const dx=ball.x-c.x,dy=ball.y-c.y,d=Math.hypot(dx,dy);if(d<ball.r+28){const nx=dx/d,ny=dy/d;ball.x=c.x+nx*(ball.r+28);ball.y=c.y+ny*(ball.r+28);ball.vx=Math.max(420,Math.abs(ball.vx))+c.vx*.3;ball.vy=ny*360+(H/2-c.y)*.9;beep(600,.03);}}
        if(ball.x<ball.r){const side=ball.y>H/2?0:1,w=1-side;sc[w]++;serve=side;beep(w?330:660,.25,'triangle',.08);buzz(60);if(sc[w]>=PTS){wait=99;later(()=>endRound(w,`${sc[0]} – ${sc[1]}`),500);}else srv();return;}}},
    draw(){ctx.fillStyle='#8fd3ff';ctx.fillRect(0,0,W,H);ctx.fillStyle='#f3d38a';ctx.fillRect(0,0,22,H);ctx.fillStyle='#fff';ctx.fillRect(0,H/2-3,netH,6);for(let x=0;x<netH;x+=10)ctx.fillRect(x,H/2-10,2,20);
      cr.forEach((c,p)=>{ctx.save();ctx.translate(c.x,c.y);ctx.rotate(Math.PI/2);E('🦀',0,0,56);ctx.restore();ring(c.x,c.y,30,COL[p],3);});circle(ball.x,ball.y,ball.r,'#fff');ring(ball.x,ball.y,ball.r,'#f2554d',3);
      for(let p=0;p<2;p++)inHalf(p,()=>{TS(String(sc[p]),W-30,H/2+40,32,COL[p]);T('Mueve el dedo · toca para saltar',W*.6,H-14,14,'#1b3a57');});}
  };
},{help:'Que la bola no caiga en tu arena'});

/* ---- PESCA INJUSTA ---- */
def('fishing','Pesca injusta','🎣','#1d5fae',()=>{
  let fish=[],hooks,sc=[0,0],t=0,held=new Map();const TL=45,MAX=H*.42;
  const FT=[['🐟',1],['🐠',2],['🐡',3],['🦑',4],['👢',-1]];
  return{
    init(){hooks=[0,1].map(()=>({x:W/2,len:0,fish:null}));},
    down(id,x,y,live){if(!live)return;const p=sideOf(y);held.set(id,p);hooks[p].x=x;},move(id,x,y){const p=held.get(id);if(p!=null&&!hooks[p].len)hooks[p].x=x;},up(id){held.delete(id);},
    update(dt){t+=dt;if(fish.length<9&&Math.random()<dt*2){const k=pick(FT),dir=Math.random()<.5?1:-1;fish.push({e:k[0],v:k[1],x:dir>0?-30:W+30,y:H/2+rnd(-H*.3,H*.3),dir,sp:rnd(50,140)});}
      for(const f of fish)if(!f.on)f.x+=f.dir*f.sp*dt;fish=fish.filter(f=>f.on||(f.x>-40&&f.x<W+40));const on=[false,false];for(const p of held.values())on[p]=true;
      hooks.forEach((h,p)=>{h.len=clamp(h.len+(on[p]&&!h.fish?280:-340)*dt,0,MAX);const hy=p==0?H-h.len:h.len;
        if(!h.fish)for(const f of fish)if(!f.on&&Math.abs(f.x-h.x)<22&&Math.abs(f.y-hy)<18){h.fish=f;f.on=true;beep(700,.05);break;}
        if(h.fish){h.fish.x=h.x;h.fish.y=hy+(p==0?14:-14);if(h.len<=0){sc[p]=Math.max(0,sc[p]+h.fish.v);beep(h.fish.v>0?1000:150,.12,'triangle',.08);fish.splice(fish.indexOf(h.fish),1);h.fish=null;}}});
      if(t>=TL)endRound(sc[0]==sc[1]?-1:sc[0]>sc[1]?0:1,`${sc[0]} – ${sc[1]} puntos`);},
    draw(){ctx.fillStyle='#1e6bb8';ctx.fillRect(0,0,W,H);ctx.fillStyle='rgba(255,255,255,.06)';for(let y=0;y<H;y+=60)ctx.fillRect(0,y,W,30);
      for(const f of fish)E(f.e,f.x,f.y,34,f.dir<0&&!f.on?0:0);
      hooks.forEach((h,p)=>{const y0=p==0?H:0,hy=p==0?H-h.len:h.len;ctx.strokeStyle='#eee';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(h.x,y0);ctx.lineTo(h.x,hy);ctx.stroke();ctx.strokeStyle=COL[p];ctx.lineWidth=4;ctx.beginPath();ctx.arc(h.x+(p?-6:6),hy+(p?-4:4),7,p?Math.PI:0,p?Math.PI*2:Math.PI);ctx.stroke();});
      for(let p=0;p<2;p++)inHalf(p,()=>{TS(String(sc[p]),36,H-30,30,COL[p]);TS(`⏱ ${Math.ceil(Math.max(0,TL-t))}`,W-44,H-30,20,'#fff');T('Mantén para bajar el anzuelo · ¡ojo con la bota!',W/2,H-10,13,'rgba(255,255,255,.8)');});}
  };
},{help:'Pesca peces de más valor'});

/* ---- GUARDA Y LADRÓN ---- */
def('guard','Guarda y ladrón','🔦','#2c2f3a',()=>{
  const J=Joys();let round=0,guardP,g,th,bags,pts=[0,0],caughtT=0,msg='',msgT=0,ph='play';
  function setup(){guardP=round%2;g={x:W/2,y:H/2,vx:0,vy:0,r:22,m:1,a:0};th={x:W/2,y:guardP==0?H*.12:H*.88,vx:0,vy:0,r:16,m:1};bags=[...Array(5)].map(()=>({x:rnd(30,W-30),y:rnd(60,H-60)}));caughtT=0;ph='play';}
  return{
    init(){setup();},down:(i,x,y)=>J.down(i,x,y),move:(i,x,y)=>J.move(i,x,y),up:i=>J.up(i),
    update(dt){if(msgT>0){msgT-=dt;if(msgT<=0&&ph=='next'){round++;if(round>=2){endRound(pts[0]==pts[1]?-1:pts[0]>pts[1]?0:1,`Azul ${pts[0]} – Rojo ${pts[1]}`);return;}setup();}return;}
      const vg=J.vec(guardP),vt=J.vec(1-guardP);g.vx+=vg.x*500*dt;g.vy+=vg.y*500*dt;if(Math.hypot(vg.x,vg.y)>.2)g.a=Math.atan2(vg.y,vg.x);th.vx+=vt.x*900*dt;th.vy+=vt.y*900*dt;
      moveDiscs([g,th],dt,.2);bounceBox(g,0,0,W,H,.3);bounceBox(th,0,0,W,H,.3);
      for(let i=bags.length-1;i>=0;i--)if(Math.hypot(bags[i].x-th.x,bags[i].y-th.y)<28){bags.splice(i,1);beep(900,.05);}
      const dx=th.x-g.x,dy=th.y-g.y,d=Math.hypot(dx,dy),da=Math.abs(((Math.atan2(dy,dx)-g.a)+Math.PI*3)%(Math.PI*2)-Math.PI);
      if(d<H*.33&&da<.45){caughtT+=dt;if(caughtT>.35){pts[guardP]++;msg='¡Ladrón pillado!';msgT=1.5;ph='next';beep(150,.4,'sawtooth',.1);buzz(150);}}else caughtT=0;
      if(!bags.length){pts[1-guardP]++;msg='¡El ladrón se lo llevó todo!';msgT=1.5;ph='next';beep(1000,.3,'triangle',.1);}},
    draw(){ctx.fillStyle='#0b0d14';ctx.fillRect(0,0,W,H);ctx.save();ctx.beginPath();ctx.moveTo(g.x,g.y);ctx.arc(g.x,g.y,H*.33,g.a-.45,g.a+.45);ctx.closePath();ctx.fillStyle='rgba(255,240,170,.28)';ctx.fill();ctx.restore();
      for(const b of bags)E('💰',b.x,b.y,26);circle(g.x,g.y,g.r,COL[guardP]);E('👮',g.x,g.y,30);circle(th.x,th.y,th.r,COL[1-guardP]);E('🦹',th.x,th.y,24);J.draw();
      for(let p=0;p<2;p++)inHalf(p,()=>{TS(p==guardP?'GUARDA: ilumina al ladrón':'LADRÓN: coge las 5 bolsas',W/2,H-28,17,'#ffe066');TS(String(pts[p]),30,H-28,26,COL[p]);if(msgT>0)TS(msg,W/2,H*.62,26,'#fff');});}
  };
},{help:'2 rondas: cada uno es guarda una vez'});

/* ---- BATALLA DE RANAS ---- */
def('frogs','Batalla de ranas','🐸','#2e8bc0',()=>{
  let fl=[],fr,sc=[0,0],t=0;const PTS=10,MAXL=()=>H*.48;
  return{
    init(){fr=[0,1].map(p=>({ang:0,tongue:0,ext:0,st:0,ph:p*1.3}));for(let i=0;i<6;i++)fl.push({x:rnd(30,W-30),y:rnd(H*.2,H*.8),a:rnd(0,6)});},
    down(id,x,y,live){if(!live)return;const f=fr[sideOf(y)];if(f.st==0){f.st=1;beep(400,.04);}},
    update(dt){t+=dt;for(const q of fl){q.a+=rnd(-3,3)*dt;q.x+=Math.cos(q.a)*90*dt;q.y+=Math.sin(q.a)*90*dt;if(q.x<20||q.x>W-20)q.a=Math.PI-q.a;if(q.y<H*.12||q.y>H*.88)q.a=-q.a;q.x=clamp(q.x,20,W-20);q.y=clamp(q.y,H*.12,H*.88);}
      fr.forEach((f,p)=>{if(f.st==0)f.ang=Math.sin(t*1.6+f.ph)*1.05;if(f.st==1){f.ext+=dt*4;if(f.ext>=1){f.ext=1;f.st=2;}}else if(f.st==2){f.ext-=dt*3;if(f.ext<=0){f.ext=0;f.st=0;}}
        const bx=W/2,by=p==0?H-50:50,dir=p==0?-1:1,tx=bx+Math.sin(f.ang)*MAXL()*f.ext,ty=by+dir*Math.cos(f.ang)*MAXL()*f.ext;
        if(f.st==1)for(let i=fl.length-1;i>=0;i--){if(segPt(fl[i].x,fl[i].y,bx,by,tx,ty).d<18){fl.splice(i,1);sc[p]++;f.st=2;beep(900,.06,'sine',.1);fl.push({x:rnd(30,W-30),y:H/2,a:rnd(0,6)});if(sc[p]>=PTS)later(()=>endRound(p,`${sc[0]} – ${sc[1]} moscas`),300);}}});},
    draw(){ctx.fillStyle='#2f8fc5';ctx.fillRect(0,0,W,H);for(let i=0;i<8;i++)circle((i*97)%W,(i*211)%H,30,'rgba(80,180,90,.35)');for(const q of fl)E('🪰',q.x,q.y,24);
      fr.forEach((f,p)=>{const bx=W/2,by=p==0?H-50:50,dir=p==0?-1:1,L=MAXL()*f.ext,tx=bx+Math.sin(f.ang)*L,ty=by+dir*Math.cos(f.ang)*L;circle(bx,by,46,'#4caf50');
        if(f.ext>0){ctx.strokeStyle='#ff6b8a';ctx.lineWidth=7;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(tx,ty);ctx.stroke();circle(tx,ty,8,'#ff6b8a');}
        else{ctx.strokeStyle='rgba(255,255,255,.3)';ctx.setLineDash([5,7]);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx+Math.sin(f.ang)*MAXL(),by+dir*Math.cos(f.ang)*MAXL());ctx.stroke();ctx.setLineDash([]);}
        E('🐸',bx,by,56,p?Math.PI:0);ring(bx,by,32,COL[p],4);});
      for(let p=0;p<2;p++)inHalf(p,()=>{TS(String(sc[p]),36,H-30,30,COL[p]);T('Toca para sacar la lengua',W-90,H-20,14,'#fff');});}
  };
},{help:'Atrapa 10 moscas'});

/* ---- ARENA ROBOT ---- */
def('robots','Arena robot','🤖','#3d3a5c',()=>{
  const J=Joys();let rb,hp=[5,5],cool=[0,0],t=0,sp=[];
  return{
    init(){rb=[{x:W/2,y:H*.75,vx:0,vy:0,r:26,m:1},{x:W/2,y:H*.25,vx:0,vy:0,r:26,m:1}];},
    down:(i,x,y)=>J.down(i,x,y),move:(i,x,y)=>J.move(i,x,y),up:i=>J.up(i),
    update(dt){t+=dt;cool[0]-=dt;cool[1]-=dt;for(let p=0;p<2;p++){const v=J.vec(p);rb[p].vx+=v.x*900*dt;rb[p].vy+=v.y*900*dt;}moveDiscs(rb,dt,.3);for(const k of rb)bounceBox(k,0,0,W,H,.6);collideAll(rb,.9);
      for(let p=0;p<2;p++){const a=t*6*(p?-1:1),bx=rb[p].x+Math.cos(a)*44,by=rb[p].y+Math.sin(a)*44,o=rb[1-p];if(Math.hypot(bx-o.x,by-o.y)<o.r+10&&cool[1-p]<=0){hp[1-p]--;cool[1-p]=.7;const dx=o.x-rb[p].x,dy=o.y-rb[p].y,l=Math.hypot(dx,dy)||1;o.vx+=dx/l*500;o.vy+=dy/l*500;
        for(let i=0;i<8;i++)sp.push({x:bx,y:by,vx:rnd(-200,200),vy:rnd(-200,200),l:.4});beep(1500,.08,'square',.08);buzz(60);if(hp[1-p]<=0)later(()=>endRound(p,'¡Robot desmontado!'),600);}}
      for(const s of sp){s.x+=s.vx*dt;s.y+=s.vy*dt;s.l-=dt;}sp=sp.filter(s=>s.l>0);},
    draw(){ctx.fillStyle='#2b2940';ctx.fillRect(0,0,W,H);ctx.strokeStyle='rgba(255,255,255,.06)';for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
      rb.forEach((k,p)=>{const a=t*6*(p?-1:1);ctx.strokeStyle='#999';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(k.x,k.y);ctx.lineTo(k.x+Math.cos(a)*44,k.y+Math.sin(a)*44);ctx.stroke();
        ctx.save();ctx.translate(k.x+Math.cos(a)*44,k.y+Math.sin(a)*44);ctx.rotate(t*20);ctx.fillStyle='#cfd8dc';for(let i=0;i<6;i++){ctx.rotate(Math.PI/3);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(5,-12);ctx.lineTo(-5,-12);ctx.fill();}ctx.restore();
        ctx.fillStyle=cool[p]>0&&Math.floor(t*12)%2?'#fff':COL[p];rrect(k.x-k.r,k.y-k.r,k.r*2,k.r*2,10);ctx.fill();E('🤖',k.x,k.y,30,p?Math.PI:0);});
      for(const s of sp)circle(s.x,s.y,3,'#ffd166');J.draw();for(let p=0;p<2;p++)inHalf(p,()=>{for(let i=0;i<5;i++){ctx.fillStyle=i<hp[p]?COL[p]:'rgba(255,255,255,.15)';rrect(20+i*26,H-34,22,14,4);ctx.fill();}});}
  };
},{help:'Golpea con la sierra giratoria'});

/* ---- FESTIVAL EXPLOSIVO (bombas en laberinto) ---- */
def('bomber','Festival explosivo','🧨','#211c3a',()=>{
  const C=9,R=13;let g,cs,ox,oy,pl,bombs=[],fl=[],J=Joys(40),done=false;
  const free=(c,r)=>c>=0&&c<C&&r>=0&&r<R&&g[r*C+c]==0&&!bombs.some(b=>b.c==c&&b.r==r);
  function explode(b){b.gone=true;beep(80,.3,'sawtooth',.1);buzz(80);const cells=[[b.c,b.r]];for(const[dc,dr]of[[1,0],[-1,0],[0,1],[0,-1]])for(let k=1;k<=2;k++){const c=b.c+dc*k,r=b.r+dr*k;if(c<0||c>=C||r<0||r>=R)break;const v=g[r*C+c];if(v==1)break;cells.push([c,r]);if(v==2){g[r*C+c]=0;break;}}
    for(const[c,r]of cells){fl.push({c,r,t:.5});for(const o of bombs)if(!o.gone&&o.c==c&&o.r==r)o.t=Math.min(o.t,.05);}}
  return{
    init(){cs=Math.min(W/C,H*.86/R);ox=(W-cs*C)/2;oy=(H-cs*R)/2;g=[];for(let r=0;r<R;r++)for(let c=0;c<C;c++)g.push(c%2==1&&r%2==1?1:Math.random()<.55?2:0);
      pl=[{c:4,r:R-1,x:0,y:0,mv:0},{c:4,r:0,x:0,y:0,mv:0}];for(const q of pl)for(const[dc,dr]of[[0,0],[1,0],[-1,0],[0,1],[0,-1],[2,0],[-2,0]]){const c=q.c+dc,r=q.r+dr;if(c>=0&&c<C&&r>=0&&r<R&&g[r*C+c]==2)g[r*C+c]=0;}},
    down:(i,x,y)=>J.down(i,x,y),move:(i,x,y)=>J.move(i,x,y),
    up(id,x,y,i){J.up(id);if(Math.hypot(i.dx,i.dy)<12&&i.ms<300){const p=sideOf(i.sy),q=pl[p];if(bombs.filter(b=>b.p==p&&!b.gone).length<2&&!bombs.some(b=>!b.gone&&b.c==q.c&&b.r==q.r)){bombs.push({c:q.c,r:q.r,t:2,p});beep(300,.05);}}},
    update(dt){if(done)return;pl.forEach((q,p)=>{q.mv-=dt;const v=J.vec(p);if(q.mv<=0&&Math.hypot(v.x,v.y)>.45){let dc=0,dr=0;if(Math.abs(v.x)>Math.abs(v.y))dc=Math.sign(v.x);else dr=Math.sign(v.y);
        if(free(q.c+dc,q.r+dr)){q.c+=dc;q.r+=dr;q.mv=.17;}}});
      for(const b of bombs){if(b.gone)continue;b.t-=dt;if(b.t<=0)explode(b);}bombs=bombs.filter(b=>!b.gone);for(const f of fl)f.t-=dt;fl=fl.filter(f=>f.t>0);
      const dead=pl.map(q=>fl.some(f=>f.c==q.c&&f.r==q.r));if(dead[0]||dead[1]){done=true;const w=dead[0]&&dead[1]?-1:dead[0]?1:0;later(()=>endRound(w,'¡Boom!'),700);}},
    draw(){ctx.fillStyle='#16122b';ctx.fillRect(0,0,W,H);for(let i=0;i<C*R;i++){const x=ox+(i%C)*cs,y=oy+Math.floor(i/C)*cs,v=g[i];
        ctx.fillStyle=v==1?'#4a4470':v==2?'#a0632f':((i%C+Math.floor(i/C))%2?'#2c2650':'#302a57');ctx.fillRect(x,y,cs,cs);if(v==2){ctx.strokeStyle='#6d3f17';ctx.lineWidth=2;ctx.strokeRect(x+3,y+3,cs-6,cs-6);}}
      for(const b of bombs){E('💣',ox+(b.c+.5)*cs,oy+(b.r+.5)*cs,cs*(.8+Math.sin(b.t*20)*.08));}for(const f of fl){ctx.fillStyle='rgba(255,170,30,.85)';ctx.fillRect(ox+f.c*cs,oy+f.r*cs,cs,cs);E('🔥',ox+(f.c+.5)*cs,oy+(f.r+.5)*cs,cs*.8);}
      pl.forEach((q,p)=>{circle(ox+(q.c+.5)*cs,oy+(q.r+.5)*cs,cs*.4,COL[p]);E('🐉',ox+(q.c+.5)*cs,oy+(q.r+.5)*cs,cs*.6,p?Math.PI:0);});J.draw();
      for(let p=0;p<2;p++)inHalf(p,()=>T('Arrastra para moverte · toque corto = bomba',W/2,H-10,13,'rgba(255,255,255,.7)'));}
  };
},{help:'Arrastra = mover · toque = bomba'});

/* ---- BATALLA DISCO (ritmo) ---- */
def('disco','Batalla disco','🕺','#2a1d3a',()=>{
  let notes=[],t=0,sc=[0,0],combo=[0,0],fb=[[],[]];const TL=30,SP=260,AR=['◀','▼','▲','▶'];
  const lx=i=>W*(.14+i*.24),hitY=()=>H-110;
  return{
    init(){const r=seeded(ri(1,1e9));let tt=1.5;while(tt<TL-1){notes.push({t:tt,l:Math.floor(r()*4),hit:[false,false]});tt+=.35+r()*.45;}},
    down(id,x,y,live){if(!live)return;const p=sideOf(y),l=local(p,x,y);if(l.y<hitY()-60)return;const lane=clamp(Math.floor((l.x-W*.02)/(W*.24)),0,3);
      let best=null,bd=1e9;for(const n of notes){if(n.hit[p]||n.l!=lane)continue;const y2=hitY()-(n.t-t)*SP,d=Math.abs(y2-hitY());if(d<bd){bd=d;best=n;}}
      if(best&&bd<55){best.hit[p]=true;const pts=bd<22?3:1;sc[p]+=pts*(1+Math.floor(combo[p]/10));combo[p]++;fb[p].push({l:lane,txt:bd<22?'¡Perfecto!':'Bien',t:.4});beep(400+lane*120,.06,'square',.06);}
      else{combo[p]=0;fb[p].push({l:lane,txt:'Fallo',t:.4});beep(120,.05);}},
    update(dt){t+=dt;for(const a of fb){for(const f of a)f.t-=dt;}fb=fb.map(a=>a.filter(f=>f.t>0));for(const n of notes)for(let p=0;p<2;p++)if(!n.hit[p]&&!n.miss&&t-n.t>.25){combo[p]=n.hit[p]?combo[p]:0;}
      if(t>=TL)endRound(sc[0]==sc[1]?-1:sc[0]>sc[1]?0:1,`${sc[0]} – ${sc[1]} puntos`);},
    draw(){for(let p=0;p<2;p++)inHalf(p,()=>{ctx.fillStyle='#24163a';ctx.fillRect(0,H/2,W,H/2);for(let i=0;i<10;i++)circle((i*83+t*40)%W,H/2+(i*61)%(H/2),20,`hsla(${(i*40+t*90)%360},80%,60%,.15)`);
        for(let i=0;i<4;i++){ctx.fillStyle='rgba(255,255,255,.08)';ctx.fillRect(lx(i)-W*.1,H/2,W*.2,H/2);ctx.fillStyle=COL[p];rrect(lx(i)-W*.1,hitY()-28,W*.2,56,12);ctx.fill();T(AR[i],lx(i),hitY(),30,'#fff');}
        for(const n of notes){if(n.hit[p])continue;const y=hitY()-(n.t-t)*SP;if(y<H/2-20||y>H+30)continue;circle(lx(n.l),y,22,`hsl(${n.l*80+180},90%,60%)`);T(AR[n.l],lx(n.l),y,22,'#fff');}
        for(const f of fb[p])TS(f.txt,lx(f.l),hitY()-60,16,'#ffe066');TS(`${sc[p]}`,40,H/2+30,28,'#fff');if(combo[p]>2)TS(`x${combo[p]}`,W-40,H/2+30,22,'#ffe066');});ctx.fillStyle='#fff';ctx.fillRect(0,H/2-2,W,4);}
  };
},{help:'Toca la flecha cuando llegue a tu botón'});

/* ---- PICOS HELADOS (sumo sobre hielo que se derrite) ---- */
def('icepeaks','Picos helados','🐧','#a9d6ef',()=>{
  const J=Joys();let R0,R,cx,cy,d,done=false,t=0;
  return{
    init(){cx=W/2;cy=H/2;R0=Math.min(W,H)*.45;R=R0;d=[{x:cx,y:cy+R*.45,vx:0,vy:0,r:R0*.14,m:1},{x:cx,y:cy-R*.45,vx:0,vy:0,r:R0*.14,m:1}];},
    down:(i,x,y)=>J.down(i,x,y),move:(i,x,y)=>J.move(i,x,y),up:i=>J.up(i),
    update(dt){if(done)return;t+=dt;R=Math.max(R0*.35,R0-t*4);for(let p=0;p<2;p++){const v=J.vec(p);d[p].vx+=v.x*700*dt;d[p].vy+=v.y*700*dt;}moveDiscs(d,dt,.75);if(collideAll(d,1.25)){beep(200,.05,'square',.07);buzz(20);}
      const out=d.map(k=>Math.hypot(k.x-cx,k.y-cy)>R);if(out[0]||out[1]){done=true;const w=out[0]&&out[1]?-1:out[0]?1:0;beep(100,.4,'sawtooth',.08);later(()=>endRound(w,w<0?'¡Al agua los dos!':`¡Pingüino ${NAMES[1-w]} al agua!`),700);}},
    draw(){ctx.fillStyle='#2a7fb8';ctx.fillRect(0,0,W,H);ctx.strokeStyle='rgba(255,255,255,.15)';for(let y=0;y<H;y+=36){ctx.beginPath();for(let x=0;x<=W;x+=20)ctx.lineTo(x,y+Math.sin(x/25+t*2+y)*4);ctx.stroke();}
      circle(cx,cy+8,R,'#9ccbe6');circle(cx,cy,R,'#eaf6ff');ring(cx,cy,R*.7,'#cde7f7',3);
      d.forEach((k,p)=>{circle(k.x,k.y+4,k.r,'rgba(0,0,0,.2)');E('🐧',k.x,k.y,k.r*2,p?Math.PI:0);ring(k.x,k.y,k.r,COL[p],4);});J.draw();}
  };
},{help:'Empuja al otro pingüino al agua'});

/* ---- SITIO FATAL (envía soldados a por el castillo rival) ---- */
def('siege','Sitio fatal','🏰','#8b4a2b',()=>{
  const LX=[.2,.5,.8];let units=[],hp=[20,20],en=[5,5];const COST=3;
  return{
    update(dt){for(let p=0;p<2;p++)en[p]=Math.min(10,en[p]+dt*1.1);
      for(const u of units){u.cd-=dt;const foe=units.find(o=>o.p!=u.p&&o.l==u.l&&o.hp>0&&Math.abs(o.y-u.y)<30);if(foe){if(u.cd<=0){foe.hp--;u.cd=.5;beep(700,.02,'square',.04);}}else u.y+=(u.p==0?-1:1)*60*dt;
        if((u.p==0&&u.y<60)||(u.p==1&&u.y>H-60)){u.hp=0;hp[1-u.p]-=2;beep(120,.2,'sawtooth',.08);buzz(50);}}
      units=units.filter(u=>u.hp>0);if(hp[0]<=0||hp[1]<=0)endRound(hp[0]<=0&&hp[1]<=0?-1:hp[0]<=0?1:0,'¡Castillo derribado!');},
    down(id,x,y,live){if(!live)return;const p=sideOf(y);if(en[p]<COST)return;const l=local(p,x,y);const lane=l.x<W*.35?0:l.x<W*.65?1:2,ln=p==0?lane:2-lane;en[p]-=COST;units.push({p,l:ln,y:p==0?H-70:70,hp:3,cd:0});beep(400,.05);},
    draw(){ctx.fillStyle='#7c5a36';ctx.fillRect(0,0,W,H);for(const x of LX){ctx.fillStyle='#a07a4e';ctx.fillRect(W*x-26,0,52,H);}
      for(let p=0;p<2;p++)inHalf(p,()=>{ctx.fillStyle=COL[p];ctx.fillRect(0,H-50,W,50);E('🏰',W/2,H-40,46);bar(W*.06,H-70,W*.4,12,hp[p]/20,'#4ade80');bar(W*.54,H-70,W*.4,12,en[p]/10,'#ffd166');
        T('Vida',W*.06,H-82,12,'#fff','left');T(`Energía (soldado = ${COST})`,W*.54,H-82,12,'#fff','left');});
      for(const u of units){E(u.p==0?'💂':'🥷',W*LX[u.l],u.y,30,u.p?Math.PI:0);ring(W*LX[u.l],u.y,16,COL[u.p],3);}
      for(let p=0;p<2;p++)inHalf(p,()=>T('Toca un carril para enviar soldados',W/2,H/2+30,14,'#fff'));}
  };
},{help:'Toca un carril para atacar'});

/* ---- BOLOS (cada uno su pista) ---- */
def('bowling','Bolos','🎳','#f2b134',()=>{
  let pl;const FR=5;
  function rack(q){q.pins=[];const ax=W/2,ay=H*.6;for(let row=0;row<4;row++)for(let j=0;j<=row;j++)q.pins.push({x:ax+(j-row/2)*26,y:ay-row*22,vx:0,vy:0,r:9,m:.6,x0:ax+(j-row/2)*26,y0:ay-row*22,down:false});}
  function newBall(q){q.ball={x:W/2,y:H-70,vx:0,vy:0,r:15,m:3,rolling:false};}
  return{
    init(){pl=[0,1].map(()=>{const q={frame:0,roll:0,score:0,last:0,done:false,wait:0};rack(q);newBall(q);return q;});},
    up(id,x,y,i){const p=sideOf(i.sy),q=pl[p];if(q.done||q.ball.rolling||q.wait>0)return;const dy=p==0?i.dy:-i.dy,dx=p==0?i.dx:-i.dx;if(dy>-30)return;const sp=Math.min(Math.hypot(dx,dy)*4,900),l=Math.hypot(dx,dy);
      q.ball.x=W/2+clamp((p==0?i.sx:W-i.sx)-W/2,-W*.3,W*.3);q.ball.vx=dx/l*sp;q.ball.vy=dy/l*sp;q.ball.rolling=true;q.t=0;beep(150,.2,'sine',.08);},
    update(dt){for(const q of pl){if(q.done)continue;if(q.wait>0){q.wait-=dt;if(q.wait<=0){q.pins.forEach(pn=>{if(pn.down)pn.gone=true;});
          if(q.roll==2||q.pins.every(pn=>pn.gone)){q.frame++;q.roll=0;rack(q);if(q.frame>=FR)q.done=true;}newBall(q);}continue;}
        if(!q.ball.rolling)continue;q.t+=dt;const all=[q.ball,...q.pins.filter(pn=>!pn.gone)],N=4,h=dt/N;
        for(let s=0;s<N;s++){moveDiscs(all,h,.7);if(collideAll(all,.6))beep(1200,.02,'square',.04);for(const pn of q.pins)if(!pn.gone&&Math.hypot(pn.x-pn.x0,pn.y-pn.y0)>8)pn.down=true;}
        if(q.ball.y<H/2-20||q.ball.x<W*.12||q.ball.x>W*.88||q.t>4||(allStill(all)&&q.t>.5)){const n=q.pins.filter(pn=>pn.down&&!pn.gone&&!pn.counted).length;q.pins.forEach(pn=>{if(pn.down)pn.counted=true;});q.score+=n;q.last=n;q.roll++;q.wait=1;q.ball.rolling=false;q.ball.vx=q.ball.vy=0;if(n)beep(300,.2,'triangle',.08);}}
      if(pl.every(q=>q.done)){const a=pl[0].score,b=pl[1].score;endRound(a==b?-1:a>b?0:1,`Bolos: Azul ${a} – Rojo ${b}`);}},
    draw(){for(let p=0;p<2;p++)inHalf(p,()=>{const q=pl[p];ctx.fillStyle='#3d2b1f';ctx.fillRect(0,H/2,W,H/2);ctx.fillStyle='#e9c48f';ctx.fillRect(W*.12,H/2,W*.76,H/2);ctx.fillStyle='rgba(0,0,0,.06)';for(let x=W*.12;x<W*.88;x+=W*.038)ctx.fillRect(x,H/2,2,H/2);
        ctx.fillStyle='#555';ctx.fillRect(W*.06,H/2,W*.06,H/2);ctx.fillRect(W*.88,H/2,W*.06,H/2);
        for(const pn of q.pins){if(pn.gone)continue;circle(pn.x,pn.y,pn.r,pn.down?'#bbb':'#fff');ring(pn.x,pn.y,pn.r*.6,'#e53935',2);}
        circle(q.ball.x,q.ball.y,q.ball.r,COL[p]);circle(q.ball.x-4,q.ball.y-5,3,'#222');circle(q.ball.x+3,q.ball.y-6,3,'#222');
        TS(q.done?`Total: ${q.score} · espera`:`Tirada ${q.frame+1}/${FR} · bola ${q.roll+1} · ${q.score} bolos`,W/2,H-20,16,'#fff');if(q.wait>0)TS(q.last==10?'¡PLENO!':`${q.last} bolos`,W/2,H*.7,30,'#fff');});ctx.fillStyle='#fff';ctx.fillRect(0,H/2-2,W,4);}
  };
},{help:'Desliza la bola hacia los bolos'});
