// PersistProvider.tsx
"use client";

import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/store";
import { Provider } from "react-redux";
import { Toaster } from "@/components/ui/sonner"
import { useEffect } from "react";
import { apiRequest } from "@/apiFiles/apiClient";
import { apiEndpoints } from "@/apiFiles/apiEndpoints";
import { subscribeToForegroundMessages } from "@/lib/fcm";
import { toast } from "sonner";

export default function StorePersistProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const PING_KEY = "lastPingTime";
    const THIRTY_MIN = 30 * 60 * 1000;
    const LOCK_KEY = "ping_lock";

    const acquireLock = () => {
        if (localStorage.getItem(LOCK_KEY)) return false;

        localStorage.setItem(LOCK_KEY, "true");
        setTimeout(() => localStorage.removeItem(LOCK_KEY), 10000);

        return true;
    };

    const onLoad = async () => {
        try {
            if (!shouldPing() || !acquireLock()) return;

            await apiRequest({
                method: "GET",
                url: apiEndpoints.pingRequest,
            });

            updatePingTime();
        } catch (err) {
            console.log("Server wake up initiated but :", err);
        }
    }

    const shouldPing = () => {
        const lastPing = localStorage.getItem(PING_KEY);

        if (!lastPing) return true;

        const now = Date.now();
        return now - Number(lastPing) > THIRTY_MIN;
    };

    const updatePingTime = () => {
        localStorage.setItem(PING_KEY, Date.now().toString());
    };

    useEffect(() => {
        onLoad();
    }, []);

    // Mount foreground FCM listener once on app boot.
    // Shows a toast when a push notification arrives while the tab is active.
    useEffect(() => {
        let unsubscribe: (() => void) | null = null;

        subscribeToForegroundMessages((payload) => {
            const title = payload.notification?.title || 'New Notification';
            const body = payload.notification?.body || '';
            const conversationId = payload.data?.conversationId;

            toast(title, {
                description: body,
                action: conversationId
                    ? {
                          label: 'View',
                          onClick: () => {
                              window.location.href = `/chat/${conversationId}`;
                          },
                      }
                    : undefined,
            });
        }).then((fn) => {
            unsubscribe = fn;
        });

        return () => {
            unsubscribe?.();
        };
    }, []);

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Toaster />
                {children}
            </PersistGate>
        </Provider>
    );
}