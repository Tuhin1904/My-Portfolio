import React from "react";
import { ChatManager } from "@/components/chat/ChatManager";

const ClientMessagesPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">My Consultations</h2>
        {/* <p className="text-gray-500 text-xs mt-1">Discuss requirements and monitor project query statuses in real-time.</p> */}
      </div>
      <ChatManager role="client" />
    </div>
  );
};

export default ClientMessagesPage;
