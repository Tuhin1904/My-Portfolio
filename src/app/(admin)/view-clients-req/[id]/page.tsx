"use client";

import { apiRequest } from "@/apiFiles/apiClient";
import { apiEndpoints } from "@/apiFiles/apiEndpoints";
import { store } from "@/store";
import { io, Socket } from "socket.io-client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    STATUS_CONFIG,
    STATUS_FLOW,
    TERMINAL_STATUS,
} from "@/const/milestones";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { getLabel } from "@/const/masterData";
import { ChevronUp, ChevronDown, ChevronLeft, Calendar, User, Briefcase, Mail, DollarSign, MessageSquare, ShieldAlert } from "lucide-react";
import ChatBox from "@/customcomponents/Chat/ChatBox";

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api").replace(/\/api$/, "");

const page = () => {
    const route = useRouter();
    const { id } = useParams();
    const [data, setData] = useState<any>(null);
    const [status, setStatus] = useState("");
    const [chatReq, setChatReq] = useState<any>(null);
    const [isChatPopupOpen, setIsChatPopupOpen] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);

    const socketRef = useRef<Socket | null>(null);

    const getChatReqStatus = async (userId: string) => {
        try {
            const res = await apiRequest({
                method: "GET",
                url: apiEndpoints.viewChatrequestOfUser(userId),
            });
            setChatReq(res?.data);

            if (res?.data?.status === "accepted") {
                const conversationId =
                    res?.data?.conversation?._id ||
                    res?.data?.conversationId ||
                    res?.data?._id;

                if (conversationId && !socketRef.current) {
                    const token = store.getState().auth.accessToken;
                    const newSocket = io(BACKEND_URL, { auth: { token } });

                    newSocket.on("joined", (d) => {
                        console.log("[Admin] Joined conversation:", d.conversationId);
                    });

                    newSocket.emit("join_conversation", { conversationId });
                    socketRef.current = newSocket;
                    setSocket(newSocket);
                }
            }
        } catch (error) {
            console.error("Error fetching chat req status", error);
        }
    };

    const getQuery = async () => {
        const res = await apiRequest({
            method: "GET",
            url: `${apiEndpoints.getAllQueries}/${id}`,
        });
        setStatus(res?.status);
        setData(res?.data || null);

        if (res?.data?.userId) {
            getChatReqStatus(res.data.userId);
        }
    };

    useEffect(() => {
        if (id) getQuery();
    }, [id]);

    useEffect(() => {
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, []);

    const getAllowedStatuses = () => {
        if (!status) return [];
        if (TERMINAL_STATUS.includes(status)) return [status];

        const currentIndex = STATUS_FLOW.indexOf(status);
        return [
            STATUS_FLOW[currentIndex],
            STATUS_FLOW[currentIndex + 1],
            ...TERMINAL_STATUS,
        ].filter(Boolean);
    };

    const handleStatusChange = async (value: string) => {
        setStatus(value);
        try {
            // Update status API
            await apiRequest({
                method: "PUT",
                url: `${apiEndpoints.getAllQueries}/${id}`,
                data: { status: value },
            });
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const handleChatAction = async (actionStatus: string) => {
        if (!chatReq?.request?._id) return console.error("Chat Request id not found");
        try {
            const actionStr = actionStatus === "accepted" ? "accept" : "reject";
            const res = await apiRequest({
                method: "POST",
                url: apiEndpoints.chatReqRespond(chatReq?.request?._id),
                data: { action: actionStr },
            });

            const conversationId = res?.data?.conversation?._id ?? null;
            console.log("[Admin] Chat respond result:", res, "conversationId:", conversationId);

            if (actionStr === "accept" && conversationId) {
                const token = store.getState().auth.accessToken;

                if (socketRef.current) {
                    socketRef.current.disconnect();
                    socketRef.current = null;
                    setSocket(null);
                }

                const newSocket = io(BACKEND_URL, { auth: { token } });

                newSocket.on("joined", (d) => {
                    console.log("[Admin] Joined conversation:", d.conversationId);
                    newSocket.emit("send_message", {
                        conversationId,
                        content: "Hello, how can I help you today?",
                    });
                });

                newSocket.emit("join_conversation", { conversationId });

                socketRef.current = newSocket;
                setSocket(newSocket);
            }

            if (data?.userId) getChatReqStatus(data.userId);
        } catch (error) {
            console.error("Error updating chat request", error);
        }
    };

    if (!data) return <div className="p-6 text-white text-center">Loading...</div>;

    const conversationId =
        chatReq?.conversation?._id ||
        chatReq?.conversationId ||
        chatReq?._id;

    return (
        <div className="space-y-6">
            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => route.push("/view-clients-req")}
                    className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-indigo-400 transition-all cursor-pointer group uppercase tracking-widest"
                >
                    <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                    Back to Enquiries
                </button>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* LEFT — Enquiry details (3/5) */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <div className="glass-card rounded-2xl p-8" style={{ border: '1px solid rgba(99,102,241,0.15)' }}>
                        <div className="flex justify-between items-start gap-4 mb-6">
                            <div>
                                <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-1">Inquiry details</p>
                                <h2 className="text-2xl font-bold text-white capitalize">{data.name}</h2>
                            </div>
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider ${STATUS_CONFIG[status]}`}>
                                {status}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]" style={{ border: '1px solid rgba(255,255,255,0.03)' }}>
                                <Mail size={16} className="text-indigo-400 shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Email address</p>
                                    <p className="text-sm text-gray-300 truncate">{data.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]" style={{ border: '1px solid rgba(255,255,255,0.03)' }}>
                                <Briefcase size={16} className="text-indigo-400 shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Work Type</p>
                                    <p className="text-sm text-gray-300 capitalize">{data.workType}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]" style={{ border: '1px solid rgba(255,255,255,0.03)' }}>
                                <DollarSign size={16} className="text-indigo-400 shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Budget range</p>
                                    <p className="text-sm text-gray-300">{data.budget}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]" style={{ border: '1px solid rgba(255,255,255,0.03)' }}>
                                <User size={16} className="text-indigo-400 shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">User Type</p>
                                    <p className="text-sm text-gray-300 capitalize">{data.typeOfUser}</p>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-white/5 mb-6" />

                        {/* Message Description */}
                        <div>
                            <label className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2 block">Project Message</label>
                            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 text-sm text-gray-300 leading-relaxed min-h-[120px]">
                                {data.message}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT — Status progress (2/5) */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                        <div className="mb-6">
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Status Progress</p>
                            <h3 className="text-white font-semibold capitalize">Current: {status}</h3>
                        </div>

                        {/* Stepper nodes */}
                        {!TERMINAL_STATUS.includes(status) && (
                            <div className="relative pl-6 space-y-6 mb-6">
                                {/* Vertical progress line */}
                                <div className="absolute left-2.5 top-2.5 bottom-2.5 w-0.5 bg-gray-800" />

                                {STATUS_FLOW.map((step, index) => {
                                    const currentIndex = STATUS_FLOW.indexOf(status?.trim().toLowerCase());
                                    const isActive = index <= currentIndex;
                                    const isCurrent = index === currentIndex;

                                    return (
                                        <div key={step} className="relative flex gap-4 items-start">
                                            {/* Stepper node circle */}
                                            <div className={`absolute -left-[21px] w-[11px] h-[11px] rounded-full border-2 transition-all duration-300 z-10
                                                ${isActive ? 'bg-indigo-500 border-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 'bg-gray-900 border-gray-700'}`} />
                                            
                                            <div className="min-w-0">
                                                <p className={`text-xs font-semibold uppercase tracking-wider transition-colors
                                                    ${isCurrent ? 'text-indigo-400' : isActive ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    {step}
                                                </p>
                                                <p className="text-[10px] text-gray-600 mt-0.5">
                                                    {isActive ? 'Step completed' : 'Pending step'}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Update Status Dropdown */}
                        <div className="pt-4 border-t border-white/5">
                            <label className="block text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">Update Query Status</label>
                            <Select value={status} onValueChange={handleStatusChange}>
                                <SelectTrigger className="w-full bg-gray-800/60 border-white/8 text-gray-300 rounded-xl focus:border-indigo-500/60">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>

                                <SelectContent className="bg-gray-900 border border-white/10 text-white">
                                    {getAllowedStatuses().map((s) => (
                                        <SelectItem key={s} value={s} className="hover:bg-indigo-500/10 cursor-pointer">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2.5 h-2.5 rounded-full ${STATUS_CONFIG[s]}`} />
                                                <span className="capitalize text-sm">{s}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

            </div>

            {/* Chat Request Popup Widget */}
            {chatReq && (
                <div className={`fixed bottom-0 right-4 w-[330px] glass-card shadow-2xl rounded-t-2xl border transition-all duration-300 z-50 overflow-hidden ${
                    isChatPopupOpen ? "translate-y-0" : "translate-y-[calc(100%-48px)]"
                }`} style={{ border: '1px solid rgba(99,102,241,0.25)', background: 'rgba(15,15,26,0.95)', backdropFilter: 'blur(16px)' }}>
                    
                    {/* Header */}
                    <div
                        className="flex items-center justify-between px-4 py-3 cursor-pointer bg-white/[0.02] border-b border-white/5 transition-colors hover:bg-white/[0.04]"
                        onClick={() => setIsChatPopupOpen(!isChatPopupOpen)}
                    >
                        <div className="flex items-center gap-2 text-indigo-400">
                            <MessageSquare size={16} />
                            <span className="font-semibold text-sm">Client Chat Box</span>
                        </div>
                        <div className="flex items-center text-gray-500">
                            {isChatPopupOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-4 text-xs">
                            <p className="text-gray-400">
                                Request Status:{" "}
                                <strong className="capitalize text-white">{chatReq.status}</strong>
                            </p>
                            {chatReq.status === "pending" && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleChatAction("rejected")}
                                        className="text-[10px] font-semibold text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-400/50 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleChatAction("accepted")}
                                        className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 hover:border-indigo-400/50 px-2.5 py-1 rounded-lg transition-all cursor-pointer hover:bg-indigo-500/10"
                                    >
                                        Accept
                                    </button>
                                </div>
                            )}
                        </div>

                        {chatReq.status === "accepted" ? (
                            <div className="border border-white/5 rounded-xl min-h-[280px] flex flex-col bg-white/[0.01] overflow-hidden">
                                <ChatBox
                                    socket={socket}
                                    conversationId={conversationId}
                                    currentUserType="admin"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 gap-3 text-center border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                                <ShieldAlert size={28} className="text-gray-600" />
                                <p className="text-xs text-gray-500 max-w-[200px]">
                                    {chatReq.status === "pending" ? "Accept the chat request to begin communicating with this client." : "This chat request has been rejected."}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default page;
