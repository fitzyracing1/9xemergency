/**
 * Lean HTML Service Worker
 * Intercepts requests and prefers content-addressed / local cache when possible.
 *
 * Registration is opt-in from the page.
 */

const CACHE_NAME = 'lean-html-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle same-origin GET for now (extend later)
  if (req.method !== 'GET') return;

  event.respondWith(
    (async () => {
      // 1. Try Cache API first (simple local-first)
      const cached = await caches.match(req);
      if (cached) {
        return cached;
      }

      // 2. Network
      try {
        const response = await fetch(req);
        // Cache successful responses for future local hits
        if (response.ok && response.type === 'basic') {
          const clone = response.clone();
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, clone);
        }
        return response;
      } catch (err) {
        // Offline fallback could go here
        return new Response('Offline – no local copy available', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      }
    })()
  );
});

// Allow pages to pre-cache content-addressed resources
self.addEventListener('message', async (event) => {
  if (event.data?.type === 'LEAN_CACHE_PUT') {
    const { url, cid } = event.data;
    try {
      const response = await fetch(url);
      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(url, response.clone());
        // Future: also store under cid key
        event.ports[0]?.postMessage({ ok: true });
      }
    } catch (e) {
      event.ports[0]?.postMessage({ ok: false, error: String(e) });
    }
  }
});
