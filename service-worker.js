if (!workbox) {
  console.log('Service Worker - Failed to load Workbox');
}

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
    cacheName: 'unmutable-cache',
    plugins: [ new workbox.expiration.Plugin({
      maxAgeSeconds: 60 * 60 * 24 * 30 * 12 // 1 year
    }) ]
  })
);