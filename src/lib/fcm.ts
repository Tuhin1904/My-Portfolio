import { getToken, onMessage, Messaging } from 'firebase/messaging';
import { getFirebaseMessaging } from './firebase';
import { apiRequest } from '@/apiFiles/apiClient';
import { apiEndpoints } from '@/apiFiles/apiEndpoints';

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

/**
 * Requests notification permission, obtains the FCM device token, and
 * POSTs it to the backend so the server can send push notifications.
 *
 * Call this immediately after a successful login.
 */
export const registerFcmToken = async () => {
  try {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('[FCM] Notification permission denied.');
      return;
    }

    const messaging = await getFirebaseMessaging();
    if (!messaging) {
      console.warn('[FCM] Firebase Messaging not supported in this browser.');
      return;
    }

    const fcmToken = await getToken(messaging as Messaging, { vapidKey: VAPID_KEY });
    if (!fcmToken) {
      console.warn('[FCM] Failed to get FCM token.');
      return;
    }

    await apiRequest({
      method: 'POST',
      url: apiEndpoints.fcmToken,
      data: { fcmToken },
    });

    console.log('[FCM] Token registered successfully.');
  } catch (err) {
    console.error('[FCM] Registration failed:', err);
  }
};

/**
 * Deletes the FCM token from the backend.
 * Call this before clearing Redux auth state on logout.
 */
export const removeFcmToken = async () => {
  try {
    await apiRequest({
      method: 'DELETE',
      url: apiEndpoints.fcmToken,
    });
    console.log('[FCM] Token cleared from backend.');
  } catch (err) {
    // Silently fail — user is logging out anyway
    console.warn('[FCM] Failed to clear token on backend:', err);
  }
};

/**
 * Subscribes to foreground FCM messages.
 * Returns an unsubscribe function — call it on component unmount.
 *
 * @param onPayload  Callback invoked with each incoming message payload.
 */
export const subscribeToForegroundMessages = async (
  onPayload: (payload: any) => void,
): Promise<(() => void) | null> => {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return null;

  const unsubscribe = onMessage(messaging as Messaging, onPayload);
  return unsubscribe;
};
