self.addEventListener('notificationclick', function(event) {
  event.waitUntil(clients.openWindow("https://vtnw.github.io/pages/note.html?m=view));
});
