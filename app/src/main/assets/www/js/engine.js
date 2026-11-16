"use strict";
/* ===== Motor común de TotaVado Games ===== */
const $=s=>document.querySelector(s);
const cv=$('#cv'),ctx=cv.getContext('2d');
let W=innerWidth,H=innerHeight,DPR=1;
// Jugador 0 = AZUL (abajo) · Jugador 1 = ROJO (arriba)
const BLUE='#22b8f0',RED='#f2554d',COL=[BLUE,RED],NAMES=['AZUL','ROJO'];
const DARK=['#123a57','#5a1c22'],LIGHT=['#8fdcfa','#ffa39d'];
const FONT='Lilita,system-ui,Roboto,sans-serif';
let G=null,ended=false,paused=false,cdT=0,last=0,gen=0,wins=[0,0],champ=null;
const persist={};

function load(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v;}catch(e){return d;}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
const SET=load('tv_set',{snd:true,vib:true});
let TOT=load('tv_tot',[0,0]);

/* ---------- utilidades ---------- */
const clamp=(v,a,b)=>v<a?a:v>b?b:v, rnd=(a,b)=>a+Math.random()*(b-a), ri=(a,b)=>Math.floor(rnd(a,b+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const sideOf=y=>y>H/2?0:1;
const local=(p,x,y)=>p==0?{x,y}:{x:W-x,y:H-y};
const inR=(q,x,y,w,h)=>q.x>=x&&q.x<=x+w&&q.y>=y&&q.y<=y+h;
function inHalf(p,fn){ctx.save();if(p==1){ctx.translate(W,H);ctx.rotate(Math.PI);}fn();ctx.restore();}
function halves(a,b){ctx.fillStyle=b||DARK[1];ctx.fillRect(0,0,W,H/2);ctx.fillStyle=a||DARK[0];ctx.fillRect(0,H/2,W,H-H/2);}
function rrect(x,y,w,h,r){ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x,y,w,h,r);else ctx.rect(x,y,w,h);}
function circle(x,y,r,c){ctx.beginPath();ctx.arc(x,y,Math.max(0,r),0,Math.PI*2);ctx.fillStyle=c;ctx.fill();}
function ring(x,y,r,c,lw){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.strokeStyle=c;ctx.lineWidth=lw||3;ctx.stroke();}
function T(s,x,y,size,color,align){ctx.font=`${size}px ${FONT}`;ctx.fillStyle=color;ctx.textAlign=align||'center';ctx.textBaseline='middle';ctx.fillText(s,x,y);}
function TS(s,x,y,size,color){ctx.font=`${size}px ${FONT}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillText(s,x,y+size*.08);ctx.fillStyle=color;ctx.fillText(s,x,y);}
function E(s,x,y,size,rot){ctx.save();ctx.translate(x,y);if(rot)ctx.rotate(rot);ctx.font=`${size}px system-ui,"Noto Color Emoji",sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,0,size*.05);ctx.restore();}
function TP(p,s,y,size,color){inHalf(p,()=>TS(s,W/2,y,size,color));}
function btn(x,y,w,h,label,bg,fg,size){ctx.fillStyle='rgba(0,0,0,.3)';rrect(x,y+4,w,h,Math.min(18,h/3));ctx.fill();ctx.fillStyle=bg;rrect(x,y,w,h,Math.min(18,h/3));ctx.fill();T(label,x+w/2,y+h/2+1,size||Math.min(28,h*.45),fg||'#fff');}
function turnLabels(turn,y,on,off){for(let p=0;p<2;p++)TP(p,turn==p?on:(off||'Espera...'),y,turn==p?28:19,turn==p?'#fff':'rgba(255,255,255,.45)');}
function scoreSide(sc,x){inHalf(0,()=>TS(String(sc[0]),x||W-28,H/2+34,32,BLUE));inHalf(1,()=>TS(String(sc[1]),x||W-28,H/2+34,32,RED));}
function later(fn,ms){const g=gen;setTimeout(()=>{if(g===gen&&!ended)fn();},ms);}
let AC=null;
function beep(f=440,d=.08,type='square',v=.05){if(!SET.snd)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(v,AC.currentTime);g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+d);o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+d+.02);}catch(e){}}
function buzz(ms){if(!SET.vib)return;try{navigator.vibrate&&navigator.vibrate(ms);}catch(e){}}

/* Joysticks virtuales: uno por jugador en su mitad */
function Joys(R){R=R||60;const j=[null,null];return{j,
  down(id,x,y){const p=sideOf(y);if(!j[p])j[p]={id,ax:x,ay:y,x,y};},
  move(id,x,y){for(const k of j)if(k&&k.id===id){k.x=x;k.y=y;}},
  up(id){for(let p=0;p<2;p++)if(j[p]&&j[p].id===id)j[p]=null;},
  vec(p){const k=j[p];if(!k)return{x:0,y:0};let dx=k.x-k.ax,dy=k.y-k.ay;const l=Math.hypot(dx,dy);if(l>R){dx*=R/l;dy*=R/l;}return{x:dx/R,y:dy/R};},
  draw(){j.forEach((k,p)=>{if(!k)return;ring(k.ax,k.ay,R,'rgba(255,255,255,.5)',3);const v=this.vec(p);circle(k.ax+v.x*R,k.ay+v.y*R,22,COL[p]);ring(k.ax+v.x*R,k.ay+v.y*R,22,'#fff',2);});}};}

/* Física de discos (billar, chapas, sumo...) */
function collide(a,b,e){const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),md=a.r+b.r;if(d>=md||d===0)return false;
  const nx=dx/d,ny=dy/d,ma=a.m||1,mb=b.m||1,ov=md-d;a.x-=nx*ov*mb/(ma+mb);a.y-=ny*ov*mb/(ma+mb);b.x+=nx*ov*ma/(ma+mb);b.y+=ny*ov*ma/(ma+mb);
  const rv=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(rv>=0)return false;const imp=-(1+e)*rv/(1/ma+1/mb);a.vx-=imp/ma*nx;a.vy-=imp/ma*ny;b.vx+=imp/mb*nx;b.vy+=imp/mb*ny;return Math.abs(rv);}
function moveDiscs(ds,dt,fr){for(const d of ds){if(d.gone)continue;d.x+=d.vx*dt;d.y+=d.vy*dt;const f=Math.pow(fr,dt);d.vx*=f;d.vy*=f;if(d.vx*d.vx+d.vy*d.vy<36){d.vx=0;d.vy=0;}}}
function collideAll(ds,e){let hit=0;for(let i=0;i<ds.length;i++)for(let k=i+1;k<ds.length;k++){if(ds[i].gone||ds[k].gone)continue;const h=collide(ds[i],ds[k],e);if(h)hit=Math.max(hit,h);}return hit;}
function bounceBox(d,x0,y0,x1,y1,e){let h=false;if(d.x<x0+d.r){d.x=x0+d.r;d.vx=Math.abs(d.vx)*e;h=true;}if(d.x>x1-d.r){d.x=x1-d.r;d.vx=-Math.abs(d.vx)*e;h=true;}
  if(d.y<y0+d.r){d.y=y0+d.r;d.vy=Math.abs(d.vy)*e;h=true;}if(d.y>y1-d.r){d.y=y1-d.r;d.vy=-Math.abs(d.vy)*e;h=true;}return h;}
const allStill=ds=>ds.every(d=>d.gone||(d.vx===0&&d.vy===0));

/* ---------- registro de juegos ---------- */
const GAMES=[];
// def(id, nombre, emoji, color, fábrica, opciones{cd:false para juegos por turnos})
function def(id,name,emoji,color,make,opts){GAMES.push(Object.assign({id,name,emoji,color,make,cd:true},opts||{}));}

/* ---------- bucle principal ---------- */
function resize(){DPR=window.devicePixelRatio||1;W=innerWidth;H=innerHeight;cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);ctx.setTransform(DPR,0,0,DPR,0,0);if(G&&G.resize)G.resize();}
addEventListener('resize',resize);

function start(id){
  const d=GAMES.find(g=>g.id==id);gen++;
  $('#menu').style.display='none';$('#over').style.display='none';$('#conf').style.display='none';$('#game').style.display='block';
  resize();G=d.make();G.def=d;ended=false;paused=false;cdT=d.cd?3:0;ptrs.clear();G.init&&G.init();
}
function toMenu(){gen++;G=null;champ=null;$('#game').style.display='none';$('#over').style.display='none';$('#conf').style.display='none';$('#menu').style.display='flex';refreshScores();}

function loop(t){
  requestAnimationFrame(loop);const dt=Math.min(.033,Math.max(0,(t-last)/1000));last=t;if(!G)return;
  if(!paused&&!ended){if(cdT>0){const b=Math.ceil(cdT);cdT-=dt;if(cdT<=0)beep(990,.18,'square',.06);else if(Math.ceil(cdT)<b)beep(520,.08,'square',.05);}else G.update&&G.update(dt);}
  ctx.save();G.draw();ctx.restore();
  if(cdT>0&&!ended){ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(0,0,W,H);const n=String(Math.ceil(cdT)),np=G.def.solo?1:2;for(let p=0;p<np;p++){TP(p,n,H*.72,110,'#fff');if(G.def.help)TP(p,G.def.help,H*.88,19,'#ffe066');}}
}
requestAnimationFrame(loop);

const ptrs=new Set(),pinfo=new Map();
cv.addEventListener('pointerdown',e=>{e.preventDefault();try{cv.setPointerCapture(e.pointerId);}catch(_){}ptrs.add(e.pointerId);pinfo.set(e.pointerId,{x:e.clientX,y:e.clientY,t:performance.now()});if(G&&!paused&&!ended&&G.down)G.down(e.pointerId,e.clientX,e.clientY,cdT<=0);});
cv.addEventListener('pointermove',e=>{if(G&&!paused&&!ended&&G.move&&ptrs.has(e.pointerId))G.move(e.pointerId,e.clientX,e.clientY);});
const upH=e=>{ptrs.delete(e.pointerId);const i=pinfo.get(e.pointerId)||{x:e.clientX,y:e.clientY,t:performance.now()};pinfo.delete(e.pointerId);
  if(G&&G.up&&!paused&&!ended)G.up(e.pointerId,e.clientX,e.clientY,{sx:i.x,sy:i.y,dx:e.clientX-i.x,dy:e.clientY-i.y,ms:performance.now()-i.t});};
cv.addEventListener('pointerup',upH);cv.addEventListener('pointercancel',upH);
document.addEventListener('contextmenu',e=>e.preventDefault());

/* ---------- final de partida y torneo ---------- */
let ovActions=[];
function halfHTML(title,color,sub,sc,btns){return `<div class="res" style="color:${color}">${title}</div>${sub?`<div class="msg">${sub}</div>`:''}<div class="sc">${sc}</div><div class="btns">${btns.map((b,i)=>`<button data-a="${i}" class="${i?'alt':''}">${b.t}</button>`).join('')}</div>`;}
function showOver(w,msg,sc,btns,titles){
  ovActions=btns;
  const t=p=>titles?titles[p]:(w<0?'¡Empate!':w==p?'¡HAS GANADO!':'Has perdido');
  const c=w<0?'#fff':COL[w];
  $('#ovBot').innerHTML=halfHTML(t(0),c,msg,sc,btns);$('#ovTop').innerHTML=halfHTML(t(1),c,msg,sc,btns);
  $('#over').style.display='flex';
}
$('#over').addEventListener('click',e=>{const b=e.target.closest('button');if(b)ovActions[+b.dataset.a].fn();});

function endRound(w,msg){
  if(ended||!G)return;ended=true;buzz([60,40,60]);beep(w<0?400:784,.3,'triangle',.08);
  if(w>=0){TOT[w]++;save('tv_tot',TOT);}
  if(champ){if(w>=0)champ.pts[w]++;const lastOne=champ.idx>=champ.list.length-1;
    const sc=`Torneo: Azul ${champ.pts[0]} – ${champ.pts[1]} Rojo · ${champ.idx+1}/${champ.list.length}`;
    setTimeout(()=>showOver(w,msg,sc,[{t:lastOne?'🏆 Ver campeón':'Siguiente ▶',fn:lastOne?champEnd:()=>{champ.idx++;start(champ.list[champ.idx]);}},{t:'Menú',fn:toMenu}]),500);
  }else{if(w>=0)wins[w]++;
    setTimeout(()=>showOver(w,msg,`Azul ${wins[0]} – ${wins[1]} Rojo`,[{t:'Revancha',fn:()=>start(G.def.id)},{t:'Menú',fn:toMenu}]),500);}
}
function champStart(){const ids=shuffle(GAMES.filter(g=>!g.solo&&(!window.ageOK||ageOK(g))).map(g=>g.id)).slice(0,5);champ={list:ids,idx:0,pts:[0,0]};start(ids[0]);}
function champEnd(){const p=champ.pts,w=p[0]==p[1]?-1:p[0]>p[1]?0:1;
  const titles=w<0?['🤝 ¡Empate!','🤝 ¡Empate!']:[w==0?'🏆 ¡CAMPEÓN!':'Rojo es el campeón',w==1?'🏆 ¡CAMPEÓN!':'Azul es el campeón'];
  showOver(w,'Final del torneo',`Azul ${p[0]} – ${p[1]} Rojo`,[{t:'Otro torneo',fn:champStart},{t:'Menú',fn:toMenu}],titles);}
function refreshScores(){$('#scB').textContent=TOT[0];$('#scR').textContent=TOT[1];}

/* Juegos de 1 jugador */
function endSolo(ok,msg){if(ended||!G)return;ended=true;beep(ok?784:200,.3,'triangle',.08);buzz(ok?[40,40,40]:120);
  setTimeout(()=>{ovActions=[{t:ok?'Siguiente':'Otra vez',fn:()=>start(G.def.id)},{t:'Menú',fn:toMenu}];$('#ovTop').innerHTML='';
    $('#ovBot').innerHTML=halfHTML(ok?'¡Conseguido!':'¡Fin de la partida!',ok?'#7CFC9A':'#fff',msg,'',ovActions);$('#over').style.display='flex';},500);}
/* Utilidades geométricas y aleatorio con semilla (para que las dos mitades vean lo mismo) */
function segPt(px,py,ax,ay,bx,by){const vx=bx-ax,vy=by-ay,l2=vx*vx+vy*vy||1;let t=((px-ax)*vx+(py-ay)*vy)/l2;t=clamp(t,0,1);const cx=ax+vx*t,cy=ay+vy*t;return{d:Math.hypot(px-cx,py-cy),x:cx,y:cy,t};}
function seeded(seed){let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
function swipeDir(i){if(Math.hypot(i.dx,i.dy)<25)return null;return Math.abs(i.dx)>Math.abs(i.dy)?(i.dx>0?'R':'L'):(i.dy>0?'D':'U');}
function bar(x,y,w,h,f,c){ctx.fillStyle='rgba(0,0,0,.35)';rrect(x,y,w,h,h/2);ctx.fill();ctx.fillStyle=c;rrect(x,y,Math.max(h,w*clamp(f,0,1)),h,h/2);ctx.fill();}
function hearts(n,x,y,s){for(let i=0;i<n;i++)E('❤️',x+i*s*1.1,y,s);}
