const STATIC_CACHE = 'pwa-demo-static-v1';
const DYNAMIC_CACHE = 'pwa-demo-dynamic-v1';
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
    caches.open(STATIC_CACHE).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => {
        if (k !== STATIC_CACHE && k !== DYNAMIC_CACHE) {
          return caches.delete(k);
        }
      }))
    )
  );
  self.clients.claim();
});

// Cache-first strategy: check cache first, then network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) {
        return cached;
      }
      return fetch(event.request).then(networkResponse => {
        // Clone and store in dynamic cache for future requests
        const responseClone = networkResponse.clone();
        caches.open(DYNAMIC_CACHE).then(cache => {
          if (event.request.method === 'GET' && networkResponse && networkResponse.status === 200) {
            cache.put(event.request, responseClone).catch(() => {});
          }
        });
        return networkResponse;
      }).catch(() => {
        // If offline and no cache, return fallback for navigation
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
        return new Response('Offline', { status: 503, statusText: 'Offline' });
      });
    })
  );
});
