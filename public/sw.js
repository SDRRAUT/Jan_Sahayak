// JanSahayak Service Worker - Auto Cache Purge & Clean Unregister
// Prevents stale bundle hashing that causes blank screens across deployments

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    }).then(() => {
      return self.registration.unregister();
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Pass-through network fetch without caching stale assets
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
