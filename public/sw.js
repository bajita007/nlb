// Service Worker for Push Notifications
const CACHE_NAME = "lentera-bunda-v2"
const urlsToCache = ["/", "/manifest.json", "/icon-192x192.png", "/icon-512x512.png"]

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)))
})

// Fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response
      }
      return fetch(event.request)
    }),
  )
})

// Push event
self.addEventListener("push", (event) => {
  let data ={};
  if(event.data){
    data = event.data.json();
  }
  const title =`${data.title} | Lentera Bunda` || "Lentera Bunda";
  const options = {
    body: event.body || "Notifikasi baru dari Lentera Bunda",
    icon: "/icon-192x192.png",
    badge: "/badge-48.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: "2",
    },
    actions: [
      {
        action: "explore",
        title: "Buka Aplikasi",
        icon: "/icon-192x192.png",
      },
      {
        action: "close",
        title: "Tutup",
        icon: "/icon-192x192.png",
      },
    ],
  }

  event.waitUntil(self.registration.showNotification(, options))
})

// Notification click event
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/user/dashboard"))
  } else if (event.action === "close") {
    event.notification.close()
  } else {
    event.waitUntil(clients.openWindow("/"))
  }
})
