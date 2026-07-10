"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { requestForToken } from "@/lib/fcm";
import { apiRequest } from "@/apiFiles/apiClient";
import { apiEndpoints } from "@/apiFiles/apiEndpoints";
import { onMessage } from "firebase/messaging";
import { messaging } from "@/lib/firebase";

export default function FCMRegister() {
  const token = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    if (!token) return;

    const registerFCM = async () => {
      try {
        const fcmToken = await requestForToken();
        if (fcmToken) {
          console.log("FCM Token retrieved successfully:", fcmToken);
          // Send to backend
          await apiRequest({
            method: "PUT",
            url: apiEndpoints.updateFcmToken,
            data: { fcmToken },
          });
        }
      } catch (err) {
        console.error("Failed to register FCM token:", err);
      }
    };

    registerFCM();
  }, [token]);

  useEffect(() => {
    if (!messaging) return;

    // Listen for foreground notifications
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);
      // Display native browser notification if allowed
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        new Notification(payload.notification?.title || "New Notification", {
          body: payload.notification?.body || "",
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return null;
}
