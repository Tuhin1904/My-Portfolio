"use client";

import { apiRequest } from "@/apiFiles/apiClient";
import { apiEndpoints } from "@/apiFiles/apiEndpoints";
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
    getStatusLabel,
} from "@/const/milestones";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getLabel, getBudgetLabel } from "@/const/masterData";
import { ChevronUp, ChevronDown, ChevronLeft, User, Briefcase, Mail, DollarSign, MessageSquare, ShieldAlert } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { QueryChatBox } from "@/components/chat/QueryChatBox";

const ViewClientRequestDetails = () => {
    const route = useRouter();
    const { id } = useParams();
    const userInfo = useSelector((state: RootState) => state.user);
    const [data, setData] = useState<any>(null);
    const [status, setStatus] = useState("");
    const [chatReq, setChatReq] = useState<any>(null);
    // const [pendingRequests, setPendingRequests] = useState<any[]>([]);
    const [isChatPopupOpen, setIsChatPopupOpen] = useState(false);

    const getPendingRequests = async () => {
        try {
            // const res = await apiRequest({
            //     method: "GET",
            //     url: apiEndpoints.viewPendingChatRequests(id as string),
            // });
            // setPendingRequests(res?.data || []);
        } catch (error) {
            console.error("Error fetching pending requests", error);
        }
    };

    const getChatReqStatus = async (userId: string) => {
        try {
            const res = await apiRequest({
                method: "GET",
                url: apiEndpoints.viewChatrequestOfUser(userId, id as string),
            });
            setChatReq(res?.data);
        } catch (error) {
            console.error("Error fetching chat req status", error);
        }
    };

    const getQuery = async () => {
        const res = await apiRequest({
            method: "GET",
            url: `${apiEndpoints.getAllQueries}/${id}`,
        });
        setStatus(res?.data?.status || "");
        setData(res?.data || null);

        // if (res?.data?.userId) {
        //     getChatReqStatus(res.data.userId);
        // }
    };

    useEffect(() => {
        if (id) {
            getQuery();
            getPendingRequests();
        }
    }, [id]);

    const getAllowedStatuses = () => {
        if (!status) return [];
        if (TERMINAL_STATUS.includes(status)) return [status];

        const currentIndex = STATUS_FLOW.indexOf(status);
        const allowed = [
            STATUS_FLOW[currentIndex],
            STATUS_FLOW[currentIndex + 1],
            ...TERMINAL_STATUS,
        ].filter(Boolean);

        return allowed.filter(s => s === status || (s !== "accepted_by_client" && s !== "delivered"));
    };

    const handleStatusChange = async (value: string) => {
        setStatus(value);
        try {
            await apiRequest({
                method: "POST",
                url: apiEndpoints.updateQuery(id as string),
                data: { status: value },
            });
            if (value == "accepted") route.push("/admin/messages");

        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const handleChatAction = async (actionStatus: string) => {
        if (!chatReq?.request?._id) return console.error("Chat Request id not found");
        try {
            const actionStr = actionStatus === "accepted" ? "accept" : "reject";
            await apiRequest({
                method: "POST",
                url: apiEndpoints.chatReqRespond(chatReq?.request?._id),
                data: { action: actionStr },
            });

            if (data?.userId) getChatReqStatus(data.userId);
            getPendingRequests();
        } catch (error) {
            console.error("Error updating chat request", error);
        }
    };

    if (!data) return <div className="p-6 text-white text-center">Loading...</div>;

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
                                {getStatusLabel(status, 'admin')}
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
                                    <p className="text-sm text-gray-300 capitalize">{getLabel(data.workType)}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]" style={{ border: '1px solid rgba(255,255,255,0.03)' }}>
                                <DollarSign size={16} className="text-indigo-400 shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Budget range</p>
                                    <p className="text-sm text-gray-300">{getBudgetLabel(data.budget)}</p>
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
                            <h3 className="text-white font-semibold">Current: {getStatusLabel(status, 'admin')}</h3>
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
                                                    {getStatusLabel(step, 'admin')}
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
                                                <span className="text-sm">{getStatusLabel(s, 'admin')}</span>
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
                <div className={`fixed bottom-0 right-4 w-[330px] glass-card shadow-2xl rounded-t-2xl border transition-all duration-300 z-50 overflow-hidden ${isChatPopupOpen ? "translate-y-0" : "translate-y-[calc(100%-48px)]"
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

                        {chatReq.status === "pending" ? (
                            <div className="flex flex-col items-center justify-center py-10 gap-3 text-center border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                                <ShieldAlert size={28} className="text-gray-655" />
                                <p className="text-xs text-gray-500 max-w-[200px]">
                                    Accept the chat request to begin communicating with this client.
                                </p>
                            </div>
                        ) : chatReq.status === "accepted" ? (
                            <QueryChatBox queryId={id as string} currentUserId={userInfo?._id || ""} />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 gap-3 text-center border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                                <ShieldAlert size={28} className="text-red-400" />
                                <p className="text-xs text-gray-500 max-w-[200px]">
                                    The chat request was rejected.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {status === "pending" && (
                <div
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-slate-950/95 border border-indigo-500/35 shadow-[0_20px_50px_rgba(0,0,0,0.6)] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 z-50 backdrop-blur-xl animate-in slide-in-from-bottom duration-500"
                    style={{ border: '1px solid rgba(99,102,241,0.25)' }}
                >
                    <div className="flex items-center gap-3 text-center sm:text-left">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                            <ShieldAlert size={20} />
                        </div>
                        <div>
                            <h4 className="text-white font-semibold text-sm">Pending Review</h4>
                            <p className="text-gray-400 text-xs mt-0.5">This project inquiry needs your approval before the client can begin chatting with you.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                        <button
                            onClick={() => handleStatusChange("rejected")}
                            className="flex-1 sm:flex-none text-center text-xs font-semibold text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-400/50 px-4 py-2.5 rounded-xl transition-all cursor-pointer hover:bg-red-500/10"
                        >
                            Reject Request
                        </button>
                        <button
                            onClick={() => handleStatusChange("accepted")}
                            className="flex-1 sm:flex-none text-center text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-[0_4px_15px_rgba(99,102,241,0.35)]"
                        >
                            Accept Request
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewClientRequestDetails;
