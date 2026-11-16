package com.totavado.games;

import android.content.Intent;
import android.content.pm.PackageInfo;
import android.net.ConnectivityManager;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;

import androidx.core.content.FileProvider;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Autoactualización desde las Releases de github.com/kosecanet/TotaVadoGames (como Yotuve).
 * Al arrancar mira si hay versión nueva; con wifi la descarga sola y luego avisa para instalar
 * (Android siempre pide confirmar la instalación de una app que no viene de la Play Store).
 */
class Updater {
    private static final String API = "https://api.github.com/repos/kosecanet/TotaVadoGames/releases/latest";

    private final MainActivity act;
    private volatile String state = "none";   // none | available | downloading | ready
    private volatile int version = 0, sizeMb = 0, progress = 0;
    private volatile String url = null;
    private volatile File file = null;
    private volatile boolean busy = false;

    Updater(MainActivity act) { this.act = act; }

    private long currentVersion() {
        try {
            PackageInfo pi = act.getPackageManager().getPackageInfo(act.getPackageName(), 0);
            return Build.VERSION.SDK_INT >= 28 ? pi.getLongVersionCode() : pi.versionCode;
        } catch (Exception e) { return Long.MAX_VALUE; }
    }

    void check() {
        new Thread(() -> {
            try {
                HttpURLConnection c = (HttpURLConnection) new URL(API).openConnection();
                c.setRequestProperty("Accept", "application/vnd.github+json");
                c.setRequestProperty("User-Agent", "totavado-games");
                c.setConnectTimeout(8000); c.setReadTimeout(8000);
                if (c.getResponseCode() != 200) return;      // sin internet, repo privado o sin releases
                JSONObject j = new JSONObject(readAll(c.getInputStream()));
                // tag "v1.0.N": el último número es el versionCode (número de compilación)
                Matcher m = Pattern.compile("(\\d+)").matcher(j.optString("tag_name"));
                int v = -1; while (m.find()) v = Integer.parseInt(m.group(1));
                if (v <= 0 || v <= currentVersion()) return;
                JSONArray assets = j.getJSONArray("assets");
                for (int i = 0; i < assets.length(); i++) {
                    JSONObject a = assets.getJSONObject(i);
                    if (a.optString("name").endsWith(".apk")) {
                        url = a.getString("browser_download_url");
                        sizeMb = (int) Math.max(1, a.optLong("size") / 1_048_576);
                        break;
                    }
                }
                if (url == null) return;
                version = v; state = "available"; push();
                // Con wifi (red sin límite de datos) se descarga ya, sin preguntar
                ConnectivityManager cm = (ConnectivityManager) act.getSystemService(android.content.Context.CONNECTIVITY_SERVICE);
                if (cm != null && !cm.isActiveNetworkMetered()) download();
            } catch (Exception ignored) { }
        }).start();
    }

    void download() {
        if (busy || url == null || "ready".equals(state)) return;
        busy = true;
        new Thread(() -> {
            try {
                File dir = new File(act.getCacheDir(), "updates");
                dir.mkdirs();
                File[] old = dir.listFiles();
                if (old != null) for (File f : old) f.delete();
                File out = new File(dir, "totavado-" + version + ".apk");
                state = "downloading"; progress = 0; push();
                HttpURLConnection c = (HttpURLConnection) new URL(url).openConnection();
                c.setRequestProperty("User-Agent", "totavado-games");
                c.setInstanceFollowRedirects(true);
                long total = Math.max(1, c.getContentLengthLong()), done = 0;
                int lastPct = -1;
                try (InputStream in = c.getInputStream(); OutputStream o = new FileOutputStream(out)) {
                    byte[] buf = new byte[64 * 1024]; int n;
                    while ((n = in.read(buf)) > 0) {
                        o.write(buf, 0, n); done += n;
                        int pct = (int) (done * 100 / total);
                        if (pct != lastPct) { lastPct = pct; progress = pct; push(); }
                    }
                }
                file = out; state = "ready"; push();
            } catch (Exception e) {
                state = "available"; push();
            } finally { busy = false; }
        }).start();
    }

    /** Lanza el instalador de Android (la primera vez pide permitir instalar desde TotaVado). */
    void install() {
        if (file == null || !file.exists()) return;
        act.runOnUiThread(() -> {
            try {
                if (Build.VERSION.SDK_INT >= 26 && !act.getPackageManager().canRequestPackageInstalls()) {
                    act.startActivity(new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                            Uri.parse("package:" + act.getPackageName())));
                    return;
                }
                Uri uri = FileProvider.getUriForFile(act, act.getPackageName() + ".files", file);
                Intent i = new Intent(Intent.ACTION_VIEW).setDataAndType(uri, "application/vnd.android.package-archive")
                        .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
                act.startActivity(i);
            } catch (Exception ignored) { }
        });
    }

    /** Envía el estado a la página para mostrar el aviso en el menú. */
    void push() {
        if ("none".equals(state)) return;
        String js = "window.tvUpdate&&window.tvUpdate({state:'" + state + "',v:" + version
                + ",mb:" + sizeMb + ",p:" + progress + "})";
        act.runJs(js);
    }

    private static String readAll(InputStream in) throws Exception {
        StringBuilder sb = new StringBuilder(); byte[] b = new byte[8192]; int n;
        while ((n = in.read(b)) > 0) sb.append(new String(b, 0, n, "UTF-8"));
        in.close(); return sb.toString();
    }
}
