/*
 * A service worker whose only job is to remove the previous one.
 *
 * The site used to be a Gatsby build with an offline service worker, which
 * served its own cached copy of every page. Browsers that visited back then
 * still have that worker installed, and it would go on showing them the old
 * site indefinitely. They re-check this URL for updates, find this file, and
 * it clears the caches, unregisters itself and reloads the open tabs.
 *
 * Keep it for as long as returning visitors from before the migration matter.
 */
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();

      const clients = await self.clients.matchAll({ type: 'window' });
      for (const client of clients) client.navigate(client.url);
    })(),
  );
});
