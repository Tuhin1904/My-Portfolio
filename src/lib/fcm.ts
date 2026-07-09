import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

export const requestForToken = async (): Promise<string | null> => {
  if (typeof window === "undefined" || !("Notification" in window)) {
    console.warn("Notifications not supported in this environment.");
    return null;
  }

  if (!messaging) {
    console.warn("Firebase messaging is not initialized.");
    return null;
  }

  try {
    console.log("FCM: Current notification permission status is:", Notification.permission);
    const permission = await Notification.requestPermission();
    console.log("FCM: Notification permission request returned:", permission);
    if (permission !== "granted") {
      console.warn("FCM: Notification permission was not granted.");
      return null;
    }

    console.log("FCM: Requesting token with VAPID key:", process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY);
    const currentToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    if (currentToken) {
      return currentToken;
    } else {
      console.warn("No registration token available. Request permission to generate one.");
      return null;
    }
  } catch (err) {
    console.error("An error occurred while retrieving token:", err);
    return null;
  }
};
