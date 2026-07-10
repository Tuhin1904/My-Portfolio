"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { apiRequest } from "@/apiFiles/apiClient";
import { apiEndpoints } from "@/apiFiles/apiEndpoints";
import { QueryChatBox } from "./QueryChatBox";
import { MessageSquare, Inbox, Loader2 } from "lucide-react";
import { getLabel } from "@/const/masterData";
import { STATUS_CONFIG, getStatusLabel } from "@/const/milestones";
import { getSocket } from "@/lib/socket";

interface QueryItem {
  _id: string;
  name: string;
  email: string;
  workType: string;
  budget: string;
  status: string;
  userId?: string;
  createdAt: string;
}

interface ChatManagerProps {
  role: "admin" | "client";
}

export const ChatManager: React.FC<ChatManagerProps> = ({ role }) => {
  const userInfo = useSelector((state: RootState) => state.user);
  const [queries, setQueries] = useState<QueryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeQuery, setActiveQuery] = useState<QueryItem | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const url = role === "admin" ? apiEndpoints.getAllQueries : apiEndpoints.getMyQueries;
      const res = await apiRequest({
        method: "GET",
        url,
      });

      const allQueries: QueryItem[] = res?.data || [];
      // Filter out pending and rejected queries (chat only unlocked for accepted ones)
      const activeChats = allQueries.filter(
        (q) => q.status !== "pending" && q.status !== "rejected"
      );
      setQueries(activeChats);

      if (activeChats.length > 0) {
        setActiveQuery(activeChats[0]);
      }
    } catch (err) {
      console.error("Failed to fetch query list for chat", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?._id) {
      fetchQueries();
    }
  }, [userInfo?._id]);

  // Track partner online status globally across all conversations
  useEffect(() => {
    if (!userInfo?._id) return;

    const socket = getSocket();
    socket.connect();
    socket.emit("register_user", { userId: userInfo._id });

    socket.on("user_status_change", ({ userId, isOnline }: { userId: string; isOnline: boolean }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        if (isOnline) {
          next.add(userId);
        } else {
          next.delete(userId);
        }
        return next;
      });
    });

    socket.on("room_online_status", ({ onlineUserIds }: { onlineUserIds: string[] }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        onlineUserIds.forEach((id) => {
          if (id !== userInfo._id) next.add(id);
        });
        return next;
      });
    });

    return () => {
      socket.off("user_status_change");
      socket.off("room_online_status");
    };
  }, [userInfo?._id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-2">
        <Loader2 className="animate-spin text-indigo-400" size={32} />
        <span className="text-sm font-medium">Loading conversations...</span>
      </div>
    );
  }

  if (queries.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center max-w-xl mx-auto flex flex-col items-center justify-center gap-4" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-2">
          <Inbox size={32} />
        </div>
        <h3 className="text-xl font-semibold text-white">No Active Chats</h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          {role === "admin"
            ? "There are no accepted project inquiries at the moment. Accept client requests from the Project Queries dashboard to open chat windows."
            : "No active consultation sessions found. Once the administrator reviews and accepts your project inquiry, your chat channel will open here."}
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[550px]" style={{ border: '1px solid var(--th-border)' }}>
      {/* Sidebar List (1/3 Width) */}
      <div className="border-r border-[var(--th-divider)] flex flex-col bg-black/[0.01] dark:bg-white/[0.01]">
        <div className="p-4 border-b border-[var(--th-divider)] flex items-center gap-2">
          <MessageSquare className="text-indigo-400" size={18} />
          <h3 className="text-white font-semibold text-sm">Conversations</h3>
          <span className="ms-auto bg-indigo-500/20 text-indigo-300 text-xs px-2 py-0.5 rounded-full font-semibold">{queries.length}</span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[var(--th-divider)]/30 max-h-[500px] custom-scrollbar">
          {queries.map((q) => {
            const isSelected = activeQuery?._id === q._id;
            // For admin view, q.userId is the client's id. For client view, there's no direct way to
            // know who the partner is from this data, but we track all online userIds.
            const partnerUserId = role === "admin" ? q.userId : undefined;
            const isPartnerOnline = partnerUserId ? onlineUsers.has(partnerUserId) : false;

            return (
              <div
                key={q._id}
                onClick={() => setActiveQuery(q)}
                className={`p-4 cursor-pointer transition-all duration-200 flex flex-col gap-1.5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] relative
                  ${isSelected ? "bg-black/[0.01] dark:bg-white/[0.03]" : ""}`}
              >
                {/* Left active marker bar */}
                {isSelected && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                )}

                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {/* Online dot */}
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 transition-colors duration-300 ${isPartnerOnline
                        ? "bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)]"
                        : "bg-gray-700"
                        }`}
                    />
                    <h4 className={`text-xs font-bold capitalize truncate transition-colors ${isSelected ? "text-white" : "text-gray-300"}`}>
                      {q.name}
                    </h4>
                  </div>
                  <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${STATUS_CONFIG[q.status]}`}>
                    {getStatusLabel(q.status, role)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-[10px] text-gray-500">
                  <span className="capitalize">{getLabel(q.workType)}</span>
                  <span className={isPartnerOnline ? "text-emerald-500" : ""}>
                    {isPartnerOnline ? "Online" : new Date(q.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area (2/3 Width) */}
      <div className="md:col-span-2 flex flex-col bg-black/[0.02] dark:bg-white/[0.02]">
        {activeQuery ? (
          <div className="flex flex-col h-full">
            {/* Header info */}
            <div className="p-4 border-b border-[var(--th-divider)] bg-black/[0.01] dark:bg-white/[0.01] flex items-center justify-between">
              <div>
                <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-semibold">Consultation chat</p>
                <h3 className="text-white font-semibold text-sm capitalize">{activeQuery.name}</h3>
              </div>
              <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${STATUS_CONFIG[activeQuery.status]}`}>
                {getStatusLabel(activeQuery.status, role)}
              </span>
            </div>

            {/* Chat viewport widget */}
            <div className="p-4 flex-1 flex flex-col justify-center">
              <QueryChatBox queryId={activeQuery._id} currentUserId={userInfo?._id || ""} queryStatus={activeQuery.status} />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center gap-3">
            <MessageSquare size={36} className="text-gray-700" />
            <p className="text-sm text-gray-500">Select a conversation from the list to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};
