// sw.js — Service Worker: cache API responses & static assets
// Giúp tải trang nhanh hơn ở lần truy cập sau

const CACHE_NAME = 'd26-cache-v3';

// Static assets cần pre-cache ngay khi cài đặt
const PRECACHE_URLS = [
  '/',
  '/styles.css',
  '/js/api-loader.js',
  '/js/advisor.js',
  '/js/render.js',
  '/js/zalo-popup.js',
  '/images/logo-d26-sidebar.svg',
  '/images/logo-d26-horizontal.svg',
  '/js/application.js'
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
  // Chỉ cache GET requests (POST/PUT/DELETE không được Cache API hỗ trợ)
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Chỉ xử lý request cùng origin (không proxy CDN, Google Fonts, v.v.)
  if (url.origin !== self.location.origin) return;

  const path = url.pathname;

  // === API endpoints: network-first (không cache, luôn lấy dữ liệu mới) ===
  if (path.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(function() {
        return caches.match(event.request);
      })
    );
    return;
  }

  // === Static assets: stale-while-revalidate (giống API) ===
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
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match(event.request).then(function(cached) {
          const fetchPromise = fetch(event.request).then(function(response) {
            if (response && response.status === 200) {
              cache.put(event.request, response.clone());
            }
            return response;
          }).catch(function() {
            return cached;
          });
          return cached || fetchPromise;
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
