"use strict";
/* Versiones 2: juegos rehechos para parecerse al original (vídeos de Jindofrog) */

/* ---- SUMO: luchadores vistos desde arriba dentro del círculo ---- */
redef('sumo',()=>{
  const J=Joys();let R,cx,cy,d,done=false,t=0;
  function wrestler(k,p){const a=k.face;ctx.save();ctx.translate(k.x,k.y);ctx.rotate(a);const r=k.r;
    circle(0,4,r,'rgba(0,0,0,.3)');circle(r*.75,-r*.55,r*.3,INK);circle(r*.75,r*.55,r*.3,INK);circle(r*.75,-r*.55,r*.24,'#9a6a4a');circle(r*.75,r*.55,r*.24,'#9a6a4a');
    circle(0,0,r,INK);circle(0,0,r*.9,'#9a6a4a');ctx.fillStyle=COL[p];ctx.fillRect(-r*.9,-r*.18,r*1.8,r*.36);circle(r*.15,0,r*.42,INK);circle(r*.15,0,r*.34,'#7a5236');circle(-r*.12,0,r*.18,INK);ctx.restore();}
  return{
    init(){cx=W/2;cy=H/2;R=Math.min(W,H)*.44;d=[{x:cx,y:cy+R*.42,vx:0,vy:0,r:R*.2,m:1,face:-Math.PI/2},{x:cx,y:cy-R*.42,vx:0,vy:0,r:R*.2,m:1,face:Math.PI/2}];},
    down:(i,x,y)=>J.down(i,x,y),move:(i,x,y)=>J.move(i,x,y),up:i=>J.up(i),
    update(dt){if(done)return;t+=dt;for(let p=0;p<2;p++){const v=J.vec(p),k=d[p];k.vx+=v.x*1100*dt;k.vy+=v.y*1100*dt;const o=d[1-p];k.face=Math.atan2(o.y-k.y,o.x-k.x);}
      moveDiscs(d,dt,.35);if(collideAll(d,1.15)){beep(160,.06,'square',.08);buzz(25);}
      const out=d.map(k=>Math.hypot(k.x-cx,k.y-cy)>R);if(out[0]||out[1]){done=true;const w=out[0]&&out[1]?-1:out[0]?1:0;beep(100,.4,'sawtooth',.08);later(()=>endRound(w,w<0?'¡Los dos fuera!':`¡${NAMES[1-w]} salió del círculo!`),700);}},
    draw(){ctx.fillStyle='#2b2b30';ctx.fillRect(0,0,W,H);circle(cx,cy,R+16,'#3a3a40');circle(cx,cy,R,'#47474e');ring(cx,cy,R,'#6a6a72',6);ctx.fillStyle='#5a5a62';ctx.fillRect(cx-R*.3,cy-3,R*.6,6);
      d.forEach((k,p)=>wrestler(k,p));J.draw();}
  };
});

/* ---- BALONCESTO: lanza a la canasta del otro ---- */
redef('basket',()=>{
  let balls,hoop=[{x:0},{x:0}],t=0,sc=[0,0];const TL=45,BR=26;
  const hy=p=>p==0?H-56:56;   // canasta propia de cada jugador
  function spawn(p){balls[p]={x:W/2+(p?-1:1)*W*.18,y:p==0?H*.7:H*.3,vx:0,vy:0,fly:false,p};}
  return{
    score:()=>sc,
    init(){balls=[];spawn(0);spawn(1);},
    up(id,x,y,i){const p=sideOf(i.sy),b=balls[p];if(b.fly)return;if(Math.hypot(i.sx-b.x,i.sy-b.y)>BR*2.5)return;const l=Math.hypot(i.dx,i.dy);if(l<30)return;
      const sp=Math.min(l*5,1100);b.vx=i.dx/l*sp;b.vy=i.dy/l*sp;b.fly=true;beep(300,.05);},
    update(dt){t+=dt;for(let p=0;p<2;p++)hoop[p].x=W/2+Math.sin(t*(1.1+p*.25)+p*2)*W*.28;
      for(const b of balls){if(!b.fly)continue;b.x+=b.vx*dt;b.y+=b.vy*dt;const f=Math.pow(.55,dt);b.vx*=f;b.vy*=f;if(b.x<BR||b.x>W-BR){b.vx*=-1;b.x=clamp(b.x,BR,W-BR);}
        const o=1-b.p;if(Math.abs(b.y-hy(o))<26&&Math.abs(b.x-hoop[o].x)<30){sc[b.p]++;beep(900,.15,'triangle',.1);buzz(40);spawn(b.p);continue;}
        if(b.y<-40||b.y>H+40||Math.hypot(b.vx,b.vy)<40)spawn(b.p);}
      const[a,c]=balls;if(a.fly&&c.fly)collide(Object.assign(a,{r:BR,m:1}),Object.assign(c,{r:BR,m:1}),.9);
      if(t>=TL)endRound(sc[0]==sc[1]?-1:sc[0]>sc[1]?0:1,`${sc[0]} – ${sc[1]} canastas`);},
    draw(){ctx.fillStyle='#24405f';ctx.fillRect(0,0,W,H);ctx.strokeStyle='#fff';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(0,H/2);ctx.lineTo(W,H/2);ctx.stroke();circle(W/2,H/2,10,'#fff');
      for(let p=0;p<2;p++){const x=hoop[p].x,y=hy(p),dir=p==0?1:-1;ctx.fillStyle=INK;rrect(x-44,y+dir*10-24,88,48,6);ctx.fill();ctx.fillStyle='#fff';rrect(x-38,y+dir*10-18,76,36,4);ctx.fill();
        circle(x,y,30,INK);circle(x,y,24,COL[p]);circle(x,y,14,INK);}
      for(const b of balls){circle(b.x,b.y+4,BR+6,'rgba(0,0,0,.3)');circle(b.x,b.y,BR+6,COL[b.p]);circle(b.x,b.y,BR,INK);circle(b.x,b.y,BR-4,'#d9822b');ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(b.x-BR+4,b.y);ctx.lineTo(b.x+BR-4,b.y);ctx.moveTo(b.x,b.y-BR+4);ctx.lineTo(b.x,b.y+BR-4);ctx.stroke();}
      for(let p=0;p<2;p++)inHalf(p,()=>T(`⏱ ${Math.ceil(Math.max(0,TL-t))}`,W-44,H/2+28,20,'#fff'));}
  };
},{help:'Desliza tu balón hacia la canasta del otro'});

/* ---- LANZAESPADAS: derriba las dianas de las esquinas del otro ---- */
redef('swords',()=>{
  let tg,sw=[],cool=[0,0];const TR=34;
  return{
    init(){tg=[[{x:44,y:H-44,ok:true},{x:W-44,y:H-44,ok:true}],[{x:44,y:44,ok:true},{x:W-44,y:44,ok:true}]];},
    up(id,x,y,i){const p=sideOf(i.sy);if(cool[p]>0||ended)return;const l=Math.hypot(i.dx,i.dy);if(l<25)return;cool[p]=.45;sw.push({x:W/2,y:p==0?H-70:70,vx:i.dx/l*720,vy:i.dy/l*720,p});beep(400,.04);},
    update(dt){cool[0]-=dt;cool[1]-=dt;for(const s of sw){s.x+=s.vx*dt;s.y+=s.vy*dt;if(s.x<10||s.x>W-10){s.vx*=-1;s.x=clamp(s.x,10,W-10);}}
      for(const s of sw){if(s.gone)continue;const o=1-s.p;for(const t of tg[o])if(t.ok&&Math.hypot(s.x-t.x,s.y-t.y)<TR){t.ok=false;s.gone=true;beep(180,.3,'sawtooth',.1);buzz(80);
          if(tg[o].every(q=>!q.ok))later(()=>endRound(s.p,'¡Dianas destruidas!'),500);}
        for(const q of sw)if(q!==s&&!q.gone&&q.p!=s.p&&Math.hypot(q.x-s.x,q.y-s.y)<26){q.gone=s.gone=true;beep(1500,.05,'square',.06);}}
      sw=sw.filter(s=>!s.gone&&s.y>-60&&s.y<H+60);},
    score:()=>[tg[1].filter(t=>!t.ok).length,tg[0].filter(t=>!t.ok).length],
    draw(){ctx.fillStyle='#5a2c2a';ctx.fillRect(0,0,W,H);ctx.fillStyle='rgba(0,0,0,.12)';for(let i=0;i<8;i++)circle((i*131)%W,(i*277)%H,40,'rgba(0,0,0,.08)');
      for(let p=0;p<2;p++)for(const t of tg[p]){if(!t.ok){circle(t.x,t.y,TR,'rgba(0,0,0,.3)');continue;}circle(t.x,t.y,TR+6,INK);circle(t.x,t.y,TR,COL[p]);circle(t.x,t.y,TR*.6,'#fff');circle(t.x,t.y,TR*.3,COL[p]);}
      const sword=(x,y,a,p)=>{ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.fillStyle=INK;ctx.fillRect(-7,-30,14,44);ctx.fillStyle=COL[p];ctx.fillRect(-4,-27,8,34);ctx.fillStyle=INK;ctx.fillRect(-14,6,28,8);ctx.fillRect(-4,10,8,14);ctx.restore();};
      for(const s of sw)sword(s.x,s.y,Math.atan2(s.vy,s.vx)+Math.PI/2,s.p);
      for(let p=0;p<2;p++)inHalf(p,()=>{if(cool[p]<=0)sword(W/2,H-70,0,p);T('Desliza para lanzar',W/2,H-20,14,'rgba(255,255,255,.6)');});}
  };
},{help:'Desliza para lanzar espadas a las dianas del otro'});

/* ---- BATALLA DE RANAS: salta de nenúfar en nenúfar para cazar la mosca ---- */
redef('frogs',()=>{
  let pads,fr,fly,sc=[0,0],t=0,sinkT=3;const PTS=7,JR=()=>H*.36;
  function newFly(){const free=pads.filter(p=>!p.sink&&!fr.some(f=>f.pad===p));fly={pad:pick(free),t:4};}
  return{
    score:()=>sc,
    init(){pads=[];const cols=3,rows=5;for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)pads.push({bx:W*(.2+.3*c)+(r%2?W*.05:-W*.05),by:H*(.1+.2*r),ph:rnd(0,6),sink:0,warn:0,r:Math.min(W*.11,46)});
      fr=[{pad:pads[13],jump:null,fall:0},{pad:pads[1],jump:null,fall:0}];newFly();},
    padXY(p){return{x:p.bx+Math.sin(t*.7+p.ph)*8,y:p.by+Math.cos(t*.6+p.ph)*6};},
    down(id,x,y,live){if(!live)return;const me=sideOf(y),f=fr[me];if(f.jump||f.fall>0)return;const a=this.padXY(f.pad);let best=null,bd=1e9;
      for(const p of pads){if(p===f.pad||p.sink)continue;const q=this.padXY(p),d=Math.hypot(q.x-x,q.y-y);if(d<p.r*1.3&&d<bd){bd=d;best=p;}}
      if(best&&Math.hypot(this.padXY(best).x-a.x,this.padXY(best).y-a.y)<JR()){f.jump={from:f.pad,to:best,k:0};beep(500,.05);}},
    update(dt){t+=dt;sinkT-=dt;if(sinkT<=0){sinkT=rnd(2,3.5);const c=pick(pads.filter(p=>!p.sink&&!p.warn));if(c)c.warn=1.2;}
      for(const p of pads){if(p.warn>0){p.warn-=dt;if(p.warn<=0){p.sink=2.5;for(const f of fr)if(f.pad===p&&!f.jump){f.fall=1;sc[fr.indexOf(f)]=Math.max(0,sc[fr.indexOf(f)]-1);beep(150,.3,'sawtooth',.08);buzz(80);}}}else if(p.sink>0){p.sink-=dt;if(p.sink<=0)p.sink=0;}}
      fly.t-=dt;if(fly.t<=0||fly.pad.sink)newFly();
      fr.forEach((f,i)=>{if(f.fall>0){f.fall-=dt;if(f.fall<=0){f.pad=pick(pads.filter(p=>!p.sink&&p!==fly.pad&&!fr.some(o=>o.pad===p)));}return;}
        if(f.jump){f.jump.k+=dt/.35;if(f.jump.k>=1){f.pad=f.jump.to;f.jump=null;const o=fr[1-i];
            if(o.pad===f.pad&&!o.jump){o.fall=1;sc[1-i]=Math.max(0,sc[1-i]-1);beep(150,.3,'sawtooth',.08);}
            if(f.pad.sink){f.fall=1;sc[i]=Math.max(0,sc[i]-1);}
            else if(fly.pad===f.pad){sc[i]++;beep(900,.12,'triangle',.1);buzz(30);if(sc[i]>=PTS)later(()=>endRound(i,`${sc[0]} – ${sc[1]} moscas`),400);newFly();}}}});},
    draw(){ctx.fillStyle='#2e8fd6';ctx.fillRect(0,0,W,H);ctx.strokeStyle='rgba(255,255,255,.12)';ctx.lineWidth=3;for(let i=0;i<14;i++){ctx.beginPath();ctx.arc((i*97)%W,(i*181)%H,20+(t*15+i*10)%40,0,Math.PI*2);ctx.stroke();}
      for(const p of pads){if(p.sink>0)continue;const q=this.padXY(p),sh=p.warn>0?Math.sin(t*40)*3:0;ctx.save();ctx.translate(q.x+sh,q.y);circle(4,6,p.r,'rgba(0,0,0,.2)');
        ctx.fillStyle=INK;ctx.beginPath();ctx.arc(0,0,p.r,.35,Math.PI*2-.05);ctx.lineTo(0,0);ctx.fill();ctx.fillStyle=p.warn>0?'#9bbf4a':'#3fbf6f';ctx.beginPath();ctx.arc(0,0,p.r-5,.4,Math.PI*2-.1);ctx.lineTo(0,0);ctx.fill();ctx.restore();}
      if(fly){const q=this.padXY(fly.pad),fx=q.x+Math.sin(t*9)*6,fy=q.y-6+Math.cos(t*11)*4;ctx.fillStyle='rgba(255,255,255,.8)';ctx.beginPath();ctx.ellipse(fx-8,fy-6,9,5,-.5,0,7);ctx.ellipse(fx+8,fy-6,9,5,.5,0,7);ctx.fill();circle(fx,fy,6,INK);}
      fr.forEach((f,i)=>{if(f.fall>0){const q=this.padXY(f.pad);ring(q.x,q.y,30*(1.2-f.fall),'#fff',3);return;}let q;if(f.jump){const a=this.padXY(f.jump.from),b=this.padXY(f.jump.to),k=f.jump.k;q={x:a.x+(b.x-a.x)*k,y:a.y+(b.y-a.y)*k};}else q=this.padXY(f.pad);
        const s=f.jump?1+Math.sin(f.jump.k*Math.PI)*.35:1,r=20*s;circle(q.x,q.y+5,r,'rgba(0,0,0,.25)');circle(q.x,q.y,r+3,INK);circle(q.x,q.y,r,COL[i]);circle(q.x-r*.45,q.y-r*.5,r*.35,'#fff');circle(q.x+r*.45,q.y-r*.5,r*.35,'#fff');circle(q.x-r*.45,q.y-r*.5,r*.15,INK);circle(q.x+r*.45,q.y-r*.5,r*.15,INK);});}
  };
},{help:'Toca un nenúfar cercano para saltar. ¡Caza la mosca y no caigas al agua!'});

/* ---- DEDOS RÁPIDOS: coge el diamante cuando se levante la cúpula ---- */
redef('fast',()=>{
  let ph='closed',t=0,wait=rnd(1.5,3.5),open=0,sc=[0,0],hand=[0,0],stun=[0,0],fake=0,msg=['',''];const PTS=5;
  return{
    score:()=>sc,
    update(dt){t+=dt;for(let p=0;p<2;p++){stun[p]-=dt;hand[p]=Math.max(0,hand[p]-dt*3);}
      if(ph=='closed'){wait-=dt;if(fake>0)fake-=dt;else if(Math.random()<dt*.5)fake=.35;if(wait<=0){ph='open';open=rnd(.6,1.1);beep(1000,.08,'sine',.08);}}
      else if(ph=='open'){open-=dt;if(open<=0){ph='closed';wait=rnd(1.5,3.5);}}
      else if(ph=='won'){wait-=dt;if(wait<=0){ph='closed';wait=rnd(1.5,3.5);}}},
    down(id,x,y,live){if(!live)return;const p=sideOf(y);if(stun[p]>0||ph=='won')return;hand[p]=1;
      if(ph=='open'){sc[p]++;ph='won';wait=1.2;msg[p]='¡Lo tienes!';msg[1-p]='';beep(900,.15,'triangle',.1);buzz(40);if(sc[p]>=PTS)later(()=>endRound(p,`${sc[0]} – ${sc[1]}`),700);}
      else{stun[p]=1.2;msg[p]='¡Ay! El cristal';beep(220,.15,'square',.08);buzz(80);}},
    draw(){ctx.fillStyle='#14141c';ctx.fillRect(0,0,W,H);const cx=W/2,cy=H/2,R=W*.17,lift=ph=='open'?R*1.3:ph=='closed'&&fake>0?R*.15:ph=='won'?R*1.3:0;
      ctx.fillStyle=INK;rrect(cx-R*1.25,cy-R*1.25,R*2.5,R*2.5,14);ctx.fill();ctx.fillStyle='#4a2f22';rrect(cx-R*1.15,cy-R*1.15,R*2.3,R*2.3,10);ctx.fill();
      if(ph!='won'){ctx.save();ctx.translate(cx,cy);ctx.fillStyle=INK;ctx.beginPath();ctx.moveTo(0,-R*.55);ctx.lineTo(R*.5,-R*.1);ctx.lineTo(0,R*.55);ctx.lineTo(-R*.5,-R*.1);ctx.closePath();ctx.fill();
        ctx.fillStyle='#8fe3f5';ctx.beginPath();ctx.moveTo(0,-R*.45);ctx.lineTo(R*.4,-R*.1);ctx.lineTo(0,R*.45);ctx.lineTo(-R*.4,-R*.1);ctx.closePath();ctx.fill();ctx.restore();}
      ctx.save();ctx.translate(cx+lift*.9,cy-lift*.3);circle(0,0,R+6,INK);ctx.globalAlpha=.85;circle(0,0,R,'#a8424a');ctx.globalAlpha=1;circle(-R*.35,-R*.35,R*.18,'rgba(255,255,255,.5)');ctx.restore();
      for(let p=0;p<2;p++)inHalf(p,()=>{const ext=hand[p],y=H-40-ext*(H/2-40-R*1.4);ctx.fillStyle=INK;rrect(W/2-34,y,68,H,18);ctx.fill();for(let i=0;i<4;i++)rrect(W/2-34+i*17+1,y-34,15,40,8),ctx.fill();
        ctx.fillStyle=COL[p];ctx.fillRect(W/2-34,y+70,68,10);if(stun[p]>0)E('💫',W/2,y-50,30);TS(msg[p]&&(stun[p]>0||ph=='won')?msg[p]:'',W/2,H*.62,24,'#fff');});}
  };
},{help:'Cuando la cúpula se levante, ¡toca para coger el diamante!'});

/* ---- ATASCO: cruza la carretera hasta el lado del otro ---- */
redef('traffic',()=>{
  let pl,cars=[],sc=[0,0],held=new Map(),next=[0,0];const PTS=3,PR=18;
  const road=()=>({y0:H*.36,y1:H*.64}),laneY=l=>H*(l==0?.43:.57);
  return{
    score:()=>sc,
    init(){pl=[{y:H-60,dead:0,x:()=>W*.35},{y:60,dead:0,x:()=>W*.65}];},
    down(id,x,y,live){if(live)held.set(id,sideOf(y));},up(id){held.delete(id);},
    update(dt){const on=[false,false];for(const p of held.values())on[p]=true;
      for(let l=0;l<2;l++){next[l]-=dt;if(next[l]<=0){next[l]=rnd(.6,1.6);const dir=l==0?1:-1,sp=rnd(170,300),len=rnd(60,95);cars.push({l,x:dir>0?-len:W+len,dir,sp,len,c:pick(['#e8eaf0','#7b9c56','#d98d74','#3f5c9c','#c9a646'])});}}
      for(const c of cars)c.x+=c.dir*c.sp*dt;cars=cars.filter(c=>c.x>-150&&c.x<W+150);
      pl.forEach((q,p)=>{if(q.dead>0){q.dead-=dt;if(q.dead<=0)q.y=p==0?H-60:60;return;}if(on[p])q.y+=(p==0?-1:1)*170*dt;
        for(const c of cars)if(Math.abs(q.y-laneY(c.l))<PR+16&&Math.abs(q.x()-c.x)<c.len/2+PR){q.dead=.8;beep(120,.3,'sawtooth',.08);buzz(100);}
        if(p==0?q.y<40:q.y>H-40){sc[p]++;q.y=p==0?H-60:60;beep(1000,.15,'triangle',.1);if(sc[p]>=PTS)later(()=>endRound(p,'¡Has cruzado 3 veces!'),300);}});},
    draw(){ctx.fillStyle='#8a83de';ctx.fillRect(0,0,W,H);const r=road();ctx.fillStyle='#6f68c4';ctx.fillRect(0,r.y0-30,W,30);ctx.fillRect(0,r.y1,W,30);
      ctx.fillStyle=INK;ctx.fillRect(0,r.y0-6,W,r.y1-r.y0+12);ctx.fillStyle='#34343c';ctx.fillRect(0,r.y0,W,r.y1-r.y0);ctx.fillStyle='#fff';for(let x=0;x<W;x+=60)ctx.fillRect(x+10,H/2-4,34,8);
      for(const c of cars){ctx.save();ctx.translate(c.x,laneY(c.l));if(c.dir<0)ctx.rotate(Math.PI);ctx.fillStyle=INK;rrect(-c.len/2-3,-25,c.len+6,50,14);ctx.fill();ctx.fillStyle=c.c;rrect(-c.len/2,-22,c.len,44,12);ctx.fill();ctx.fillStyle='rgba(30,30,40,.7)';rrect(c.len*.08,-16,c.len*.22,32,6);ctx.fill();ctx.restore();}
      pl.forEach((q,p)=>{if(q.dead>0){E('💥',q.x(),q.y,40);return;}circle(q.x(),q.y+4,PR+3,'rgba(0,0,0,.25)');circle(q.x(),q.y,PR+4,INK);circle(q.x(),q.y,PR,COL[p]);});
      for(let p=0;p<2;p++)inHalf(p,()=>T('Mantén pulsado para avanzar',W/2,H-18,15,'#fff'));}
  };
},{help:'Mantén pulsado para cruzar la carretera sin que te atropellen'});

/* ---- BAMBÚ SHURIKEN: corta todos los bambús del otro ---- */
redef('bamboo',()=>{
  const N=7;let bam,sh=[],cool=[0,0];
  return{
    init(){bam=[0,1].map(()=>Array.from({length:N},()=>true));},
    score:()=>[bam[1].filter(b=>!b).length,bam[0].filter(b=>!b).length],
    up(id,x,y,i){const p=sideOf(i.sy);if(cool[p]>0||ended)return;const l=Math.hypot(i.dx,i.dy);if(l<25)return;cool[p]=.35;sh.push({x:i.sx,y:i.sy,vx:i.dx/l*800,vy:i.dy/l*800,p,r:0});beep(500,.03);},
    update(dt){cool[0]-=dt;cool[1]-=dt;const bw=W/N;
      for(const k of sh){k.x+=k.vx*dt;k.y+=k.vy*dt;k.r+=dt*18;if(k.x<6||k.x>W-6){k.vx*=-1;k.x=clamp(k.x,6,W-6);}
        const o=1-k.p,inRow=o==0?k.y>H-70:k.y<70;if(inRow){const c=Math.floor(k.x/bw);if(c>=0&&c<N&&bam[o][c]){bam[o][c]=false;k.gone=true;beep(900,.06,'square',.07);buzz(30);if(bam[o].every(b=>!b))later(()=>endRound(k.p,'¡Todo el bambú cortado!'),500);}}
        for(const q of sh)if(q!==k&&!q.gone&&!k.gone&&q.p!=k.p&&Math.hypot(q.x-k.x,q.y-k.y)<22){q.gone=k.gone=true;beep(1500,.04);}}
      sh=sh.filter(k=>!k.gone&&k.y>-30&&k.y<H+30);},
    draw(){ctx.fillStyle='#6b4334';ctx.fillRect(0,0,W,H);ctx.fillStyle='rgba(255,255,255,.08)';ctx.fillRect(0,H/2-2,W,4);const bw=W/N;
      for(let p=0;p<2;p++)inHalf(p,()=>{for(let c=0;c<N;c++){const x=c*bw+bw/2;if(!bam[p][c]){ctx.fillStyle='rgba(0,0,0,.25)';rrect(x-bw*.35,H-18,bw*.7,18,6);ctx.fill();continue;}
        ctx.fillStyle=INK;rrect(x-bw*.4,H-80,bw*.8,90,bw*.4);ctx.fill();ctx.fillStyle=COL[p];rrect(x-bw*.32,H-72,bw*.64,82,bw*.32);ctx.fill();ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(x-bw*.32,H-45,bw*.64,4);}
        T('Desliza para lanzar shurikens',W/2,H-100,14,'rgba(255,255,255,.55)');});
      for(const k of sh){ctx.save();ctx.translate(k.x,k.y);ctx.rotate(k.r);ctx.fillStyle=INK;for(let i=0;i<4;i++){ctx.rotate(Math.PI/2);ctx.beginPath();ctx.moveTo(-7,-3);ctx.lineTo(0,-18);ctx.lineTo(7,-3);ctx.fill();}circle(0,0,9,INK);circle(0,0,5,COL[k.p]);ctx.restore();}}
  };
},{help:'Desliza para lanzar shurikens y corta todo el bambú del otro'});

/* ---- FESTIVAL EXPLOSIVO: dispara cohetes al dragón ---- */
redef('bomber',()=>{
  let segs=[],t=0,rk=[],sc=[0,0],aim=[0,0],cool=[0,0],pops=[];const PTS=10,N=14,SR=20;
  return{
    score:()=>sc,
    init(){},
    update(dt){t+=dt;segs=[];for(let i=0;i<N;i++){const s=t*110-i*SR*1.5,x=((s%(W+N*SR*2))+W+N*SR*2)%(W+N*SR*2)-N*SR;segs.push({x,y:H/2+Math.sin((x/W)*Math.PI*3+t*1.5)*H*.08,i});}
      for(let p=0;p<2;p++){aim[p]=Math.sin(t*1.6+p*1.7)*1.0;cool[p]-=dt;}
      for(const r of rk){r.x+=r.vx*dt;r.y+=r.vy*dt;for(const s of segs)if(!r.gone&&Math.hypot(r.x-s.x,r.y-s.y)<SR+6){r.gone=true;sc[r.p]+=s.i==0?2:1;pops.push({x:r.x,y:r.y,t:.5,p:r.p});beep(s.i==0?1200:800,.1,'square',.08);buzz(25);
          if(sc[r.p]>=PTS)later(()=>endRound(r.p,`${sc[0]} – ${sc[1]}`),500);}}
      rk=rk.filter(r=>!r.gone&&r.y>-30&&r.y<H+30&&r.x>-30&&r.x<W+30);for(const q of pops)q.t-=dt;pops=pops.filter(q=>q.t>0);},
    down(id,x,y,live){if(!live)return;const p=sideOf(y);if(cool[p]>0)return;cool[p]=.4;const a=aim[p],dir=p==0?-1:1;rk.push({x:W/2,y:p==0?H-70:70,vx:Math.sin(a)*650*(p==0?1:-1),vy:Math.cos(a)*650*dir,p});beep(300,.08,'sawtooth',.06);},
    draw(){ctx.fillStyle='#1f1d2b';ctx.fillRect(0,0,W,H);for(let i=0;i<30;i++)circle((i*89)%W,(i*197)%H,2,'rgba(255,255,255,.2)');
      for(let i=segs.length-1;i>=0;i--){const s=segs[i];circle(s.x,s.y,SR+4,INK);circle(s.x,s.y,SR,i==0?'#4d9be0':'#3d7fbf');if(i>0){ctx.fillStyle='#e8eef5';for(let k=-1;k<=1;k+=2){ctx.beginPath();ctx.moveTo(s.x-6,s.y+k*SR*.6);ctx.lineTo(s.x,s.y+k*(SR+12));ctx.lineTo(s.x+6,s.y+k*SR*.6);ctx.fill();}}
        else{circle(s.x+8,s.y-6,6,'#fff');circle(s.x+9,s.y-6,3,INK);ctx.fillStyle='#e8eef5';ctx.fillRect(s.x+12,s.y+4,14,4);}}
      for(const r of rk){ctx.save();ctx.translate(r.x,r.y);ctx.rotate(Math.atan2(r.vy,r.vx));ctx.fillStyle=INK;rrect(-16,-7,32,14,6);ctx.fill();ctx.fillStyle=COL[r.p];rrect(-13,-4,26,8,4);ctx.fill();ctx.fillStyle='#ffb347';ctx.beginPath();ctx.moveTo(-16,-5);ctx.lineTo(-28,0);ctx.lineTo(-16,5);ctx.fill();ctx.restore();}
      for(const q of pops){ring(q.x,q.y,40*(1-q.t*2+.2),COL[q.p],5);E('💥',q.x,q.y,36);}
      for(let p=0;p<2;p++)inHalf(p,()=>{const x=W/2,y=H-70;ctx.save();ctx.translate(x,y);ctx.fillStyle=INK;ctx.beginPath();for(let i=0;i<6;i++){const a=i*Math.PI/3;ctx.lineTo(Math.cos(a)*38,Math.sin(a)*38);}ctx.fill();
        ctx.fillStyle='#7a4a30';ctx.beginPath();for(let i=0;i<6;i++){const a=i*Math.PI/3;ctx.lineTo(Math.cos(a)*31,Math.sin(a)*31);}ctx.fill();ctx.rotate(aim[p]);ctx.fillStyle=INK;ctx.fillRect(-9,-60,18,48);ctx.fillStyle=COL[p];ctx.fillRect(-5,-56,10,40);ctx.restore();
        T('Toca para disparar',W/2,H-14,14,'rgba(255,255,255,.6)');});}
  };
},{help:'Toca para lanzar cohetes al dragón. ¡La cabeza vale doble!'});

/* ---- MAESTRÍA DEL ARCO: arcos enfrentados y diana que se mueve ---- */
redef('bowduel',()=>{
  let tg,t=0,ar=[],aim=[null,null],sc=[0,0],pops=[];const PTS=10;
  return{
    score:()=>sc,init(){tg={x:W/2,y:H/2,r:22};},
    update(dt){t+=dt;tg={x:W/2+Math.sin(t*1.3)*W*.32,y:H/2+Math.sin(t*2.1)*H*.12,r:22};
      for(const a of ar){a.x+=a.vx*dt;a.y+=a.vy*dt;if(!a.hit&&Math.hypot(a.x-tg.x,a.y-tg.y)<tg.r+4){a.hit=true;const pts=Math.hypot(a.x-tg.x,a.y-tg.y)<9?3:1;sc[a.p]+=pts;pops.push({x:a.x,y:a.y,t:.6,s:'+'+pts,p:a.p});beep(pts>1?1100:800,.08,'triangle',.08);
          if(sc[a.p]>=PTS)later(()=>endRound(a.p,`${sc[0]} – ${sc[1]}`),400);}}
      ar=ar.filter(a=>!a.hit&&a.y>-40&&a.y<H+40&&a.x>-40&&a.x<W+40);for(const q of pops)q.t-=dt;pops=pops.filter(q=>q.t>0);},
    down(id,x,y,live){if(!live)return;const p=sideOf(y);if(!aim[p])aim[p]={id,sx:x,sy:y,x,y};},
    move(id,x,y){for(const a of aim)if(a&&a.id===id){a.x=x;a.y=y;}},
    up(id){for(let p=0;p<2;p++){const a=aim[p];if(!a||a.id!==id)continue;aim[p]=null;const dx=a.sx-a.x,dy=a.sy-a.y,l=Math.hypot(dx,dy);if(l<20)continue;const bx=W/2,by=p==0?H-80:80,sp=600+Math.min(l,150)*4;
      ar.push({x:bx,y:by,vx:dx/l*sp,vy:dy/l*sp,p});beep(600,.05,'triangle',.06);}},
    draw(){ctx.fillStyle='#5a2a24';ctx.fillRect(0,0,W,H);
      circle(tg.x,tg.y,tg.r+5,INK);circle(tg.x,tg.y,tg.r,'#fff');circle(tg.x,tg.y,tg.r*.66,'#ea7a62');circle(tg.x,tg.y,tg.r*.33,'#fff');
      for(const a of ar){ctx.save();ctx.translate(a.x,a.y);ctx.rotate(Math.atan2(a.vy,a.vx));ctx.fillStyle=INK;ctx.fillRect(-26,-2.5,28,5);ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(0,-6);ctx.lineTo(0,6);ctx.fill();ctx.fillStyle=COL[a.p];ctx.fillRect(-28,-5,8,10);ctx.restore();}
      for(const q of pops)TS(q.s,q.x,q.y-30*(1-q.t),26,COL[q.p]);
      for(let p=0;p<2;p++){const a=aim[p],bx=W/2,by=p==0?H-80:80;let ang=p==0?-Math.PI/2:Math.PI/2,pull=0;if(a){const dx=a.sx-a.x,dy=a.sy-a.y;if(Math.hypot(dx,dy)>5){ang=Math.atan2(dy,dx);pull=Math.min(Math.hypot(dx,dy),150)/150;}}
        ctx.save();ctx.translate(bx,by);ctx.rotate(ang+Math.PI/2);ctx.lineCap='round';ctx.strokeStyle=INK;ctx.lineWidth=12;ctx.beginPath();ctx.arc(0,30,52,Math.PI*1.15,Math.PI*1.85);ctx.stroke();ctx.strokeStyle=COL[p];ctx.lineWidth=7;ctx.stroke();
        ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(Math.cos(Math.PI*1.15)*52,30+Math.sin(Math.PI*1.15)*52);ctx.lineTo(0,-8+pull*40);ctx.lineTo(Math.cos(Math.PI*1.85)*52,30+Math.sin(Math.PI*1.85)*52);ctx.stroke();ctx.restore();}
      for(let p=0;p<2;p++)inHalf(p,()=>T('Arrastra hacia atrás y suelta',W/2,H-20,14,'rgba(255,255,255,.55)'));}
  };
},{cd:true,help:'Arrastra hacia atrás y suelta para disparar a la diana. El centro vale 3'});

/* ---- SAQUEADOR: tira del dinero hacia tu caja fuerte ---- */
redef('looter',()=>{
  let pos=0,sc=[0,0],wait=0,flash=[0,0],coin=null,coinT=2,boost=[0,0];const PTS=3;
  return{
    score:()=>sc,
    update(dt){flash[0]-=dt;flash[1]-=dt;boost[0]-=dt;boost[1]-=dt;if(wait>0){wait-=dt;if(wait<=0)pos=0;return;}coinT-=dt;if(coinT<=0&&!coin){coin={p:ri(0,1),x:rnd(60,W-60),t:1.5};}if(coin){coin.t-=dt;if(coin.t<=0){coin=null;coinT=rnd(2,4);}}},
    down(id,x,y,live){if(!live||wait>0)return;const p=sideOf(y);if(coin&&coin.p==p){const cy=p==0?H*.8:H*.2;if(Math.hypot(x-coin.x,y-cy)<40){boost[p]=2;coin=null;coinT=rnd(2,4);beep(1200,.1,'sine',.1);return;}}
      pos+=(p==0?1:-1)*(boost[p]>0?.07:.04);flash[p]=.08;beep(p?300:420,.03,'square',.04);
      if(Math.abs(pos)>=1){const w=pos>0?0:1;sc[w]++;wait=1.2;beep(1000,.2,'triangle',.1);buzz(60);if(sc[w]>=PTS)later(()=>endRound(w,`${sc[0]} – ${sc[1]}`),600);}},
    draw(){ctx.fillStyle='#6b4334';ctx.fillRect(0,0,W,H);const by=H/2+pos*(H/2-110);
      const safe=(y,p)=>{ctx.fillStyle=INK;rrect(W/2-58,y-46,116,92,10);ctx.fill();ctx.fillStyle=COL[p];rrect(W/2-50,y-38,100,76,8);ctx.fill();ring(W/2,y,22,INK,6);circle(W/2,y,6,INK);};
      safe(H-50,0);safe(50,1);
      for(let p=0;p<2;p++){const sy=p==0?H-96:96;ctx.strokeStyle=INK;ctx.lineWidth=16;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(W/2,sy);ctx.lineTo(W/2,by+(p==0?20:-20));ctx.stroke();ctx.strokeStyle=COL[p];ctx.lineWidth=9;ctx.stroke();
        circle(W/2,by+(p==0?24:-24),18,INK);circle(W/2,by+(p==0?24:-24),13,flash[p]>0?'#fff':COL[p]);}
      circle(W/2,by,30,INK);circle(W/2,by,25,'#e3c95b');T('$',W/2,by+1,26,'#7a5a10');
      if(coin){const cy=coin.p==0?H*.8:H*.2;circle(coin.x,cy,26,INK);circle(coin.x,cy,21,'#ffd43b');T('⚡',coin.x,cy,20,'#7a5a10');}
      for(let p=0;p<2;p++)inHalf(p,()=>T(boost[p]>0?'¡TURBO!':'¡Toca muy rápido para tirar!',W/2,H*.62,18,boost[p]>0?'#ffd43b':'rgba(255,255,255,.7)'));}
  };
},{help:'¡Toca muy rápido para llevar el dinero a tu caja fuerte! El rayo da turbo'});

/* ---- PENALTIS en tiempo real: el que chuta desliza, el portero se lanza ---- */
redef('penalty',()=>{
  let k=0,ph='aim',ball,keeper,goals=[0,0],hist=[[],[]],msg='',msgT=0,gw;
  const sh=()=>k%2,kp=()=>1-sh(),goalY=()=>kp()==0?H-40:40;
  function setup(){const s=sh();ball={x:W/2,y:s==0?H*.7:H*.3,vx:0,vy:0};keeper={x:W/2,tx:W/2,dive:0};ph='aim';}
  function finished(){const a=hist[0].length,b=hist[1].length;if(a<5||b<5)return goals[0]+(5-a)<goals[1]||goals[1]+(5-b)<goals[0];return a==b&&goals[0]!=goals[1];}
  return{
    score:()=>goals,
    init(){gw=W*.6;setup();},
    up(id,x,y,i){const p=sideOf(i.sy),l=Math.hypot(i.dx,i.dy);if(l<25)return;
      if(p==sh()&&ph=='aim'){const dirOK=sh()==0?i.dy<0:i.dy>0;if(!dirOK)return;const sp=Math.min(l*4.5,1000)+300;ball.vx=i.dx/l*sp;ball.vy=i.dy/l*sp;ph='fly';beep(300,.08,'square',.07);}
      else if(p==kp()&&(ph=='fly'||ph=='aim')&&keeper.dive==0&&Math.abs(i.dx)>Math.abs(i.dy)){keeper.tx=clamp(keeper.x+Math.sign(i.dx)*gw*.42,W/2-gw/2+30,W/2+gw/2-30);keeper.dive=1;beep(500,.05);}},
    update(dt){if(msgT>0){msgT-=dt;if(msgT<=0){k++;if(finished()){endRound(goals[0]>goals[1]?0:1,`${goals[0]} – ${goals[1]}`);return;}setup();}return;}
      keeper.x+=clamp(keeper.tx-keeper.x,-900*dt,900*dt);
      if(ph=='fly'){ball.x+=ball.vx*dt;ball.y+=ball.vy*dt;const gy=goalY();
        if(kp()==0?ball.y>=gy-30:ball.y<=gy+30){const inGoal=Math.abs(ball.x-W/2)<gw/2,saved=Math.abs(ball.x-keeper.x)<(keeper.dive?60:40);const goal=inGoal&&!saved;
          if(goal)goals[sh()]++;hist[sh()].push(goal);msg=!inGoal?'¡Fuera!':saved?'¡PARADA!':'¡GOOOL!';msgT=1.4;ph='end';beep(goal?900:200,.3,goal?'triangle':'sawtooth',.09);buzz(goal?80:150);}}},
    draw(){ctx.fillStyle='#2f7d3c';ctx.fillRect(0,0,W,H);ctx.fillStyle='#348844';for(let y=0;y<H;y+=70)ctx.fillRect(0,y,W,35);
      for(let p=0;p<2;p++){const gy=p==0?H-40:40,dir=p==0?1:-1;ctx.fillStyle='rgba(255,255,255,.25)';for(let i=0;i<10;i++)ctx.fillRect(W/2-gw/2+i*gw/10,gy,2,dir*40);ctx.strokeStyle=INK;ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(W/2-gw/2,gy+dir*40);ctx.lineTo(W/2-gw/2,gy);ctx.lineTo(W/2+gw/2,gy);ctx.lineTo(W/2+gw/2,gy+dir*40);ctx.stroke();ctx.strokeStyle='#fff';ctx.lineWidth=6;ctx.stroke();}
      const gy=goalY(),dir=kp()==0?-1:1,ky=gy+dir*26;ctx.save();ctx.translate(keeper.x,ky);if(kp()==1)ctx.rotate(Math.PI);circle(-28,0,10,INK);circle(28,0,10,INK);circle(-28,0,7,'#f2d0a4');circle(28,0,7,'#f2d0a4');circle(0,0,24,INK);circle(0,0,20,COL[kp()]);circle(0,-4,11,'#6b4a3a');ctx.restore();
      circle(ball.x,ball.y+3,13,'rgba(0,0,0,.3)');circle(ball.x,ball.y,13,INK);circle(ball.x,ball.y,10,'#fff');circle(ball.x,ball.y,4,INK);
      for(let p=0;p<2;p++)inHalf(p,()=>{hist[p].forEach((g,i)=>T(g?'●':'✕',W*.25+i*22,H/2+28,20,g?'#7CFC9A':'#ff8a80'));
        if(msgT>0)TS(msg,W/2,H*.62,40,'#ffe066');else TS(p==sh()?'Desliza el balón hacia la portería':'Desliza a un lado para lanzarte',W/2,H*.62,18,'#fff');});}
  };
},{cd:false,help:'El que chuta desliza el balón. El portero desliza a un lado para lanzarse'});

/* ---- VÓLEY CANGREJO visto desde arriba, con red en el centro ---- */
redef('crabvolley',()=>{
  let cr,ball,sc=[0,0],wait=1,serve=0,last=0;const PTS=5,GZ=900,CR=30;
  function srv(){const p=serve,c=cr[p];ball={x:c.x,y:c.y+(p==0?-12:12),z:240,vx:0,vy:0,vz:0,spin:0};last=p;wait=.9;}
  return{
    score:()=>sc,
    init(){cr=[{x:W/2,y:H*.82,tx:W/2,ty:H*.82,sx:0},{x:W/2,y:H*.18,tx:W/2,ty:H*.18,sx:0}];srv();},
    down(id,x,y){const p=sideOf(y);cr[p].tx=x;cr[p].ty=p==0?clamp(y,H/2+40,H-30):clamp(y,30,H/2-40);},
    move(id,x,y){const p=sideOf(y),c=cr[p];c.sx=x-c.tx;c.tx=x;c.ty=p==0?clamp(y,H/2+40,H-30):clamp(y,30,H/2-40);},
    update(dt){for(const c of cr){c.x+=clamp(c.tx-c.x,-600*dt,600*dt);c.y+=clamp(c.ty-c.y,-600*dt,600*dt);c.sx*=Math.pow(.01,dt);}
      if(wait>0){wait-=dt;return;}const b=ball;b.vz-=GZ*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.z+=b.vz*dt;b.vx+=b.spin*dt;
      if(b.x<14||b.x>W-14){b.vx*=-1;b.x=clamp(b.x,14,W-14);}
      cr.forEach((c,p)=>{const towardMe=p==0?(b.vy>=0||b.y>H/2):(b.vy<=0||b.y<H/2);if(b.z<70&&Math.hypot(b.x-c.x,b.y-c.y)<CR+16&&towardMe&&last!==p+10){
          const dir=p==0?-1:1,tx=rnd(W*.15,W*.85),ty=p==0?rnd(H*.12,H*.4):rnd(H*.6,H*.88),T2=1.1;b.vx=(tx-b.x)/T2;b.vy=(ty-b.y)/T2;b.vz=GZ*T2/2;b.z=Math.max(b.z,10);b.spin=clamp(c.sx*8,-500,500);last=p+10;beep(600,.04,'square',.06);}});
      if(b.z<=0){const side=b.y>H/2?0:1,w=1-side;sc[w]++;serve=side;beep(w?330:660,.25,'triangle',.08);buzz(60);if(sc[w]>=PTS){wait=99;later(()=>endRound(w,`${sc[0]} – ${sc[1]}`),500);}else srv();}},
    draw(){ctx.fillStyle='#4f4a24';ctx.fillRect(0,0,W,H);ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=4;ctx.strokeRect(16,16,W-32,H-32);
      ctx.strokeStyle=INK;ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(0,H/2);ctx.lineTo(W,H/2);ctx.stroke();ctx.strokeStyle='#e9e4d0';ctx.lineWidth=4;ctx.stroke();circle(8,H/2,10,INK);circle(W-8,H/2,10,INK);
      const b=ball;circle(b.x,b.y,16,'rgba(0,0,0,.3)');
      cr.forEach((c,p)=>{ctx.save();ctx.translate(c.x,c.y);if(p)ctx.rotate(Math.PI);for(const s of[-1,1]){ctx.strokeStyle=INK;ctx.lineWidth=5;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(s*CR*.6,4+i*7);ctx.lineTo(s*CR*1.3,10+i*9);ctx.stroke();}
          circle(s*CR*.9,-CR*.9,11,INK);circle(s*CR*.9,-CR*.9,8,COL[p]);}circle(0,0,CR,INK);circle(0,0,CR-4,COL[p]);circle(-9,-CR+4,6,'#fff');circle(9,-CR+4,6,'#fff');circle(-9,-CR+4,3,INK);circle(9,-CR+4,3,INK);ctx.restore();});
      const s=1+b.z/220;circle(b.x,b.y-b.z*.25,15*s+3,INK);circle(b.x,b.y-b.z*.25,15*s,'#3f8fd2');circle(b.x-4*s,b.y-b.z*.25-5*s,4*s,'rgba(255,255,255,.6)');}
  };
},{help:'Mueve tu cangrejo bajo la pelota. Desliza al golpear para darle efecto'});


/* ---- PIMPÓN realista: palas con mango, bote en la mesa, red y efecto ---- */
redef('pong',()=>{
  let x0,x1,y0,y1,ball,pad,sc=[0,0],server=0,h=-1,bounces=0,state='serve',msg='',msgT=0,points=0;
  const G=1500,NETZ=16,PR=34,PTS=7;
  const onTable=(x,y)=>x>=x0&&x<=x1&&y>=y0&&y<=y1;
  function newServe(){const p=server;ball={x:pad[p].x,y:p==0?y1+20:y0-20,z:45,vx:0,vy:0,vz:0,spin:0};state='serve';h=-1;bounces=0;}
  function point(w,m){if(state=='point')return;sc[w]++;points++;msg=m;msgT=1.2;state='point';beep(w?330:660,.2,'triangle',.08);buzz(50);
    if(points%2==0)server^=1;if(sc[w]>=PTS&&sc[w]-sc[1-w]>=2){later(()=>endRound(w,`${sc[0]} – ${sc[1]}`),900);}}
  function hit(p){const q=pad[p],b=ball,dir=p==0?-1:1,sp=clamp(620+Math.abs(q.vy)*.35,600,1250);
    const ly=H/2+dir*(H/2-y0)*rnd(.35,.75),t=Math.abs(ly-b.y)/sp;b.vy=dir*sp;
    b.vx=clamp((b.x-q.x)*5+q.vx*.25,-420,420);b.spin=clamp(q.vx*.9,-700,700);b.vz=G*t/2-b.z/t;h=p;bounces=0;state='rally';beep(520+Math.random()*80,.04,'square',.07);buzz(15);}
  return{
    score:()=>sc,_s:()=>({ball,state,h,bounces,sc,pad}),
    init(){x0=W*.12;x1=W*.88;y0=H*.13;y1=H*.87;pad=[{x:W/2,y:H-60,tx:W/2,ty:H-60,vx:0,vy:0,id:null},{x:W/2,y:60,tx:W/2,ty:60,vx:0,vy:0,id:null}];newServe();},
    down(id,x,y){const p=sideOf(y),q=pad[p];q.id=id;this.move(id,x,y);},
    move(id,x,y){for(let p=0;p<2;p++){const q=pad[p];if(q.id!==id)continue;q.tx=clamp(x,20,W-20);q.ty=p==0?clamp(y-36,H/2+40,H-30):clamp(y+36,30,H/2-40);}},
    up(id){for(const q of pad)if(q.id===id)q.id=null;},
    update(dt){for(const q of pad){const nx=q.x+(q.tx-q.x)*Math.min(1,dt*25),ny=q.y+(q.ty-q.y)*Math.min(1,dt*25);q.vx=q.vx*.6+((nx-q.x)/dt)*.4;q.vy=q.vy*.6+((ny-q.y)/dt)*.4;q.x=nx;q.y=ny;}
      if(state=='point'){msgT-=dt;if(msgT<=0&&!ended)newServe();return;}
      const b=ball;
      if(state=='serve'){const q=pad[server];b.x+=(q.x-b.x)*Math.min(1,dt*6);b.z=45+Math.sin(performance.now()/200)*8;
        const dir=server==0?-1:1;if(Math.hypot(b.x-q.x,b.y-q.y)<PR+10&&q.vy*dir>120)hit(server);
        return;}
      const N=3,st=dt/N;
      for(let s=0;s<N;s++){const py=b.y;b.vx+=b.spin*st;b.spin*=Math.pow(.3,st);b.x+=b.vx*st;b.y+=b.vy*st;b.vz-=G*st;b.z+=b.vz*st;
        if((py-H/2)*(b.y-H/2)<0&&b.z<NETZ){b.vy*=-.25;b.vx*=.3;b.y=H/2+(py>H/2?1:-1)*4;beep(160,.06,'sine',.06);}
        if(b.z<=0){b.z=0;if(onTable(b.x,b.y)){const side=b.y>H/2?0:1;b.vz=Math.abs(b.vz)*.82;beep(900,.03,'sine',.06);
            if(side==h){point(1-h,'¡Ha botado en tu lado!');return;}bounces++;if(bounces>=2){point(h,'¡Dos botes!');return;}}
          else{if(bounces>=1)point(h,'¡Punto!');else point(1-h,'¡Fuera!');return;}}
        for(let p=0;p<2;p++){const q=pad[p],toward=p==0?b.vy>0:b.vy<0;if(p!==h&&toward&&bounces>=1&&b.z<110&&Math.hypot(b.x-q.x,b.y-q.y)<PR+12){hit(p);break;}}}},
    draw(){ctx.fillStyle='#3d3b24';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='rgba(0,0,0,.25)';rrect(x0+8,y0+10,x1-x0,y1-y0,6);ctx.fill();ctx.fillStyle=INK;rrect(x0-6,y0-6,x1-x0+12,y1-y0+12,8);ctx.fill();
      ctx.fillStyle='#2f6f9a';ctx.fillRect(x0,y0,x1-x0,y1-y0);ctx.strokeStyle='#fff';ctx.lineWidth=5;ctx.strokeRect(x0+3,y0+3,x1-x0-6,y1-y0-6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(W/2,y0);ctx.lineTo(W/2,y1);ctx.stroke();
      ctx.fillStyle=INK;ctx.fillRect(x0-18,H/2-5,x1-x0+36,10);ctx.fillStyle='#e9e4d0';ctx.fillRect(x0-14,H/2-2,x1-x0+28,4);circle(x0-16,H/2,7,INK);circle(x1+16,H/2,7,INK);
      const b=ball,r=8*(1+b.z/200);ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(b.x+b.z*.3,b.y+b.z*.15,8,6,0,0,7);ctx.fill();
      const paddle=(q,p)=>{const dir=p==0?1:-1,tilt=clamp(q.vx/1500,-.5,.5);ctx.save();ctx.translate(q.x,q.y);ctx.rotate(tilt+(p?Math.PI:0));
        ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(6,10,PR,PR*1.05,0,0,7);ctx.fill();
        ctx.fillStyle=INK;rrect(-10,PR*.7,20,PR*1.25,7);ctx.fill();ctx.fillStyle='#c9925a';rrect(-6,PR*.75,12,PR*1.15,5);ctx.fill();ctx.fillStyle='#a8743f';ctx.fillRect(-6,PR*1.15,12,4);ctx.fillRect(-6,PR*1.4,12,4);
        ctx.fillStyle=INK;ctx.beginPath();ctx.ellipse(0,0,PR+4,PR*1.05+4,0,0,7);ctx.fill();ctx.fillStyle='#e8d2b0';ctx.beginPath();ctx.ellipse(0,0,PR+1,PR*1.05+1,0,0,7);ctx.fill();
        ctx.fillStyle=COL[p];ctx.beginPath();ctx.ellipse(0,0,PR-2,PR*1.05-2,0,0,7);ctx.fill();ctx.fillStyle='rgba(255,255,255,.12)';for(let i=-3;i<=3;i++)for(let k=-3;k<=3;k++)if(i*i+k*k<10)circle(i*8,k*8,1.6,'rgba(0,0,0,.18)');ctx.restore();};
      paddle(pad[1],1);if(b.z<60)paddle(pad[0],0);
      circle(b.x,b.y,r+2.5,INK);circle(b.x,b.y,r,'#fff');circle(b.x-r*.3,b.y-r*.3,r*.3,'#e8e8e8');
      if(b.z>=60)paddle(pad[0],0);
      for(let p=0;p<2;p++)inHalf(p,()=>{if(state=='point'&&msgT>0)TS(msg,W/2,H*.7,30,'#ffe066');else if(state=='serve'&&server==p)TS('¡Sacas tú! Mueve la pala hacia la pelota',W/2,H*.7,17,'#fff');});}
  };
},{help:'Mueve la pala con el dedo. La pelota tiene que botar una vez en cada lado. Desliza de lado para dar efecto',cd:true});
