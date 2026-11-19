const CACHE_NAME = "zau-web-pwa-80a092a4bc";
const SHELL_URLS = [
  "./apple-touch-icon.png",
  "./assets/icons-CLZZQnz2.js",
  "./assets/index-CdQoEkiS.css",
  "./assets/index-aX0AFzPj.js",
  "./assets/react-D7hS72C8.js",
  "./favicon.png",
  "./index.html",
  "./manifest.webmanifest",
  "./pwa-icon-192.png",
  "./pwa-icon-512.png"
];
const BIBLE_URL = './data/synodal_bible.json';

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(SHELL_URLS);
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((k) => k.startsWith('zau-web-pwa-') && k !== CACHE_NAME)
        .map((k) => caches.delete(k))
    );
    await self.clients.claim();
    try {
      const cache = await caches.open(CACHE_NAME);
      const hasBible = await cache.match(BIBLE_URL);
      if (!hasBible) {
        const res = await fetch(BIBLE_URL);
        if (res.ok) await cache.put(BIBLE_URL, res);
      }
    } catch {}
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.includes('/api/') || url.pathname.endsWith('/admin') || url.pathname.includes('/admin/')) return;

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(async (res) => {
          if (res.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put('./index.html', res.clone());
          }
          return res;
        })
        .catch(async () => (await caches.match('./index.html')) || Response.error())
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(async (cached) => {
      if (cached) return cached;
      const res = await fetch(req);
      if (res.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, res.clone());
      }
      return res;
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil((async () => {
    const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of allClients) {
      if ('focus' in client) {
        await client.focus();
        return;
      }
    }
    if (self.clients.openWindow) {
      await self.clients.openWindow('./');
    }
  })());
});
