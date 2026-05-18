self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
