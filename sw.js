var CACHE_NAME = "web";
self.addEventListener("activate", function(event) {
	event.waitUntil(
		caches.keys().then(function(keys) {
			return Promise.all( keys.map(function(k) { return caches.delete(k); }) );
		}).then(function(){
			caches.open(CACHE_NAME).then(function(cache) { return cache.addAll(["notify.html"]); })
		})
	);
});
self.addEventListener("fetch", function(event) {
	event.respondWith(
		caches.match(event.request, {ignoreSearch: true}).then(function(response) {
			if (response) { return response; }
			return fetch(event.request).then(function(response) {
				if(!response || response.status !== 200 || response.type !== "basic") { return response; }
				caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, response.clone()); });
				return response;
			});
		})
	);
});
self.addEventListener("notificationclick", function(event) {
	event.notification.close();
	event.waitUntil(clients.openWindow("notify.html?d=" + event.notification.body));
});
