var cacheName = '5217-cache';
var filesToCache = [
  '/5217-web/',
  '/5217-web/index.html',
  '/5217-web/css/materialize.css',
  '/5217-web/css/materialize.min.css',
  '/5217-web/css/style.css',
  '/5217-web/images/ic_5217.svg',
  '/5217-web/images/icon.png',
  '/5217-web/js/5217.js',
  '/5217-web/js/materialize.js',
  '/5217-web/js/materialize.min.js',
  '/5217-web/sound/end_break.wav',
  '/5217-web/sound/end_work.wav',
  '/5217-web/favicon/android-chrome-192x192.png',
  '/5217-web/favicon/android-chrome-256x256.png',
  '/5217-web/favicon/apple-touch-icon.png',
  '/5217-web/favicon/browserconfig.xml',
  '/5217-web/favicon/favicon-16x16.png',
  '/5217-web/favicon/favicon-32x32.png',
  '/5217-web/favicon/favicon.ico',
  '/5217-web/favicon/manifest.json',
  '/5217-web/favicon/mstile-150x150.png',
  '/5217-web/favicon/safari-pinned-tab.svg',
  '/5217-web/fonts/roboto/Roboto-Bold.woff',
  '/5217-web/fonts/roboto/Roboto-Bold.woff2',
  '/5217-web/fonts/roboto/Roboto-Light.woff',
  '/5217-web/fonts/roboto/Roboto-Light.woff2',
  '/5217-web/fonts/roboto/Roboto-Medium.woff',
  '/5217-web/fonts/roboto/Roboto-Medium.woff2',
  '/5217-web/fonts/roboto/Roboto-Regular.woff',
  '/5217-web/fonts/roboto/Roboto-Regular.woff2',
  '/5217-web/fonts/roboto/Roboto-Thin.woff',
  '/5217-web/fonts/roboto/Roboto-Thin.woff2'
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
         return clients.focus();
      })
    );
  // close all notifications
  self.registration.getNotifications().then(function(notifications) {
    notifications.forEach(function(notification) {
      notification.close();
    });
  });
});
