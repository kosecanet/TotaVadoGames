"use strict";
/* Bloque 3: Cannon duel, Maestría del arco, Solitario, Backgammon, Saqueador, Pinball, Coches de carreras, Sudoku, Emparejar números, Atasco, Puzle deslizante, Guerra de peonzas */

/* ---- Duelo de proyectiles con la gravedad hacia la izquierda (los dos lo ven igual de lado) ---- */
function shotDuel(o){return()=>{
  let hgt,pl,turn=0,aim=null,shot=null,boom=null,wind=0,msgT=0;const GR=700;
  const ground=y=>hgt[clamp(Math.round(y),0,hgt.length-1)];
  function settle(){for(const q of pl)q.x=ground(q.y)+(o.tower?0:4);}
  return{
    init(){hgt=new Float32Array(Math.ceil(H)+1);const ph=rnd(0,6);for(let y=0;y<=H;y++){hgt[y]=o.tower?W*.16:W*.22+W*.1*Math.sin(y/H*Math.PI)+W*.04*Math.sin(y/H*Math.PI*4+ph);}
      if(o.tower)for(const ty of[H*.85,H*.15])for(let y=Math.round(ty-28);y<=ty+28;y++)hgt[y]=W*.16+W*.22;
      if(o.tower)for(let y=Math.round(H*.42);y<=H*.58;y++)hgt[y]=W*.16+W*.12*Math.sin((y-H*.42)/(H*.16)*Math.PI);
      pl=[{y:H*.85,hp:3},{y:H*.15,hp:3}];settle();wind=rnd(-60,60);},
    down(id,x,y){if(shot||aim||sideOf(y)!=turn)return;aim={id,sx:x,sy:y,x,y};},
    move(id,x,y){if(aim&&aim.id===id){aim.x=x;aim.y=y;}},
    up(id){if(!aim||aim.id!==id)return;const dx=aim.sx-aim.x,dy=aim.sy-aim.y,l=Math.hypot(dx,dy);aim=null;if(l<15)return;const pw=Math.min(l,160)/160*o.pow,q=pl[turn];
      shot={x:q.x+20,y:q.y,vx:dx/l*pw,vy:dy/l*pw,t:0};beep(o.tower?700:150,.15,o.tower?'triangle':'sawtooth',.09);},
    update(dt){if(msgT>0)msgT-=dt;if(boom)boom.t-=dt;if(!shot)return;const N=4,h=dt/N;
      for(let s=0;s<N;s++){shot.vx-=GR*h;shot.vy+=wind*h;shot.x+=shot.vx*h;shot.y+=shot.vy*h;shot.t+=h;
        let hitP=-1;pl.forEach((q,p)=>{if(Math.hypot(shot.x-(q.x+18),shot.y-q.y)<(o.tower?22:26)&&shot.t>.15)hitP=p;});
        const inGround=shot.x<ground(shot.y);
        if(hitP>=0||inGround||shot.y<-50||shot.y>H+50||shot.x>W*3){
          if(hitP<0&&inGround&&!o.tower){for(const q of pl)if(Math.hypot(shot.x-q.x,shot.y-q.y)<42)hitP=pl.indexOf(q);const R=34;for(let y=Math.round(shot.y-R);y<=shot.y+R;y++){if(y<0||y>H)continue;const d=Math.sqrt(R*R-(y-shot.y)**2);hgt[y]=Math.max(0,Math.min(hgt[y],shot.x-d));}settle();}
          if(hitP>=0){pl[hitP].hp--;beep(100,.4,'sawtooth',.1);buzz(150);msgT=1.2;if(pl[hitP].hp<=0){const w=1-hitP;later(()=>endRound(w,o.win),800);}}
          boom={x:shot.x,y:shot.y,t:.5};shot=null;turn^=1;wind=rnd(-60,60);return;}}},
    draw(){ctx.fillStyle=o.sky;ctx.fillRect(0,0,W,H);ctx.beginPath();ctx.moveTo(0,0);for(let y=0;y<=H;y+=3)ctx.lineTo(hgt[y],y);ctx.lineTo(0,H);ctx.closePath();ctx.fillStyle=o.dirt;ctx.fill();
      ctx.beginPath();for(let y=0;y<=H;y+=3)ctx.lineTo(hgt[y],y);ctx.strokeStyle=o.grass;ctx.lineWidth=8;ctx.stroke();
      pl.forEach((q,p)=>{if(o.tower){ctx.save();ctx.translate(q.x+16,q.y);ctx.rotate(Math.PI/2);E('🏹',0,0,34);ctx.restore();circle(q.x+34,q.y,10,COL[p]);}
        else{ctx.fillStyle=COL[p];rrect(q.x-2,q.y-18,26,36,8);ctx.fill();ctx.strokeStyle='#333';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(q.x+20,q.y);ctx.lineTo(q.x+44,q.y+(p?14:-14));ctx.stroke();}
        inHalf(p,()=>hearts(q.hp,W-80,H-26,20));});
      if(shot)circle(shot.x,shot.y,o.tower?4:7,'#222');if(boom&&boom.t>0)E('💥',boom.x,boom.y,50);
      if(aim){const q=pl[turn],dx=aim.sx-aim.x,dy=aim.sy-aim.y,l=Math.hypot(dx,dy)||1,pw=Math.min(l,160);ctx.strokeStyle=COL[turn];ctx.lineWidth=4;ctx.setLineDash([6,6]);ctx.beginPath();ctx.moveTo(q.x+20,q.y);ctx.lineTo(q.x+20+dx/l*pw,q.y+dy/l*pw);ctx.stroke();ctx.setLineDash([]);}
      for(let p=0;p<2;p++)inHalf(p,()=>{TS(turn==p&&!shot?'¡Tu turno! Arrastra hacia atrás y suelta':'Espera...',W/2,H-60,turn==p?17:14,turn==p?'#fff':'rgba(255,255,255,.6)');T(`Viento ${Math.abs(Math.round(wind/10))}`,W/2,H-34,14,'#fff');});}
  };};}
def('cannon','Cannon duel','💣','#b8735a',shotDuel({pow:900,sky:'#2c4a6b',dirt:'#c9876a',grass:'#8d5a45',tower:false,win:'¡Cañón destruido!'}),{cd:false});
def('bowduel','Maestría del arco','🏹','#8b4a2b',shotDuel({pow:1000,sky:'#7a4428',dirt:'#5a2f17',grass:'#3b1d0d',tower:true,win:'¡Diana!'}),{cd:false});

/* ---- SOLITARIO (1 jugador, toca para mover) ---- */
def('solitaire','Solitario','🃏','#2e7d32',()=>{
  const SU=['♠','♥','♦','♣'],RK=['','A','2','3','4','5','6','7','8','9','10','J','Q','K'];let stock,waste,found,tab,cw,chh,moves=0;
  const red=c=>c.s==1||c.s==2;
  const canTab=(c,col)=>{const t=col[col.length-1];return t?t.up&&red(t)!=red(c)&&t.r==c.r+1:c.r==13;};
  const canFound=(c,i)=>{const f=found[i],t=f[f.length-1];return t?t.s==c.s&&c.r==t.r+1:c.r==1;};
  function flip(){for(const col of tab){const t=col[col.length-1];if(t&&!t.up)t.up=true;}}
  function check(){if(found.every(f=>f.length==13))endSolo(true,`¡Ganado en ${moves} movimientos!`);}
  function tryMove(cards,from){const c=cards[0];if(cards.length==1)for(let i=0;i<4;i++)if(canFound(c,i)){found[i].push(c);from.splice(from.length-1,1);return true;}
    const cols=tab.filter(col=>col!==from&&canTab(c,col)).sort((a,b)=>b.length-a.length);if(cols.length){from.splice(from.length-cards.length,cards.length);cols[0].push(...cards);return true;}return false;}
  const colX=i=>4+i*cw,topY=()=>70,tabY=()=>70+chh+16;
  return{
    init(){cw=(W-8)/7;chh=cw*1.4;const d=[];for(let s=0;s<4;s++)for(let r=1;r<=13;r++)d.push({s,r,up:false});shuffle(d);tab=[];for(let i=0;i<7;i++){tab.push(d.splice(0,i+1));tab[i][i].up=true;}stock=d;waste=[];found=[[],[],[],[]];},
    down(id,x,y){
      if(y>=topY()&&y<=topY()+chh){const i=Math.floor((x-4)/cw);if(i==0){if(stock.length){const c=stock.pop();c.up=true;waste.push(c);}else{stock=waste.reverse().map(c=>({...c,up:false}));waste=[];}beep(500,.03);return;}
        if(i==1&&waste.length){if(tryMove([waste[waste.length-1]],waste)){moves++;beep(700,.04);flip();check();}return;}
        if(i>=3){const f=found[i-3];if(f.length&&tryMove([f[f.length-1]],f)){moves++;beep(700,.04);}}return;}
      const i=Math.floor((x-4)/cw);if(i<0||i>6)return;const col=tab[i];let k=-1;for(let j=col.length-1;j>=0;j--){if(y>=this.cy(i,j)){k=j;break;}}
      if(k<0||!col[k].up)return;if(tryMove(col.slice(k),col)){moves++;beep(700,.04);flip();check();}else beep(200,.05);},
    cy(i,j){let y=tabY();for(let k=0;k<j;k++)y+=tab[i][k].up?Math.min(26,chh*.3):10;return y;},
    draw(){ctx.fillStyle='#1f6e2a';ctx.fillRect(0,0,W,H);T(`Movimientos: ${moves}`,12,32,18,'#fff','left');T('Toca una carta para moverla',W-12,32,14,'rgba(255,255,255,.7)','right');
      const card=(c,x,y)=>{if(!c.up){ctx.fillStyle='#1d4f9a';rrect(x+2,y,cw-4,chh,6);ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();return;}
        ctx.fillStyle='#fff';rrect(x+2,y,cw-4,chh,6);ctx.fill();ctx.strokeStyle='#999';ctx.lineWidth=1;ctx.stroke();const col=red(c)?'#d32f2f':'#111';
        ctx.font=`${cw*.3}px ${FONT}`;ctx.fillStyle=col;ctx.textAlign='left';ctx.textBaseline='top';ctx.fillText(RK[c.r]+SU[c.s],x+5,y+3);ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`${cw*.5}px serif`;ctx.fillText(SU[c.s],x+cw/2,y+chh*.62);};
      const slot=(x,y,t)=>{ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=2;rrect(x+2,y,cw-4,chh,6);ctx.stroke();if(t)T(t,x+cw/2,y+chh/2,cw*.35,'rgba(255,255,255,.35)');};
      slot(colX(0),topY(),'↻');if(stock.length)card({up:false},colX(0),topY());slot(colX(1),topY());if(waste.length)card(waste[waste.length-1],colX(1),topY());
      for(let i=0;i<4;i++){slot(colX(3+i),topY(),SU[i]);const f=found[i];if(f.length)card(f[f.length-1],colX(3+i),topY());}
      tab.forEach((col,i)=>{if(!col.length)slot(colX(i),tabY());col.forEach((c,j)=>card(c,colX(i),this.cy(i,j)));});}
  };
},{cd:false,solo:true});

/* ---- BACKGAMMON ---- */
def('backgammon','Backgammon','🎲','#d9a066',()=>{
  // Azul (0) va de 23 → 0 y saca por abajo; Rojo (1) va de 0 → 23
  let pts,bar=[0,0],off=[0,0],turn=0,dice=[],sel=null,targets=[],msg='',msgT=0,ph='roll',bx,bw,top,ph2;
  const geo=()=>{top=H*.13;ph2=(H*.74)/12;bw=W*.43;bx=[W-bw-6,6];};
  const owner=i=>pts[i]>0?0:pts[i]<0?1:-1,cnt=i=>Math.abs(pts[i]);
  const ptRect=i=>i<12?{x:bx[0],y:top+(11-i)*ph2,right:true}:{x:bx[1],y:top+(i-12)*ph2,right:false};
  const home=p=>p==0?[0,5]:[18,23];
  const allHome=p=>bar[p]==0&&pts.every((v,i)=>!(p==0?v>0:v<0)||(i>=home(p)[0]&&i<=home(p)[1]));
  function dests(p,from){const out=[];for(const d of new Set(dice)){let to=from==='bar'?(p==0?24-d:d-1):(p==0?from-d:from+d);
      if(to<0||to>23){if(!allHome(p)||from==='bar')continue;const exact=p==0?from-d==-1:from+d==24;const further=p==0?pts.some((v,i)=>v>0&&i>from):pts.some((v,i)=>v<0&&i<from);if(exact||!further)out.push({to:'off',d});continue;}
      if(owner(to)==1-p&&cnt(to)>=2)continue;out.push({to,d});}return out;}
  function sources(p){if(bar[p])return dests(p,'bar').length?['bar']:[];const s=[];for(let i=0;i<24;i++)if(owner(i)==p&&dests(p,i).length)s.push(i);return s;}
  function endTurn(){turn^=1;dice=[];sel=null;targets=[];ph='roll';}
  function move(p,from,m){const sg=p==0?1:-1;if(from==='bar')bar[p]--;else pts[from]-=sg;
    if(m.to==='off')off[p]++;else{if(owner(m.to)==1-p&&cnt(m.to)==1){pts[m.to]=0;bar[1-p]++;msg='¡Ficha comida!';msgT=1.2;beep(200,.2,'sawtooth',.07);}pts[m.to]+=sg;}
    dice.splice(dice.indexOf(m.d),1);beep(500,.04);sel=null;targets=[];
    if(off[p]>=15){later(()=>endRound(p,'¡Todas las fichas fuera!'),500);ph='end';return;}
    if(!dice.length||!sources(p).length){if(dice.length){msg='Sin más movimientos';msgT=1;}later(endTurn,dice.length?900:300);ph='wait';}}
  function hitPoint(x,y){for(let i=0;i<24;i++){const r=ptRect(i);if(inR({x,y},r.x,r.y,bw,ph2))return i;}return null;}
  const offRect=p=>({x:W/2-W*.06,y:p==0?top+ph2*9:top,w:W*.12,h:ph2*3});
  return{
    init(){geo();pts=Array(24).fill(0);pts[23]=2;pts[12]=5;pts[7]=3;pts[5]=5;pts[0]=-2;pts[11]=-5;pts[16]=-3;pts[18]=-5;},resize:geo,
    update(dt){if(msgT>0)msgT-=dt;},
    down(id,x,y){const p=sideOf(y);
      if(ph=='roll'){if(p!=turn)return;const a=ri(1,6),b=ri(1,6);dice=a==b?[a,a,a,a]:[a,b];ph='move';beep(300,.08);if(!sources(turn).length){msg='No puedes mover';msgT=1.2;ph='wait';later(endTurn,1200);}return;}
      if(ph!='move')return;
      if(sel!==null){const o=offRect(turn);if(inR({x,y},o.x,o.y,o.w,o.h)){const m=targets.find(t=>t.to==='off');if(m){move(turn,sel,m);return;}}
        const i=hitPoint(x,y);const m=targets.find(t=>t.to===i);if(m){move(turn,sel,m);return;}}
      const srcs=sources(turn);if(bar[turn]&&Math.abs(x-W/2)<W*.07){sel='bar';targets=dests(turn,'bar');return;}
      const i=hitPoint(x,y);if(i!==null&&srcs.includes(i)){sel=i;targets=dests(turn,i);beep(600,.02);}},
    draw(){halves('#5b3a1c','#5b3a1c');ctx.fillStyle='#e9c99a';rrect(bx[1]-4,top-6,W-4,ph2*12+12,10);ctx.fill();ctx.fillStyle='#6d4524';ctx.fillRect(W/2-W*.065,top-6,W*.13,ph2*12+12);
      const r=Math.min(ph2*.42,bw/11);
      for(let i=0;i<24;i++){const q=ptRect(i),hl=targets.some(t=>t.to===i);ctx.fillStyle=hl?'#ffe066':i%2?'#8b2f2f':'#2f4f6b';ctx.beginPath();
        if(q.right){ctx.moveTo(q.x+bw,q.y+2);ctx.lineTo(q.x+bw,q.y+ph2-2);ctx.lineTo(q.x+bw*.15,q.y+ph2/2);}else{ctx.moveTo(q.x,q.y+2);ctx.lineTo(q.x,q.y+ph2-2);ctx.lineTo(q.x+bw*.85,q.y+ph2/2);}ctx.closePath();ctx.fill();
        const n=cnt(i),o=owner(i);for(let k=0;k<Math.min(n,5);k++){const cx=q.right?q.x+bw-r-k*r*2:q.x+r+k*r*2;circle(cx,q.y+ph2/2,r-1,COL[o]);ring(cx,q.y+ph2/2,r-1,sel===i&&k==Math.min(n,5)-1?'#ffe066':'rgba(0,0,0,.4)',2);}
        if(n>5)T(String(n),q.right?q.x+bw-r*9:q.x+r*9,q.y+ph2/2,14,'#fff');}
      for(let p=0;p<2;p++){for(let k=0;k<bar[p];k++)circle(W/2,H/2+(p==0?1:-1)*(r*2+k*r*1.6),r-1,COL[p]);const o=offRect(p);ctx.fillStyle=targets.some(t=>t.to==='off')&&turn==p?'#ffe066':'rgba(0,0,0,.3)';rrect(o.x,o.y,o.w,o.h,6);ctx.fill();T(String(off[p]),o.x+o.w/2,o.y+o.h/2,16,COL[p]);}
      for(let p=0;p<2;p++)inHalf(p,()=>{const y=(top+ph2*12+H)/2+4;if(turn==p){TS(ph=='roll'?'¡Tu turno! Toca para tirar':dice.length?'Dados: '+dice.join(' · '):'',W/2,y,20,'#fff');}else TS('Espera...',W/2,y,15,'rgba(255,255,255,.5)');if(msgT>0)TS(msg,W/2,y-24,18,'#ffe066');});}
  };
},{cd:false});

/* ---- SAQUEADOR ---- */
def('looter','Saqueador','💰','#e15b4f',()=>{
  const J=Joys();let s,coins=[],bank=[0,0],t=0;const TL=60,GOAL=15;
  return{
    init(){s=[{x:W/2,y:H*.75,vx:0,vy:0,r:22,m:1,carry:0},{x:W/2,y:H*.25,vx:0,vy:0,r:22,m:1,carry:0}];for(let i=0;i<8;i++)coins.push({x:rnd(30,W-30),y:rnd(H*.2,H*.8)});},
    down:(i,x,y)=>J.down(i,x,y),move:(i,x,y)=>J.move(i,x,y),up:i=>J.up(i),
    update(dt){t+=dt;for(let p=0;p<2;p++){const v=J.vec(p),k=s[p],sl=1/(1+k.carry*.12);k.vx+=v.x*1000*dt*sl;k.vy+=v.y*1000*dt*sl;}
      moveDiscs(s,dt,.3);for(const k of s)bounceBox(k,0,0,W,H,.5);
      const[a,b]=s,d=Math.hypot(a.x-b.x,a.y-b.y);if(d<a.r+b.r){const sa=Math.hypot(a.vx,a.vy),sb=Math.hypot(b.vx,b.vy),vic=sa>sb?b:a;if(Math.abs(sa-sb)>150&&vic.carry){const n=Math.ceil(vic.carry/2);vic.carry-=n;for(let i=0;i<n;i++)coins.push({x:clamp(vic.x+rnd(-50,50),20,W-20),y:clamp(vic.y+rnd(-50,50),20,H-20)});beep(200,.2,'sawtooth',.07);}}
      collideAll(s,.9);
      for(let p=0;p<2;p++){const k=s[p];for(let i=coins.length-1;i>=0;i--)if(Math.hypot(coins[i].x-k.x,coins[i].y-k.y)<k.r+12){coins.splice(i,1);k.carry++;beep(900,.03,'sine',.08);}
        if(k.carry&&(p==0?k.y>H-60:k.y<60)){bank[p]+=k.carry;k.carry=0;beep(1200,.1,'triangle',.1);}}
      if(coins.length<6)coins.push({x:rnd(30,W-30),y:rnd(H*.25,H*.75)});
      if(bank[0]>=GOAL||bank[1]>=GOAL||t>=TL)endRound(bank[0]==bank[1]?-1:bank[0]>bank[1]?0:1,`Azul ${bank[0]} – Rojo ${bank[1]}`);},
    draw(){ctx.fillStyle='#e8705f';ctx.fillRect(0,0,W,H);ctx.fillStyle=LIGHT[1];ctx.fillRect(0,0,W,60);ctx.fillStyle=LIGHT[0];ctx.fillRect(0,H-60,W,60);E('🏦',W/2,30,36,Math.PI);E('🏦',W/2,H-30,36);
      for(const c of coins)E('🪙',c.x,c.y,24);s.forEach((k,p)=>{circle(k.x,k.y,k.r,COL[p]);E('🦹',k.x,k.y,k.r*1.4,p?Math.PI:0);if(k.carry)T('💰'+k.carry,k.x,k.y-k.r-12,15,'#fff');});
      J.draw();for(let p=0;p<2;p++)inHalf(p,()=>{TS(`Banco: ${bank[p]}/${GOAL}`,80,H-78,18,'#fff');TS(`⏱ ${Math.ceil(Math.max(0,TL-t))}`,W-40,H-78,18,'#fff');});}
  };
},{help:'Lleva monedas a tu banco · choca para robar'});

/* ---- PINBALL ---- */
def('pinball','Pinball','🪩','#2c4a6b',()=>{
  let ball,fl,bump,sc=[0,0],held=new Map(),wait=1,serveTo=0;const BR=11,PTS=5;
  function mkFl(){const L=W*.28,y0=H-80,y1=80;fl=[{px:W*.14,py:y0,s:1,p:0,side:0},{px:W*.86,py:y0,s:-1,p:0,side:1},{px:W*.86,py:y1,s:-1,p:1,side:0},{px:W*.14,py:y1,s:1,p:1,side:1}].map(f=>Object.assign(f,{L,a:0,av:0}));}
  const tip=f=>{const base=f.p==0?.45:-.45,ang=(base-f.a*(f.p==0?1:-1))*f.s;return{x:f.px+Math.cos(ang)*f.L*f.s,y:f.py+Math.sin(ang)*f.L*f.s};};
  function serve(){ball={x:W/2,y:H/2,vx:rnd(-200,200),vy:serveTo==0?320:-320};wait=.8;}
  return{
    init(){mkFl();bump=[{x:W*.3,y:H*.42,r:26},{x:W*.7,y:H*.58,r:26},{x:W*.5,y:H/2,r:30},{x:W*.25,y:H*.62,r:18},{x:W*.75,y:H*.38,r:18}];serve();},
    down(id,x,y){const p=sideOf(y),l=local(p,x,y);held.set(id,{p,side:l.x<W/2?0:1});beep(300,.03);},up(id){held.delete(id);},
    update(dt){for(const f of fl){const on=[...held.values()].some(h=>h.p==f.p&&h.side==f.side);const na=clamp(f.a+(on?14:-10)*dt,0,.9);f.av=(na-f.a)/dt;f.a=na;}
      if(wait>0){wait-=dt;return;}const N=6,h=dt/N;
      for(let s=0;s<N;s++){ball.x+=ball.vx*h;ball.y+=ball.vy*h;if(ball.x<BR){ball.x=BR;ball.vx=Math.abs(ball.vx);}if(ball.x>W-BR){ball.x=W-BR;ball.vx=-Math.abs(ball.vx);}
        for(const b of bump){const dx=ball.x-b.x,dy=ball.y-b.y,d=Math.hypot(dx,dy);if(d<b.r+BR){const nx=dx/d,ny=dy/d;ball.x=b.x+nx*(b.r+BR);ball.y=b.y+ny*(b.r+BR);const vn=ball.vx*nx+ball.vy*ny;ball.vx-=2*vn*nx;ball.vy-=2*vn*ny;ball.vx+=nx*120;ball.vy+=ny*120;b.hit=.15;beep(900,.03,'square',.05);}}
        for(const f of fl){const t=tip(f),q=segPt(ball.x,ball.y,f.px,f.py,t.x,t.y);if(q.d<BR+5){const nx=(ball.x-q.x)/(q.d||1),ny=(ball.y-q.y)/(q.d||1);ball.x=q.x+nx*(BR+5);ball.y=q.y+ny*(BR+5);
          const vn=ball.vx*nx+ball.vy*ny;if(vn<0){ball.vx-=1.7*vn*nx;ball.vy-=1.7*vn*ny;}const boost=Math.abs(f.av)*q.t*f.L*.9;if(f.av>0){ball.vx+=nx*boost;ball.vy+=ny*boost;beep(400,.03);}}}
        const sp=Math.hypot(ball.vx,ball.vy);if(sp>1400){ball.vx*=1400/sp;ball.vy*=1400/sp;}if(sp<260){ball.vx*=260/sp;ball.vy*=260/sp;}
        if(ball.y>H+20||ball.y<-20){const w=ball.y>H?1:0;sc[w]++;serveTo=1-w;beep(w?330:660,.3,'triangle',.08);buzz(80);if(sc[w]>=PTS){wait=99;later(()=>endRound(w,`${sc[0]} – ${sc[1]}`),500);}else serve();return;}}
      for(const b of bump)if(b.hit)b.hit-=dt;},
    draw(){ctx.fillStyle='#1d2f45';ctx.fillRect(0,0,W,H);ctx.strokeStyle='rgba(255,255,255,.08)';for(let i=0;i<H;i+=30){ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(W,i+60);ctx.stroke();}
      for(const b of bump){circle(b.x,b.y,b.r,b.hit>0?'#fff':'#f25c54');circle(b.x,b.y,b.r*.6,'#ffd166');}
      for(const f of fl){const t=tip(f);ctx.strokeStyle=COL[f.p];ctx.lineCap='round';ctx.lineWidth=16;ctx.beginPath();ctx.moveTo(f.px,f.py);ctx.lineTo(t.x,t.y);ctx.stroke();circle(f.px,f.py,9,'#fff');}
      circle(ball.x,ball.y,BR,'#e0e0e0');circle(ball.x-3,ball.y-3,4,'#fff');scoreSide(sc);for(let p=0;p<2;p++)inHalf(p,()=>T('Toca izquierda / derecha para mover las palas',W/2,H-14,13,'rgba(255,255,255,.6)'));}
  };
},{help:'Que no pase la bola por tus palas'});

/* ---- COCHES DE CARRERAS (con volante) ---- */
def('race','Coches de carreras','🏎️','#4a9f3c',()=>{
  let cars,held=new Map(),rx,ry,cx,cy,ch,done=false;const LAPS=3,TW=58;
  const onRoad=(x,y)=>{const d=Math.hypot((x-cx)/rx,(y-cy)/ry);return Math.abs(d-1)*Math.min(rx,ry)<TW;};
  return{
    init(){ch=Math.max(76,H*.1);cx=W/2;cy=H/2;rx=W*.36;ry=(H-2*ch)*.4;cars=[0,1].map(p=>({x:cx+(p?18:-18),y:cy+ry,a:Math.PI,v:0,r:14,m:1,vx:0,vy:0,ang:Math.PI/2,lap:0}));},
    down(id,x,y,live){if(!live)return;const p=y>H-ch?0:y<ch?1:-1;if(p<0)return;const l=local(p,x,y);held.set(id,{p,d:l.x<W/2?-1:1});},up(id){held.delete(id);},
    update(dt){if(done)return;const st=[0,0];for(const h of held.values())st[h.p]+=h.d;
      cars.forEach((c,p)=>{c.a+=clamp(st[p],-1,1)*2.8*dt;const road=onRoad(c.x,c.y),max=road?300:120;c.v+=((max-c.v)*1.2)*dt;c.vx=Math.cos(c.a)*c.v;c.vy=Math.sin(c.a)*c.v;});
      for(const c of cars){c.x+=c.vx*dt;c.y+=c.vy*dt;c.x=clamp(c.x,10,W-10);c.y=clamp(c.y,ch+10,H-ch-10);const na=Math.atan2((c.y-cy)/ry,(c.x-cx)/rx);let d=na-c.ang;if(d>Math.PI)d-=2*Math.PI;if(d<-Math.PI)d+=2*Math.PI;c.lap+=d/(2*Math.PI);c.ang=na;}
      collide(cars[0],cars[1],.5);cars.forEach((c,p)=>{if(Math.abs(c.lap)>=LAPS&&!done){done=true;later(()=>endRound(p,'¡Primero en la meta!'),300);}});},
    draw(){ctx.fillStyle='#4caf50';ctx.fillRect(0,0,W,H);ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);ctx.strokeStyle='#e53935';ctx.lineWidth=TW*2+10;ctx.setLineDash([16,16]);ctx.stroke();ctx.setLineDash([]);
      ctx.strokeStyle='#424242';ctx.lineWidth=TW*2;ctx.stroke();ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=2;ctx.setLineDash([14,14]);ctx.stroke();ctx.setLineDash([]);
      for(let i=0;i<10;i++){ctx.fillStyle=i%2?'#fff':'#111';ctx.fillRect(cx-4,cy+ry-TW+i*TW/5,8,TW/5);}
      cars.forEach((c,p)=>{ctx.save();ctx.translate(c.x,c.y);ctx.rotate(c.a);ctx.fillStyle='#111';ctx.fillRect(-14,-12,8,24);ctx.fillRect(8,-12,8,24);ctx.fillStyle=COL[p];rrect(-18,-8,38,16,6);ctx.fill();ctx.fillStyle='#fff';ctx.fillRect(12,-6,6,12);ctx.restore();});
      for(let p=0;p<2;p++)inHalf(p,()=>{ctx.fillStyle=DARK[p];ctx.fillRect(0,H-ch,W,ch);btn(10,H-ch+10,W/2-20,ch-24,'◀ IZQ',COL[p]);btn(W/2+10,H-ch+10,W/2-20,ch-24,'DCHA ▶',COL[p]);
        TS(`Vuelta ${Math.min(LAPS,Math.floor(Math.abs(cars[p].lap))+1)}/${LAPS}`,W/2,H-ch-20,20,'#fff');});}
  };
},{help:'Gira con IZQ / DCHA · 3 vueltas'});

/* ---- SUDOKU (1 jugador) ---- */
def('sudoku','Sudoku','🔢','#1d8fbf',()=>{
  let sol,g,fixed,sel=-1,errs=0,cs,ox,oy;
  const geo=()=>{cs=Math.min(W*.96/9,H*.55/9);ox=(W-cs*9)/2;oy=H*.1;};
  function fill(a,i){if(i==81)return true;const r=Math.floor(i/9),c=i%9;for(const v of shuffle([1,2,3,4,5,6,7,8,9])){let ok=true;for(let k=0;k<9&&ok;k++){if(a[r*9+k]==v||a[k*9+c]==v)ok=false;const br=Math.floor(r/3)*3+Math.floor(k/3),bc=Math.floor(c/3)*3+k%3;if(a[br*9+bc]==v)ok=false;}if(ok){a[i]=v;if(fill(a,i+1))return true;a[i]=0;}}return false;}
  return{
    init(){geo();sol=Array(81).fill(0);fill(sol,0);g=sol.slice();const rm=shuffle([...Array(81).keys()]).slice(0,44);rm.forEach(i=>g[i]=0);fixed=g.map(v=>v>0);},resize:geo,
    down(id,x,y){const c=Math.floor((x-ox)/cs),r=Math.floor((y-oy)/cs);if(c>=0&&c<9&&r>=0&&r<9){sel=r*9+c;return;}
      const pw=W/5.4,py=oy+cs*9+30;for(let k=0;k<10;k++){const bx=W/2+((k%5)-2)*pw-pw*.45,by=py+Math.floor(k/5)*(pw*.8);if(inR({x,y},bx,by,pw*.9,pw*.7)&&sel>=0&&!fixed[sel]){const v=k==9?0:k+1;g[sel]=v;if(v&&v!=sol[sel]){errs++;beep(150,.1,'sawtooth',.05);}else beep(600,.03);
        if(g.every((v,i)=>v==sol[i]))endSolo(true,`¡Resuelto! Errores: ${errs}`);return;}}},
    draw(){ctx.fillStyle='#e8f4fb';ctx.fillRect(0,0,W,H);T(`Errores: ${errs}`,W/2,oy-24,20,'#1d5f80');
      for(let i=0;i<81;i++){const r=Math.floor(i/9),c=i%9,x=ox+c*cs,y=oy+r*cs,sr=Math.floor(sel/9),sc2=sel%9;let bg='#fff';if(sel>=0&&(r==sr||c==sc2||(Math.floor(r/3)==Math.floor(sr/3)&&Math.floor(c/3)==Math.floor(sc2/3))))bg='#dbeefa';if(i==sel)bg='#9fd3f2';if(sel>=0&&g[i]&&g[i]==g[sel])bg='#bfe3f7';
        ctx.fillStyle=bg;ctx.fillRect(x,y,cs,cs);if(g[i])T(String(g[i]),x+cs/2,y+cs/2+1,cs*.6,fixed[i]?'#1d2b36':g[i]==sol[i]?'#1d7fd0':'#e53935');}
      ctx.strokeStyle='#9ab';ctx.lineWidth=1;for(let i=0;i<=9;i++){ctx.lineWidth=i%3?1:3;ctx.strokeStyle=i%3?'#9ab':'#1d2b36';ctx.beginPath();ctx.moveTo(ox+i*cs,oy);ctx.lineTo(ox+i*cs,oy+9*cs);ctx.moveTo(ox,oy+i*cs);ctx.lineTo(ox+9*cs,oy+i*cs);ctx.stroke();}
      const pw=W/5.4,py=oy+cs*9+30;for(let k=0;k<10;k++){const bx=W/2+((k%5)-2)*pw-pw*.45,by=py+Math.floor(k/5)*(pw*.8);btn(bx,by,pw*.9,pw*.7,k==9?'⌫':String(k+1),'#1d8fbf');}}
  };
},{cd:false,solo:true});

/* ---- EMPAREJAR NÚMEROS (1 jugador) ---- */
def('numbers','Emparejar números','🔟','#0aa2c0',()=>{
  const C=9;let a,sel=-1,adds=5,cs,oy,scroll=0,dirty=true;
  const alive=i=>a[i]>0;
  function between(i,j,step){for(let k=i+step;k!=j;k+=step)if(alive(k))return false;return true;}
  function linked(i,j){if(i>j)[i,j]=[j,i];const ri0=Math.floor(i/C),ci=i%C,rj=Math.floor(j/C),cj=j%C;
    if(between(i,j,1))return true;if(ci==cj&&between(i,j,C))return true;if(cj-ci==rj-ri0&&rj>ri0&&between(i,j,C+1))return true;if(ci-cj==rj-ri0&&rj>ri0&&between(i,j,C-1))return true;return false;}
  function compact(){const rows=[];for(let r=0;r*C<a.length;r++){const row=a.slice(r*C,r*C+C);if(row.some(v=>v>0)||row.length<C)rows.push(row);}a=rows.flat();while(a.length&&a[a.length-1]===0&&a.length%C==1)a.pop();}
  return{
    init(){cs=W/C;oy=90;a=[];for(let i=0;i<27;i++)a.push(ri(1,9));},
    down(id,x,y){if(y>H-80){if(adds>0){adds--;a.push(...a.filter(v=>v>0));dirty=true;beep(500,.05);}return;}
      const i=Math.floor((y-oy+scroll)/cs)*C+Math.floor(x/cs);if(i<0||i>=a.length||!alive(i))return;if(sel<0){sel=i;return;}if(sel==i){sel=-1;return;}
      if((a[i]==a[sel]||a[i]+a[sel]==10)&&linked(sel,i)){a[i]=0;a[sel]=0;sel=-1;beep(800,.06,'sine',.08);compact();dirty=true;if(!a.some(v=>v>0))endSolo(true,'¡Tablero limpio!');}
      else{sel=i;beep(200,.05);}},
    update(){const rows=Math.ceil(a.length/C);scroll=Math.max(0,rows*cs-(H-oy-100));if(dirty&&adds==0){dirty=false;if(!a.some((v,i)=>v>0&&a.some((w,j)=>j>i&&w>0&&(w==v||w+v==10)&&linked(i,j))))endSolo(false,'No quedan parejas');}},
    draw(){ctx.fillStyle='#eaf8fb';ctx.fillRect(0,0,W,H);T('Toca 2 iguales o que sumen 10',W/2,30,18,'#0a6a80');T('(juntos o sin nada en medio)',W/2,56,14,'#0a6a80');
      ctx.save();ctx.beginPath();ctx.rect(0,oy,W,H-oy-90);ctx.clip();for(let i=0;i<a.length;i++){const x=(i%C)*cs,y=oy+Math.floor(i/C)*cs-scroll;ctx.fillStyle=i==sel?'#4ec3dd':'#fff';ctx.fillRect(x+1,y+1,cs-2,cs-2);if(a[i])T(String(a[i]),x+cs/2,y+cs/2+1,cs*.55,i==sel?'#fff':'#234');}ctx.restore();
      btn(W/2-90,H-72,180,54,`+ Números (${adds})`,adds?'#0aa2c0':'#9ab');}
  };
},{cd:false,solo:true});

/* ---- ATASCO (cruza la carretera) ---- */
def('traffic','Atasco','🐔','#4f9d42',()=>{
  const LN=5;let pl,lanes,t=0,cross=[0,0];const GOAL=3;
  const laneY=i=>H-60-(i+1)*((H/2-80)/(LN+1));
  return{
    init(){const r=seeded(ri(1,1e9));lanes=[...Array(LN)].map((_,i)=>({sp:(70+r()*110)*(i%2?1:-1),gap:150+r()*90,off:r()*300,len:50+r()*40}));pl=[0,1].map(()=>({lane:-1,stun:0,hop:0}));},
    carsAt(i,x){const L=lanes[i],per=L.gap+L.len,pos=((x-L.off-L.sp*t)%per+per)%per;return pos<L.len;},
    down(id,x,y,live){if(!live)return;const q=pl[sideOf(y)];if(q.stun>0)return;q.lane++;q.hop=.12;beep(600,.03);
      if(q.lane>=LN){const p=pl.indexOf(q);cross[p]++;q.lane=-1;beep(1000,.15,'triangle',.1);if(cross[p]>=GOAL)later(()=>endRound(p,'¡Gallina valiente!'),300);}},
    update(dt){t+=dt;pl.forEach(q=>{q.stun-=dt;q.hop-=dt;if(q.lane>=0&&q.lane<LN&&this.carsAt(q.lane,W/2)){q.lane=-1;q.stun=.6;beep(120,.3,'sawtooth',.08);buzz(100);}});},
    draw(){for(let p=0;p<2;p++)inHalf(p,()=>{ctx.fillStyle='#62b357';ctx.fillRect(0,H/2,W,H/2);const lh=(H/2-80)/(LN+1);
        for(let i=0;i<LN;i++){const y=laneY(i);ctx.fillStyle='#3d3f45';ctx.fillRect(0,y-lh/2,W,lh);ctx.fillStyle='#fff';for(let x=0;x<W;x+=40)ctx.fillRect(x,y+lh/2-2,20,3);
          const L=lanes[i],per=L.gap+L.len;for(let k=-1;k<W/per+2;k++){let x0=((L.off+L.sp*t)%per+per)%per+k*per-per;ctx.fillStyle=['#e74c3c','#f1c40f','#9b59b6','#1abc9c','#e67e22'][i];rrect(x0,y-lh*.32,L.len,lh*.64,8);ctx.fill();}}
        const q=pl[p],cy=q.lane<0?H-40:laneY(q.lane);E(q.stun>0?'💫':'🐔',W/2,cy-(q.hop>0?8:0),lh*.8);
        TS(`${cross[p]}/${GOAL}`,40,H-30,24,COL[p]);T('Toca para avanzar',W-80,H-30,15,'#fff');});ctx.fillStyle='#ffe066';ctx.fillRect(0,H/2-3,W,6);}
  };
},{help:'Cruza 3 veces sin que te pillen'});

/* ---- PUZLE DESLIZANTE (1 jugador) ---- */
def('slide','Puzle deslizante','🧩','#2b3a4f',()=>{
  const N=4;let a,moves=0,cs,ox,oy;
  const geo=()=>{cs=Math.min(W*.92/N,H*.6/N);ox=(W-cs*N)/2;oy=(H-cs*N)/2;};
  function mv(i){const e=a.indexOf(0),r=Math.floor(i/N),c=i%N,er=Math.floor(e/N),ec=e%N;if(Math.abs(r-er)+Math.abs(c-ec)!=1)return false;[a[i],a[e]]=[a[e],a[i]];return true;}
  return{
    init(){geo();a=[...Array(N*N).keys()].map(i=>(i+1)%(N*N));for(let k=0;k<300;k++){const e=a.indexOf(0),nb=[e-1,e+1,e-N,e+N].filter(j=>j>=0&&j<N*N&&(Math.floor(j/N)==Math.floor(e/N)||j%N==e%N));mv(pick(nb));}},resize:geo,
    down(id,x,y){const c=Math.floor((x-ox)/cs),r=Math.floor((y-oy)/cs);if(c<0||c>=N||r<0||r>=N)return;if(mv(r*N+c)){moves++;beep(500,.03);if(a.every((v,i)=>v==(i+1)%(N*N)))endSolo(true,`¡Resuelto en ${moves} movimientos!`);}},
    draw(){ctx.fillStyle='#1f2a3a';ctx.fillRect(0,0,W,H);TS(`Movimientos: ${moves}`,W/2,oy-36,24,'#fff');
      for(let i=0;i<N*N;i++){const v=a[i];if(!v)continue;const x=ox+(i%N)*cs,y=oy+Math.floor(i/N)*cs,ok=v==i+1;ctx.fillStyle=ok?'#f59e0b':'#fbbf24';rrect(x+3,y+3,cs-6,cs-6,12);ctx.fill();T(String(v),x+cs/2,y+cs/2+2,cs*.45,'#5b3a00');}
      T('Ordena del 1 al 15',W/2,oy+cs*N+36,18,'rgba(255,255,255,.6)');}
  };
},{cd:false,solo:true});

/* ---- GUERRA DE PEONZAS ---- */
def('tops','Guerra de peonzas','🌀','#5b4370',()=>{
  const J=Joys();let R,cx,cy,tp,rot=0,done=false;
  return{
    init(){cx=W/2;cy=H/2;R=Math.min(W,H)*.44;tp=[{x:cx,y:cy+R*.5,vx:0,vy:-60,r:R*.16,m:1,spin:100},{x:cx,y:cy-R*.5,vx:0,vy:60,r:R*.16,m:1,spin:100}];},
    down:(i,x,y)=>J.down(i,x,y),move:(i,x,y)=>J.move(i,x,y),up:i=>J.up(i),
    update(dt){if(done)return;rot+=dt*20;for(let p=0;p<2;p++){const v=J.vec(p),k=tp[p];k.vx+=v.x*600*dt;k.vy+=v.y*600*dt;k.spin-=dt*3;
        const dx=k.x-cx,dy=k.y-cy;k.vx-=dx*.6*dt;k.vy-=dy*.6*dt;}
      moveDiscs(tp,dt,.6);const h=collideAll(tp,1.2);if(h){const loss=h/40;tp.forEach(k=>k.spin-=loss*rnd(.6,1.4));beep(1200,.03,'square',.06);buzz(20);}
      const out=tp.map(k=>Math.hypot(k.x-cx,k.y-cy)>R||k.spin<=0);if(out[0]||out[1]){done=true;const w=out[0]&&out[1]?-1:out[0]?1:0;beep(100,.4,'sawtooth',.08);later(()=>endRound(w,w<0?'¡Las dos fuera!':`¡La peonza ${NAMES[1-w]} cayó!`),600);}},
    draw(){halves();circle(cx,cy,R+12,'#c8a46e');circle(cx,cy,R,'#f6dcae');ring(cx,cy,R*.55,'#d9b47c',3);
      tp.forEach((k,p)=>{const s=Math.max(0,k.spin)/100;circle(k.x,k.y+4,k.r,'rgba(0,0,0,.25)');circle(k.x,k.y,k.r,COL[p]);for(let i=0;i<3;i++){const a=rot*s+i*2.09;ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=4;ctx.beginPath();ctx.arc(k.x,k.y,k.r*.65,a,a+1);ctx.stroke();}circle(k.x,k.y,k.r*.2,'#fff');});
      J.draw();for(let p=0;p<2;p++)inHalf(p,()=>{bar(W*.2,H-34,W*.6,14,tp[p].spin/100,COL[p]);T('Giro',W*.12,H-27,14,'#fff');});}
  };
},{help:'Empuja a la otra fuera · cuida tu giro'});
