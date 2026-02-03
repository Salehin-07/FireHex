// Base Service Worker implementation.  To use your own Service Worker, set the PWA_SERVICE_WORKER_PATH variable in settings.py

var staticCacheName = "django-pwa-v" + new Date().getTime();
var filesToCache = [
    '/offline/',
    '/static/css/django-pwa-app.css',
    '/static/img/logo.png'
    'static/css/admin_request_detail.css',
    'static/csd/admin_request.css',
    'static/css/admin_requests.css',
    'static/css/credentials_update.css',
    'static/css/footer.css'
    'static/css/nav.css',
    'static/css/login.css',
    'static/css/my_applications.css',
    'static/css/profile.css',
    'static/css/signup.css',
    'static/css/tournament_detail.css',
    'static/css/tournament.css',
    'static/js/footer.js',
    'static/js/nav.js',
    'static/js/tournament_detail.css',
    'static/js/tournament.css',
    'static/js/admin_requests.js',
    'static/js/credentials_update.js',
    'static/js/admin_tournaments.js',
    'static/js/login.js',
    'static/js/my_applications.js',
    'static/js/profile.js',
    'static/js/signup.js',
    'static/js/tournament_detail.js',
    'static/js/tournament.js'
];

// Cache on install
self.addEventListener("install", event => {
    this.skipWaiting();
    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                return cache.addAll(filesToCache);
            })
    )
});

// Clear cache on activate
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => (cacheName.startsWith("django-pwa-")))
                    .filter(cacheName => (cacheName !== staticCacheName))
                    .map(cacheName => caches.delete(cacheName))
            );
        })
    );
});

// Serve from Cache
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
            .catch(() => {
                return caches.match('/offline/');
            })
    )
});