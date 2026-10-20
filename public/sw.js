/**
 * Gateway Classes — Offline Service Worker
 * Provides caching and enables Add-to-Home-Screen (PWA) installation
 */

const CACHE_NAME = 'gateway-classes-v2';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/css/gwc-ui.css',
  '/css/student-tracker.css',
  '/css/global-search.css',
  '/js/student-tracker.js',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Network first, fallback to cache for offline support
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
