// public/firebase-messaging-sw.js
// Firebase compat SDK is required in service workers (ESM imports are not supported here).
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// ─── IMPORTANT ────────────────────────────────────────────────────────────────
// Service workers cannot read NEXT_PUBLIC_* env vars at runtime.
// Replace the placeholder strings below with your actual Firebase config values.
// These must match the values in your .env file.
// ──────────────────────────────────────────────────────────────────────────────
firebase.initializeApp({
  apiKey: 'REPLACE_WITH_NEXT_PUBLIC_FIREBASE_API_KEY',
  authDomain: 'REPLACE_WITH_NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  projectId: 'REPLACE_WITH_NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  storageBucket: 'REPLACE_WITH_NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'REPLACE_WITH_NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'REPLACE_WITH_NEXT_PUBLIC_FIREBASE_APP_ID',
});

const messaging = firebase.messaging();

/**
 * Handle background push notifications — fires when the tab is closed or
 * in the background and a push message arrives.
 */
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background message received:', payload);

  const title = payload.notification?.title || 'New Notification';
  const options = {
    body: payload.notification?.body || '',
    icon: '/images/icon-192x192.png',
    badge: '/images/icon-192x192.png',
    data: payload.data || {},
  };

  self.registration.showNotification(title, options);
});

/**
 * Handle notification click — navigates the user to the relevant page
 * when they tap the background notification.
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const conversationId = event.notification.data?.conversationId;
  const targetUrl = conversationId
    ? `/chat/${conversationId}`
    : '/';

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // If a tab is already open, focus it and navigate
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.focus();
            client.navigate(targetUrl);
            return;
          }
        }
        // Otherwise open a new tab
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      }),
  );
});
