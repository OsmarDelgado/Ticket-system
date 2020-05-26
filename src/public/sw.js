const staticCacheName = 'site-static-v2';
const dynamicCacheName = 'site-dynamic-v1';
const assets = [
    './',
    '/css/styles.css',
    '/img/Canion-del-Sumidero.jpg',
    '/img/Nelios_logo.png',
    'https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Roboto:300,300i,400,400i,500,500i,700,700i&display=swap',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css',
    'https://kit.fontawesome.com/60a8f45d49.js',
];

// Cache size limit function
const limitCacheSize = (name, size) => {
    caches.open(name)
        .then(cache => {
            cache.keys()
                .then(keys => {
                    if(keys.length > size) {
                        cache.delete(keys[0])
                            .then(limitCacheSize(name, size));
                    }
                })
        })
};

// Install Service Worker
self.addEventListener('install', (evt) => {
    //console.log( 'Service Worker has been installed' );
    evt.waitUntil(
        caches.open(staticCacheName)
            .then((cache) => {
                console.log('Caching shell assets');
                cache.addAll(assets);
            })
    );
});

// Activate Service Worker
self.addEventListener('activate', (evt) => {
    //console.log( 'Service Worker has been activated' );
    evt.waitUntil(
        caches.keys()
            .then(keys => {
                //console.log(keys);
                return Promise.all(keys
                    .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                    .map(key => caches.delete(key))
                );
            })
    );
});

// Fetch event
self.addEventListener('fetch', (evt) => {
    //console.log( 'Fetch event', evt );
    //if(evt.requeest.url.indexOf()){
    // evt.respondWith(
    //     caches.match(evt.request)
    //         .then(cacheRes => {
    //             return cacheRes || fetch(evt.request).then(fetchRes => {
    //                 return caches.open(dynamicCacheName).then(cache => {
    //                     cache.put(evt.request.url, fetchRes.clone());
    //                     limitCacheSize(dynamicCacheName, 20)
    //                     return fetchRes;
    //                 })
    //             });
    //         })
    // );
    //}
});