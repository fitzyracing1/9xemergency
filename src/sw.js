/**
 * Emergency Internet Service Worker
 * Aggressive local-first. Critical content stays available offline.
 */

const CACHE = 'emergency-v1';
const CRITICAL = 'emergency-critical-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith((async () => {
    // 1. Always try cache first (emergency default)
    const cached = await caches.match(req);
    if (cached) return cached;

    // 2. Network when available
    try {
      const res = await fetch(req);
      if (res.ok) {
        const clone = res.clone();
        const cache = await caches.open(CACHE);
        cache.put(req, clone);
      }
      return res;
    } catch {
      // 3. Offline fallback
      const fallback = await caches.match('/public/offline.html');
      if (fallback) return fallback;
      return new Response(
        '<!DOCTYPE html><html><body><h1>Offline</h1><p>No local copy available.</p></body></html>',
        { status: 503, headers: { 'Content-Type': 'text/html' } }
      );
    }
  })());
});

// Allow pages to pin critical content
self.addEventListener('message', async (event) => {
  const { type, url, urls } = event.data || {};
  if (type === 'PIN_CRITICAL') {
    const cache = await caches.open(CRITICAL);
    const list = urls || (url ? [url] : []);
    for (const u of list) {
      try {
        const res = await fetch(u);
        if (res.ok) await cache.put(u, res.clone());
      } catch (_) {}
    }
    event.ports?.[0]?.postMessage({ ok: true });
  }
});
