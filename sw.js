// Şantiye Defteri - çevrimdışı çalışma için servis çalışanı
// Uygulamada değişiklik yaptığında aşağıdaki sürümü artır (v1 -> v2).
var V = 'sd-v1';
var SHELL = ['./', 'index.html', 'firebase-config.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
var CDN = [
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js'
];

self.addEventListener('install', function (e) {
  e.waitUntil((async function () {
    var c = await caches.open(V);
    await c.addAll(SHELL);
    await Promise.all(CDN.map(function (u) {
      return fetch(u).then(function (r) { if (r.ok) return c.put(u, r); }).catch(function () {});
    }));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', function (e) {
  e.waitUntil((async function () {
    var keys = await caches.keys();
    await Promise.all(keys.filter(function (k) { return k !== V; }).map(function (k) { return caches.delete(k); }));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  var same = url.origin === self.location.origin;
  if (!same && CDN.indexOf(req.url) < 0) return;      // Firestore/Auth istekleri olduğu gibi geçer
  if (same && url.pathname.indexOf('/__/') === 0) return;
  e.respondWith((async function () {
    var c = await caches.open(V);
    var hit = await c.match(req, { ignoreSearch: true });
    if (!hit && req.mode === 'navigate') hit = await c.match('index.html');
    var net = fetch(req).then(function (r) {
      if (r && r.ok) c.put(req, r.clone());
      return r;
    }).catch(function () { return null; });
    if (hit) { e.waitUntil(net); return hit; }
    var r = await net;
    return r || new Response('Çevrimdışı', { status: 503 });
  })());
});
