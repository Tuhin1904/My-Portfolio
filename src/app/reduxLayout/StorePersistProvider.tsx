// PersistProvider.tsx
"use client";

import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/store";
import { Provider } from "react-redux";
import { Toaster } from "@/components/ui/sonner"

export default function StorePersistProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Toaster />
                {children}
            </PersistGate>
        </Provider>
    );
}