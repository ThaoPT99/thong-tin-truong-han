// sw.js — Service Worker: cache API responses & static assets
// Giúp tải trang nhanh hơn ở lần truy cập sau

var CACHE_NAME = 'd26-cache-v1';

// Static assets cần pre-cache ngay khi cài đặt
var PRECACHE_URLS = [
  './',
  './styles.css',
  './api-loader.js',
  './advisor.js',
  './render.js',
  './zalo-popup.js',
  './images/logo-d26-sidebar.svg',
  './images/logo-d26-horizontal.svg'
];

// Install: pre-cache static assets
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(PRECACHE_URLS);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// Activate: clean old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(name) {
          return name !== CACHE_NAME;
        }).map(function(name) {
          return caches.delete(name);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Fetch: stale-while-revalidate cho API, cache-first cho static
self.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url);

  // Chỉ xử lý request cùng origin (không proxy CDN, Google Fonts, v.v.)
  if (url.origin !== self.location.origin) return;

  var path = url.pathname;

  // === API endpoints: stale-while-revalidate ===
  if (path.startsWith('/api/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match(event.request).then(function(cached) {
          var fetchPromise = fetch(event.request).then(function(response) {
            if (response && response.status === 200) {
              cache.put(event.request, response.clone());
            }
            return response;
          }).catch(function() {
            return cached;
          });
          // Trả về cache ngay nếu có, không thì chờ network
          return cached || fetchPromise;
        });
      })
    );
    return;
  }

  // === Static assets: cache-first, fallback network ===
  if (
    path.endsWith('.js') ||
    path.endsWith('.css') ||
    path.endsWith('.svg') ||
    path.endsWith('.png') ||
    path.endsWith('.webp') ||
    path === '/' ||
    path === ''
  ) {
    event.respondWith(
      caches.match(event.request).then(function(cached) {
        return cached || fetch(event.request).then(function(response) {
          return caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
    return;
  }

  // Mọi thứ khác: network-first
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});
