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
$('#grid').innerHTML=GAMES.map(g=>`<div class="tile" data-id="${g.id}" style="--c:${g.color};--b:${shade(g.color,-.45)}"><div class="band"></div><div class="ic">${g.emoji}</div>${g.solo?'<div class="solo">1P</div>':''}${NEW.has(g.id)?'<div class="new">¡NUEVO!</div>':''}<div class="t">${g.name}</div></div>`).join('');
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
