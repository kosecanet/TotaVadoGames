"use strict";
/* Menú principal, ajustes y botón Atrás */
const ORDER=['oops','guessperson','guessanimal','triple','golf','uttt','crash','reflex','throw','yazy','cuppong','mazepaint',
  'fruit','wheelie','findmatch','snakes1','nuts','brainrot','ballrun','cars','archery','animalstack','stampede','tilematch',
  'target','gravity','golffoot','brick','blocks','darts','tennis','cannon','ludo','solitaire','backgammon','soccer',
  'penalty','snake','looter','pinball','race','tanks','hippo','sudoku','numbers','ttt','c4','traffic',
  'slap','memory','pool','rps','sumo','hockey','naval','pong','slide','tops','knife','tug',
  'basket','swords','chess','minigolf','shipbattle','sashimi','stars','minisoccer','mole','bamboo','checkers','crabvolley',
  'paint','fishing','fast','guard','frogs','robots','bomber','bowduel','disco','icepeaks','siege','bowling',
  'duel','math','turtle'];
const NEW=new Set(['oops','guessanimal']);
GAMES.sort((a,b)=>{const ia=ORDER.indexOf(a.id),ib=ORDER.indexOf(b.id);return(ia<0?999:ia)-(ib<0?999:ib);});

function shade(hex,f){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;r=Math.round(r*(1+f));g=Math.round(g*(1+f));b=Math.round(b*(1+f));return`rgb(${clamp(r,0,255)},${clamp(g,0,255)},${clamp(b,0,255)})`;}
// Nivel de dificultad: 1 = menores de 5, 2 = menores de 10, 3 = todos (los demás no listados = 2)
const LVL={tug:1,fast:1,mole:1,hippo:1,paint:1,stars:1,sumo:1,hockey:1,turtle:1,memory:1,reflex:1,findmatch:1,sashimi:1,frogs:1,fishing:1,traffic:1,
  icepeaks:1,bamboo:1,swords:1,target:1,crash:1,rps:1,brainrot:1,animalstack:1,wheelie:1,stampede:1,basket:1,bowling:1,minisoccer:1,slap:1,knife:1,duel:1,
  tilematch:1,fruit:1,mazepaint:1,
  chess:3,backgammon:3,yazy:3,triple:3,uttt:3,sudoku:3,solitaire:3,numbers:3,slide:3};
const lvlOf=g=>LVL[g.id]||2;
let AGE=load('tv_age',3);
window.ageOK=g=>lvlOf(g)<=AGE;
function renderGrid(){const list=GAMES.filter(ageOK);
  $('#grid').innerHTML=list.map(g=>`<div class="tile" data-id="${g.id}" style="--c:${g.color};--b:${shade(g.color,-.45)}"><div class="band"></div><div class="ic">${g.emoji}</div>${g.solo?'<div class="solo">1P</div>':''}${NEW.has(g.id)?'<div class="new">¡NUEVO!</div>':''}<div class="t">${g.name}</div></div>`).join('');
  document.querySelectorAll('#ages button').forEach(b=>b.classList.toggle('on',+b.dataset.a==AGE));$('#grid').scrollTop=0;}
renderGrid();
$('#ages').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;AGE=+b.dataset.a;save('tv_age',AGE);renderGrid();beep(600,.04);});
$('#grid').addEventListener('click',e=>{const c=e.target.closest('.tile');if(c){wins=[0,0];champ=null;start(c.dataset.id);}});
$('#tourBtn').addEventListener('click',champStart);
$('#nGames').textContent=GAMES.length;

function askExit(){if(!G)return;paused=true;$('#conf').style.display='flex';}
$('#exitBtn').addEventListener('click',askExit);
$('#confYes').addEventListener('click',toMenu);
$('#confNo').addEventListener('click',()=>{$('#conf').style.display='none';paused=false;});

function syncToggles(){$('#tgSnd').classList.toggle('on',SET.snd);$('#tgVib').classList.toggle('on',SET.vib);}
$('#setBtn').addEventListener('click',()=>{syncToggles();$('#sets').style.display='flex';});
$('#setClose').addEventListener('click',()=>{$('#sets').style.display='none';});
$('#tgSnd').addEventListener('click',()=>{SET.snd=!SET.snd;save('tv_set',SET);syncToggles();beep(660,.08);});
$('#tgVib').addEventListener('click',()=>{SET.vib=!SET.vib;save('tv_set',SET);syncToggles();buzz(40);});
$('#resetBtn').addEventListener('click',()=>{TOT=[0,0];save('tv_tot',TOT);refreshScores();});

// Botón "atrás" de Android: devuelve true si lo gestiona la página
window.tvBack=function(){
  if($('#sets').style.display=='flex'){$('#sets').style.display='none';return true;}
  if($('#conf').style.display=='flex'){$('#conf').style.display='none';paused=false;return true;}
  if(G){if($('#over').style.display=='flex'){toMenu();return true;}askExit();return true;}
  return false;
};
// Aviso de actualización (lo llama MainActivity.java con el estado del Updater)
let updState=null;
window.tvUpdate=function(u){updState=u;const box=$('#upd'),b=$('#updBtn');box.style.display='flex';
  if(u.state=='available'){$('#updTxt').textContent=`🆕 Nueva versión 1.0.${u.v} (${u.mb} MB)`;b.textContent='Descargar';b.style.display='';}
  else if(u.state=='downloading'){$('#updTxt').textContent=`⬇️ Descargando versión 1.0.${u.v}… ${u.p} %`;b.style.display='none';}
  else if(u.state=='ready'){$('#updTxt').textContent=`✅ Versión 1.0.${u.v} lista`;b.textContent='Instalar';b.style.display='';}};
$('#updBtn').addEventListener('click',()=>{if(!window.TVNative||!updState)return;if(updState.state=='available')TVNative.download();else if(updState.state=='ready')TVNative.install();});
refreshScores();resize();
if(document.fonts&&document.fonts.load)document.fonts.load('20px Lilita');
