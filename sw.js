// Guarda la app para que abra sin internet y se actualice sola en segundo plano.
const CACHE = 'mytraining-v6';
const FILES = ['./', 'index.html', 'styles.css', 'config.js', 'exercises.js', 'app.js', 'db.js', 'sync.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'maskable-192.png', 'maskable-512.png', 'apple-touch-icon.png'];
self.addEventListener('install', ev => { ev.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(FILES.map(f => c.add(f)))).then(() => self.skipWaiting())); });
self.addEventListener('activate', ev => { ev.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', ev => {
  const u = new URL(ev.request.url);
  if (ev.request.method !== 'GET') return;
  const own = u.origin === location.origin, font = /fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if (!own && !font) return;
  ev.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(ev.request, { ignoreSearch: own });
    const net = fetch(ev.request).then(r => { if (r.ok || r.type === 'opaque') c.put(ev.request, r.clone()); return r; });
    if (hit) { net.catch(() => {}); return hit; }
    return net.catch(async () => (await c.match('./')) || Response.error());
  }));
});
