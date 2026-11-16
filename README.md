# TotaVado Games 🅿️🚫

Juegos para 2 jugadores en el mismo móvil, **sin anuncios** y sin internet.
Azul juega abajo, Rojo juega arriba.

## Juegos
Tres en raya · Conecta 4 · Air Hockey · Ping Pong · Serpientes · Tira y afloja ·
Duelo del Oeste · Duelo matemático · Hipopótamos · Carrera de tortugas · Sumo de discos ·
y modo **Campeonato** (5 juegos al azar).

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
