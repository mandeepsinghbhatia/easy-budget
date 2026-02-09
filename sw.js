importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

if (workbox) {
  console.log("Workbox is loaded 🎉");

  // 1. Force the waiting service worker to become the active service worker
  workbox.core.skipWaiting();
  workbox.core.clientsClaim();

  // 2. Precache the files listed in your original script
  // This ensures the basic UI loads instantly without the network
  workbox.precaching.precacheAndRoute([
    { url: 'index.html', revision: 'bb1a0731e000' },
    { url: 'manifest.json', revision: 'd11157c67b7c' },
    { url: 'assets/index-CsyKWHUr.js', revision: '457072446cab' },
    { url: 'assets/index-BS8WF3ZO.css', revision: '8e096e58607d' }
    // Add other critical assets from your previous list here
  ]);

  // 3. Navigation Route: Ensures any URL (like /settings or /profile) 
  // serves index.html so the app doesn't crash while offline
  workbox.routing.registerRoute(
    new workbox.routing.NavigationRoute(
      workbox.precaching.getCacheKeyForURL('index.html')
    )
  );

  // 4. Runtime Caching for Images
  // If the user views an image while online, it gets saved for offline use
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'images',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
  );

  // 5. Runtime Caching for Fonts
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'font',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'fonts',
    })
  );

} else {
  console.log("Workbox failed to load  worker remains inactive.");
}