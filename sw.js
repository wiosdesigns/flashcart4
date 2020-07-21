const version = "0.1.9";

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('the-magic-cache').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/codefiles/assets/hind.ttf',
        '/codefiles/assets/icon.png',
        '/codefiles/assets/icon512.png',
        '/codefiles/assets/icons.ttf',
        '/codefiles/assets/logotext.png',
        '/codefiles/assets/ogbg.png',
        '/codefiles/assets/ogicon.png',
        '/codefiles/assets/phone.png',
        '/codefiles/assets/whatsapp.png',
        '/codefiles/css/main.css',
        '/codefiles/js/hnav.js',
        '/codefiles/js/main.js',        
        '/codefiles/js/papaparse.min.js',
        '/codefiles/js/tabletop.min.js',
        '/codefiles/js/vue.min.js'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
