/**
 * Vynora PWA Service Worker
 * High-performance offline caching, asset streaming, and background sync
 */

const CACHE_NAME = 'vynora-v1.0.0';
const DYNAMIC_CACHE = 'vynora-dynamic-v1';
const IMAGE_CACHE = 'vynora-images-v1';

const STATIC_ASSETS = [
  './',
  './index.html',
  './pages/homepage.html',
  './pages/movie-details.html',
  './pages/my-list.html',
  './pages/profile.html',
  './pages/signin.html',
  './pages/signup.html',
  './css/common.css',
  './css/index.css',
  './css/homepage.css',
  './css/movie-details.css',
  './css/my-list.css',
  './css/auth.css',
  './css/profile.css',
  './js/app.js',
  './manifest.json',
  './assets/icons/logo.svg',
  './assets/icons/logo-header.svg',
  './assets/icons/favicon.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png'
];

// 1. Install Event: Cache Core App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Vynora SW: Some static assets failed to pre-cache:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate Event: Clean Old Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== DYNAMIC_CACHE && key !== IMAGE_CACHE) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event Strategy
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Skip non-GET requests or chrome-extension URLs
  if (req.method !== 'GET' || !req.url.startsWith('http')) return;

  // TMDB / External Images: Cache-first with network fallback
  if (url.hostname.includes('image.tmdb.org') || url.hostname.includes('placehold.co')) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        if (cached) return cached;
        try {
          const networkRes = await fetch(req);
          if (networkRes.ok) {
            cache.put(req, networkRes.clone());
          }
          return networkRes;
        } catch (e) {
          return cached || new Response('', { status: 408, statusText: 'Image unavailable offline' });
        }
      })
    );
    return;
  }

  // HTML Navigation: Network-first with cache fallback
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req).then((networkRes) => {
        if (networkRes.ok) {
          const clone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return networkRes;
      }).catch(async () => {
        const cached = await caches.match(req);
        if (cached) return cached;
        // Fallback to cached index.html or homepage.html
        return caches.match('./index.html') || caches.match('./pages/homepage.html');
      })
    );
    return;
  }

  // App Shell & Static Assets (CSS, JS, Fonts, Icons): Cache-first with background revalidation
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req).then((networkRes) => {
        if (networkRes.ok) {
          const clone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return networkRes;
      }).catch(() => {
        // Offline and not in cache
      });

      return cached || fetchPromise;
    })
  );
});