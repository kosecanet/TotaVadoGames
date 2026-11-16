# TotaVado Games 🅿️🚫

Juegos para 2 jugadores en el mismo móvil, **sin anuncios** y sin internet.
Azul juega abajo, Rojo juega arriba.

## Juegos
31 juegos para 2 (y más en camino): Batalla de pintura, Dedos rápidos, Tanques, Fútbol chapas, Encuentra la pareja,
Ajedrez, Damas, Batalla naval, Tragabolas, Tres en raya, 4 en raya, Tres en raya total, Pimpón, Tira de la cuerda,
Lanzacuchillos, Penaltis, Serpientes, Coches de carreras, Golpe de mano, Memoria, Billar, Piedra papel o tijera, Sumo,
Hockey de aire, Dardos, Recogestrellas, Mazatopos, Carrera de reflejos, Duelo del Oeste, Duelo matemático y Carrera de tortugas.
Modo **Jugar torneo** (5 juegos al azar) y marcador total Rojo/Azul.

## Autoactualización
Al abrir la app mira la última Release de este repo. Con wifi descarga la versión nueva sola y muestra
"Versión lista · Instalar" en el menú (Android pide confirmar la instalación). El repo debe ser **público**
para que la app pueda consultar las Releases sin contraseña.

## Compilar con GitHub
1. Sube **todo** el contenido de esta carpeta a un repositorio (incluida la carpeta oculta `.github`).
2. Cada `push` a `main` lanza **Actions → "Compilar APK y publicar Release"** (también se puede lanzar a mano con *Run workflow*).
3. Al terminar, el APK aparece en **Releases** como `TotaVadoGames-1.0.N.apk`.

La versión sube sola en cada compilación, así que las actualizaciones se instalan encima de la anterior.

### Firma
El repo incluye `app/totavado.jks` (contraseña `totavado`) para que las actualizaciones
siempre lleven la misma firma. Mantén el repositorio **privado**. Si prefieres tu propia clave,
crea los secrets `TV_KEYSTORE_BASE64`, `TV_KEYSTORE_PASSWORD`, `TV_KEY_ALIAS` y `TV_KEY_PASSWORD`
(si cambias de clave tendrás que desinstalar la versión anterior una vez).

## Estructura
- `app/src/main/assets/www/index.html` → todos los juegos (HTML5 + Canvas). Se puede probar en el navegador.
- `app/src/main/java/.../MainActivity.java` → WebView a pantalla completa, botón Atrás.
- `app/src/main/res/mipmap-*` → icono de vado permanente.
