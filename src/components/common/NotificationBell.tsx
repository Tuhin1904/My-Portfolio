"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  writeBatch,
  orderBy,
} from "firebase/firestore";
import { Bell, Trash2, Check, CheckCheck, Inbox, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotificationBell({ align = "auto" }: { align?: "left" | "right" | "auto" }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [dummyRead, setDummyRead] = useState(false);
  const [dummyDeleted, setDummyDeleted] = useState(false);
  const userId = useSelector((state: RootState) => state.user._id);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Subscribe to real-time notifications in Firestore
  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      return;
    }

    const q = query(
      collection(db, "notifications"),
      where("recipientId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: any[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setNotifications(list);
      },
      (error) => {
        console.error("Error fetching notifications:", error);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load initial dummy state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isRead = localStorage.getItem("dummyNotificationRead") === "true";
      setDummyRead(isRead);
      const isDeleted = localStorage.getItem("dummyNotificationDeleted") === "true";
      setDummyDeleted(isDeleted);
    }
  }, []);

  // Mark dummy notification as read when popover is opened
  useEffect(() => {
    if (isOpen && !userId && !dummyRead) {
      setDummyRead(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("dummyNotificationRead", "true");
      }
    }
  }, [isOpen, userId, dummyRead]);

  const notificationsList = userId
    ? notifications
    : dummyDeleted
      ? []
      : [
        {
          id: "onboarding",
          title: "Get Started Today! 👋",
          body: "Sign up now to submit project enquiries, track development milestones in real-time, and collaborate directly with me!",
          read: dummyRead,
          createdAt: new Date().toISOString(),
          isDummy: true,
        },
      ];

  const unreadCount = userId
    ? notifications.filter((n) => !n.read).length
    : dummyRead || dummyDeleted
      ? 0
      : 1;

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, "notifications", id), { read: true });
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await deleteDoc(doc(db, "notifications", id));
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const markAllAsRead = async () => {
    if (!userId || unreadCount === 0) return;
    try {
      const q = query(
        collection(db, "notifications"),
        where("recipientId", "==", userId),
        where("read", "==", false)
      );
      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => {
        batch.update(doc.ref, { read: true });
      });
      await batch.commit();
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-gray-400 hover:text-indigo-400 transition-colors duration-200 cursor-pointer p-2 rounded-full hover:bg-white/5 flex items-center justify-center"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 text-[9px] text-white font-bold items-center justify-center">
              {unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div
          className={`absolute mt-3 w-80 sm:w-96 rounded-2xl shadow-2xl z-50 border overflow-hidden transition-all duration-300 ${align === "left"
            ? "left-[-20px] sm:left-auto sm:right-0"
            : align === "right"
              ? "right-[-10px] sm:right-0"
              : "right-[-60px] xs:right-[-20px] sm:right-0"
            }`}
          style={{
            border: "1px solid var(--th-border)",
            background: "var(--th-bg-deeper)",
            backdropFilter: "blur(16px)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--th-divider)] bg-black/[0.01] dark:bg-white/[0.01]">
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <CheckCheck size={14} />
                Mark all as read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[350px] overflow-y-auto divide-y divide-[var(--th-divider)] custom-scrollbar">
            {notificationsList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <Inbox size={32} className="text-gray-600 mb-2" />
                <p className="text-sm text-gray-500 font-medium">No notifications yet</p>
                <p className="text-xs text-gray-650 mt-1">
                  {userId ? "Queries from registered users will appear here." : "Sign up or login to receive notifications."}
                </p>
              </div>
            ) : (
              notificationsList.map((notif) => (
                <div
                  key={notif.id}
                  className={`flex gap-3 p-4 transition-all duration-200 ${
                    notif.read
                      ? "bg-black/[0.02] hover:bg-black/[0.04] dark:bg-white/[0.01] dark:hover:bg-white/[0.02]"
                      : "bg-indigo-500/[0.02] hover:bg-indigo-500/[0.04] dark:bg-indigo-500/[0.04] dark:hover:bg-indigo-500/[0.06]"
                  }`}
                >
                  {/* Status Indicator */}
                  <div className="flex-shrink-0 mt-1">
                    <span
                      className={`block w-2.5 h-2.5 rounded-full ${
                        notif.read ? "bg-gray-400 dark:bg-gray-600" : "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm text-white font-medium truncate ${notif.read ? "opacity-70" : ""}`}>
                      {notif.title}
                    </p>
                    <p className={`text-xs text-gray-400 mt-0.5 break-words line-clamp-3 leading-relaxed ${notif.read ? "opacity-60" : ""}`}>
                      {notif.body}
                    </p>
                    {notif.budget && (
                      <p className="text-[11px] text-indigo-400 font-semibold mt-1">
                        Budget: {notif.budget}
                      </p>
                    )}
                    <span className="text-[10px] text-gray-650 block mt-2 font-light">
                      {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : ""}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 items-center justify-start flex-shrink-0">
                    {!notif.read && (
                      <button
                        onClick={() => {
                          if (notif.isDummy) {
                            setDummyRead(true);
                            if (typeof window !== "undefined") {
                              localStorage.setItem("dummyNotificationRead", "true");
                            }
                          } else {
                            markAsRead(notif.id);
                          }
                        }}
                        className="text-gray-400 hover:text-green-400 p-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
                        title="Mark as read"
                      >
                        <Check size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (notif.isDummy) {
                          setDummyDeleted(true);
                          if (typeof window !== "undefined") {
                            localStorage.setItem("dummyNotificationDeleted", "true");
                          }
                        } else {
                          deleteNotification(notif.id);
                        }
                      }}
                      className="text-gray-400 hover:text-red-400 p-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Call To Action for Guests */}
          {!userId && notificationsList.length > 0 && (
            <div className="p-3 border-t border-[var(--th-border)] bg-black/[0.01] dark:bg-white/[0.01] flex justify-center">
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push("/sign-up");
                }}
                className="w-full text-center py-2 px-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 transition-all duration-200 cursor-pointer shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-1.5"
              >
                <UserPlus size={14} />
                Create Free Account / Login
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
