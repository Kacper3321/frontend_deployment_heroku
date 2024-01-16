/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

clientsClaim();

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
precacheAndRoute(self.__WB_MANIFEST);

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  // Return false to exempt requests from being fulfilled by index.html.
  ({ request, url }) => {
    // If this isn't a navigation, skip.
    if (request.mode !== 'navigate') {
      return false;
    } // If this is a URL that starts with /_, skip.

    if (url.pathname.startsWith('/_')) {
      return false;
    } // If this looks like a URL for a resource, because it contains // a file extension, skip.

    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    } // Return true to signal that we want to use the handler.

    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin .png requests like those from in public/
registerRoute(
  // Add in any other file extensions or routing criteria as needed.
  ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.png'), // Customize this strategy as needed, e.g., by changing to CacheFirst.
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      // Ensure that once this runtime cache reaches a maximum size the
      // least-recently used images are removed.
      new ExpirationPlugin({ maxEntries: 50 }),
    ],
  })
);

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Any other custom service worker logic can go here.

/*self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Usuń stare cache, które nie jest częścią bieżącej wersji aplikacji
                    if (cacheName !== 'my-cache') {
                        console.log('Service Worker: usuwanie starego cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});*/


// Nazwa cache
const CACHE_NAME = 'v1';

// Lista zasobów do buforowania
const urlsToCache = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/script.js',
    '/views/BookList.css',
    '/views/BookList.js',
    '/views/CheckOutList.css',
    '/views/CheckOutList.js',
    '/views/Home.css',
    '/views/Home.js',
    '/App.css',
    '/App.js',
    'D:/3Studia/pamiw/pamiw_zad6/frontend/public/index.html'


    // Dodaj więcej zasobów, które chcesz buforować
];

// Instalacja Service Workera i buforowanie zasobów
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Obsługa żądań sieciowych
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - zwróć odpowiedź z cache
                if (response) {
                    return response;
                }

                // Jeśli nie ma odpowiedzi w cache, pobierz ją z sieci
                return fetch(event.request).then(
                    response => {
                        // Sprawdź, czy otrzymaliśmy poprawną odpowiedź
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Klonowanie odpowiedzi
                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});

// Aktualizacja Service Workera i usuwanie starych cache
self.addEventListener('activate', event => {
    const cacheWhitelist = ['v1'];

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});