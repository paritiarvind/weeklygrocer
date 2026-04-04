self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Core: Push event handler
self.addEventListener("push", (event) => {
  if (!event.data) {
    return;
  }

  const payload = event.data.json();

  const title = payload.title || "Annam";
  const body = payload.body || "";
  const url = payload.url || "/index.html";

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "icon.png",
      badge: "icon.png",
      data: { url }
    })
  );
});

// When user taps a notification
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data.url || "/index.html";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsArr) => {
      // If already open, focus it
      for (const client of clientsArr) {
        if (client.url.includes("index.html")) {
          return client.focus();
        }
      }
      // Otherwise open a new tab
      return clients.openWindow(url);
    })
  );
});
