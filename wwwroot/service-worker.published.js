
// BUILD_TIMESTAMP
const CACHE_NAME = 'pwa-cache-v1';



self.addEventListener('install', event => {
    self.skipWaiting(); // Forza il nuovo SW a diventare attivo subito
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

/*
self.addEventListener('fetch', event => {
    // Sempre rete, nessuna cache
});
*/