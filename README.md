![5217](https://i.imgur.com/m1F5vNM.jpg)

# 5217-web

5217, the fantastic productivity timer by Francisco Franco and Liam Spradlin, now on the Web!

## Contributing

### Pull requests

This web app uses Webpack to build all of it's dependencies. You shouldn't have any problem with adding files but you will **have to use `webpack-dev-server`**. It's available without global installation, just run

```
$ npm install
$ npm start
```


Before submitting it's also advised to **test your changes after a production build**.
When you finish your edits, run `$ npm run build` and serve `/dist` directory with local server of your choice. Be sure to clear site data as used source-worker might not update it on the first reload!

If you're also **adding third-party resources**, you should try serving them locally from Node Modules. If that's impossible and you have to add content served from other domains, edit [service-worker.js](service-worker.js) file according to guide below:

<details>
  <summary>How to add external resources</summary>

  The first step is to add the link in this array:

  ```javascript
  workbox.precaching.precacheAndRoute([
    "https://fonts.googleapis.com/css?family=Roboto:300",
    "https://fonts.googleapis.com/icon?family=Material+Icons",
    /* HERE */
    //..
  ]);
  ```

  After that you must see:

  If the third party server you're using **supports cross-site requests** and points to a file that won't change (it's a static image, font or points to a specific version), you should add its hostname to this array:

  ```javascript
  // Those third party resources are also unmutable
  workbox.routing.registerRoute(
    matchURL(['fonts.googleapis.com', 'cdn.jsdelivr.net', 'code.jquery.com', 'fonts.gstatic.com' /* HERE */], { sameOrigin: false }),
    workbox.strategies.cacheFirst({
      cacheName: 'static-cache',
      plugins: [ new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 60 // 2 Months
      }) ]
    })
  );
  ```

  If **the file is mutable** but server **supports cross-site requests** you should add it here: (note that this might be commented out as there's no need for this section now)

  ```javascript
  // Those can be changed
  workbox.routing.registerRoute(
    matchURL([/* HERE */], { sameOrigin: false }),
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'mutable-cache',
      plugins: [ new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 60 // 2 Months
      }) ]
    })
  );
  ```

  The third case is that the server that you are using **doesn't support cross-site requests**. Then you should put it here:

  ```javascript
  // Sadly some send opaque responses which can't be cached
  workbox.routing.registerRoute(
    matchURL([/unpkg.com/ /* HERE */], { sameOrigin: false }),
    workbox.strategies.networkFirst({
      cacheName: 'static-cache',
      networkTimeoutSeconds: 60, // If network doesn't respond in a minute, use cache
      plugins: [ new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 60 // 2 Months
      }) ]
    })
  );
  ```

  and also add this attribute to the place where you import the script: `crossorigin="anonymous"`. Such like:
  ```html
  <link rel="stylesheet" crossorigin="anonymous" href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css">
  ```

  ### How to find out if server supports cross-site requests?

  It's easy - treat it as it would support it and once you have generated the service worker, serve it locally on `localhost`. It's important because only `localhost` triggers Workbox' debug mode. If you see a warning like this:
  ![Workbox opaque response warning](https://developers.google.com/web/tools/workbox/images/guides/third-party-requests/opaque-response-log.png)
  ...then your server does not support cross-site requests.
</details>