"use strict";
/* Juegos de mesa, por turnos y de mesa de billar */

/* PIEDRA, PAPEL O TIJERA */
def('rps','Piedra, papel o tijera','✌️','#3aa64a',()=>{
  const O=['✊','✋','✌️'],NM=['Piedra','Papel','Tijera'];let ch=[null,null],sc=[0,0],ph='pick',t=0,res=-1;const PTS=3;
  const bs=()=>Math.min(W*.26,H*.12),bx=i=>W/2+(i-1)*W*.3-bs()/2,by=()=>H*.8-bs()/2;
  return{score:()=>sc,
    update(dt){if(ph=='show'){t+=dt;if(t>1.7){if(Math.max(...sc)>=PTS)endRound(sc[0]>sc[1]?0:1,`${sc[0]} – ${sc[1]}`);else{ch=[null,null];ph='pick';}}}},
    down(id,x,y,live){if(!live||ph!='pick')return;const p=sideOf(y),l=local(p,x,y);if(ch[p]!=null)return;
      for(let i=0;i<3;i++)if(inR(l,bx(i),by(),bs(),bs())){ch[p]=i;beep(500,.05,'square',.05);}
      if(ch[0]!=null&&ch[1]!=null){const d=(ch[0]-ch[1]+3)%3;res=d==0?-1:d==1?0:1;if(res>=0)sc[res]++;ph='show';t=0;beep(res<0?400:800,.2,'triangle',.08);}},
    draw(){halves('#2c7a37','#2c7a37');ctx.fillStyle='rgba(255,255,255,.25)';ctx.fillRect(0,H/2-1,W,2);
      for(let p=0;p<2;p++)inHalf(p,()=>{TS(String(sc[p]),W*.12,H*.58,42,COL[p]);
        if(ph=='pick'){if(ch[p]==null){TS('Elige en secreto',W/2,H*.62,24,'#fff');for(let i=0;i<3;i++){ctx.fillStyle='#fff';rrect(bx(i),by(),bs(),bs(),18);ctx.fill();E(O[i],bx(i)+bs()/2,by()+bs()/2,bs()*.6);}}
          else TS('✔ Elegido · esperando al otro',W/2,H*.75,22,'#ffe066');}
        else{E(O[ch[p]],W/2,H*.6,H*.13);TS(NM[ch[p]],W/2,H*.73,24,'#fff');TS(res<0?'¡Empate!':res==p?'¡Ganas la ronda!':'Pierdes la ronda',W/2,H*.85,28,res<0?'#fff':res==p?'#7CFC9A':'#ffb4ab');}});}
  };
},{help:'Al mejor de 5 (gana quien llega a 3)'});

/* MEMORIA */
def('memory','Memoria','🃏','#a5573a',()=>{
  const POOL=['🐟','🐶','🐱','🦊','🐼','🐸','🦁','🐵','🐔','🐙','🦋','🐞','🐢','🦀'];
  let cards,turn=0,sel=[],wait=0,sc=[0,0],cs,ox,oy;const C=4,R=5;
  const geo=()=>{cs=Math.min(W*.94/C,H*.6/R);ox=(W-cs*C)/2;oy=(H-cs*R)/2;};
  return{score:()=>sc,
    init(){geo();const e=shuffle(POOL.slice()).slice(0,C*R/2);cards=shuffle([...e,...e]).map(x=>({e:x,open:false,own:-1}));},resize:geo,
    update(dt){if(wait>0){wait-=dt;if(wait<=0){for(const i of sel)cards[i].open=false;sel=[];turn^=1;}}},
    down(id,x,y){if(wait>0||sel.length>=2)return;const c=Math.floor((x-ox)/cs),r=Math.floor((y-oy)/cs);if(c<0||c>=C||r<0||r>=R)return;const i=r*C+c,k=cards[i];if(k.open||k.own>=0)return;
      k.open=true;sel.push(i);beep(600,.04,'sine',.06);
      if(sel.length==2){const[a,b]=sel;if(cards[a].e==cards[b].e){cards[a].own=cards[b].own=turn;sc[turn]++;sel=[];beep(900,.12,'sine',.1);
        if(cards.every(k=>k.own>=0)){const w=sc[0]==sc[1]?-1:sc[0]>sc[1]?0:1;later(()=>endRound(w,`${sc[0]} – ${sc[1]} parejas`),600);}}else wait=1;}},
    draw(){halves('#6e3a26','#6e3a26');
      cards.forEach((k,i)=>{const x=ox+(i%C)*cs+4,y=oy+Math.floor(i/C)*cs+4,s=cs-8;
        if(k.own>=0){ctx.fillStyle=COL[k.own];rrect(x,y,s,s,12);ctx.fill();E(k.e,x+s/2,y+s/2,s*.55,k.own?Math.PI:0);}
        else if(k.open){ctx.fillStyle='#fff';rrect(x,y,s,s,12);ctx.fill();E(k.e,x+s/2,y+s/2,s*.6);}
        else{ctx.fillStyle='#f4b63a';rrect(x,y,s,s,12);ctx.fill();ctx.strokeStyle='#c98a17';ctx.lineWidth=4;ctx.stroke();T('?',x+s/2,y+s/2,s*.45,'#fff');}});
      const my=(oy)/2;for(let p=0;p<2;p++)inHalf(p,()=>{TS(turn==p?'¡Tu turno!':'Espera...',W/2,H-my,turn==p?28:19,turn==p?'#fff':'rgba(255,255,255,.45)');TS(String(sc[p]),W*.1,H-my,32,COL[p]);});}
  };
},{cd:false});

/* DAMAS */
def('checkers','Damas','⚪','#1f8fb8',()=>{
  let b,turn=0,sel=null,forced=null,moves=[],s,ox,oy,c;
  const geo=()=>{s=Math.min(W*.96,H*.62);c=s/8;ox=(W-s)/2;oy=(H-s)/2;};
  const at=(r,k)=>r>=0&&r<8&&k>=0&&k<8?b[r][k]:undefined;
  const dirs=pc=>pc.k?[[1,1],[1,-1],[-1,1],[-1,-1]]:pc.p==0?[[-1,-1],[-1,1]]:[[1,-1],[1,1]];
  function caps(r,k){const pc=b[r][k],o=[];for(const[dr,dc]of dirs(pc)){const m=at(r+dr,k+dc),t=at(r+2*dr,k+2*dc);if(m&&m.p!=pc.p&&t===null)o.push({r:r+2*dr,c:k+2*dc,cap:[r+dr,k+dc]});}return o;}
  function steps(r,k){const o=[];for(const[dr,dc]of dirs(b[r][k]))if(at(r+dr,k+dc)===null)o.push({r:r+dr,c:k+dc});return o;}
  function anyCap(p){for(let r=0;r<8;r++)for(let k=0;k<8;k++)if(b[r][k]&&b[r][k].p==p&&caps(r,k).length)return true;return false;}
  function legal(r,k){if(forced)return forced[0]==r&&forced[1]==k?caps(r,k):[];return anyCap(b[r][k].p)?caps(r,k):steps(r,k);}
  function hasMoves(p){for(let r=0;r<8;r++)for(let k=0;k<8;k++)if(b[r][k]&&b[r][k].p==p&&legal(r,k).length)return true;return false;}
  return{
    init(){geo();b=[];for(let r=0;r<8;r++){b.push([]);for(let k=0;k<8;k++)b[r].push((r+k)%2==1&&r<3?{p:1,k:false}:(r+k)%2==1&&r>4?{p:0,k:false}:null);}},resize:geo,
    down(id,x,y){const k=Math.floor((x-ox)/c),r=Math.floor((y-oy)/c);if(r<0||r>7||k<0||k>7)return;const pc=b[r][k];
      if(pc&&pc.p==turn){const m=legal(r,k);if(m.length){sel=[r,k];moves=m;beep(500,.03,'sine',.05);}return;}
      if(!sel)return;const mv=moves.find(m=>m.r==r&&m.c==k);if(!mv)return;
      const piece=b[sel[0]][sel[1]];b[sel[0]][sel[1]]=null;b[r][k]=piece;let prom=false;
      if(mv.cap){b[mv.cap[0]][mv.cap[1]]=null;beep(300,.08,'square',.07);}else beep(420,.04,'sine',.06);
      if(!piece.k&&((piece.p==0&&r==0)||(piece.p==1&&r==7))){piece.k=true;prom=true;}
      if(mv.cap&&!prom&&caps(r,k).length){forced=[r,k];sel=[r,k];moves=caps(r,k);return;}
      forced=null;sel=null;moves=[];turn^=1;
      if(!hasMoves(turn)){const w=1-turn;later(()=>endRound(w,'¡Sin movimientos para el rival!'),500);}},
    draw(){ctx.fillStyle='#d98d74';ctx.fillRect(0,0,W,H);ctx.fillStyle=INK;rrect(ox-10,oy-10,s+20,s+20,8);ctx.fill();
      for(let r=0;r<8;r++)for(let k=0;k<8;k++){ctx.fillStyle=(r+k)%2?'#6e4a3a':'#f4f1ea';ctx.fillRect(ox+k*c,oy+r*c,c,c);}
      if(sel){ctx.fillStyle='rgba(255,230,0,.45)';ctx.fillRect(ox+sel[1]*c,oy+sel[0]*c,c,c);for(const m of moves)circle(ox+(m.c+.5)*c,oy+(m.r+.5)*c,c*.16,'rgba(255,255,255,.8)');}
      for(let r=0;r<8;r++)for(let k=0;k<8;k++){const pc=b[r][k];if(!pc)continue;const x=ox+(k+.5)*c,y=oy+(r+.5)*c;circle(x,y+3,c*.4,'rgba(0,0,0,.35)');circle(x,y,c*.4,INK);circle(x,y,c*.33,COL[pc.p]);ring(x,y,c*.2,'rgba(255,255,255,.45)',3);if(pc.k)E('👑',x,y,c*.4,pc.p?Math.PI:0);}
      turnLabels(turn,H/2+s/2+(H/2-s/2)/2,forced?'¡Sigue comiendo!':'¡Tu turno!');}
  };
},{cd:false});

/* AJEDREZ (reglas completas: enroque, al paso, coronación a dama) */
def('chess','Ajedrez','♞','#e7b43a',()=>{
  const GL={k:'♚',q:'♛',r:'♜',b:'♝',n:'♞',p:'♟'};
  let B,turn=0,sel=-1,moves=[],ep=-1,cr,lastM=null,s,ox,oy,cs,check=false;
  const geo=()=>{s=Math.min(W*.97,H*.62);cs=s/8;ox=(W-s)/2;oy=(H-s)/2;};
  const fwd=c=>c==0?-1:1;
  function pseudo(B,i,ep,cr,att){const p=B[i],r=i>>3,c=i&7,o=[];
    const ok=(rr,cc)=>rr>=0&&rr<8&&cc>=0&&cc<8;
    const slide=(ds,one)=>{for(const[dr,dc]of ds){let rr=r+dr,cc=c+dc;while(ok(rr,cc)){const q=B[rr*8+cc];if(!q)o.push(rr*8+cc);else{if(q.c!=p.c||att)o.push(rr*8+cc);break;}if(one)break;rr+=dr;cc+=dc;}}};
    const D=[[1,1],[1,-1],[-1,1],[-1,-1]],S=[[1,0],[-1,0],[0,1],[0,-1]];
    if(p.t=='p'){const d=fwd(p.c);for(const dc of[-1,1]){const rr=r+d,cc=c+dc;if(!ok(rr,cc))continue;const q=B[rr*8+cc];if(att||(q&&q.c!=p.c)||rr*8+cc===ep)o.push(rr*8+cc);}
      if(!att&&ok(r+d,c)&&!B[(r+d)*8+c]){o.push((r+d)*8+c);const sr=p.c==0?6:1;if(r==sr&&!B[(r+2*d)*8+c])o.push((r+2*d)*8+c);}}
    else if(p.t=='n'){for(const[dr,dc]of[[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]]){const rr=r+dr,cc=c+dc;if(ok(rr,cc)){const q=B[rr*8+cc];if(!q||q.c!=p.c||att)o.push(rr*8+cc);}}}
    else if(p.t=='b')slide(D);else if(p.t=='r')slide(S);else if(p.t=='q')slide(D.concat(S));
    else if(p.t=='k'){slide(D.concat(S),true);
      if(!att&&cr&&!attacked(B,i,1-p.c)){const row=p.c==0?7:0;if(r==row&&c==4){
        if(cr[p.c].k&&!B[row*8+5]&&!B[row*8+6]&&B[row*8+7]&&B[row*8+7].t=='r'&&!attacked(B,row*8+5,1-p.c)&&!attacked(B,row*8+6,1-p.c))o.push(row*8+6);
        if(cr[p.c].q&&!B[row*8+3]&&!B[row*8+2]&&!B[row*8+1]&&B[row*8]&&B[row*8].t=='r'&&!attacked(B,row*8+3,1-p.c)&&!attacked(B,row*8+2,1-p.c))o.push(row*8+2);}}}
    return o;}
  function attacked(B,sq,by){for(let i=0;i<64;i++){const q=B[i];if(q&&q.c==by&&pseudo(B,i,-1,null,true).includes(sq))return true;}return false;}
  const kingSq=(B,c)=>B.findIndex(q=>q&&q.t=='k'&&q.c==c);
  function apply(B,f,t){const n=B.slice(),p=n[f];n[t]={t:p.t,c:p.c};n[f]=null;
    if(p.t=='p'&&(f&7)!=(t&7)&&!B[t])n[(f&~7)|(t&7)]=null;
    if(p.t=='k'&&Math.abs((t&7)-(f&7))==2){const row=t&~7;if((t&7)==6){n[row+5]=n[row+7];n[row+7]=null;}else{n[row+3]=n[row];n[row]=null;}}
    if(p.t=='p'&&((t>>3)==0||(t>>3)==7))n[t]={t:'q',c:p.c};return n;}
  const legal=i=>pseudo(B,i,ep,cr,false).filter(t=>{const n=apply(B,i,t);return!attacked(n,kingSq(n,B[i].c),1-B[i].c);});
  const anyLegal=c=>{for(let i=0;i<64;i++)if(B[i]&&B[i].c==c&&legal(i).length)return true;return false;};
  return{
    init(){geo();const back=['r','n','b','q','k','b','n','r'];B=Array(64).fill(null);for(let c=0;c<8;c++){B[c]={t:back[c],c:1};B[8+c]={t:'p',c:1};B[48+c]={t:'p',c:0};B[56+c]={t:back[c],c:0};}cr=[{k:true,q:true},{k:true,q:true}];},resize:geo,
    down(id,x,y){const c=Math.floor((x-ox)/cs),r=Math.floor((y-oy)/cs);if(r<0||r>7||c<0||c>7)return;const i=r*8+c,q=B[i];
      if(q&&q.c==turn){sel=i;moves=legal(i);beep(500,.03,'sine',.05);return;}
      if(sel<0||!moves.includes(i))return;const p=B[sel],cap=!!B[i]||(p.t=='p'&&(sel&7)!=c);
      B=apply(B,sel,i);
      if(p.t=='k')cr[p.c]={k:false,q:false};
      for(const sq of[sel,i]){if(sq==63)cr[0].k=false;if(sq==56)cr[0].q=false;if(sq==7)cr[1].k=false;if(sq==0)cr[1].q=false;}
      ep=p.t=='p'&&Math.abs(i-sel)==16?(i+sel)/2:-1;lastM=[sel,i];sel=-1;moves=[];turn^=1;
      check=attacked(B,kingSq(B,turn),1-turn);beep(cap?300:440,.07,cap?'square':'sine',.07);
      if(!anyLegal(turn)){if(check){const w=1-turn;later(()=>endRound(w,'¡Jaque mate!'),600);}else later(()=>endRound(-1,'Rey ahogado: tablas'),600);}},
    draw(){halves();ctx.fillStyle='#5b3a1c';rrect(ox-8,oy-8,s+16,s+16,12);ctx.fill();
      for(let i=0;i<64;i++){const r=i>>3,c=i&7;ctx.fillStyle=(r+c)%2?'#b58863':'#f0d9b5';if(lastM&&lastM.includes(i))ctx.fillStyle=(r+c)%2?'#c9a14a':'#efd98a';if(i==sel)ctx.fillStyle='#ffe066';ctx.fillRect(ox+c*cs,oy+r*cs,cs,cs);}
      if(check){const k=kingSq(B,turn);circle(ox+((k&7)+.5)*cs,oy+((k>>3)+.5)*cs,cs*.48,'rgba(255,0,0,.45)');}
      for(const m of moves){const x=ox+((m&7)+.5)*cs,y=oy+((m>>3)+.5)*cs;if(B[m])ring(x,y,cs*.44,'rgba(0,0,0,.35)',5);else circle(x,y,cs*.15,'rgba(0,0,0,.3)');}
      ctx.font=`${cs*.82}px "Noto Sans Symbols 2","Segoe UI Symbol","DejaVu Sans",serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';
      for(let i=0;i<64;i++){const q=B[i];if(!q)continue;const x=ox+((i&7)+.5)*cs,y=oy+((i>>3)+.5)*cs;ctx.save();ctx.translate(x,y);if(q.c==1)ctx.rotate(Math.PI);
        const g=GL[q.t]+'︎';ctx.lineWidth=cs*.09;ctx.strokeStyle='#1b1b1b';ctx.strokeText(g,0,cs*.04);ctx.fillStyle=COL[q.c];ctx.fillText(g,0,cs*.04);ctx.restore();}
      turnLabels(turn,H/2+s/2+(H/2-s/2)/2,check?'¡Jaque! Tu turno':'¡Tu turno!');}
  };
},{cd:false});

/* BATALLA NAVAL */
def('naval','Sea battle','🚢','#264b73',()=>{
  const N=7,SHIPS=[4,3,3,2,2];let fleet=[[],[]],shots=[[],[]],turn=0,wait=0,gs,cell,gx,gy,flash=null;
  function place(){const g=Array(N*N).fill(-1);SHIPS.forEach((len,id)=>{for(;;){const h=Math.random()<.5,r=ri(0,h?N-1:N-len),c=ri(0,h?N-len:N-1);const cells=[];for(let k=0;k<len;k++)cells.push(h?r*N+c+k:(r+k)*N+c);if(cells.every(i=>g[i]<0)){cells.forEach(i=>g[i]=id);break;}}});return g;}
  const geo=()=>{gs=Math.min(W*.88,H*.38);cell=gs/N;gx=W/2-gs/2;gy=H*.56;};
  const sunk=(p,id)=>fleet[1-p].every((v,i)=>v!=id||shots[p][i]==2);
  const left=p=>SHIPS.filter((_,id)=>!sunk(p,id)).length;
  return{
    init(){geo();for(let p=0;p<2;p++){fleet[p]=place();shots[p]=Array(N*N).fill(0);}},resize:geo,
    update(dt){if(wait>0){wait-=dt;if(wait<=0)turn^=1;}if(flash)flash.t-=dt;},
    down(id,x,y){if(wait>0)return;const p=sideOf(y);if(p!=turn)return;const l=local(p,x,y);const c=Math.floor((l.x-gx)/cell),r=Math.floor((l.y-gy)/cell);if(c<0||c>=N||r<0||r>=N)return;
      const i=r*N+c;if(shots[p][i])return;const hit=fleet[1-p][i]>=0;shots[p][i]=hit?2:1;
      if(hit){const sk=sunk(p,fleet[1-p][i]);flash={p,t:1,m:sk?'¡Hundido!':'¡Tocado! Repites'};beep(sk?200:700,.25,'sawtooth',.08);buzz(sk?150:60);
        if(left(p)==0)later(()=>endRound(p,'¡Flota enemiga hundida!'),800);}
      else{flash={p,t:.8,m:'Agua'};beep(250,.1,'sine',.06);wait=.8;}},
    draw(){halves('#0e3a5c','#0e3a5c');ctx.fillStyle='rgba(255,255,255,.25)';ctx.fillRect(0,H/2-1,W,2);
      for(let p=0;p<2;p++)inHalf(p,()=>{ctx.fillStyle='#1f6fa8';rrect(gx-4,gy-4,gs+8,gs+8,10);ctx.fill();
        for(let i=0;i<N*N;i++){const x=gx+(i%N)*cell,y=gy+Math.floor(i/N)*cell,v=shots[p][i];ctx.strokeStyle='rgba(255,255,255,.25)';ctx.lineWidth=1;ctx.strokeRect(x,y,cell,cell);
          const id=fleet[1-p][i];if(id>=0&&sunk(p,id)){ctx.fillStyle='#4b5563';ctx.fillRect(x+2,y+2,cell-4,cell-4);}
          if(v==1)circle(x+cell/2,y+cell/2,cell*.14,'#cfe8ff');if(v==2)E('🔥',x+cell/2,y+cell/2,cell*.6);}
        TS(turn==p&&wait<=0?'¡Tu turno! Dispara al mar rival':'Espera...',W/2,H*.53-8,turn==p?20:16,turn==p?'#fff':'rgba(255,255,255,.5)');
        TS(`Barcos rivales: ${left(p)}`,W/2,gy+gs+22,18,COL[p]);
        if(flash&&flash.t>0)TS(flash.m,W/2,gy+gs/2,34,flash.p==p?'#ffe066':'rgba(255,255,255,.7)');});}
  };
},{cd:false});

/* PENALTIS */
def('penalty','Penaltis','⚽','#2f8f3a',()=>{
  let k=0,ch=[null,null],ph='pick',t=0,goals=[0,0],hist=[[],[]],last=null,gw,gh,gx,gy;
  const geo=()=>{gw=W*.84;gh=gw*.42;gx=W/2-gw/2;gy=H*.62;};
  const mir=z=>Math.floor(z/3)*3+(2-z%3);
  const zr=z=>({x:gx+(z%3)*gw/3,y:gy+Math.floor(z/3)*gh/2,w:gw/3,h:gh/2});
  function finished(){const a=hist[0].length,b=hist[1].length;if(a<5||b<5){const ra=5-a,rb=5-b;return goals[0]+ra<goals[1]||goals[1]+rb<goals[0];}return a==b&&goals[0]!=goals[1];}
  return{
    init(){geo();},resize:geo,
    update(dt){if(ph=='show'){t+=dt;if(t>1.8){k++;ch=[null,null];ph='pick';if(finished()){const w=goals[0]>goals[1]?0:1;endRound(w,`${goals[0]} – ${goals[1]}`);}}}},
    down(id,x,y,live){if(!live||ph!='pick')return;const p=sideOf(y),l=local(p,x,y);if(ch[p]!=null)return;
      for(let z=0;z<6;z++){const q=zr(z);if(inR(l,q.x,q.y,q.w,q.h)){ch[p]=z;beep(500,.04,'square',.05);}}
      if(ch[0]!=null&&ch[1]!=null){const sh=k%2,kp=1-sh,goal=ch[sh]!=mir(ch[kp]);if(goal)goals[sh]++;hist[sh].push(goal);last={sh,goal};ph='show';t=0;
        beep(goal?900:200,.3,goal?'triangle':'sawtooth',.09);buzz(goal?80:150);}},
    draw(){halves('#2f8f3a','#2f8f3a');ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(0,H/2-2,W,4);const sh=k%2;
      for(let p=0;p<2;p++)inHalf(p,()=>{
        ctx.fillStyle='rgba(255,255,255,.12)';ctx.fillRect(gx,gy,gw,gh);ctx.strokeStyle='rgba(255,255,255,.25)';ctx.lineWidth=1;
        for(let i=1;i<12;i++){ctx.beginPath();ctx.moveTo(gx+i*gw/12,gy);ctx.lineTo(gx+i*gw/12,gy+gh);ctx.stroke();}for(let i=1;i<5;i++){ctx.beginPath();ctx.moveTo(gx,gy+i*gh/5);ctx.lineTo(gx+gw,gy+i*gh/5);ctx.stroke();}
        ctx.strokeStyle='#fff';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(gx,gy+gh);ctx.lineTo(gx,gy);ctx.lineTo(gx+gw,gy);ctx.lineTo(gx+gw,gy+gh);ctx.stroke();
        const shooter=sh==p;
        if(ph=='pick'){if(ch[p]==null){for(let z=0;z<6;z++){const q=zr(z);ctx.strokeStyle='rgba(255,230,100,.8)';ctx.lineWidth=2;ctx.strokeRect(q.x+4,q.y+4,q.w-8,q.h-8);}
            TS(shooter?'⚽ Elige dónde CHUTAS':'🧤 Elige dónde te TIRAS',W/2,gy-26,24,'#fff');}
          else TS('✔ Elegido · esperando...',W/2,gy-26,22,'#ffe066');}
        else{const ballZ=shooter?ch[sh]:mir(ch[sh]),keepZ=shooter?mir(ch[1-sh]):ch[1-sh],b=zr(ballZ),kq=zr(keepZ);
          E('🧤',kq.x+kq.w/2,kq.y+kq.h/2,kq.h*.8);E('⚽',b.x+b.w/2,b.y+b.h/2,b.h*.5);TS(last.goal?'¡GOOOL!':'¡PARADA!',W/2,gy-26,34,last.goal?'#ffe066':'#fff');}
        TS(`${goals[p]}`,W*.1,H*.56,34,COL[p]);
        hist[p].forEach((g,i)=>T(g?'●':'✕',W*.25+i*22,H*.56,20,g?'#7CFC9A':'#ff8a80'));});}
  };
},{cd:false});

/* BILLAR */
def('pool','Billar','🎱','#0f86c4',()=>{
  let x0,y0,x1,y1,tw,th,br,pr,balls,pockets,turn=0,aim=null,moving=false,potted=[],msg='',msgT=0,owner;
  function rack(){const cue={x:W/2,y:y0+th*.75,vx:0,vy:0,r:br,m:1,k:'cue'};const cols=shuffle([0,0,0,0,0,0,0,1,1,1,1,1,1,1]);const list=[cue];let n=0;const ax=W/2,ay=y0+th*.28;
    for(let row=0;row<5;row++)for(let j=0;j<=row;j++){const isBlack=row==2&&j==1;list.push({x:ax+(j-row/2)*br*2.04,y:ay-row*br*1.78,vx:0,vy:0,r:br,m:1,k:isBlack?'8':cols[n++]});}return list;}
  const remaining=p=>balls.filter(b=>!b.gone&&b.k===p).length;
  return{
    init(){tw=Math.min(W*.86,H*.42);th=Math.min(H*.8,tw*2);x0=(W-tw)/2;y0=(H-th)/2;x1=x0+tw;y1=y0+th;br=tw*.034;pr=br*1.85;
      pockets=[[x0,y0],[x1,y0],[x0,(y0+y1)/2],[x1,(y0+y1)/2],[x0,y1],[x1,y1]];balls=rack();owner=[0,1];},
    down(id,x,y){if(moving||aim||sideOf(y)!=turn)return;aim={id,sx:x,sy:y,x,y};},
    move(id,x,y){if(aim&&aim.id===id){aim.x=x;aim.y=y;}},
    up(id){if(!aim||aim.id!==id)return;const dx=aim.sx-aim.x,dy=aim.sy-aim.y,l=Math.hypot(dx,dy);aim=null;if(l<12)return;const pw=Math.min(l,170)/170*1700,cue=balls[0];
      cue.vx=dx/l*pw;cue.vy=dy/l*pw;moving=true;potted=[];beep(200,.05,'square',.08);},
    update(dt){if(msgT>0)msgT-=dt;if(!moving)return;const N=8,h=dt/N;
      for(let s=0;s<N;s++){moveDiscs(balls,h,.42);
        for(const b of balls){if(b.gone)continue;for(const[px,py]of pockets)if(Math.hypot(b.x-px,b.y-py)<pr){b.gone=true;b.vx=b.vy=0;potted.push(b.k);beep(150,.12,'sine',.1);break;}
          if(!b.gone)bounceBox(b,x0,y0,x1,y1,.78);}
        const hit=collideAll(balls,.95);if(hit>300)beep(1200,.02,'sine',Math.min(.08,hit/20000));}
      if(allStill(balls)){moving=false;const me=turn,op=1-turn,cueIn=potted.includes('cue'),blackIn=potted.includes('8');
        if(blackIn){const w=remaining(me)==0&&!cueIn?me:op;later(()=>endRound(w,w==me?'¡Bola negra embocada!':'¡Negra antes de tiempo!'),500);return;}
        if(cueIn){const c=balls[0];c.gone=false;c.x=W/2;c.y=me==0?y0+th*.75:y0+th*.25;msg='¡Falta! Bola blanca dentro';msgT=1.6;turn=op;return;}
        if(potted.includes(me)){msg='¡Bien! Repites tiro';msgT=1.4;}else{turn=op;msg='';}}},
    draw(){halves();ctx.fillStyle='#6b3f1f';rrect(x0-18,y0-18,tw+36,th+36,20);ctx.fill();ctx.fillStyle='#1f9a4c';ctx.fillRect(x0,y0,tw,th);
      ctx.strokeStyle='rgba(255,255,255,.18)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0,y0+th*.75);ctx.lineTo(x1,y0+th*.75);ctx.stroke();
      for(const[px,py]of pockets)circle(px,py,pr,'#111');
      for(const b of balls){if(b.gone)continue;const c=b.k=='cue'?'#fafafa':b.k=='8'?'#111':COL[b.k];circle(b.x,b.y+2,b.r,'rgba(0,0,0,.3)');circle(b.x,b.y,b.r,c);circle(b.x-b.r*.3,b.y-b.r*.3,b.r*.3,'rgba(255,255,255,.45)');if(b.k=='8')T('8',b.x,b.y+1,b.r,'#fff');}
      if(aim){const c=balls[0],dx=aim.sx-aim.x,dy=aim.sy-aim.y,l=Math.hypot(dx,dy)||1,pw=Math.min(l,170);ctx.strokeStyle='rgba(255,255,255,.75)';ctx.setLineDash([8,8]);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(c.x,c.y);ctx.lineTo(c.x+dx/l*H*.5,c.y+dy/l*H*.5);ctx.stroke();ctx.setLineDash([]);
        ctx.strokeStyle='#d9a25b';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(c.x-dx/l*(br+8+pw*.4),c.y-dy/l*(br+8+pw*.4));ctx.lineTo(c.x-dx/l*(br+8+pw*.4+H*.25),c.y-dy/l*(br+8+pw*.4+H*.25));ctx.stroke();}
      for(let p=0;p<2;p++)inHalf(p,()=>{const my=(y1+18+H)/2;TS(turn==p&&!moving?'¡Tu turno! Arrastra hacia atrás y suelta':moving?'...':'Espera...',W/2,my-10,turn==p?17:15,turn==p?'#fff':'rgba(255,255,255,.5)');
        T(`Tus bolas: ${remaining(p)}`,W/2,my+16,15,COL[p]);if(msgT>0&&msg)TS(msg,W/2,H/2+40,22,'#ffe066');});}
  };
},{cd:false});

/* FÚTBOL CHAPAS */
def('soccer','Soccer pool','🥅','#45a83f',()=>{
  let ds,ball,turn=0,aim=null,moving=false,sc=[0,0],gw,y0,y1,r,br,msgT=0;const PTS=3;
  function reset(){r=W*.07;br=W*.042;ds=[];[[.3,.7],[.7,.7],[.5,.84]].forEach(([fx,fy])=>{ds.push({x:W*fx,y:H*fy,vx:0,vy:0,r,m:2,p:0});ds.push({x:W*(1-fx),y:H*(1-fy),vx:0,vy:0,r,m:2,p:1});});ball={x:W/2,y:H/2,vx:0,vy:0,r:br,m:1,ball:true};}
  const all=()=>ds.concat([ball]);
  return{
    init(){gw=W*.38;y0=56;y1=H-56;reset();},
    down(id,x,y){if(moving||aim)return;let best=null;for(const d of ds)if(d.p==turn&&Math.hypot(d.x-x,d.y-y)<d.r*1.4)best=d;if(best)aim={id,d:best,x,y};},
    move(id,x,y){if(aim&&aim.id===id){aim.x=x;aim.y=y;}},
    up(id){if(!aim||aim.id!==id)return;const d=aim.d,dx=d.x-aim.x,dy=d.y-aim.y,l=Math.hypot(dx,dy);aim=null;if(l<10)return;const pw=Math.min(l,150)/150*1500;d.vx=dx/l*pw;d.vy=dy/l*pw;moving=true;beep(250,.05,'square',.07);},
    update(dt){if(msgT>0)msgT-=dt;if(!moving)return;const N=6,h=dt/N,A=all();
      for(let s=0;s<N;s++){moveDiscs(A,h,.4);
        for(const d of A){const inMouth=d.ball&&Math.abs(d.x-W/2)<gw/2-d.r*.5;
          if(d.x<d.r){d.x=d.r;d.vx=Math.abs(d.vx)*.8;}if(d.x>W-d.r){d.x=W-d.r;d.vx=-Math.abs(d.vx)*.8;}
          if(!inMouth){if(d.y<y0+d.r){d.y=y0+d.r;d.vy=Math.abs(d.vy)*.8;}if(d.y>y1-d.r){d.y=y1-d.r;d.vy=-Math.abs(d.vy)*.8;}}}
        collideAll(A,.85);
        if(ball.y<y0-ball.r*1.2||ball.y>y1+ball.r*1.2){const w=ball.y<y0?0:1;sc[w]++;beep(900,.3,'triangle',.1);buzz(100);moving=false;msgT=1.5;
          if(sc[w]>=PTS){later(()=>endRound(w,`${sc[0]} – ${sc[1]}`),900);}else{turn=1-w;later(reset,900);}return;}}
      if(allStill(A)){moving=false;turn^=1;}},
    draw(){ctx.fillStyle='#3f9e3a';ctx.fillRect(0,0,W,H);ctx.fillStyle='rgba(255,255,255,.06)';for(let y=0;y<H;y+=60)ctx.fillRect(0,y,W,30);
      ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=4;ctx.strokeRect(6,y0,W-12,y1-y0);ctx.beginPath();ctx.moveTo(6,H/2);ctx.lineTo(W-6,H/2);ctx.stroke();ring(W/2,H/2,W*.16,'rgba(255,255,255,.7)',4);
      ctx.fillStyle=RED;ctx.fillRect(W/2-gw/2,y0-40,gw,40);ctx.fillStyle=BLUE;ctx.fillRect(W/2-gw/2,y1,gw,40);
      ctx.fillStyle='rgba(255,255,255,.25)';for(let i=0;i<gw;i+=10){ctx.fillRect(W/2-gw/2+i,y0-40,2,40);ctx.fillRect(W/2-gw/2+i,y1,2,40);}
      for(const d of ds){circle(d.x,d.y+3,d.r,'rgba(0,0,0,.3)');circle(d.x,d.y,d.r,COL[d.p]);E('⭐',d.x,d.y,d.r*1.05);if(d.p==turn&&!moving)ring(d.x,d.y,d.r+4,'#fff',3);}
      circle(ball.x,ball.y+2,br,'rgba(0,0,0,.3)');E('⚽',ball.x,ball.y,br*2.1);
      if(aim){const d=aim.d,dx=d.x-aim.x,dy=d.y-aim.y,l=Math.hypot(dx,dy)||1,pw=Math.min(l,150);ctx.strokeStyle='#fff';ctx.lineWidth=4;ctx.setLineDash([8,8]);ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(d.x+dx/l*pw*1.4,d.y+dy/l*pw*1.4);ctx.stroke();ctx.setLineDash([]);}
      scoreSide(sc);if(msgT>0)for(let p=0;p<2;p++)TP(p,'¡GOOOL!',H*.7,48,'#ffe066');
      for(let p=0;p<2;p++)inHalf(p,()=>T(turn==p&&!moving?'Tu turno: arrastra una chapa hacia atrás':'',W/2,H-28,16,'#fff'));}
  };
},{cd:false});

/* TRES EN RAYA DEFINITIVO (9 tableros) */
def('uttt','Ultimate tic tac toe','#️⃣','#33506e',()=>{
  const L=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  let b,sw,turn=0,active=-1,s,ox,oy;
  const geo=()=>{s=Math.min(W*.96,H*.58);ox=(W-s)/2;oy=(H-s)/2;};
  const win3=(a,v)=>L.some(l=>l.every(k=>a[k]===v));
  return{
    init(){geo();b=Array.from({length:9},()=>Array(9).fill(-1));sw=Array(9).fill(-1);},resize:geo,
    down(id,x,y){const col=Math.floor((x-ox)/(s/9)),row=Math.floor((y-oy)/(s/9));if(col<0||col>8||row<0||row>8)return;
      const B=Math.floor(row/3)*3+Math.floor(col/3),c=(row%3)*3+col%3;if(sw[B]!=-1||b[B][c]!=-1||(active>=0&&active!=B))return;
      b[B][c]=turn;beep(turn?520:660,.05,'sine',.07);
      if(win3(b[B],turn)){sw[B]=turn;beep(880,.12,'triangle',.08);}else if(b[B].every(v=>v>=0))sw[B]=2;
      if(win3(sw,turn)){const w=turn;later(()=>endRound(w,'¡Tres tableros en raya!'),700);return;}
      if(sw.every(v=>v!=-1)){later(()=>endRound(-1),600);return;}
      active=sw[c]==-1?c:-1;turn^=1;},
    draw(){halves();const bs=s/3,cs=s/9;ctx.fillStyle='#0b1220';rrect(ox-8,oy-8,s+16,s+16,16);ctx.fill();
      for(let B=0;B<9;B++){const bx=ox+(B%3)*bs,by=oy+Math.floor(B/3)*bs;if(sw[B]==-1&&(active<0||active==B)){ctx.fillStyle='rgba(255,230,0,.18)';ctx.fillRect(bx+3,by+3,bs-6,bs-6);}
        ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=2;ctx.beginPath();for(let i=1;i<3;i++){ctx.moveTo(bx+i*cs,by+6);ctx.lineTo(bx+i*cs,by+bs-6);ctx.moveTo(bx+6,by+i*cs);ctx.lineTo(bx+bs-6,by+i*cs);}ctx.stroke();
        for(let c=0;c<9;c++){const v=b[B][c];if(v<0)continue;const x=bx+(c%3+.5)*cs,y=by+(Math.floor(c/3)+.5)*cs,r=cs*.28;ctx.strokeStyle=COL[v];ctx.lineWidth=4;ctx.beginPath();
          if(v==0){ctx.moveTo(x-r,y-r);ctx.lineTo(x+r,y+r);ctx.moveTo(x+r,y-r);ctx.lineTo(x-r,y+r);}else ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();}
        if(sw[B]==0||sw[B]==1){ctx.fillStyle='rgba(11,18,32,.6)';ctx.fillRect(bx+3,by+3,bs-6,bs-6);const x=bx+bs/2,y=by+bs/2,r=bs*.3;ctx.strokeStyle=COL[sw[B]];ctx.lineWidth=10;ctx.beginPath();
          if(sw[B]==0){ctx.moveTo(x-r,y-r);ctx.lineTo(x+r,y+r);ctx.moveTo(x+r,y-r);ctx.lineTo(x-r,y+r);}else ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();}}
      ctx.strokeStyle='#fff';ctx.lineWidth=5;ctx.beginPath();for(let i=1;i<3;i++){ctx.moveTo(ox+i*bs,oy);ctx.lineTo(ox+i*bs,oy+s);ctx.moveTo(ox,oy+i*bs);ctx.lineTo(ox+s,oy+i*bs);}ctx.stroke();
      turnLabels(turn,H/2+s/2+(H/2-s/2)/2,turn==0?'¡Tu turno! ✕ (zona amarilla)':'¡Tu turno! ◯ (zona amarilla)');}
  };
},{cd:false});
