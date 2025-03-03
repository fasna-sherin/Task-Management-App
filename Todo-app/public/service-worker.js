const CACHE_NAME = "pwa-offline-cache-v1";
const OFFLINE_URL = "/offline.html";

// List of files to cache
const URLS_TO_CACHE = [
  "/",
  "/index.html",
  "/offline.html",
  "/static/css/main.css",
  "/static/js/main.js",
];

// Install event - cache files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Activate event - cleanup old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cache) => cache !== CACHE_NAME)
          .map((cache) => caches.delete(cache))
      );
    })
  );
});

// Fetch event - serve files from cache when offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
