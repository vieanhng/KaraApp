// Basic Service Worker for PWA
self.addEventListener('install', (event) => {
    console.log('SW installed');
});

self.addEventListener('fetch', (event) => {
    // Basic pass-through
    event.respondWith(fetch(event.request));
});
