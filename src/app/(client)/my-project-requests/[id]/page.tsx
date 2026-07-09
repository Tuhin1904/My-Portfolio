'use client'

import { apiRequest } from '@/apiFiles/apiClient';
import { apiEndpoints } from '@/apiFiles/apiEndpoints';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, Mail, Briefcase, DollarSign, User, MessageSquare, ShieldAlert } from "lucide-react";
import { STATUS_CONFIG, STATUS_FLOW, TERMINAL_STATUS } from '@/const/milestones';
import { getLabel } from '@/const/masterData';

const page = () => {
    const route = useRouter();
    const { id } = useParams();
    const [data, setData] = useState<any>(null);
    const [status, setStatus] = useState("");
    const [chatReq, setChatReq] = useState<any>(null);
    const [isChatPopupOpen, setIsChatPopupOpen] = useState(false);

    const getChatReqStatus = async () => {
        try {
            const res = await apiRequest({
                method: "GET",
                url: apiEndpoints.viewMyChatrequestStat(id as string),
            });
            const requestData = res?.data || res;
            setChatReq(requestData);
        } catch (error) {
            console.error("Error fetching chat req status", error);
        }
    };

    const getQuery = async () => {
        const res = await apiRequest({
            method: "GET",
            url: `${apiEndpoints.getMyQueries}/${id}`
        });
        setStatus(res?.data?.status || "");
        setData(res?.data || null);
        // getChatReqStatus();
    };

    const handleAcceptQuery = async () => {
        try {
            await apiRequest({
                method: "POST",
                url: apiEndpoints.updateQuery(id as string),
                data: { status: "accepted_by_client" },
            });
            setStatus("accepted_by_client");
        } catch (error) {
            console.error("Failed to accept proposal:", error);
        }
    };
    const handleDeliverQuery = async () => {
        try {
            await apiRequest({
                method: "POST",
                url: apiEndpoints.updateQuery(id as string),
                data: { status: "delivered" },
            });
            setStatus("delivered");
        } catch (error) {
            console.error("Failed to mark as delivered:", error);
        }
    };
    useEffect(() => {
        if (id) getQuery();
    }, [id]);

    if (!data) return <div className="p-6 text-white text-center">Loading...</div>

    return (
        <div className="space-y-6">
            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => route.push("/my-project-requests")}
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
                                    <p className="text-sm text-gray-300 capitalize">{getLabel(data.workType)}</p>
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

                        <div className="h-px bg-white/5 mb-6" />

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

                        {!TERMINAL_STATUS.includes(status) && (
                            <div className="relative pl-6 space-y-6">
                                <div className="absolute left-2.5 top-2.5 bottom-2.5 w-0.5 bg-gray-800" />

                                {STATUS_FLOW.map((step, index) => {
                                    const normalizedStatus = status?.trim().toLowerCase();
                                    const currentIndex = STATUS_FLOW.indexOf(normalizedStatus);
                                    const isActive = index <= currentIndex;
                                    const isCurrent = index === currentIndex;

                                    return (
                                        <div key={step} className="relative flex gap-4 items-start">
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

                        {/* Action for Client to Accept */}
                        {status === "accepted" && (
                            <div className="pt-6 mt-6 border-t border-white/5">
                                <button
                                    onClick={handleAcceptQuery}
                                    className="w-full text-center py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 transition-all duration-200 cursor-pointer shadow-lg shadow-indigo-500/20 animate-pulse"
                                >
                                    Accept Proposal
                                </button>
                            </div>
                        )}

                        {/* Action for Client to Mark as Delivered */}
                        {status === "working" && (
                            <div className="pt-6 mt-6 border-t border-white/5">
                                <button
                                    onClick={handleDeliverQuery}
                                    className="w-full text-center py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 transition-all duration-200 cursor-pointer shadow-lg shadow-teal-500/20"
                                >
                                    Mark as Delivered
                                </button>
                            </div>
                        )}
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
                            <span className="font-semibold text-sm">Consultation Chat</span>
                        </div>
                        <div className="flex items-center text-gray-500">
                            {isChatPopupOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-4">
                        <div className="flex flex-col mb-4">
                            <p className="text-xs text-gray-400 mb-2">
                                Chat Status: <strong className="capitalize text-white">{chatReq.status}</strong>
                            </p>
                            {chatReq.status === "pending" && (
                                <p className="text-xs text-yellow-500/80 font-medium">Wait for admin to accept the chat request...</p>
                            )}
                            {chatReq.status === "rejected" && (
                                <p className="text-xs text-red-400 font-medium">Chat request was rejected.</p>
                            )}
                        </div>

                        {chatReq.status === "pending" ? (
                            <div className="flex flex-col items-center justify-center py-10 gap-3 text-center border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                                <ShieldAlert size={28} className="text-gray-600" />
                                <p className="text-xs text-gray-500 max-w-[200px]">
                                    The discussion chat window will unlock once the administrator accepts your request.
                                </p>
                            </div>
                        ) : chatReq.status === "accepted" ? (
                            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center border border-white/5 rounded-xl bg-white/[0.01] min-h-[280px]">
                                <MessageSquare size={36} className="text-indigo-400 animate-pulse" />
                                <p className="text-sm font-semibold text-white">Chat coming soon</p>
                                <p className="text-xs text-gray-500 max-w-[200px]">
                                    Live chat consultation feature will be available in a future update.
                                </p>
                            </div>
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
        </div>
    )
}

export default page