// In development, always fetch from the network and do not enable offline support.
// This is because caching would make development more difficult (changes would not
// be reflected on the first load after each change).

// PERMETTE DI RICHIAMARE LA VERSIONE DEL SERVICE WORKER DAL MAIN THREAD
VERSION = "1.2.43";

self.addEventListener('message', e =>
        {
            if (e.data === 'GET_VERSION') {
                e.source.postMessage(VERSION);
            }
        });



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


self.addEventListener('install', event => {
    event.waitUntil(
        self.skipWaiting()
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        self.clients.claim()
    );
});
*/