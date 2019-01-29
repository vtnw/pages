self.addEventListener('notificationclick', function(event) {
  event.waitUntil({
    const url = "https://vtnw.github.io/pages/note.html?n=" + event.notification.title;
    const promiseChain = clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    })
    .then((windowClients) => {
      if(windowClients.length > 0){
        windowClients[windowClients.length-1].focus();
      } else {
        return clients.openWindow(url);
      }
    });
});
