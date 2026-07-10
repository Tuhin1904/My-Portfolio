"use client";

import React from "react";
import { ChatManager } from "@/components/chat/ChatManager";

const AdminMessagesPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Client Consultations</h2>
        {/* <p className="text-gray-500 text-xs mt-1">Manage project requests and chat with clients in real-time.</p> */}
      </div>
      <ChatManager role="admin" />
    </div>
  );
};

export default AdminMessagesPage;
