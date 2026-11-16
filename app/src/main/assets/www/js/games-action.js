"use strict";
/* Juegos de acción y reflejos */

/* DEDOS RÁPIDOS: toca solo cuando aparezca el diamante */
def('fast','Dedos rápidos','💎','#5a4068',()=>{
  const ITEMS=['🍎','⭐','🎈','🍩','🔔','🧸','⚽','🍀','🔷','💍'];
  let cur=null,t=0,next=1,sc=[0,0],nonD=0,lock=0,flash=null;const PTS=5;
  function nextItem(){if(nonD>=2&&Math.random()<.35){cur='💎';nonD=0;next=1.1;}else{cur=pick(ITEMS);nonD++;next=rnd(.55,1);}t=0;}
  return{
    init(){nextItem();},
    update(dt){if(lock>0){lock-=dt;if(lock<=0)nextItem();return;}t+=dt;if(t>=next)nextItem();},
    down(id,x,y,live){if(!live||lock>0)return;const p=sideOf(y);let w;
      if(cur=='💎'){w=p;flash={p,ok:true};beep(880,.12,'sine',.1);}else{w=1-p;flash={p,ok:false};beep(150,.2,'sawtooth',.07);buzz(60);}
      sc[w]++;cur=null;lock=1;if(sc[w]>=PTS){lock=99;later(()=>endRound(w,`${sc[0]} – ${sc[1]}`),700);}},
    draw(){halves('#3b2a47','#3b2a47');ctx.fillStyle='rgba(255,255,255,.12)';ctx.fillRect(0,H/2-1,W,2);
      ctx.fillStyle='#5b3a24';rrect(W/2-W*.17,H/2+W*.14,W*.34,W*.08,8);ctx.fill();
      circle(W/2,H/2,W*.2,'rgba(160,200,255,.12)');ring(W/2,H/2,W*.2,'rgba(255,255,255,.35)',5);
      if(cur)E(cur,W/2,H/2,W*.2);
      for(let p=0;p<2;p++)inHalf(p,()=>{TS('Toca SOLO cuando salga 💎',W/2,H*.88,20,'#ffe066');TS(String(sc[p]),W/2,H*.76,52,COL[p]);
        if(flash&&flash.p==p&&lock>0&&lock<90)TS(flash.ok?'¡Bien!':'¡Fallo! Punto para el otro',W/2,H*.66,24,flash.ok?'#7CFC9A':'#ff8a80');});
    }
  };
},{help:'Toca solo con el 💎'});

/* MAZATOPOS */
def('mole','Mazatopos','🐹','#8a4b2e',()=>{
  let holes=[[],[]],sc=[0,0],t=0,spawn=0,hs,gx,gy;const TL=30;
  const geo=()=>{hs=Math.min(W*.27,H*.125);gx=W/2-hs*1.5;gy=H/2+H*.07;};
  return{
    init(){geo();for(let p=0;p<2;p++)holes[p]=Array.from({length:9},()=>({k:null,t:0,hit:0}));},resize:geo,
    update(dt){t+=dt;spawn-=dt;
      if(spawn<=0){spawn=rnd(.35,.7);const i=ri(0,8),k=Math.random()<.18?'💣':'🐹',life=rnd(.7,1.1);for(let p=0;p<2;p++)if(!holes[p][i].k)holes[p][i]={k,t:life,hit:0};}
      for(const hp of holes)for(const h of hp){if(h.k){h.t-=dt;if(h.t<=0)h.k=null;}if(h.hit>0)h.hit-=dt;}
      if(t>=TL){const w=sc[0]==sc[1]?-1:sc[0]>sc[1]?0:1;endRound(w,`${sc[0]} – ${sc[1]}`);}},
    down(id,x,y,live){if(!live)return;const p=sideOf(y),l=local(p,x,y);const c=Math.floor((l.x-gx)/hs),r=Math.floor((l.y-gy)/hs);if(c<0||c>2||r<0||r>2)return;
      const h=holes[p][r*3+c];if(!h.k)return;
      if(h.k=='🐹'){sc[p]++;beep(700,.05,'square',.06);}else{sc[p]=Math.max(0,sc[p]-2);beep(120,.25,'sawtooth',.08);buzz(80);}h.k=null;h.hit=.25;},
    draw(){halves('#6b3a22','#6b3a22');ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(0,H/2-2,W,4);const left=Math.max(0,TL-t);
      for(let p=0;p<2;p++)inHalf(p,()=>{
        for(let i=0;i<9;i++){const x=gx+(i%3+.5)*hs,y=gy+(Math.floor(i/3)+.5)*hs;ctx.fillStyle='#3a1d10';ctx.beginPath();ctx.ellipse(x,y+hs*.2,hs*.4,hs*.17,0,0,Math.PI*2);ctx.fill();
          const h=holes[p][i];if(h.k)E(h.k,x,y-hs*.02,hs*.55);if(h.hit>0)E('💥',x,y,hs*.5);}
        TS(String(sc[p]),W*.15,H*.54,38,COL[p]);TS(`⏱ ${Math.ceil(left)}`,W*.84,H*.54,26,'#fff');TS('¡Golpea topos, evita bombas!',W/2,H*.54,16,'#ffe066');});
    }
  };
},{help:'Golpea 🐹 · evita 💣'});

/* RECOGESTRELLAS */
def('stars','Recogestrellas','🚀','#2a2448',()=>{
  const J=Joys();let s,st=[],sc=[0,0];const PTS=10,R=22;
  const addStar=()=>st.push({x:rnd(30,W-30),y:rnd(H*.12,H*.88),a:rnd(0,6)});
  return{
    init(){s=[{x:W/2,y:H*.75,vx:0,vy:0,r:R,m:1,ang:-Math.PI/2},{x:W/2,y:H*.25,vx:0,vy:0,r:R,m:1,ang:Math.PI/2}];for(let i=0;i<4;i++)addStar();},
    down:(i,x,y)=>J.down(i,x,y),move:(i,x,y)=>J.move(i,x,y),up:i=>J.up(i),
    update(dt){for(let p=0;p<2;p++){const v=J.vec(p),k=s[p];k.vx+=v.x*900*dt;k.vy+=v.y*900*dt;}
      moveDiscs(s,dt,.3);for(const k of s){bounceBox(k,0,0,W,H,.6);if(Math.hypot(k.vx,k.vy)>20)k.ang=Math.atan2(k.vy,k.vx);}collideAll(s,.9);
      for(let i=st.length-1;i>=0;i--){const q=st[i];q.a+=dt*2;for(let p=0;p<2;p++)if(Math.hypot(q.x-s[p].x,q.y-s[p].y)<R+16){st.splice(i,1);sc[p]++;beep(900+sc[p]*30,.06,'sine',.1);addStar();
        if(sc[p]>=PTS)later(()=>endRound(p,`${sc[0]} – ${sc[1]}`),200);break;}}},
    draw(){ctx.fillStyle='#16132b';ctx.fillRect(0,0,W,H);for(let i=0;i<50;i++)circle((i*97)%W,(i*233)%H,1.5,'rgba(255,255,255,.35)');
      for(const q of st)E('⭐',q.x,q.y,30,Math.sin(q.a)*.3);
      s.forEach((k,p)=>{ctx.save();ctx.translate(k.x,k.y);ctx.rotate(k.ang);ctx.fillStyle=COL[p];ctx.beginPath();ctx.moveTo(R*1.3,0);ctx.lineTo(-R*.8,R*.85);ctx.lineTo(-R*.35,0);ctx.lineTo(-R*.8,-R*.85);ctx.closePath();ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=2.5;ctx.stroke();ctx.restore();});
      J.draw();scoreSide(sc);for(let p=0;p<2;p++)if(!J.j[p])TP(p,'Arrastra para pilotar · 10 estrellas',H-26,16,'rgba(255,255,255,.6)');}
  };
},{help:'Recoge 10 estrellas'});

/* TANQUES */
def('tanks','Tanques','💥','#e8a93a',()=>{
  let ch,tk,bul=[],walls,sc=[0,0],held=new Map(),cool=[0,0];const TR=17,PTS=3;
  function reset(){tk=[{x:W*.5,y:H-ch-50,a:-Math.PI/2,dead:0},{x:W*.5,y:ch+50,a:Math.PI/2,dead:0}];bul=[];}
  function hitWall(x,y,r){if(x<r||x>W-r||y<ch+r||y>H-ch-r)return true;for(const[wx,wy,ww,wh]of walls)if(x>wx-r&&x<wx+ww+r&&y>wy-r&&y<wy+wh+r)return true;return false;}
  function fire(p){if(cool[p]>0||tk[p].dead||ended)return;if(bul.filter(b=>b.p==p).length>=3)return;cool[p]=.35;const k=tk[p];
    bul.push({x:k.x+Math.cos(k.a)*TR*1.5,y:k.y+Math.sin(k.a)*TR*1.5,vx:Math.cos(k.a)*330,vy:Math.sin(k.a)*330,p,life:4});beep(300,.06,'square',.05);}
  return{
    init(){ch=Math.max(80,H*.11);const t=ch,b=H-ch,h=b-t;walls=[[W*.12,t+h*.3,W*.28,16],[W*.6,t+h*.3,W*.28,16],[W*.12,t+h*.7-16,W*.28,16],[W*.6,t+h*.7-16,W*.28,16],[W*.5-8,t+h*.42,16,h*.16]];reset();},
    down(id,x,y,live){const p=y>H-ch?0:y<ch?1:-1;if(p<0||!live)return;const l=local(p,x,y);const b=l.x<W/2?'mv':'fire';held.set(id,{p,b});if(b=='fire')fire(p);},
    up(id){held.delete(id);},
    update(dt){cool[0]-=dt;cool[1]-=dt;const mv=[false,false];for(const v of held.values())if(v.b=='mv')mv[v.p]=true;
      for(let p=0;p<2;p++){const k=tk[p];if(k.dead)continue;if(mv[p]){const nx=k.x+Math.cos(k.a)*125*dt,ny=k.y+Math.sin(k.a)*125*dt;if(!hitWall(nx,ny,TR)){k.x=nx;k.y=ny;}}else k.a+=2.6*dt;}
      for(let i=bul.length-1;i>=0;i--){const b=bul[i];b.life-=dt;
        for(let s=0;s<3;s++){const nx=b.x+b.vx*dt/3;if(hitWall(nx,b.y,4))b.vx=-b.vx;else b.x=nx;const ny=b.y+b.vy*dt/3;if(hitWall(b.x,ny,4))b.vy=-b.vy;else b.y=ny;}
        let gone=b.life<=0;
        for(let p=0;p<2&&!gone;p++){const k=tk[p];if(!k.dead&&Math.hypot(b.x-k.x,b.y-k.y)<TR+4&&(b.p!=p||b.life<3.7)){k.dead=1;gone=true;const w=1-p;sc[w]++;beep(100,.4,'sawtooth',.1);buzz(120);
          if(sc[w]>=PTS)later(()=>endRound(w,`${sc[0]} – ${sc[1]}`),900);else later(reset,1200);}}
        if(gone)bul.splice(i,1);}},
    draw(){ctx.fillStyle='#e9b949';ctx.fillRect(0,0,W,H);ctx.fillStyle='rgba(160,110,20,.25)';for(let x=0;x<W;x+=34)for(let y=0;y<H;y+=34)if(((x+y)/34)%2==0){ctx.save();ctx.translate(x+17,y+17);ctx.rotate(.78);ctx.fillRect(-6,-6,12,12);ctx.restore();}
      ctx.fillStyle='#6b4f1d';for(const[wx,wy,ww,wh]of walls){rrect(wx,wy,ww,wh,6);ctx.fill();}
      for(const b of bul)circle(b.x,b.y,5,'#222');
      tk.forEach((k,p)=>{ctx.save();ctx.translate(k.x,k.y);ctx.rotate(k.a);ctx.fillStyle=k.dead?'#777':COL[p];ctx.strokeStyle='#222';ctx.lineWidth=3;rrect(-TR,-TR*.85,TR*2,TR*1.7,6);ctx.fill();ctx.stroke();
        ctx.fillStyle='#222';ctx.fillRect(0,-4,TR*1.6,8);circle(0,0,TR*.55,k.dead?'#999':LIGHT[p]);ctx.restore();if(k.dead)E('💥',k.x,k.y,40);});
      for(let p=0;p<2;p++)inHalf(p,()=>{ctx.fillStyle=DARK[p];ctx.fillRect(0,H-ch,W,ch);btn(10,H-ch+10,W/2-20,ch-24,'MOVER',COL[p]);btn(W/2+10,H-ch+10,W/2-20,ch-24,'¡FUEGO!','#e74c3c');TS(String(sc[p]),W-24,H-ch-24,28,COL[p]);});}
  };
},{help:'Mantén MOVER · suelta para girar'});

/* COCHES DE CARRERAS (circuito tipo Scalextric) */
def('cars','Slot cars','🏎️','#3d8b3d',()=>{
  let cx,cy,Ls,Rm,cars,held=new Map(),done=false;const LAPS=4;
  const lane=p=>Rm+(p==0?20:-20);
  const per=r=>4*Ls+2*Math.PI*r;
  function pos(s,r){const P=per(r);s=((s%P)+P)%P;const S=2*Ls,C=Math.PI*r;
    if(s<S)return{x:cx+r,y:cy+Ls-s};s-=S;if(s<C){const th=-s/r;return{x:cx+r*Math.cos(th),y:cy-Ls+r*Math.sin(th)};}s-=C;
    if(s<S)return{x:cx-r,y:cy-Ls+s};s-=S;const th=Math.PI-s/r;return{x:cx+r*Math.cos(th),y:cy+Ls+r*Math.sin(th)};}
  function inCurve(s,r){const P=per(r);s=((s%P)+P)%P;const S=2*Ls,C=Math.PI*r;return(s>=S&&s<S+C)||s>=2*S+C;}
  return{
    init(){cx=W/2;cy=H/2;Rm=Math.min(W*.33,H*.2);Ls=H*.42-Rm;cars=[0,1].map(p=>({s:0,v:0,stun:0}));},
    down(id,x,y,live){held.set(id,sideOf(y));},up(id){held.delete(id);},
    update(dt){if(done)return;const on=[false,false];for(const p of held.values())on[p]=true;
      for(let p=0;p<2;p++){const c=cars[p],r=lane(p);if(c.stun>0){c.stun-=dt;continue;}
        c.v+=on[p]?380*dt:-320*dt;c.v=clamp(c.v,0,560);
        if(inCurve(c.s,r)&&c.v>Math.sqrt(1000*r)){c.stun=1.3;c.v=0;beep(110,.35,'sawtooth',.08);buzz(150);}
        c.s+=c.v*dt;if(c.s>=per(r)*LAPS){done=true;later(()=>endRound(p,'¡Primero en cruzar la meta!'),300);}}},
    draw(){ctx.fillStyle='#4caf50';ctx.fillRect(0,0,W,H);ctx.fillStyle='rgba(0,0,0,.06)';for(let y=0;y<H;y+=40)ctx.fillRect(0,y,W,20);
      ctx.lineJoin='round';const path=r=>{ctx.beginPath();ctx.moveTo(cx+r,cy+Ls);ctx.lineTo(cx+r,cy-Ls);ctx.arc(cx,cy-Ls,r,0,Math.PI,true);ctx.lineTo(cx-r,cy+Ls);ctx.arc(cx,cy+Ls,r,Math.PI,0,true);ctx.closePath();};
      path(Rm);ctx.strokeStyle='#e53935';ctx.lineWidth=96;ctx.setLineDash([18,18]);ctx.stroke();ctx.setLineDash([]);
      path(Rm);ctx.strokeStyle='#3a3f47';ctx.lineWidth=84;ctx.stroke();
      for(const p of[0,1]){path(lane(p));ctx.strokeStyle='rgba(255,255,255,.25)';ctx.lineWidth=3;ctx.setLineDash([14,12]);ctx.stroke();ctx.setLineDash([]);}
      for(let i=0;i<8;i++){ctx.fillStyle=i%2?'#fff':'#111';ctx.fillRect(cx+Rm-42+i*10.5,cy+Ls-5,10.5,10);}
      cars.forEach((c,p)=>{const r=lane(p),a=pos(c.s,r),b=pos(c.s+2,r),ang=Math.atan2(b.y-a.y,b.x-a.x);ctx.save();ctx.translate(a.x,a.y);ctx.rotate(ang);
        ctx.fillStyle='#111';ctx.fillRect(-14,-13,9,26);ctx.fillRect(6,-13,9,26);ctx.fillStyle=COL[p];rrect(-18,-9,36,18,6);ctx.fill();ctx.fillStyle='#fff';ctx.fillRect(-3,-9,4,18);ctx.restore();if(c.stun>0)E('💫',a.x,a.y-24,26);});
      for(let p=0;p<2;p++){const c=cars[p],lap=Math.min(LAPS,Math.floor(c.s/per(lane(p)))+1);inHalf(p,()=>{TS(`Vuelta ${lap}/${LAPS}`,W/2,H-60,26,COL[p]);TS('Mantén pulsado para acelerar · ¡frena en las curvas!',W/2,H-26,15,'#fff');});}}
  };
},{help:'Mantén = acelerar · cuidado en curvas'});

/* DARDOS */
def('darts','Darts','🎯','#b5543a',()=>{
  const NUM=[20,1,18,4,13,6,10,15,2,17,3,19,7,16,8,11,14,9,12,5];
  let R,cx,cy,turn=0,thrown=0,round=0,sc=[0,0],darts=[],t=0,lock=0,lastPts=null;const ROUNDS=3;
  function score(x,y){const dx=x-cx,dy=y-cy,d=Math.hypot(dx,dy)/R;if(d>1)return 0;if(d<.07)return 50;if(d<.15)return 25;let a=Math.atan2(dx,-dy)*180/Math.PI;a=(a+360+9)%360;const n=NUM[Math.floor(a/18)%20];if(d>.55&&d<.63)return n*3;if(d>.92)return n*2;return n;}
  const aim=()=>{const k=1+round*.25;return{x:cx+R*.9*Math.sin(t*1.9*k),y:cy+R*.9*Math.sin(t*1.33*k+1)};};
  return{
    init(){cx=W/2;cy=H/2;R=Math.min(W*.44,H*.24);},
    update(dt){t+=dt;if(lock>0){lock-=dt;if(lock<=0){darts=[];thrown=0;turn^=1;if(turn==0)round++;
      if(round>=ROUNDS){const w=sc[0]==sc[1]?-1:sc[0]>sc[1]?0:1;endRound(w,`${sc[0]} – ${sc[1]} puntos`);}}}},
    down(id,x,y,live){if(!live||lock>0||sideOf(y)!=turn)return;const a=aim(),lx=a.x+rnd(-5,5),ly=a.y+rnd(-5,5),pts=score(lx,ly);
      darts.push({x:lx,y:ly,p:turn});sc[turn]+=pts;lastPts=pts;thrown++;beep(pts>=40?1000:600,.06,'square',.06);if(thrown>=3)lock=1.1;},
    draw(){halves('#5a3b2a','#5a3b2a');
      circle(cx,cy,R*1.12,'#222');
      for(let i=0;i<20;i++){const a0=(i*18-9-90)*Math.PI/180,a1=a0+18*Math.PI/180,dark=i%2==0;
        const seg=(r0,r1,c)=>{ctx.beginPath();ctx.arc(cx,cy,R*r1,a0,a1);ctx.arc(cx,cy,R*r0,a1,a0,true);ctx.closePath();ctx.fillStyle=c;ctx.fill();};
        seg(.15,.92,dark?'#1b1b1b':'#f1e3c3');seg(.55,.63,dark?'#d63a2f':'#1e9e57');seg(.92,1,dark?'#d63a2f':'#1e9e57');
        const am=(a0+a1)/2;ctx.save();ctx.translate(cx+Math.cos(am)*R*1.06,cy+Math.sin(am)*R*1.06);ctx.rotate(am+Math.PI/2);T(String(NUM[i]),0,0,R*.09,'#fff');ctx.restore();}
      circle(cx,cy,R*.15,'#1e9e57');circle(cx,cy,R*.07,'#d63a2f');
      for(const d of darts){circle(d.x,d.y,6,COL[d.p]);ring(d.x,d.y,6,'#fff',2);}
      if(lock<=0){const a=aim();ring(a.x,a.y,14,COL[turn],3);ctx.strokeStyle=COL[turn];ctx.beginPath();ctx.moveTo(a.x-22,a.y);ctx.lineTo(a.x+22,a.y);ctx.moveTo(a.x,a.y-22);ctx.lineTo(a.x,a.y+22);ctx.stroke();}
      const y0=cy+R*1.12;for(let p=0;p<2;p++)inHalf(p,()=>{TS(`${sc[p]} pts`,W/2,(y0+H)/2-14,34,COL[p]);
        TS(turn==p?(lock>0?`+${lastPts}`:`¡Tu turno! Dardo ${thrown+1}/3 · toca para lanzar`):`Ronda ${Math.min(round+1,ROUNDS)}/${ROUNDS} · espera`,W/2,(y0+H)/2+22,turn==p?18:15,turn==p?'#fff':'rgba(255,255,255,.5)');});}
  };
},{cd:false});

/* CARRERA DE REFLEJOS: encuentra el objeto antes que el otro */
def('reflex','Reflex race','👀','#43305e',()=>{
  const POOL=['📘','🍾','⛄','🛋️','🎸','🍕','🚲','🌵','🎩','🍌','🐙','⚓','🔑','🎁','🧲','🦆','🧦','⏰'];
  let items,lay=[[],[]],target,sc=[0,0],lock=[0,0],wait=0,win=-1,c;const PTS=5,N=8;
  function nq(){items=shuffle(POOL.slice()).slice(0,N);target=pick(items);for(let p=0;p<2;p++)lay[p]=shuffle(items.slice());lock=[0,0];win=-1;}
  const geo=()=>{c=Math.min(W/4.5,H*.1);};
  const cp=i=>({x:W/2+(i%4-1.5)*c*1.08,y:H*.74+(Math.floor(i/4)-.5)*c*1.08});
  return{
    init(){geo();nq();},resize:geo,
    update(dt){for(let p=0;p<2;p++)if(lock[p]>0)lock[p]-=dt;if(wait>0){wait-=dt;if(wait<=0){const m=Math.max(...sc);if(m>=PTS)endRound(sc[0]>sc[1]?0:1,`${sc[0]} – ${sc[1]}`);else nq();}}},
    down(id,x,y,live){if(!live||wait>0)return;const p=sideOf(y);if(lock[p]>0)return;const l=local(p,x,y);
      for(let i=0;i<N;i++){const q=cp(i);if(Math.abs(l.x-q.x)<c/2&&Math.abs(l.y-q.y)<c/2){
        if(lay[p][i]==target){sc[p]++;win=p;wait=1;beep(900,.1,'sine',.1);}else{lock[p]=1;beep(150,.2,'sawtooth',.06);buzz(50);}return;}}},
    draw(){halves();ctx.fillStyle='rgba(255,255,255,.2)';ctx.fillRect(0,H/2-1,W,2);
      for(let p=0;p<2;p++)inHalf(p,()=>{
        TS('Busca:',W*.3,H*.56,26,'#fff');E(target,W*.55,H*.56,46);TS(String(sc[p]),W*.85,H*.56,40,COL[p]);
        for(let i=0;i<N;i++){const q=cp(i),e=lay[p][i];let bg='#f8fafc';if(wait>0&&e==target)bg='#4ade80';else if(lock[p]>0)bg='#64748b';
          ctx.fillStyle=bg;rrect(q.x-c/2,q.y-c/2,c,c,14);ctx.fill();E(e,q.x,q.y,c*.6);}
        if(lock[p]>0&&wait<=0)TS('¡Fallo! Espera...',W/2,H*.95,18,'#fca5a5');
        if(wait>0)TS(win==p?'¡Lo encontraste!':'¡Más rápido el otro!',W/2,H*.95,20,win==p?'#7CFC9A':'#fca5a5');});}
  };
},{help:'Toca el objeto que se pide'});

/* GOLPE DE MANO */
def('slap','Golpe de mano','✋','#8a5aa0',()=>{
  let att=0,ph='ready',t=0,sc=[0,0],msg='',st=0;const PTS=5,STRIKE=.26;
  function point(w,m){sc[w]++;msg=m;ph='res';t=0;beep(w==att?300:800,.15,'square',.07);buzz(60);if(sc[w]>=PTS)later(()=>endRound(w,`${sc[0]} – ${sc[1]}`),900);}
  return{
    update(dt){t+=dt;if(ph=='ready'&&t>5)point(1-att,'¡El atacante tardó demasiado!');
      else if(ph=='strike'&&t>=STRIKE){point(att,'¡Golpe!');}
      else if(ph=='res'&&t>1.2&&Math.max(...sc)<PTS){att^=1;ph='ready';t=0;}},
    down(id,x,y,live){if(!live)return;const p=sideOf(y);
      if(ph=='ready'){if(p==att&&t>.3){ph='strike';t=0;beep(500,.05,'square',.05);}else if(p!=att)point(att,'¡Te has movido antes de tiempo!');}
      else if(ph=='strike'&&p!=att)point(1-att,'¡Esquivado!');},
    draw(){halves('#5e3b72','#5e3b72');ctx.fillStyle='rgba(255,255,255,.15)';ctx.fillRect(0,H/2-1,W,2);
      const def=1-att,dy=def==0?1:-1;let dodge=ph=='res'&&msg=='¡Esquivado!';
      const dHand={x:W/2,y:H/2+dy*(dodge?H*.18:H*.03)};
      let k=ph=='strike'?t/STRIKE:ph=='res'?1:0;const aStart=H/2-dy*H*.28,aY=aStart+(H/2-aStart)*k;
      E('🫲',dHand.x,dHand.y,W*.3,def==0?0:Math.PI);E('🤚',W/2,aY,W*.3,att==0?0:Math.PI);
      if(ph=='res'&&!dodge&&msg=='¡Golpe!')E('💥',W/2,H/2,W*.25);
      for(let p=0;p<2;p++)inHalf(p,()=>{TS(String(sc[p]),W*.14,H*.62,42,COL[p]);
        const txt=ph=='res'?msg:p==att?'ATACAS: toca para golpear':'DEFIENDES: toca para apartar la mano cuando ataque';
        TS(txt,W/2,H*.9,p==att||ph=='res'?20:17,'#ffe066');});}
  };
},{help:'Atacas / defiendes por turnos'});

/* BATALLA DE PINTURA */
def('paint','Batalla de pintura','🖌️','#21b5ea',()=>{
  const J=Joys();let cols,rows,cs,grid,r,t=0;const TL=30,RR=22;
  function count(){let a=0,b=0;for(const v of grid){if(v==1)a++;else if(v==2)b++;}return[a,b];}
  return{
    init(){cols=16;cs=W/cols;rows=Math.ceil(H/cs);grid=new Uint8Array(cols*rows);r=[{x:W/2,y:H*.8,vx:0,vy:0,r:RR,m:1},{x:W/2,y:H*.2,vx:0,vy:0,r:RR,m:1}];},
    down:(i,x,y)=>J.down(i,x,y),move:(i,x,y)=>J.move(i,x,y),up:i=>J.up(i),
    update(dt){t+=dt;for(let p=0;p<2;p++){const v=J.vec(p),k=r[p];k.vx+=v.x*1100*dt;k.vy+=v.y*1100*dt;}
      moveDiscs(r,dt,.25);for(const k of r)bounceBox(k,0,0,W,H,.5);collideAll(r,.8);
      r.forEach((k,p)=>{const c0=Math.floor((k.x-RR*1.2)/cs),c1=Math.floor((k.x+RR*1.2)/cs),r0=Math.floor((k.y-RR*1.2)/cs),r1=Math.floor((k.y+RR*1.2)/cs);
        for(let c=c0;c<=c1;c++)for(let q=r0;q<=r1;q++)if(c>=0&&c<cols&&q>=0&&q<rows&&Math.hypot((c+.5)*cs-k.x,(q+.5)*cs-k.y)<RR*1.3)grid[q*cols+c]=p+1;});
      if(t>=TL){const[a,b]=count(),tot=cols*rows;const w=a==b?-1:a>b?0:1;endRound(w,`Azul ${Math.round(a/tot*100)}% – Rojo ${Math.round(b/tot*100)}%`);}},
    draw(){ctx.fillStyle='#f4f1ea';ctx.fillRect(0,0,W,H);
      for(let q=0;q<rows;q++)for(let c=0;c<cols;c++){const v=grid[q*cols+c];if(v){ctx.fillStyle=COL[v-1];ctx.fillRect(c*cs,q*cs,cs+.5,cs+.5);}}
      r.forEach((k,p)=>{ctx.fillStyle='#333';rrect(k.x-RR*1.1,k.y-8,RR*2.2,16,8);ctx.fill();ctx.fillStyle=COL[p];rrect(k.x-RR,k.y-6,RR*2,12,6);ctx.fill();circle(k.x,k.y,6,'#333');});
      J.draw();const[a,b]=count(),left=Math.max(0,TL-t);
      inHalf(0,()=>{TS(`⏱ ${Math.ceil(left)}`,40,H/2+30,24,'#333');TS(String(a),W-30,H/2+30,26,BLUE);});
      inHalf(1,()=>{TS(`⏱ ${Math.ceil(left)}`,40,H/2+30,24,'#333');TS(String(b),W-30,H/2+30,26,RED);});}
  };
},{help:'Pinta más que el otro en 30 s'});

/* LANZACUCHILLOS */
def('knife','Lanzacuchillos','🔪','#2f4157',()=>{
  let rot=0,spd=1.6,flip=3,knives=[],turn=0,fly=null,R,cx,cy,crash=null;const L=60;
  const angd=(a,b)=>{let d=Math.abs(((a-b)%(Math.PI*2)+Math.PI*3)%(Math.PI*2)-Math.PI);return d;};
  return{
    init(){cx=W/2;cy=H/2;R=Math.min(W,H)*.17;},
    update(dt){if(crash)return;rot+=spd*dt;flip-=dt;if(flip<=0){flip=rnd(1.5,3.5);spd=pick([-1,1])*rnd(1.2,3.2);}
      if(fly){const dir=fly.p==0?-1:1;fly.y+=dir*1400*dt;const reach=fly.p==0?fly.y<=cy+R+L*.5:fly.y>=cy-R-L*.5;
        if(reach){const world=fly.p==0?Math.PI/2:-Math.PI/2,a=world-rot;
          if(knives.some(k=>angd(k.a,a)<.21)){crash={p:fly.p,y:fly.y};fly=null;beep(120,.4,'sawtooth',.1);buzz(150);const w=1-crash.p;later(()=>endRound(w,`¡${NAMES[crash.p]} chocó con otro cuchillo!`),900);return;}
          knives.push({a,p:fly.p});fly=null;turn^=1;beep(420,.05,'square',.06);if(knives.length>=26)later(()=>endRound(-1,'¡Tronco lleno!'),500);}}},
    down(id,x,y,live){if(!live||fly||crash||sideOf(y)!=turn)return;fly={p:turn,y:turn==0?H-100:100};},
    draw(){ctx.fillStyle='#22303f';ctx.fillRect(0,0,W,H);
      const knifeAt=(x,y,ang,p)=>{ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.fillStyle='#dfe6ee';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(L*.6,-6);ctx.lineTo(L*.6,6);ctx.closePath();ctx.fill();ctx.fillStyle=COL[p];rrect(L*.6,-5,L*.4,10,4);ctx.fill();ctx.restore();};
      for(const k of knives){const a=k.a+rot;knifeAt(cx+Math.cos(a)*R*.85,cy+Math.sin(a)*R*.85,a,k.p);}
      ctx.save();ctx.translate(cx,cy);ctx.rotate(rot);circle(0,0,R,'#a0632f');for(let i=1;i<4;i++)ring(0,0,R*i/4,'#7a4620',3);ctx.fillStyle='#7a4620';ctx.fillRect(-2,-R,4,R*.4);ctx.restore();
      if(fly)knifeAt(cx,fly.y,fly.p==0?-Math.PI/2:Math.PI/2,fly.p);
      if(crash)E('💥',cx,crash.y,50);
      turnLabels(turn,H*.86,'¡Tu turno! Toca para lanzar','Espera...');
      for(let p=0;p<2;p++)inHalf(p,()=>{if(turn==p&&!fly)knifeAt(W/2,H-100,-Math.PI/2,p);TS(`${knives.filter(k=>k.p==p).length} 🔪`,W*.85,H*.95,20,COL[p]);});}
  };
},{cd:false});

/* ENCUENTRA LA PAREJA (estilo Dobble) */
def('findmatch','Find match','🔍','#e85b52',()=>{
  const POOL=['🍎','🐶','⭐','🚗','🎈','🍦','🐸','⚽','🌙','🔥','🎵','🍄','🐟','🌈','🍓','🦋','✏️','🔔','🧀','🐢','☂️','🍉','🚀','🎲','🐝','🍋','💡','🦄','🌻','🍪'];
  let plates=[[],[]],common,sc=[0,0],lock=[0,0],wait=0,win=-1,Rp;const PTS=5;
  function nq(){const s=shuffle(POOL.slice());common=s[0];const sets=[[common,...s.slice(1,6)],[common,...s.slice(6,11)]];
    for(let p=0;p<2;p++){const it=shuffle(sets[p]);plates[p]=it.map((e,i)=>{const ang=i==0?0:(i-1)/5*Math.PI*2+rnd(-.2,.2),d=i==0?0:Rp*.6;return{e,x:W/2+Math.cos(ang)*d,y:H*.745+Math.sin(ang)*d,s:Rp*rnd(.3,.42),rot:rnd(-.6,.6)};});}
    lock=[0,0];win=-1;}
  return{
    init(){Rp=Math.min(W*.42,H*.19);nq();},
    update(dt){for(let p=0;p<2;p++)if(lock[p]>0)lock[p]-=dt;if(wait>0){wait-=dt;if(wait<=0){if(Math.max(...sc)>=PTS)endRound(sc[0]>sc[1]?0:1,`${sc[0]} – ${sc[1]}`);else nq();}}},
    down(id,x,y,live){if(!live||wait>0)return;const p=sideOf(y);if(lock[p]>0)return;const l=local(p,x,y);
      let best=null,bd=1e9;for(const q of plates[p]){const d=Math.hypot(l.x-q.x,l.y-q.y);if(d<bd){bd=d;best=q;}}if(!best||bd>Rp*.32)return;
      if(best.e==common){sc[p]++;win=p;wait=1.2;beep(900,.12,'sine',.1);}else{lock[p]=1;beep(150,.2,'sawtooth',.06);buzz(50);}},
    draw(){halves('#1e7fb8','#c8463f');ctx.fillStyle='rgba(255,255,255,.3)';ctx.fillRect(0,H/2-2,W,4);
      for(let p=0;p<2;p++)inHalf(p,()=>{circle(W/2,H*.745+5,Rp,'rgba(0,0,0,.25)');circle(W/2,H*.745,Rp,lock[p]>0?'#cbd5e1':'#fff');ring(W/2,H*.745,Rp,'#333',4);
        for(const q of plates[p]){if(wait>0&&q.e==common)circle(q.x,q.y,q.s*.75,'#4ade80');E(q.e,q.x,q.y,q.s,q.rot);}
        TS(String(sc[p]),W*.1,H*.55,40,'#fff');TS(wait>0?(win==p?'¡Bien visto!':'¡Ganó el otro!'):lock[p]>0?'¡Fallo! Espera...':'Busca el dibujo repetido en los dos platos',W/2,H*.53,17,'#ffe066');});}
  };
},{help:'Busca el dibujo que está en los dos platos'});
