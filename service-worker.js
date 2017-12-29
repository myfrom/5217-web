var cacheName = '5217-cache';
var filesToCache = [
  '/',
  '/index.html',
  '/css/materialize.css',
  '/css/materialize.min.css',
  '/css/style.css',
  '/images/ic_5217.svg',
  '/images/icon.png',
  '/js/5217.js',
  '/js/materialize.js',
  '/js/materialize.min.js',
  '/sound/end_break.wav',
  '/sound/end_work.wav'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});
self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});
self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
self.addEventListener('notificationclick', event => {
  // do your notification magic
  //     notification.close();
    const rootUrl = new URL('/', location).href;
    // Enumerate windows, and call window.focus(), or open a new one.
    event.waitUntil(
      clients.matchAll().then(matchedClients => {
        for (let client of matchedClients) {
          if (client.url === rootUrl) {
            return client.focus();
          }
        }
         return clients.openWindow("/");
      })
    );
  // close all notifications
  self.registration.getNotifications().then(function(notifications) {
    notifications.forEach(function(notification) {
      notification.close();
    });
  });
});
