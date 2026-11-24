// Atomic, public-only offline shell. Never cache API replies or URLs with credentials.
const ROOT = self.registration.scope,
  loc = new URL(ROOT),
  PREFIX = 'zau-original:' + loc.pathname + ':',
  CACHE = PREFIX + '2026.11.24-study-mail-order-history-4877a0776ff7';
const files = {"apple-touch-icon.png":"34d018db09638153cd2d2557b791aa632b08a90a2e27083872ce6148fd41a050","assets/Lora-0e523e4bc3c6.woff2":"0e523e4bc3c6308f002a3208ea2990cb4f64282d4fbb67c12f5726d13b66eef6","assets/Lora-2a2d9c22c986.woff2":"2a2d9c22c9863086a23f5013fede1428585321812b25f2662542c39d02967c5e","assets/Lora-405b30a5bea8.woff2":"405b30a5bea8b70446e08e40e5d70b7bf5262ef3c4a9e4f3e4672e079a01a4cd","assets/Lora-45f989df83f3.woff2":"45f989df83f3a9f40007d2ecdea98bff248c8767a1a0bbe60e94fb37b605ecee","assets/Lora-b67b0f50d1d0.woff2":"b67b0f50d1d03fc36a1b3ded113de24a0ab71b838cc27e493d4f62cea00be99b","assets/Lora-c57d9ca3bd42.woff2":"c57d9ca3bd42e6bc093badc7744dd2059a78f66a3a4dc6ca40574480c870f553","assets/Lora-d824d807d4d8.woff2":"d824d807d4d832d12c87932d0b8ec1314dcfd502157a56dee6bb04cf8a3768ae","assets/Lora-ddb8c6603510.woff2":"ddb8c66035104e233fc024669183aad3738b6daa16deee2ebb1241bd0f98ace1","assets/Manrope-2f7335119075.woff2":"2f7335119075b2079f1d882530bbc18728461612bf90743203d73a74a48f4d9b","assets/Manrope-3c09135e88bb.woff2":"3c09135e88bbfcd848e99be137710afbb615a8d9a73c5c48e6cb0245a162af1d","assets/Manrope-447c49583b1b.woff2":"447c49583b1b735cc6f566151db1d24354cec41076c55dd98455cfbde9e806c1","assets/Manrope-8c2def024c1b.woff2":"8c2def024c1bf31aacf3624ae3c4d701269b4ec3dc765c04830839f0d36b2d9e","assets/bible-tools-fd1661b42c3c.js":"fd1661b42c3cebec94f52c023e3e9b94c70bf14ea331d6a1847dfdf49f855b3a","assets/cabinet-7c820d826d3e.js":"7c820d826d3ea02c3e89fee72ed0fa6686051a46a9270e3224352d05fa2fd1bb","assets/headman-roster-890d5e52a868.js":"890d5e52a868ba8bb095961e71ef321e996dddd2355aad868afba4be21232f8c","assets/icons-CLZZQnz2.js":"86767e5f6ea746a86c270359b352ddb53373309bba49f587ea85ff0ba992817c","assets/index-CdQoEkiS.css":"9acaaa495a9055bc13ad2952ef891aaf71ad33056e12c23790a80b23c6f18677","assets/personal-mode-bef0a44c2c9b.js":"bef0a44c2c9b8ceb4398ddbc2d7877b1650473f55ccba28e28ae38eb8bb283d4","assets/react-D7hS72C8.js":"32302b731ab0531e3438141303f0239caab5449962a50bd64fd8b6230eb9a363","assets/runtime-0ef486abf046.js":"0ef486abf0466c62217ca7d1d4be57b9c13c83f8aa8f76d6a3f620d2c2eedb57","assets/web-controls-fcd9e0369170.css":"fcd9e0369170c8cfc9958d3f70d719e48fb63af328ca28a527593c575fce4dce","assets/web-tools-c5df2eb6ac0f.js":"c5df2eb6ac0f4e5c3f70615afca47fcf23635c718df10ee9328a517e9f24ee37","data/ipb2015.json":"223e48ba48f886500779716a8d4fa7350887daebd1a380ec5af41393f2e90ff2","data/synodal_bible.json":"69490e688acaa5b8284965cf0515e84b01f40f8ebe221ab030ccccb2f3dd7fb7","favicon.png":"4aa295e3225645f654d865c45f8d7d769aff325b0951f00599d6ee8987248681","index.html":"11504a1a9f4cc88607c533b723cc0bc4115db7a0d6d3d9dd793a2f3909f1ee5a","manifest.webmanifest":"6030eba07a407188a4667be8084b7bfcf679c3b95e175de3cd688b1efac516ce","pwa-icon-192.png":"a16621c782b96c0a3ed9654dc4537f81dbe86c4045dd88f8190fb370bbb2ab90","pwa-icon-512.png":"79825972000e93cad11351ca2472f1000ca3974b7d643eb43694345686484e3a","release.json":"dbb613efd25801ff280d7c5deb4eaab25af7ffb65ad1eb342cd71d76a3346ec5"},
  urls = new Map(Object.entries(files).map(([p, sum]) => [new URL(p, ROOT).href, sum]));
const indexURL = new URL('index.html', ROOT).href;
const hex = (a) => Array.from(new Uint8Array(a), (v) => v.toString(16).padStart(2, '0')).join('');
self.addEventListener('install', (ev) =>
  ev.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      try {
        for (const [url, want] of urls) {
          const published = new URL(url);
          published.searchParams.set('zau-rev', want.slice(0, 16));
          const res = await fetch(published.href, {
            cache: 'reload',
            credentials: 'omit',
            redirect: 'error'
          });
          if (!res.ok) throw Error('Не удалось сохранить общедоступный файл');
          const buf = await res.arrayBuffer();
          if (hex(await crypto.subtle.digest('SHA-256', buf)) !== want)
            throw Error('Неполная версия сайта');
          const headers = new Headers(res.headers);
          headers.delete('Content-Encoding');
          headers.delete('Content-Length');
          await cache.put(url, new Response(buf, { headers }));
        }
      } catch (e) {
        await caches.delete(CACHE);
        throw e;
      }
    })()
  )
);
self.addEventListener('message', (e) => {
  if (e.data === 'ZAU_SITE_STATUS') e.ports[0]?.postMessage(CACHE.slice(PREFIX.length));
  if (e.data === 'ZAU_APPLY') e.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', (ev) =>
  ev.waitUntil(
    (async () => {
      for (const key of await caches.keys())
        if (
          (key.startsWith(PREFIX) || key.startsWith('zau-unified:' + loc.pathname + ':')) &&
          key !== CACHE
        )
          await caches.delete(key);
      await self.clients.claim();
    })()
  )
);
self.addEventListener('fetch', (ev) => {
  const r = ev.request,
    u = new URL(r.url);
  if (
    r.method !== 'GET' ||
    u.origin !== loc.origin ||
    !u.pathname.startsWith(loc.pathname) ||
    r.headers.has('authorization') ||
    /\/api\//.test(u.pathname)
  )
    return;
  // release.json is a real, directly inspectable file (also with a cache buster), not the SPA shell.
  if (u.pathname === new URL('release.json', ROOT).pathname) {
    ev.respondWith(
      fetch(r, { cache: 'no-store' }).catch(() =>
        caches.open(CACHE).then((c) => c.match(new URL('release.json', ROOT).href))
      )
    );
    return;
  }
  // Explicit online entry after publishing, even when the main start_url is pinned offline.
  // In a real outage the already-verified cabinet remains usable.
  if (
    r.mode === 'navigate' &&
    [loc.pathname + 'open/classic/', loc.pathname + 'open/classic/index.html'].includes(u.pathname)
  ) {
    ev.respondWith(
      (async () => {
        const abort = new AbortController(),
          timer = setTimeout(() => abort.abort(), 5500);
        try {
          const fresh = await fetch(r, { cache: 'no-store', signal: abort.signal });
          if (fresh.ok && (fresh.headers.get('content-type') || '').includes('text/html'))
            return fresh;
        } catch {
        } finally {
          clearTimeout(timer);
        }
        return (await (await caches.open(CACHE)).match(indexURL)) || Response.error();
      })()
    );
    return;
  }
  if (u.pathname.startsWith(loc.pathname + 'classic/')) return;
  if (
    r.mode === 'navigate' &&
    (u.pathname === loc.pathname || u.pathname === loc.pathname + 'index.html')
  ) {
    ev.respondWith(caches.open(CACHE).then(async (c) => (await c.match(indexURL)) || fetch(r)));
    return;
  }
  if (u.search || !urls.has(u.href)) return;
  ev.respondWith(caches.open(CACHE).then(async (c) => (await c.match(u.href)) || fetch(r)));
});
self.addEventListener('notificationclick', (ev) => {
  ev.notification.close();
  ev.waitUntil(
    (async () => {
      for (const c of await self.clients.matchAll({ type: 'window' }))
        if (c.url.startsWith(ROOT) && 'focus' in c) return c.focus();
      return self.clients.openWindow(ROOT);
    })()
  );
});
