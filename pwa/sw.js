const CACHE_NAME = 'pwa-demo-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Pre-cache app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

// Network-first for all requests: try network, cache successful responses, fallback to cache on failure
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Clone and store in cache for offline fallback
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          // Only cache GET requests and successful responses
          if (event.request.method === 'GET' && networkResponse && networkResponse.status === 200) {
            cache.put(event.request, responseClone).catch(()=>{});
          }
        });
        return networkResponse;
      })
      .catch(() => caches.match(event.request).then(cached => {
        // If no cached match, optionally return a fallback for navigation requests
        if (cached) return cached;
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
        return new Response('Offline', { status: 503, statusText: 'Offline' });
      }))
  );
});
