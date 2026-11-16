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

// Nombres en castellano y ayudas de la mascota (sobrescriben los de cada juego)
const ES={oops:'¡Ups!',guessperson:'Adivina quién',guessanimal:'Adivina el animal',uttt:'Tres en raya total',crash:'Choque de coches',reflex:'Carrera de reflejos',
  throw:'Bolas de nieve',yazy:'Yatzi clásico',cuppong:'Vasos',mazepaint:'Laberinto de pintura',fruit:'Fusión de frutas',wheelie:'Caballito',findmatch:'Encuentra la pareja',
  snakes1:'Serpiente glotona',nuts:'Tuercas y tornillos',brainrot:'Torre loca',ballrun:'Bola veloz',cars:'Coches de carreras',race:'Carreras con volante',archery:'Tiro con arco',
  animalstack:'Torre de animales',stampede:'Estampida',tilematch:'Toca empareja',target:'Tiro al blanco',gravity:'Carrera de gravedad',golffoot:'Fútbol golf',
  brick:'Rompeladrillos',darts:'Dardos',tennis:'Tenis',cannon:'Duelo de cañones',soccer:'Fútbol chapas',naval:'Hundir la flota',looter:'Saqueador',pinball:'Pinball'};
const HELP={oops:'Tira el dado y lleva tus fichas a casa. ¡Si caes sobre el otro, lo mandas a la salida!',guessperson:'Toca a la persona que dice la pista antes que el otro',
  guessanimal:'Lee la pista y toca el animal correcto',triple:'Elige 3 cartas: cada rasgo todo igual o todo distinto',golf:'Arrastra hacia atrás y suelta. Menos golpes gana',
  uttt:'Tu jugada decide en qué tablero juega el otro',crash:'Embiste al otro coche de frente',reflex:'Toca el objeto que se pide antes que el otro',throw:'Muévete y suelta para lanzar bolas de nieve',
  yazy:'Tira hasta 3 veces y apunta en una casilla',cuppong:'Desliza hacia arriba para meter la pelota en los vasos',mazepaint:'Desliza para pintar todo el laberinto',
  fruit:'Junta dos frutas iguales para crear una más grande',wheelie:'Mantén pulsado para levantar la rueda, ¡sin caerte!',findmatch:'Busca el dibujo que está en los dos platos',
  snakes1:'Desliza para girar y come manzanas',nuts:'Ordena las tuercas por colores',brainrot:'Toca para soltar la pieza encima de la torre',ballrun:'Toca a los lados para esquivar',
  cars:'Mantén para acelerar, ¡pero frena en las curvas!',race:'Gira con los botones. 3 vueltas',archery:'Toca cuando la mira esté en el centro',animalstack:'Toca para soltar el animal encima de la torre',
  stampede:'Toca para saltar los bisontes',tilematch:'Junta 3 iguales en la bandeja',target:'Toca las dianas. El centro vale más',gravity:'Toca para cambiar de suelo a techo',
  golffoot:'Arrastra hacia atrás y suelta para chutar',brick:'Rompe más ladrillos que el otro',blocks:'Arrastra las piezas y completa líneas',darts:'Toca cuando la mira esté donde quieres',
  tennis:'Muévete para devolver la bola',cannon:'Arrastra hacia atrás y suelta para disparar',ludo:'Saca un 6 para salir y lleva tus 4 fichas a casa',solitaire:'Toca una carta para moverla',
  backgammon:'Tira los dados y saca todas tus fichas',soccer:'Arrastra una chapa hacia atrás y suelta',penalty:'Elige dónde chutas o dónde te tiras',snake:'Pulsa izquierda o derecha para girar. ¡No choques!',
  looter:'Coge el dinero y llévalo a tu caja fuerte',pinball:'Toca a cada lado para mover tus palas',tanks:'Mantén MOVER y dispara con FUEGO',hippo:'Toca para que tu hipopótamo coma bolas',
  sudoku:'Rellena cada fila, columna y cuadro del 1 al 9',numbers:'Toca dos iguales o que sumen 10',ttt:'Haz tres en raya',c4:'Haz cuatro en raya',traffic:'Toca para avanzar sin que te pillen',
  slap:'Si atacas, golpea. Si defiendes, ¡aparta la mano a tiempo!',memory:'Encuentra las parejas',pool:'Arrastra hacia atrás y suelta. Mete tus bolas y después la negra',
  rps:'Elige en secreto piedra, papel o tijera',sumo:'¡Quédate dentro del círculo!',hockey:'Mueve tu mazo y mete gol',naval:'Dispara al mar del otro y hunde su flota',
  pong:'Mueve tu pala y no dejes pasar la bola',slide:'Ordena los números del 1 al 15',tops:'Empuja a la otra peonza fuera',knife:'Toca para lanzar. ¡No toques otro cuchillo!',
  tug:'¡Toca muy rápido para tirar de la cuerda!',basket:'Desliza hacia arriba para encestar',swords:'Toca para lanzar espadas a los muñecos',chess:'Da jaque mate al rey del otro',
  minigolf:'Arrastra hacia atrás y suelta. Menos golpes gana',shipbattle:'Toca donde quieras disparar al barco del otro',sashimi:'Toca solo el sashimi',stars:'Arrastra para pilotar y coge estrellas',
  minisoccer:'Arrastra para mover a tu jugador y mete gol',mole:'Golpea los topos y evita las bombas',bamboo:'Toca para lanzar shurikens al bambú',checkers:'Come todas las fichas del otro',
  crabvolley:'Mueve tu cangrejo y no dejes caer la pelota',paint:'Pinta más suelo que el otro',fishing:'Mantén para bajar el anzuelo',fast:'Toca solo cuando salga el diamante',
  guard:'El guarda alumbra al ladrón. El ladrón coge las bolsas',frogs:'Toca para sacar la lengua y cazar moscas',robots:'Golpea al otro robot con tu sierra',
  bomber:'Arrastra para moverte. Toque corto para poner una bomba',bowduel:'Arrastra hacia atrás y suelta para disparar la flecha',disco:'Toca la flecha cuando llegue a tu botón',
  icepeaks:'Empuja al otro pingüino al agua',siege:'Toca un camino para enviar soldados al castillo del otro',bowling:'Desliza la bola hacia los bolos',duel:'Espera la señal y toca el primero',
  math:'Toca la respuesta correcta antes que el otro',turtle:'Toca izquierda y derecha alternando'};
for(const g of GAMES){if(ES[g.id])g.name=ES[g.id];if(HELP[g.id])g.help=HELP[g.id];}
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
  $('#grid').innerHTML=list.map(g=>`<div class="tile" data-id="${g.id}" style="--c:${g.color};--b:${shade(g.color,-.45)}"><div class="band"></div><div class="ic">${g.emoji}</div>${g.solo?'<div class="solo">1J</div>':''}${NEW.has(g.id)?'<div class="new">¡NUEVO!</div>':''}<div class="t">${g.name}</div></div>`).join('');
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
