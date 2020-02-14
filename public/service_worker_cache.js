var cacheNamesToDelete = [];//old caches to delete on a new service worker activation
var version = '061502FB4D6E55BBB43DE53A2D7FB73F0F2A98EF70AEF00E8BF812E889EF574D';
var cacheName = 'v1';

self.addEventListener('install', function(event) {
    console.log('install');

    //forca nova versão
    self.skipWaiting();
    
    event.waitUntil(
      caches.open(cacheName).then(function(cache) {
        return cache.addAll(
          [
            '/',
            '/index.html',
            '/js/dist/main.min.js',
            '/css/style.css'
            /*
            '/css/style.css'
            '/css/fa_all.min.css',
            '/css/bootstrap.min.css',
            '/js/libs/angular.min.js',
            '/js/libs/jquery-1.9.1.min.js'
            */
          ] //File list goes here
        );//end addAll 
      })
    );
    /**/
  });

  self.addEventListener('activate', function(event) {
    console.log('installed');

    event.waitUntil(caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.filter(function(name) {
            // Return true if you want to remove this cache,
            // but remember that caches are shared across
            // the whole origin
            if(cacheNamesToDelete.indexOf(name) != -1){
              console.log('Worker Deleting Cache', name);
              return true;
            }else{
              return false;
            }

          }).map(function(cacheName) {
            console.log('Deleting', cacheName);
            return caches.delete(cacheName);
          })
        );
      })
    );//end wait until
  });

  self.addEventListener('fetch', function(event) {
    //console.log('Handling fetch event for', event.request.url);
    
    event.respondWith(
      caches.match(event.request).then(function(response) {
        //console.log('No response found in cache. About to fetch from network...');

        if (response) {
          console.log('Found response in cache:', response);
          return response;
        }
  
        return fetch(event.request).then(function(response) {
          //console.log('Response from network is:', response);
          //vai meter todos estes assets na cache
          if(
            String(event.request.url).indexOf('/images/') != -1 
            || String(event.request.url).indexOf('/webfonts/') != -1
            || String(event.request.url).indexOf('/js/libs/') != -1
            || String(event.request.url).indexOf('/js/dist/') != -1
            //|| String(event.request.url).indexOf('/json/') != -1
            || String(event.request.url).indexOf('/css/') != -1
            || String(event.request.url).indexOf('#!/') != -1
          ){
            return caches.open(cacheName).then(function(cache) {
              cache.put(event.request, response.clone());

              return response;
            });
          }else{
            return response;
          }
        }).catch(function(error) {
          console.error('Fetching failed: ' + event.request.url, error);
  
          throw error;
        });
      })
    );//end respondWith

  });