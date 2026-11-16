"use strict";
/* Bloque 1: Oops!, Guess the person/animal, Triple, Golf, Golf football, Crash it, Throw, Yazy, Cup pong, Maze paint, Ludo */

/* ---- Tablero de carrera con dado (Oops! y Ludo) ---- */
function raceBoard(o){return()=>{
  const C=7,R=11,N=2*(C+R)-4,NP=o.pawns;let cs,x0,y0,cells=[],pawns,turn=0,die=0,ph='roll',valid=[],msg='',msgT=0,rollT=0;
  function geo(){cs=Math.min(W/(C+.6),H*.62/R);x0=(W-cs*C)/2;y0=(H-cs*R)/2;cells=[];
    for(let c=0;c<C;c++)cells.push([c,R-1]);for(let r=R-2;r>=0;r--)cells.push([C-1,r]);for(let c=C-2;c>=0;c--)cells.push([c,0]);for(let r=1;r<R-1;r++)cells.push([0,r]);}
  const startOf=p=>p==0?3:3+N/2;
  const absOf=(p,prog)=>(startOf(p)+prog)%N;
  const cellXY=i=>{const[c,r]=cells[i];return{x:x0+(c+.5)*cs,y:y0+(r+.5)*cs};};
  const baseXY=(p,i)=>{const y=p==0?(y0+R*cs+H)/2:y0/2;return{x:W/2+(i-(NP-1)/2)*cs*1.05,y};};
  const homeXY=(p,i)=>({x:W/2+(i-(NP-1)/2)*cs*.7,y:H/2+(p==0?cs*1.2:-cs*1.2)});
  function pos(p,i){const v=pawns[p][i];if(v<0)return baseXY(p,i);if(v>=N)return homeXY(p,i);const q=cellXY(absOf(p,v));const same=pawns[p].filter((w,k)=>k<i&&w==v).length;return{x:q.x+same*6,y:q.y-same*6};}
  function canMove(p,i){const v=pawns[p][i];if(v>=N)return false;if(v<0)return!o.needSix||die==6;return o.exact?v+die<=N:true;}
  function next(extra){if(!extra)turn^=1;ph='roll';valid=[];}
  function doMove(p,i){let v=pawns[p][i];v=v<0?0:Math.min(N,v+die);pawns[p][i]=v;beep(520,.05,'square',.05);
    if(v<N){const a=absOf(p,v);for(let k=0;k<NP;k++){const w=pawns[1-p][k];if(w>=0&&w<N&&absOf(1-p,w)==a){pawns[1-p][k]=-1;msg=o.bump;msgT=1.4;beep(180,.3,'sawtooth',.08);buzz(80);}}}
    if(pawns[p].every(w=>w>=N)){later(()=>endRound(p,'¡Todas las fichas en casa!'),600);ph='end';return;}
    next(o.extraSix&&die==6);}
  return{
    init(){geo();pawns=[Array(NP).fill(o.startOut?0:-1),Array(NP).fill(o.startOut?0:-1)];if(o.startOut)pawns.forEach(a=>a.fill(-1));},resize:geo,
    update(dt){if(msgT>0)msgT-=dt;if(ph=='rolling'){rollT-=dt;if(rollT<=0){valid=[...Array(NP).keys()].filter(i=>canMove(turn,i));
      if(!valid.length){msg='Sin movimientos';msgT=1;ph='wait';later(()=>next(false),1000);}else if(valid.length==1||new Set(valid.map(i=>pawns[turn][i])).size==1)doMove(turn,valid[0]);else ph='choose';}}},
    down(id,x,y){const p=sideOf(y);
      if(ph=='roll'&&p==turn){die=ri(1,6);ph='rolling';rollT=.5;beep(300,.05);return;}
      if(ph=='choose'){let best=-1,bd=cs*.8;for(const i of valid){const q=pos(turn,i);const d=Math.hypot(q.x-x,q.y-y);if(d<bd){bd=d;best=i;}}if(best>=0)doMove(turn,best);}},
    draw(){halves();ctx.fillStyle='#f5ecd7';rrect(x0-6,y0-6,cs*C+12,cs*R+12,14);ctx.fill();
      ctx.fillStyle=o.center;rrect(x0+cs*1.2,y0+cs*1.2,cs*(C-2.4),cs*(R-2.4),16);ctx.fill();E(o.logo,W/2,H/2,cs*1.6);
      cells.forEach((q,i)=>{const{x,y}=cellXY(i);let c='#fff';if(i==startOf(0))c=LIGHT[0];if(i==startOf(1))c=LIGHT[1];ctx.fillStyle=c;rrect(x-cs*.44,y-cs*.44,cs*.88,cs*.88,7);ctx.fill();});
      for(let p=0;p<2;p++)for(let i=0;i<NP;i++){const q=pos(p,i),hl=ph=='choose'&&p==turn&&valid.includes(i);if(hl)circle(q.x,q.y,cs*.42,'#ffe066');circle(q.x,q.y+2,cs*.32,'rgba(0,0,0,.35)');circle(q.x,q.y,cs*.32,COL[p]);ring(q.x,q.y,cs*.18,'rgba(255,255,255,.6)',3);}
      for(let p=0;p<2;p++)inHalf(p,()=>{const by=(y0+R*cs+H)/2;
        if(turn==p){const dx=W-50;ctx.fillStyle='#fff';rrect(dx-24,by-24,48,48,10);ctx.fill();T(ph=='rolling'?String(ri(1,6)):die?String(die):'?',dx,by+1,30,'#222');
          TS(ph=='roll'?'Toca para tirar el dado':ph=='choose'?'Elige ficha':'',W/2,y0+R*cs+12,17,'#ffe066');}
        if(msgT>0)TS(msg,W/2,H/2+cs*2.6,26,'#ffe066');});}
  };};}
def('oops','Oops!','💥','#18a6d8',raceBoard({pawns:3,needSix:false,extraSix:false,exact:false,bump:'¡Oops! A casa',logo:'💥',center:'#1592c0'}),{cd:false});
def('ludo','Ludo','🎲','#f4b63a',raceBoard({pawns:4,needSix:true,extraSix:true,exact:true,bump:'¡Comida! A casa',logo:'🎲',center:'#e9a521'}),{cd:false});

/* ---- Carrera de pistas: encuentra lo que se describe ---- */
function clueRace(data,bg){return()=>{
  let items,target,lay=[[],[]],sc=[0,0],lock=[0,0],wait=0,win=-1,c;const PTS=5,N=9;
  function nq(){items=shuffle(data.slice()).slice(0,N);target=pick(items);for(let p=0;p<2;p++)lay[p]=shuffle(items.slice());lock=[0,0];win=-1;}
  const geo=()=>{c=Math.min(W/3.6,H*.105);};const cp=i=>({x:W/2+(i%3-1)*c*1.08,y:H*.77+(Math.floor(i/3)-1)*c*1.08});
  return{init(){geo();nq();},resize:geo,
    update(dt){for(let p=0;p<2;p++)if(lock[p]>0)lock[p]-=dt;if(wait>0){wait-=dt;if(wait<=0){if(Math.max(...sc)>=PTS)endRound(sc[0]>sc[1]?0:1,`${sc[0]} – ${sc[1]}`);else nq();}}},
    down(id,x,y,live){if(!live||wait>0)return;const p=sideOf(y);if(lock[p]>0)return;const l=local(p,x,y);
      for(let i=0;i<N;i++){const q=cp(i);if(Math.abs(l.x-q.x)<c/2&&Math.abs(l.y-q.y)<c/2){if(lay[p][i]==target){sc[p]++;win=p;wait=1.2;beep(900,.1,'sine',.1);}else{lock[p]=1;beep(150,.2,'sawtooth',.06);buzz(50);}return;}}},
    draw(){halves(bg[0],bg[1]);ctx.fillStyle='rgba(255,255,255,.25)';ctx.fillRect(0,H/2-1,W,2);
      for(let p=0;p<2;p++)inHalf(p,()=>{ctx.fillStyle='rgba(0,0,0,.3)';rrect(14,H*.525,W-28,44,12);ctx.fill();TS(target[1],W/2,H*.525+22,Math.min(20,(W-40)/target[1].length*1.9),'#fff');TS(String(sc[p]),W-26,H*.97-12,28,COL[p]);
        for(let i=0;i<N;i++){const q=cp(i),e=lay[p][i][0];let b='#f8fafc';if(wait>0&&lay[p][i]==target)b='#4ade80';else if(lock[p]>0)b='#64748b';ctx.fillStyle=b;rrect(q.x-c/2,q.y-c/2,c,c,14);ctx.fill();E(e,q.x,q.y,c*.66);}
        if(wait>0)TS(win==p?'¡Correcto!':'¡El otro fue más rápido!',W/2,H*.97-12,18,win==p?'#7CFC9A':'#fca5a5');});}
  };};}
def('guessperson','Guess the person','🕵️','#5a3f78',clueRace([['👨‍🦰','Hombre pelirrojo'],['👩‍🦰','Mujer pelirroja'],['👨‍🦱','Hombre con pelo rizado'],['👩‍🦱','Mujer con pelo rizado'],['👨‍🦳','Hombre de pelo blanco'],['👩‍🦳','Mujer de pelo blanco'],['👨‍🦲','Hombre calvo'],['👱‍♂️','Hombre rubio'],['👱‍♀️','Mujer rubia'],['🧔','Hombre con barba'],['👴','Abuelo'],['👵','Abuela'],['👮','Policía'],['👷','Obrero con casco'],['🧑‍🍳','Cocinero'],['🧑‍🚒','Bombero'],['🧑‍⚕️','Médico'],['🤴','Príncipe'],['👸','Princesa'],['🧙','Mago'],['🧛','Vampiro'],['🧑‍🚀','Astronauta'],['🕵️','Detective'],['🤠','Vaquero'],['🥷','Ninja'],['🎅','Papá Noel'],['👶','Bebé'],['🧑‍🎨','Pintor'],['🧜‍♀️','Sirena'],['🦸','Superhéroe']],['#3d2a55','#3d2a55']),{help:'Toca a la persona descrita'});
def('guessanimal','Guess the animal','🐼','#2f8f4e',clueRace([['🐙','Tiene 8 brazos y vive en el mar'],['🦒','El cuello más largo'],['🐘','Tiene trompa'],['🦘','Salta y lleva a su cría en una bolsa'],['🐧','Ave que no vuela y vive en el hielo'],['🦉','Ave que caza de noche'],['🐢','Lleva su casa a cuestas'],['🦓','Caballo con rayas'],['🐪','Tiene jorobas y vive en el desierto'],['🦈','Pez enorme con muchos dientes'],['🐝','Hace miel'],['🕷️','Teje telarañas'],['🦔','Tiene púas'],['🐄','Nos da leche'],['🐓','Canta por la mañana'],['🦜','Ave de colores que habla'],['🐼','Oso blanco y negro'],['🐸','Croa y salta'],['🦀','Camina de lado'],['🐌','Muy lento y con concha'],['🦇','Vuela de noche y cuelga boca abajo'],['🐊','Reptil de río con grandes dientes'],['🦩','Ave rosa que se apoya en una pata'],['🐳','El animal más grande del mar'],['🦁','El rey de la selva'],['🐿️','Guarda bellotas'],['🐑','Nos da lana'],['🦨','Huele muy mal'],['🦥','El más perezoso'],['🐬','Mamífero marino muy listo']],['#1f6b3a','#1f6b3a']),{help:'Toca el animal de la pista'});

/* ---- TRIPLE (encuentra 3 cartas: cada rasgo igual o todo distinto) ---- */
def('triple','Triple','🔷','#4b2f7a',()=>{
  const CC=['#8e44ad','#27ae60','#e67e22'];let cards,sel=[[],[]],sc=[0,0],lock=[0,0],wait=0,win=-1,cw,ch;const PTS=5;
  const isSet=(a,b,c)=>['s','c','n'].every(k=>(a[k]==b[k]&&b[k]==c[k])||(a[k]!=b[k]&&b[k]!=c[k]&&a[k]!=c[k]));
  function hasSet(cs){for(let i=0;i<9;i++)for(let j=i+1;j<9;j++)for(let k=j+1;k<9;k++)if(isSet(cs[i],cs[j],cs[k]))return true;return false;}
  function deal(){const all=[];for(let s=0;s<3;s++)for(let c=0;c<3;c++)for(let n=1;n<4;n++)all.push({s,c,n});do cards=shuffle(all).slice(0,9);while(!hasSet(cards));sel=[[],[]];lock=[0,0];win=-1;}
  const geo=()=>{cw=Math.min(W*.3,H*.15*1.4);ch=Math.min(H*.12,cw*.62);};const cp=i=>({x:W/2+(i%3-1)*cw*1.06-cw/2,y:H*.6+Math.floor(i/3)*ch*1.1});
  function shape(x,y,s,c,r){ctx.fillStyle=c;ctx.beginPath();if(s==0)ctx.arc(x,y,r,0,7);else if(s==1){ctx.moveTo(x,y-r);ctx.lineTo(x+r,y+r*.8);ctx.lineTo(x-r,y+r*.8);ctx.closePath();}else ctx.rect(x-r*.85,y-r*.85,r*1.7,r*1.7);ctx.fill();}
  return{init(){geo();deal();},resize:geo,
    update(dt){for(let p=0;p<2;p++)if(lock[p]>0)lock[p]-=dt;if(wait>0){wait-=dt;if(wait<=0){if(Math.max(...sc)>=PTS)endRound(sc[0]>sc[1]?0:1,`${sc[0]} – ${sc[1]}`);else deal();}}},
    down(id,x,y,live){if(!live||wait>0)return;const p=sideOf(y);if(lock[p]>0)return;const l=local(p,x,y);
      for(let i=0;i<9;i++){const q=cp(i);if(inR(l,q.x,q.y,cw,ch)){const s=sel[p],k=s.indexOf(i);if(k>=0)s.splice(k,1);else s.push(i);beep(500,.03);
        if(s.length==3){if(isSet(cards[s[0]],cards[s[1]],cards[s[2]])){sc[p]++;win=p;wait=1.3;beep(900,.12,'sine',.1);}else{lock[p]=1.2;sel[p]=[];beep(150,.2,'sawtooth',.06);buzz(60);}}return;}}},
    draw(){halves('#2e1f4a','#2e1f4a');ctx.fillStyle='rgba(255,255,255,.2)';ctx.fillRect(0,H/2-1,W,2);
      for(let p=0;p<2;p++)inHalf(p,()=>{TS(wait>0?(win==p?'¡TRIPLE!':'¡El otro lo encontró!'):lock[p]>0?'No es triple. Espera...':'Elige 3: cada rasgo todo igual o todo distinto',W/2,H*.54,16,'#ffe066');TS(String(sc[p]),W-24,H*.97-10,26,COL[p]);
        for(let i=0;i<9;i++){const q=cp(i),k=cards[i],on=sel[p].includes(i)||(wait>0&&win==p&&sel[p].includes(i));ctx.fillStyle=on?'#fff6bf':'#fff';rrect(q.x,q.y,cw,ch,10);ctx.fill();if(on){ctx.strokeStyle='#f4b63a';ctx.lineWidth=4;ctx.stroke();}
          for(let m=0;m<k.n;m++)shape(q.x+cw/2+(m-(k.n-1)/2)*cw*.28,q.y+ch/2,k.s,CC[k.c],ch*.22);}});}
  };
},{help:'Cada rasgo: igual en las 3 o distinto en las 3'});

/* ---- GOLF lateral (cada uno en su mitad, mismo hoyo) ---- */
function golfGame(o){return()=>{
  let hole=0,pl,seed,amp,phs,holeX;const HOLES=3;
  const gy=x=>H*.86-amp[0]*Math.sin(x/W*Math.PI*phs[0]+seed)-amp[1]*Math.sin(x/W*Math.PI*phs[1]+seed*2)-(Math.abs(x-holeX)<14?-10:0);
  function newHole(){seed=rnd(0,6);amp=[H*rnd(.02,.06),H*rnd(.01,.03)];phs=[rnd(1,3),rnd(3,6)];holeX=W*rnd(.72,.9);
    for(const q of pl){q.b={x:30,y:gy(30)-12,vx:0,vy:0};q.done=false;q.rest=1;q.hs=0;}}
  return{
    init(){pl=[0,1].map(()=>({strokes:0,aim:null}));newHole();},
    down(id,x,y){const p=sideOf(y),q=pl[p];if(q.done||q.rest<.25||q.aim)return;const l=local(p,x,y);q.aim={id,sx:l.x,sy:l.y,x:l.x,y:l.y};},
    move(id,x,y){for(let p=0;p<2;p++){const a=pl[p].aim;if(a&&a.id===id){const l=local(p,x,y);a.x=l.x;a.y=l.y;}}},
    up(id){for(const q of pl){const a=q.aim;if(a&&a.id===id){q.aim=null;const dx=a.sx-a.x,dy=a.sy-a.y,l=Math.hypot(dx,dy);if(l<10)continue;const pw=Math.min(l,140)/140*o.pow;q.b.vx=dx/l*pw;q.b.vy=dy/l*pw;q.strokes++;q.rest=0;beep(300,.05);}}},
    update(dt){for(const q of pl){if(q.done)continue;const b=q.b,N=4,h=dt/N;
      for(let s=0;s<N;s++){b.vy+=900*h;b.x+=b.vx*h;b.y+=b.vy*h;if(b.x<10){b.x=10;b.vx=Math.abs(b.vx)*.5;}if(b.x>W-10){b.x=W-10;b.vx=-Math.abs(b.vx)*.5;}
        const g=gy(b.x);if(b.y>g-o.r){b.y=g-o.r;const sl=(gy(b.x+1)-gy(b.x-1))/2,nl=Math.hypot(sl,1),nx=sl/nl,ny=-1/nl,vn=b.vx*nx+b.vy*ny;if(vn<0){b.vx-=1.45*vn*nx;b.vy-=1.45*vn*ny;}const f=Math.pow(.25,h);b.vx*=f;b.vy*=f;
          if(Math.abs(b.x-holeX)<10&&Math.hypot(b.vx,b.vy)<420){q.done=true;b.x=holeX;b.y=gy(holeX)-4;beep(880,.2,'triangle',.1);buzz(60);}}}
      if(Math.hypot(b.vx,b.vy)<14&&b.y>=gy(b.x)-o.r-1){q.rest+=dt;if(q.rest>.25){b.vx=b.vy=0;}}else q.rest=0;}
      if(pl.every(q=>q.done)){hole++;if(hole>=HOLES){const a=pl[0].strokes,b=pl[1].strokes;endRound(a==b?-1:a<b?0:1,`Golpes: Azul ${a} – Rojo ${b}`);}else{newHole();}}},
    draw(){for(let p=0;p<2;p++)inHalf(p,()=>{ctx.fillStyle=o.sky;ctx.fillRect(0,H/2,W,H/2);ctx.save();ctx.beginPath();ctx.rect(0,H/2,W,H/2);ctx.clip();
        ctx.fillStyle='#fff';circle(W*.2,H*.6,18,'rgba(255,255,255,.7)');circle(W*.24,H*.6,22,'rgba(255,255,255,.7)');
        ctx.beginPath();ctx.moveTo(0,H);for(let x=0;x<=W;x+=4)ctx.lineTo(x,gy(x));ctx.lineTo(W,H);ctx.closePath();ctx.fillStyle=o.dirt;ctx.fill();
        ctx.beginPath();for(let x=0;x<=W;x+=4)ctx.lineTo(x,gy(x));ctx.strokeStyle=o.grass;ctx.lineWidth=12;ctx.stroke();
        const hy=gy(holeX);ctx.fillStyle='#222';ctx.fillRect(holeX-9,hy-4,18,10);ctx.fillStyle='#eee';ctx.fillRect(holeX-1,hy-70,3,66);ctx.fillStyle=COL[p];ctx.beginPath();ctx.moveTo(holeX+2,hy-70);ctx.lineTo(holeX+30,hy-60);ctx.lineTo(holeX+2,hy-50);ctx.fill();
        const q=pl[p];if(o.ball=='⚪')circle(q.b.x,q.b.y,o.r,'#fff');else E(o.ball,q.b.x,q.b.y,o.r*2.2);
        if(q.aim){const dx=q.aim.sx-q.aim.x,dy=q.aim.sy-q.aim.y,l=Math.hypot(dx,dy)||1,pw=Math.min(l,140);ctx.strokeStyle=COL[p];ctx.lineWidth=4;ctx.setLineDash([6,6]);ctx.beginPath();ctx.moveTo(q.b.x,q.b.y);ctx.lineTo(q.b.x+dx/l*pw,q.b.y+dy/l*pw);ctx.stroke();ctx.setLineDash([]);}
        ctx.restore();TS(`Hoyo ${Math.min(hole+1,HOLES)}/${HOLES} · Golpes: ${q.strokes}`,W/2,H/2+22,20,'#1b3a57');if(q.done)TS('¡Dentro! Espera al otro',W/2,H/2+48,18,COL[p]);
        else if(q.strokes==0&&hole==0)TS('Arrastra hacia atrás y suelta',W/2,H/2+48,16,'#1b3a57');});
      ctx.fillStyle='#fff';ctx.fillRect(0,H/2-2,W,4);}
  };};}
def('golf','Golf','⛳','#5fb6e8',golfGame({ball:'⚪',r:6,pow:900,sky:'#9fd8f7',dirt:'#7b4a2a',grass:'#4caf50'}),{help:'Menos golpes en 3 hoyos'});
def('golffoot','Golf football','⚽','#3f9c3a',golfGame({ball:'⚽',r:10,pow:850,sky:'#bfe9ff',dirt:'#8d5a35',grass:'#5cc04f'}),{help:'Mete el balón en menos toques'});

/* ---- CRASH IT (coches de choque) ---- */
def('crash','Crash it','🚙','#c5604e',()=>{
  const J=Joys();let cars,hp=[3,3],cool=0,boom=null;
  return{
    init(){cars=[{x:W/2,y:H*.75,vx:0,vy:0,r:26,m:1,a:-Math.PI/2},{x:W/2,y:H*.25,vx:0,vy:0,r:26,m:1,a:Math.PI/2}];},
    down:(i,x,y)=>J.down(i,x,y),move:(i,x,y)=>J.move(i,x,y),up:i=>J.up(i),
    update(dt){cool-=dt;if(boom)boom.t-=dt;
      for(let p=0;p<2;p++){const v=J.vec(p),k=cars[p];k.vx+=v.x*1000*dt;k.vy+=v.y*1000*dt;if(Math.hypot(k.vx,k.vy)>30)k.a=Math.atan2(k.vy,k.vx);}
      moveDiscs(cars,dt,.35);for(const k of cars)bounceBox(k,0,0,W,H,.6);
      const[a,b]=cars,dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);
      if(d<a.r+b.r&&cool<=0){const nx=dx/d,ny=dy/d,ia=a.vx*nx+a.vy*ny,ib=-(b.vx*nx+b.vy*ny);const atk=ia>ib?0:1,sp=Math.max(ia,ib);
        if(sp>220){const vic=1-atk;hp[vic]--;cool=.6;boom={x:(a.x+b.x)/2,y:(a.y+b.y)/2,t:.5};beep(120,.3,'sawtooth',.1);buzz(120);if(hp[vic]<=0)later(()=>endRound(atk,'¡Coche destrozado!'),600);}}
      collideAll(cars,.9);},
    draw(){ctx.fillStyle='#55565c';ctx.fillRect(0,0,W,H);ctx.strokeStyle='#f4c430';ctx.lineWidth=8;ctx.setLineDash([20,16]);ctx.strokeRect(10,10,W-20,H-20);ctx.setLineDash([]);
      cars.forEach((k,p)=>{ctx.save();ctx.translate(k.x,k.y);ctx.rotate(k.a);ctx.fillStyle='#111';ctx.fillRect(-20,-22,12,44);ctx.fillRect(10,-22,12,44);ctx.fillStyle=COL[p];rrect(-28,-17,56,34,10);ctx.fill();ctx.fillStyle='rgba(255,255,255,.6)';rrect(4,-12,14,24,4);ctx.fill();ctx.restore();});
      if(boom&&boom.t>0)E('💥',boom.x,boom.y,60);J.draw();for(let p=0;p<2;p++)inHalf(p,()=>hearts(hp[p],30,H-30,22));}
  };
},{help:'Embiste al otro coche de frente'});

/* ---- THROW (bolas de nieve) ---- */
def('throw','Throw','⛄','#2f66b8',()=>{
  let px=[0,0],tx=[0,0],balls=[],walls,sc=[0,0],cool=[0,0],hit=[0,0];const PTS=5;
  const py=p=>p==0?H-70:70;
  return{
    init(){px=[W/2,W/2];tx=[W/2,W/2];walls=[0,1,2].map(i=>({x:W*(.2+i*.3),w:W*.18,dir:i%2?1:-1}));},
    down(id,x,y){const p=sideOf(y);tx[p]=clamp(x,24,W-24);},move(id,x,y){const p=sideOf(y);tx[p]=clamp(x,24,W-24);},
    up(id,x,y){const p=sideOf(y);if(cool[p]>0||ended)return;cool[p]=.55;balls.push({x:px[p],y:py(p)+(p?30:-30),vy:p?520:-520,p});beep(400,.04);},
    update(dt){for(let p=0;p<2;p++){cool[p]-=dt;hit[p]-=dt;px[p]+=clamp(tx[p]-px[p],-500*dt,500*dt);}
      for(const w of walls){w.x+=w.dir*60*dt;if(w.x<0||w.x+w.w>W)w.dir*=-1;}
      for(let i=balls.length-1;i>=0;i--){const b=balls[i];b.y+=b.vy*dt;let gone=b.y<-20||b.y>H+20;
        if(Math.abs(b.y-H/2)<12)for(const w of walls)if(b.x>w.x&&b.x<w.x+w.w)gone=true;
        const o=1-b.p;if(!gone&&Math.abs(b.y-py(o))<26&&Math.abs(b.x-px[o])<24){gone=true;sc[b.p]++;hit[o]=.4;beep(200,.2,'sawtooth',.08);buzz(60);if(sc[b.p]>=PTS)later(()=>endRound(b.p,`${sc[0]} – ${sc[1]}`),400);}
        if(gone)balls.splice(i,1);}},
    draw(){halves('#dceefa','#dceefa');ctx.fillStyle='#b7d7ef';for(let i=0;i<30;i++)circle((i*71)%W,(i*137)%H,3,'#fff');
      for(const w of walls){ctx.fillStyle='#fff';rrect(w.x,H/2-16,w.w,32,14);ctx.fill();ctx.strokeStyle='#9cc3e0';ctx.lineWidth=3;ctx.stroke();}
      for(const b of balls)circle(b.x,b.y,8,'#fff'),ring(b.x,b.y,8,'#9cc3e0',2);
      for(let p=0;p<2;p++){const x=px[p],y=py(p);circle(x,y,24,hit[p]>0?'#fff':COL[p]);E(hit[p]>0?'😵':'🧑',x,y,30,p?Math.PI:0);}
      for(let p=0;p<2;p++)inHalf(p,()=>{TS(String(sc[p]),30,H/2+36,30,COL[p]);T('Arrastra para moverte · suelta para lanzar',W/2,H-18,14,'#2f5d86');});}
  };
},{help:'Acierta 5 bolas de nieve'});

/* ---- YAZY CLASSIC (dados, 13 categorías) ---- */
def('yazy','Yazy classic','🎲','#a0522d',()=>{
  const CAT=['1','2','3','4','5','6','Trío','Póker','Full','Esc. corta','Esc. larga','YAZY','Suerte'];
  let card=[Array(13).fill(null),Array(13).fill(null)],turn=0,dice=[1,1,1,1,1],held=Array(5).fill(false),rolls=3,anim=0;
  function score(c,d){const cnt=[0,0,0,0,0,0,0];d.forEach(v=>cnt[v]++);const sum=d.reduce((a,b)=>a+b,0),mx=Math.max(...cnt);
    if(c<6)return cnt[c+1]*(c+1);if(c==6)return mx>=3?sum:0;if(c==7)return mx>=4?sum:0;if(c==8)return cnt.includes(3)&&cnt.includes(2)?25:0;
    const has=a=>a.every(v=>cnt[v]);if(c==9)return has([1,2,3,4])||has([2,3,4,5])||has([3,4,5,6])?30:0;if(c==10)return has([1,2,3,4,5])||has([2,3,4,5,6])?40:0;if(c==11)return mx==5?50:0;return sum;}
  const total=p=>{const c=card[p],up=c.slice(0,6).reduce((a,b)=>a+(b||0),0);return c.reduce((a,b)=>a+(b||0),0)+(up>=63?35:0);};
  const dS=()=>Math.min(W*.15,58),dX=i=>W/2+(i-2)*dS()*1.15-dS()/2,dY=()=>H*.565,rb=()=>({x:W*.2,y:H*.565+dS()+10,w:W*.6,h:40});
  const cr=i=>{const col=i<7?0:1,row=i<7?i:i-7,h=(H*.97-(H*.565+dS()+60))/7;return{x:col?W/2+4:10,y:H*.565+dS()+58+row*h,w:W/2-14,h:h-4};};
  return{
    update(dt){if(anim>0)anim-=dt;},
    down(id,x,y){const p=sideOf(y);if(p!=turn||anim>0)return;const l=local(p,x,y);const r=rb();
      if(inR(l,r.x,r.y,r.w,r.h)&&rolls>0){for(let i=0;i<5;i++)if(!held[i]||rolls==3)dice[i]=ri(1,6);if(rolls==3)held.fill(false);rolls--;anim=.35;beep(300,.08);return;}
      if(rolls<3)for(let i=0;i<5;i++)if(inR(l,dX(i),dY(),dS(),dS())){held[i]=!held[i];beep(600,.03);return;}
      if(rolls<3)for(let i=0;i<13;i++){const q=cr(i);if(inR(l,q.x,q.y,q.w,q.h)&&card[p][i]==null){card[p][i]=score(i,dice);beep(800,.08,'sine',.08);rolls=3;held.fill(false);turn^=1;
        if(card[1].every(v=>v!=null)&&card[0].every(v=>v!=null)){const a=total(0),b=total(1);later(()=>endRound(a==b?-1:a>b?0:1,`Azul ${a} – Rojo ${b}`),400);}return;}}},
    draw(){halves('#6b3a1f','#6b3a1f');ctx.fillStyle='rgba(255,255,255,.25)';ctx.fillRect(0,H/2-1,W,2);
      for(let p=0;p<2;p++)inHalf(p,()=>{const me=turn==p;TS(`${me?'¡Tu turno!':'Espera...'}  ·  Total: ${total(p)}`,W/2,H*.525,20,me?'#fff':'rgba(255,255,255,.55)');
        if(me){for(let i=0;i<5;i++){const x=dX(i),y=dY(),s=dS();ctx.fillStyle=held[i]?'#ffe066':'#fff';rrect(x,y,s,s,10);ctx.fill();T(rolls==3?'?':String(anim>0&&!held[i]?ri(1,6):dice[i]),x+s/2,y+s/2+1,s*.55,'#222');}
          const r=rb();btn(r.x,r.y,r.w,r.h,rolls>0?`TIRAR (${rolls})`:'Elige casilla',rolls>0?'#43a95b':'#64809a');}
        for(let i=0;i<13;i++){const q=cr(i),v=card[p][i];ctx.fillStyle=v!=null?'rgba(0,0,0,.35)':'rgba(255,255,255,.12)';rrect(q.x,q.y,q.w,q.h,8);ctx.fill();
          T(CAT[i],q.x+8,q.y+q.h/2,15,'#fff','left');T(v!=null?String(v):me&&rolls<3?String(score(i,dice)):'',q.x+q.w-10,q.y+q.h/2,16,v!=null?'#fff':'#ffe066','right');}});}
  };
},{cd:false});

/* ---- CUP PONG ---- */
def('cuppong','Cup pong','🥤','#1f7a5c',()=>{
  let cups,turn=0,shots=0,ball=null,sc=[0,0],msg='',msgT=0;const R=22;
  function rack(p){const out=[],by=p==1?H*.16:H*.84,dir=p==1?1:-1;let k=0;for(let row=0;row<3;row++)for(let j=0;j<=row;j++)out.push({x:W/2+(j-row/2)*R*2.1,y:by+dir*row*R*1.85,in:true});return out;}
  return{
    init(){cups=[rack(0),rack(1)];},
    update(dt){if(msgT>0)msgT-=dt;if(!ball)return;ball.t+=dt/.7;if(ball.t>=1){const tgt=cups[1-ball.p];let hit=null;for(const c of tgt)if(c.in&&Math.hypot(c.x-ball.tx,c.y-ball.ty)<R*.95)hit=c;
        if(hit){hit.in=false;sc[ball.p]++;msg='¡Dentro!';beep(900,.15,'triangle',.1);buzz(50);}else{msg='Fallo';beep(200,.1);}msgT=.8;ball=null;shots++;
        if(cups[1-turn].every(c=>!c.in)){const w=turn;later(()=>endRound(w,'¡Todos los vasos!'),500);return;}if(shots>=2){shots=0;turn^=1;}}},
    up(id,x,y,i){if(ball||sideOf(i.sy)!=turn||ended)return;const p=turn,dy=p==0?-i.dy:i.dy,dx=p==0?i.dx:-i.dx;if(dy<30)return;
      const sx=i.sx,sy=i.sy,dist=dy*3.2+rnd(-10,10);const lx=(p==0?sx:W-sx)+dx*2+rnd(-8,8);const tx=p==0?lx:W-lx,ty=p==0?sy-dist:sy+dist;ball={p,sx,sy,tx,ty,t:0};beep(400,.04);},
    draw(){halves('#1d5e47','#1d5e47');ctx.fillStyle='rgba(255,255,255,.4)';ctx.fillRect(W/2-2,0,4,H);ctx.fillRect(0,H/2-2,W,4);
      for(let p=0;p<2;p++)for(const c of cups[p])if(c.in){circle(c.x,c.y,R,'#c62828');circle(c.x,c.y,R*.78,'#fafafa');circle(c.x,c.y,R*.68,COL[p]);}
      if(ball){const t=ball.t,x=ball.sx+(ball.tx-ball.sx)*t,y=ball.sy+(ball.ty-ball.sy)*t,s=8+Math.sin(t*Math.PI)*10;circle(x+s*.6,y+s*.6,8,'rgba(0,0,0,.25)');circle(x,y,s,'#fff');}
      for(let p=0;p<2;p++)inHalf(p,()=>{TS(turn==p?`¡Tu turno! Desliza hacia arriba (${2-shots} tiros)`:'Espera...',W/2,H*.62,turn==p?18:15,turn==p?'#fff':'rgba(255,255,255,.5)');TS(String(sc[p]),30,H*.62,28,COL[p]);if(msgT>0)TS(msg,W/2,H*.68,26,'#ffe066');});}
  };
},{cd:false});

/* ---- MAZE PAINT (1 jugador) ---- */
def('mazepaint','Maze paint','🖍️','#2b2b33',()=>{
  const C=8,R=11;persist.mp=persist.mp||{lvl:1};let g,ball,paint,target,anim=null,cs,ox,oy;
  const geo=()=>{cs=Math.min(W*.92/C,H*.72/R);ox=(W-cs*C)/2;oy=(H-cs*R)/2+20;};
  const free=(c,r)=>c>=0&&c<C&&r>=0&&r<R&&!g[r*C+c];
  function slide(c,r,dc,dr,mark){while(free(c+dc,r+dr)){c+=dc;r+=dr;if(mark)mark.add(r*C+c);}return[c,r];}
  function gen(){for(let tries=0;tries<300;tries++){g=Array(C*R).fill(0).map(()=>Math.random()<.3?1:0);let s;do s=ri(0,C*R-1);while(g[s]);
      const seen=new Set([s]),q=[s],cov=new Set([s]);while(q.length){const v=q.shift();for(const[dc,dr]of[[1,0],[-1,0],[0,1],[0,-1]]){const[c,r]=slide(v%C,Math.floor(v/C),dc,dr,cov);const n=r*C+c;if(!seen.has(n)){seen.add(n);q.push(n);}}}
      if(cov.size>=18+Math.min(persist.mp.lvl,10)*2){ball={c:s%C,r:Math.floor(s/C)};target=cov;paint=new Set([s]);for(let i=0;i<C*R;i++)if(!g[i]&&!cov.has(i))g[i]=1;return;}}}
  return{
    init(){geo();gen();},resize:geo,
    update(dt){if(!anim)return;anim.t+=dt*22;while(anim.t>=1&&anim.path.length){const n=anim.path.shift();ball={c:n%C,r:Math.floor(n/C)};paint.add(n);anim.t-=1;}
      if(!anim.path.length){anim=null;beep(500,.04);if([...target].every(i=>paint.has(i))){persist.mp.lvl++;endSolo(true,`Nivel ${persist.mp.lvl-1} pintado`);}}},
    down(id,x,y){if(y<oy-10&&x>W-110){gen();}},
    up(id,x,y,i){if(anim)return;const d=swipeDir(i);if(!d)return;const[dc,dr]={L:[-1,0],R:[1,0],U:[0,-1],D:[0,1]}[d];let c=ball.c,r=ball.r;const path=[];while(free(c+dc,r+dr)){c+=dc;r+=dr;path.push(r*C+c);}if(path.length)anim={path,t:0};},
    draw(){ctx.fillStyle='#1d1d24';ctx.fillRect(0,0,W,H);T(`Nivel ${persist.mp.lvl}`,20,oy-28,24,'#fff','left');T('↻ Nuevo',W-20,oy-28,20,'#ffe066','right');
      for(let r=0;r<R;r++)for(let c=0;c<C;c++){const i=r*C+c,x=ox+c*cs,y=oy+r*cs;if(g[i]){ctx.fillStyle='#34343f';ctx.fillRect(x,y,cs,cs);}else{ctx.fillStyle=paint.has(i)?'#e94e77':'#c9c9d6';ctx.fillRect(x+1,y+1,cs-2,cs-2);}}
      circle(ox+(ball.c+.5)*cs,oy+(ball.r+.5)*cs,cs*.36,'#fff');T('Desliza para mover la bola y pintar todo',W/2,H-24,16,'rgba(255,255,255,.6)');}
  };
},{cd:false,solo:true});
