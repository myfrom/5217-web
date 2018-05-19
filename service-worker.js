importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');

if (!workbox) {
  console.log('Service Worker - Failed to load Workbox');
}

workbox.precaching.precacheAndRoute([
  {
    "url": "css/materialize.css",
    "revision": "a493a025029b0a4e35b914f9f68a08a8"
  },
  {
    "url": "css/materialize.min.css",
    "revision": "df8ee5622d9d736da06a6b0e7afdef55"
  },
  {
    "url": "css/style.css",
    "revision": "a9b54c0ebad61292dc5a47a9a3df2241"
  },
  {
    "url": "favicon/android-chrome-192x192.png",
    "revision": "27f45ef6481426517b0377b67fa7738e"
  },
  {
    "url": "favicon/android-chrome-256x256.png",
    "revision": "d2fe3ccd0516425713fee600665907e0"
  },
  {
    "url": "favicon/apple-touch-icon.png",
    "revision": "26da0d47f4f55eb63e22bddc66222c2d"
  },
  {
    "url": "favicon/browserconfig.xml",
    "revision": "ae871ccae98eccefe956c2e9489bddfc"
  },
  {
    "url": "favicon/favicon-16x16.png",
    "revision": "701d477917fc2b1e740e5f76316ad6c3"
  },
  {
    "url": "favicon/favicon-32x32.png",
    "revision": "f0ef315270b9448de2bb766fafc07061"
  },
  {
    "url": "favicon/favicon.ico",
    "revision": "ed2798c368731f8832f46f4f9d7456c9"
  },
  {
    "url": "favicon/manifest.json",
    "revision": "9ad8c5835d185ffb8916a90f5d201cc8"
  },
  {
    "url": "favicon/mstile-150x150.png",
    "revision": "aa495293fa96dc881e5d21b5a6a73523"
  },
  {
    "url": "favicon/safari-pinned-tab.svg",
    "revision": "a49cd6efc1cf6677932b63cf08fa6577"
  },
  {
    "url": "fonts/roboto/Roboto-Bold.woff",
    "revision": "eed9aab5449cc9c8430d7d258108f602"
  },
  {
    "url": "fonts/roboto/Roboto-Bold.woff2",
    "revision": "c0f1e4a4fdfb8048c72e86aadb2a247d"
  },
  {
    "url": "fonts/roboto/Roboto-Light.woff",
    "revision": "ea36cd9a0e9eee97012a67b8a4570d7b"
  },
  {
    "url": "fonts/roboto/Roboto-Light.woff2",
    "revision": "3c37aa69cd77e6a53a067170fa8fe2e9"
  },
  {
    "url": "fonts/roboto/Roboto-Medium.woff",
    "revision": "cf4d60bc0b1d4b2314085919a00e1724"
  },
  {
    "url": "fonts/roboto/Roboto-Medium.woff2",
    "revision": "1561b424aaef2f704bbd89155b3ce514"
  },
  {
    "url": "fonts/roboto/Roboto-Regular.woff",
    "revision": "3cf6adf61054c328b1b0ddcd8f9ce24d"
  },
  {
    "url": "fonts/roboto/Roboto-Regular.woff2",
    "revision": "5136cbe62a63604402f2fedb97f246f8"
  },
  {
    "url": "fonts/roboto/Roboto-Thin.woff",
    "revision": "44b78f142603eb69f593ed4002ed7a4a"
  },
  {
    "url": "fonts/roboto/Roboto-Thin.woff2",
    "revision": "1f35e6a11d27d2e10d28946d42332dc5"
  },
  {
    "url": "images/ic_5217.svg",
    "revision": "8ad454841f429aa6a1454c6f00de3e47"
  },
  {
    "url": "images/ic_notif_white.png",
    "revision": "b17450d75c1c3a16e45431897ab6993c"
  },
  {
    "url": "images/icon.png",
    "revision": "ad3a5bc1dbaa6e2d3f786e749dd5b4d8"
  },
  {
    "url": "js/5217.js",
    "revision": "d253a2a10fb955c48185dbf5aa5ee620"
  },
  {
    "url": "js/materialize.js",
    "revision": "6c0a2223a1daf8c2d3dc0079685d503f"
  },
  {
    "url": "js/materialize.min.js",
    "revision": "e98efeec88f756629f42e58b1e11acaa"
  },
  {
    "url": "sound/end_break.wav",
    "revision": "3373cb4b00ac7a1891f1000cc645bbb7"
  },
  {
    "url": "sound/end_work.wav",
    "revision": "12d183731ff4985a11f525cf9350f3cd"
  },
  {
    "url": "index.html",
    "revision": "ead6ae1530abf63b94e13b8f62b99405"
  }
]);

workbox.precaching.precacheAndRoute([
  "https://fonts.googleapis.com/css?family=Roboto:300",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css" ,
  "https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js",
  "https://code.jquery.com/jquery-3.2.1.min.js"
]);

workbox.googleAnalytics.initialize();

function matchURL(conditions, options = {}) {
  const currentOrigin = location.origin,
        sameOrigin = typeof options.sameOrigin === 'undefined' ? true : options.sameOrigin,
        acceptIndex = typeof options.acceptIndex === 'undefined' ? false : options.acceptIndex;
  return function({url, event}) {
    if (sameOrigin && url.origin !== currentOrigin) {
      return false;
    } else if (acceptIndex && url.origin === currentOrigin &&
      (url.pathname === '' || url.pathname === '/')) {
      return true;
    } else if (sameOrigin && url.origin === currentOrigin) {
      let matched = false;
      conditions.forEach(condition => {
        if (!condition instanceof RegExp) condition = new RegExp(condition);
        if (condition.test(url.href)) {
          matched = true;
          return;
        }
      });
      return matched;
    } else if (!sameOrigin) {
      let matched = false;
      conditions.forEach(condition => {
        if ((condition instanceof RegExp && condition.test(url.href))
          || (!(condition instanceof RegExp) && url.href.search(condition.toString()) !== -1)) {
          matched = true;
          return;
        }
      });
      return matched;
    } else return false;
  }
};

workbox.skipWaiting();
workbox.clientsClaim();


// All local routes are unmutable so cache forever
workbox.routing.registerRoute(
  matchURL([/.*/], { acceptIndex: true, sameOrigin: true }),
  workbox.strategies.cacheFirst({
    cacheName: 'unmutable-cache'
  })
);

// Those third party resources are also unmutable
workbox.routing.registerRoute(
  matchURL(['fonts.googleapis.com', 'cdn.jsdelivr.net', 'code.jquery.com', 'fonts.gstatic.com'], { sameOrigin: false }),
  workbox.strategies.cacheFirst({
    cacheName: 'static-cache',
    plugins: [ new workbox.expiration.Plugin({
      maxAgeSeconds: 60 * 60 * 24 * 60 // 2 Months
    }) ]
  })
);

// // Those can be changed
// workbox.routing.registerRoute(
//   matchURL([], { sameOrigin: false }),
//   workbox.strategies.staleWhileRevalidate({
//     cacheName: 'mutable-cache',
//     plugins: [ new workbox.expiration.Plugin({
//       maxAgeSeconds: 60 * 60 * 24 * 60 // 2 Months
//     }) ]
//   })
// );

// Sadly some send opaque responses which can't be cached
workbox.routing.registerRoute(
  matchURL([/unpkg.com/], { sameOrigin: false }),
  workbox.strategies.networkFirst({
    cacheName: 'static-cache',
    networkTimeoutSeconds: 60, // If network doesn't respond in a minute, use cache
    plugins: [ new workbox.expiration.Plugin({
      maxAgeSeconds: 60 * 60 * 24 * 60 // 2 Months
    }) ]
  })
);