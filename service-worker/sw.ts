/// <reference lib="WebWorker" />
/// <reference types="vite/client" />
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';
import { NavigationRoute, registerRoute } from 'workbox-routing';

// Declare self for TypeScript
declare let self: ServiceWorkerGlobalScope;

// Define custom cache name and assets
const CACHE_NAME = `diamond-clinic-cache-v2 - ${self.location.origin}`;
const ASSETS_TO_CACHE = [
  'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap',
  'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap',
  `https://diamond.talenavi.com/api/json`,
];

// Precache assets defined in __WB_MANIFEST
precacheAndRoute(self.__WB_MANIFEST);

// Cache additional static assets during installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and caching additional assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch((error) => console.error('Caching failed', error)),
  );
});

cleanupOutdatedCaches();

self.addEventListener('message', async (event) => {
  if (event.data.action === 'cache-on-demand') {
    const cache = await caches.open(CACHE_NAME);
    const isCached = await cache.match('images/cache-me-outside.jpg');
    console.log('berhasil');
    if (!isCached) {
      const res = await fetch('images/cache-me-outside.jpg');
      await cache.put('images/cache-me-outside.jpg', res);
    }
  }
  event.ports[0].postMessage(true);
});
// Custom cache clearing for old versions of the manual cache
// self.addEventListener('activate', (event) => {
//   event.waitUntil(
//     caches.keys().then) => {
//       return Promise.all(
//       .map((cacheName) => {
//           if (cacheName !== CACHE_NAME) {
//             console.log('Deleting old cache:', cacheName);
//             return caches.delete(cacheName);
//           }
//         }),
//       );
//     }),
//   );
// });

// Serve cached assets for fetch events if available
self.addEventListener('fetch', (event) => {
  if (event.request.url.endsWith('.jpg') || event.request.url.endsWith('.jpeg') || event.request.url.endsWith('.png')) {
    event.respondWith(handleImageRequest(event));
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      }),
    );
  }
});

const handleImageRequest = async (event: FetchEvent) => {
  const cache = await caches.open(CACHE_NAME);
  const response = await cache.match(event.request.url);

  if (!response) {
    const fetchResponse = await fetch(event.request);
    cache.put(event.request.url, fetchResponse.clone());

    return fetchResponse;
  }

  return response;
};

// Navigation fallback route for SPA
let allowlist: undefined | RegExp[];
if (import.meta.env.DEV) allowlist = [/^\/$/];

registerRoute(new NavigationRoute(createHandlerBoundToURL('/'), { allowlist }));

self.skipWaiting();
clientsClaim();
