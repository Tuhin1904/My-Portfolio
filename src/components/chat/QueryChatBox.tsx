import React, { useEffect, useState, useRef } from "react";
import { getSocket } from "@/lib/socket";
import { apiRequest } from "@/apiFiles/apiClient";
import { apiEndpoints } from "@/apiFiles/apiEndpoints";
import {
  Send,
  MessageSquare,
  Loader2,
  CheckCheck,
  Check,
  Ban,
} from "lucide-react";
import Image from "next/image";

interface MessagePayload {
  _id: string;
  queryId: string;
  senderId: {
    _id: string;
    userName: string;
    email: string;
    profilePicUrl?: string;
    userRole: number;
  };
  message: string;
  createdAt: string;
  readBy: string[];
}

interface OnlineStatus {
  isOnline: boolean;
  lastSeen: string | null;
}

interface QueryChatBoxProps {
  queryId: string;
  currentUserId: string;
  /** Pass query status in so we can pre-gate before the socket fires */
  queryStatus?: string;
}

const formatLastSeen = (lastSeen: string | null): string => {
  if (!lastSeen) return "a while ago";
  const date = new Date(lastSeen);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

/** Statuses where a chat is fully locked for everyone */
const CHAT_DISABLED_STATUSES = ["cancelled"];
/** Statuses where a client cannot join at all (access denied) */
const CHAT_NO_ACCESS_STATUSES = ["pending", "rejected"];

export const QueryChatBox: React.FC<QueryChatBoxProps> = ({
  queryId,
  currentUserId,
  queryStatus,
}) => {
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [partnerStatus, setPartnerStatus] = useState<OnlineStatus>({
    isOnline: false,
    lastSeen: null,
  });
  /** True when the chat is read-only (cancelled status) */
  const [chatDisabled, setChatDisabled] = useState(
    queryStatus ? CHAT_DISABLED_STATUSES.includes(queryStatus) : false
  );
  const [disabledReason, setDisabledReason] = useState(
    queryStatus === "cancelled"
      ? "This project enquiry has been cancelled. The chat is now read-only."
      : ""
  );

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch initial history
  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await apiRequest({
        method: "GET",
        url: apiEndpoints.getChatHistory(queryId),
      });
      setMessages(res?.data || []);
      setError("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load chat history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!queryId || !currentUserId) return;

    fetchHistory();

    const socket = getSocket();
    socket.connect();
    socket.emit("register_user", { userId: currentUserId });
    socket.emit("join_query_room", { queryId, userId: currentUserId });

    // New real-time message
    socket.on("receive_chat_message", (message: MessagePayload) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
      // Auto-mark as read since we're in the room
      socket.emit("mark_as_read", { queryId, userId: currentUserId });
    });

    // Partner online/offline status change
    socket.on(
      "user_status_change",
      ({
        userId,
        isOnline,
        lastSeen,
      }: {
        userId: string;
        isOnline: boolean;
        lastSeen: string | null;
      }) => {
        if (userId !== currentUserId) {
          setPartnerStatus({ isOnline, lastSeen });
        }
      }
    );

    // Initial online users in room
    socket.on(
      "room_online_status",
      ({ onlineUserIds }: { onlineUserIds: string[] }) => {
        const partnerOnline = onlineUserIds.some((id) => id !== currentUserId);
        if (partnerOnline) {
          setPartnerStatus({ isOnline: true, lastSeen: null });
        }
      }
    );

    // Read receipt — partner read our messages
    socket.on(
      "messages_read",
      ({
        readByUserId,
      }: {
        readByUserId: string;
        queryId: string;
      }) => {
        if (readByUserId !== currentUserId) {
          setMessages((prev) =>
            prev.map((m) => {
              const senderIdStr =
                typeof m.senderId === "string"
                  ? m.senderId
                  : m.senderId?._id;
              if (
                senderIdStr === currentUserId &&
                !m.readBy.includes(readByUserId)
              ) {
                return { ...m, readBy: [...m.readBy, readByUserId] };
              }
              return m;
            })
          );
        }
      }
    );

    // Chat disabled by status change (e.g., cancelled)
    socket.on(
      "chat_disabled",
      ({ reason }: { queryId: string; reason: string }) => {
        setChatDisabled(true);
        setDisabledReason(reason);
      }
    );

    socket.on("chat_error", (err: { message: string }) => {
      console.error("Socket error:", err.message);
    });

    // Mark existing messages as read on mount
    socket.emit("mark_as_read", { queryId, userId: currentUserId });

    return () => {
      socket.emit("leave_query_room", { queryId });
      socket.off("receive_chat_message");
      socket.off("user_status_change");
      socket.off("room_online_status");
      socket.off("messages_read");
      socket.off("chat_disabled");
      socket.off("chat_error");
    };
  }, [queryId, currentUserId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || chatDisabled) return;

    const socket = getSocket();
    socket.emit("send_chat_message", {
      queryId,
      senderId: currentUserId,
      messageText: text.trim(),
    });

    setText("");
    inputRef.current?.focus();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-2">
        <Loader2 className="animate-spin text-indigo-400" size={24} />
        <span className="text-xs">Connecting to chat session...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-white/5 rounded-xl bg-white/[0.01]">
        <MessageSquare size={28} className="text-gray-600 mb-2" />
        <p className="text-xs text-gray-400 max-w-[220px]">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[460px] bg-slate-950/40 rounded-xl border border-white/5 overflow-hidden">
      {/* Online status header */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-950/50 border-b border-white/5 shrink-0">
        <div className="relative">
          <div className="w-7 h-7 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-xs font-bold border border-indigo-500/20">
            {partnerStatus.isOnline ? "●" : "○"}
          </div>
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-950 transition-colors duration-300 ${
              chatDisabled
                ? "bg-red-500"
                : partnerStatus.isOnline
                ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]"
                : "bg-gray-600"
            }`}
          />
        </div>
        <div className="leading-none flex-1">
          {chatDisabled ? (
            <p className="text-xs font-semibold text-red-400">Chat Stopped</p>
          ) : (
            <p
              className={`text-xs font-semibold ${
                partnerStatus.isOnline ? "text-emerald-400" : "text-gray-400"
              }`}
            >
              {partnerStatus.isOnline ? "Online" : "Offline"}
            </p>
          )}
          {!chatDisabled && !partnerStatus.isOnline && (
            <p className="text-[10px] text-gray-600 mt-0.5">
              Last seen {formatLastSeen(partnerStatus.lastSeen)}
            </p>
          )}
        </div>
        {chatDisabled && (
          <Ban size={14} className="text-red-400 shrink-0" />
        )}
      </div>

      {/* Chat Stopped Banner */}
      {chatDisabled && (
        <div className="flex items-center gap-2.5 px-4 py-2 bg-red-500/[0.08] border-b border-red-500/20 shrink-0">
          <Ban size={13} className="text-red-400 shrink-0" />
          <p className="text-[11px] text-red-300 leading-tight">{disabledReason}</p>
        </div>
      )}

      {/* Messages viewport */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-1.5">
            <MessageSquare size={24} className="opacity-40" />
            <p className="text-[11px] text-center px-4">
              No messages yet. Send a greeting to begin chatting!
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const senderIdStr =
              typeof msg.senderId === "string"
                ? msg.senderId
                : msg.senderId?._id;
            const isMe = senderIdStr === currentUserId;
            const senderName = (msg.senderId as any)?.userName || "User";
            const profilePic = (msg.senderId as any)?.profilePicUrl;
            const isRead =
              msg.readBy &&
              msg.readBy.some((rid) => rid !== currentUserId);

            return (
              <div
                key={msg._id}
                className={`flex gap-2.5 items-end ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                {/* Recipient avatar */}
                {!isMe && (
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20">
                    {profilePic ? (
                      <Image
                        width={24}
                        height={24}
                        src={profilePic}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-indigo-400 uppercase font-bold">
                        {senderName[0]}
                      </span>
                    )}
                  </div>
                )}

                {/* Message bubble */}
                <div className="flex flex-col max-w-[75%] gap-0.5">
                  {!isMe && (
                    <span className="text-[9px] text-gray-500 px-1">
                      {senderName}
                    </span>
                  )}

                  <div
                    className={`px-3 py-2 rounded-2xl text-xs leading-relaxed break-words ${
                      isMe
                        ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-br-none shadow-[0_2px_8px_rgba(99,102,241,0.25)]"
                        : "bg-slate-900 border border-white/5 text-gray-300 rounded-bl-none"
                    }`}
                  >
                    {msg.message}
                  </div>

                  {/* Timestamp + Read receipt */}
                  <div
                    className={`flex items-center gap-1 px-1 ${
                      isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    <span className="text-[9px] text-gray-600">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {isMe && (
                      <span className="flex items-center">
                        {isRead ? (
                          <CheckCheck size={11} className="text-indigo-400" />
                        ) : (
                          <Check size={11} className="text-gray-600" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Message input — locked when chat is disabled */}
      {chatDisabled ? (
        <div className="p-3 bg-slate-950/70 border-t border-red-500/20 flex items-center gap-2.5 shrink-0">
          <Ban size={14} className="text-red-400 shrink-0" />
          <p className="text-[11px] text-red-400/70 italic">
            Chat has been disabled for this inquiry.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSendMessage}
          className="p-2.5 bg-slate-950/70 border-t border-white/5 flex gap-2 shrink-0"
        >
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-slate-900/60 border border-white/5 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="w-8 h-8 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all cursor-pointer shadow-[0_2px_8px_rgba(99,102,241,0.3)] shrink-0"
          >
            <Send size={13} />
          </button>
        </form>
      )}
    </div>
  );
};
