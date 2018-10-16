self.addEventListener('notificationclick', function(event) {
  //event.notification.close();
  event.waitUntil(clients.openWindow("https://vtnw.github.io/pages/notify.html?data=" + event.notification.title));
});
