var CACHE_NAME = "web";

self.addEventListener("install", function(event) {
  console.log("at install");
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log("adding all");
        return cache.addAll(["notify.html"]);
      })
  );
});

self.addEventListener("activate", function(event) {
  console.log("at activate");
  event.waitUntil(
    caches.keys().then(function(cacheNames) {console.log("clearing all");
      return Promise.all( cacheNames.map(function(cacheName) { return caches.delete(cacheName); }) );
    }).then(function(){
      caches.open(CACHE_NAME).then(function(cache) {
        console.log("re-adding all");
        return cache.addAll(["notify.html"]);
      })
    })
  );
});

self.addEventListener("fetch", function(event) {
  console.log("at fetch");
  event.respondWith(
    caches.match(event.request, {ignoreSearch: true}).then(function(response) {
      if (response) {console.log("cache match");
        return response;
      }
      return fetch(event.request).then(function(response) {
        if(!response || response.status !== 200 || response.type !== "basic") {console.log("invalid response");
          return response;
        }
        var responseToCache = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {console.log("cache put");
          cache.put(event.request, responseToCache);
        });console.log("return response");
        return response;
      });
    })
  );
});

self.addEventListener("notificationclick", function(event) {console.log("notification clicked");
  //event.notification.close();
  event.waitUntil(clients.openWindow("https://vtnw.github.io/pages/notify.html?data=" + event.notification.title));
});
