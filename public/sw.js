self.addEventListener('push', function (event) {
    console.log('test')
    if (event.data) {
        const data = event.data.json()
        const options = {
            body: data.body,
            icon: data.icon || '/icon.png',
            badge: '/badge.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: '2',
                url: data.url
            },
        }
        event.waitUntil(self.registration.showNotification(data.title, options))
    }
})

self.addEventListener('notificationclick', function (event) {
    const notification = event.notification
    const notif_data = notification.data
    event.notification.close()

    event.waitUntil(clients.openWindow(notif_data['url']))
})
