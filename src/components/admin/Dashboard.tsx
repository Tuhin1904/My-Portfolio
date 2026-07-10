'use client'

import React, { useEffect, useState } from 'react'
import StatCard from './StatCard'
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import {
    Activity, Clock, Users, XCircle, CheckCircle2, AlertCircle,
    TrendingUp, UserCheck, Loader2, RefreshCcw,
} from 'lucide-react'
import { apiRequest } from '@/apiFiles/apiClient'
import { apiEndpoints } from '@/apiFiles/apiEndpoints'

interface DashboardData {
    queries: {
        total: number;
        byStatus: Record<string, number>;
        guestCount: number;
        registeredCount: number;
        pendingCount: number;
        undergoingCount: number;
        closedCount: number;
        completedCount: number;
        ratio: { guest: number; registered: number };
        timeline: { _id: string; count: number }[];
    };
    users: {
        total: number;
        newLast7Days: number;
        newLast30Days: number;
    };
}

const COLORS = {
    indigo: '#6366f1',
    violet: '#a855f7',
    cyan: '#06b6d4',
    amber: '#f59e0b',
    emerald: '#22c55e',
    red: '#ef4444',
    rose: '#f43f5e',
}

const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-card rounded-xl px-3 py-2 text-xs text-white border border-white/10">
                <p className="font-semibold">{payload[0].name}</p>
                <p style={{ color: payload[0].payload.fill }}>{payload[0].value} queries ({payload[0].payload.percent}%)</p>
            </div>
        );
    }
    return null;
};

const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-card rounded-xl px-3 py-2 text-xs text-white border border-white/10">
                <p className="text-gray-400 mb-0.5">{label}</p>
                <p className="font-semibold text-indigo-300">{payload[0].value} queries</p>
            </div>
        );
    }
    return null;
};

const Dashboard = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError('');
            const res = await apiRequest({
                method: 'GET',
                url: apiEndpoints.getDashboardAnalytics,
            });
            setData(res?.data);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to load dashboard stats.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-gray-500">
                <Loader2 className="animate-spin text-indigo-400" size={28} />
                <span className="text-sm">Loading dashboard analytics...</span>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <AlertCircle className="text-red-400" size={32} />
                <p className="text-sm text-gray-400">{error || 'No data available.'}</p>
                <button
                    onClick={fetchStats}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/20 text-indigo-300 text-xs hover:bg-indigo-500/30 transition-colors cursor-pointer"
                >
                    <RefreshCcw size={13} /> Retry
                </button>
            </div>
        );
    }

    const { queries, users } = data;

    const pieData = [
        { name: 'Registered', value: queries.registeredCount, percent: queries.ratio.registered, fill: COLORS.indigo },
        { name: 'Guest', value: queries.guestCount, percent: queries.ratio.guest, fill: COLORS.violet },
    ];

    // Format timeline for BarChart — show last 14 days only to avoid crowding
    const timelineFormatted = queries.timeline.slice(-14).map((d) => ({
        date: d._id.slice(5), // "MM-DD"
        count: d.count,
    }));

    const statusBreakdown = [
        { label: 'Pending', key: 'pending', color: COLORS.amber, count: queries.pendingCount },
        { label: 'Accepted', key: 'accepted', color: COLORS.indigo, count: queries.byStatus.accepted || 0 },
        { label: 'Working', key: 'working', color: COLORS.emerald, count: queries.byStatus.working || 0 },
        { label: 'Completed', key: 'completed', color: COLORS.cyan, count: queries.completedCount },
        { label: 'Cancelled', key: 'cancelled', color: COLORS.red, count: queries.byStatus.cancelled || 0 },
        { label: 'Rejected', key: 'rejected', color: COLORS.rose, count: queries.byStatus.rejected || 0 },
    ];

    return (
        <div className="space-y-8">
            {/* Page heading */}
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-1">Overview</p>
                    <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                </div>
                <button
                    onClick={fetchStats}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/5 text-gray-400 text-xs hover:text-white hover:bg-white/[0.07] transition-all cursor-pointer"
                >
                    <RefreshCcw size={12} /> Refresh
                </button>
            </div>

            {/* ── Top stat cards ─────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard title="Total Queries" value={queries.total} accent={COLORS.indigo}
                    icon={<Activity size={20} />} />
                <StatCard title="Registered Users" value={users.total} accent={COLORS.cyan}
                    icon={<UserCheck size={20} />} />
                <StatCard title="Guest Queries" value={queries.guestCount} accent={COLORS.violet}
                    icon={<Users size={20} />} />
                <StatCard title="Registered Queries" value={queries.registeredCount} accent={COLORS.indigo}
                    icon={<CheckCircle2 size={20} />} />
            </div>

            {/* ── Status row ─────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <StatCard title="Pending" value={queries.pendingCount} accent={COLORS.amber}
                    icon={<Clock size={20} />} />
                <StatCard title="Undergoing" value={queries.undergoingCount} accent={COLORS.emerald}
                    icon={<TrendingUp size={20} />} />
                <StatCard title="Cancelled / Rejected" value={queries.closedCount} accent={COLORS.red}
                    icon={<XCircle size={20} />} />
            </div>

            {/* ── Charts row ─────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* Donut: Guest vs Registered */}
                <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="mb-5">
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Distribution</p>
                        <h3 className="text-white font-semibold">User Type Breakdown</h3>
                    </div>
                    <div className="h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={65}
                                    outerRadius={105}
                                    paddingAngle={4}
                                    label={({ name, percent }) =>
                                        `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                                    }
                                    labelLine={{ stroke: 'rgba(255,255,255,0.15)' }}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={index} fill={entry.fill}
                                            style={{ filter: `drop-shadow(0 0 8px ${entry.fill}55)` }} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomPieTooltip />} />
                                <Legend formatter={(value) =>
                                    <span className="text-gray-400 text-sm">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Ratio pill */}
                    <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full overflow-hidden bg-slate-900">
                            <div
                                className="h-full rounded-full"
                                style={{
                                    width: `${queries.ratio.registered}%`,
                                    background: `linear-gradient(to right, ${COLORS.indigo}, ${COLORS.violet})`,
                                }}
                            />
                        </div>
                        <span className="text-[10px] text-gray-500 shrink-0">
                            {queries.ratio.registered}% registered · {queries.ratio.guest}% guest
                        </span>
                    </div>
                </div>

                {/* 30-day Bar Chart */}
                <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="mb-5">
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Trend</p>
                        <h3 className="text-white font-semibold">Queries — Last 14 Days</h3>
                    </div>
                    <div className="h-[260px]">
                        {timelineFormatted.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-gray-600 text-xs">
                                No query activity in the last 30 days.
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={timelineFormatted} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fill: '#6b7280', fontSize: 10 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fill: '#6b7280', fontSize: 10 }}
                                        axisLine={false}
                                        tickLine={false}
                                        allowDecimals={false}
                                    />
                                    <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
                                    <Bar dataKey="count" radius={[4, 4, 0, 0]}
                                        fill="url(#barGrad)" />
                                    <defs>
                                        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={COLORS.indigo} stopOpacity={0.9} />
                                            <stop offset="100%" stopColor={COLORS.violet} stopOpacity={0.4} />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Status breakdown table ──────────────────────────── */}
            <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="mb-5">
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Breakdown</p>
                    <h3 className="text-white font-semibold">Query Status Detail</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {statusBreakdown.map((s) => (
                        <div
                            key={s.key}
                            className="flex flex-col gap-1.5 p-3 rounded-xl"
                            style={{ background: `${s.color}10`, border: `1px solid ${s.color}25` }}
                        >
                            <span className="text-[10px] uppercase tracking-wider font-semibold"
                                style={{ color: s.color }}>{s.label}</span>
                            <span className="text-2xl font-bold text-white">{s.count}</span>
                            <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all"
                                    style={{
                                        width: queries.total > 0
                                            ? `${Math.min(100, (s.count / queries.total) * 100).toFixed(1)}%`
                                            : '0%',
                                        background: s.color,
                                    }}
                                />
                            </div>
                            <span className="text-[9px] text-gray-600">
                                {queries.total > 0
                                    ? `${((s.count / queries.total) * 100).toFixed(1)}%`
                                    : '0%'} of total
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Quick insights ──────────────────────────────────── */}
            <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="mb-5">
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Insights</p>
                    <h3 className="text-white font-semibold">Quick Summary</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                        { label: 'Pending attention', value: queries.pendingCount, color: COLORS.amber, suffix: '' },
                        { label: 'Active projects', value: queries.undergoingCount, color: COLORS.emerald, suffix: '' },
                        { label: 'New users (7d)', value: users.newLast7Days, color: COLORS.cyan, suffix: '' },
                        {
                            label: 'Registered ratio',
                            value: `${queries.ratio.registered}%`,
                            color: COLORS.indigo,
                            suffix: ''
                        },
                    ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between p-3.5 rounded-xl"
                            style={{ background: `${item.color}10`, border: `1px solid ${item.color}25` }}>
                            <span className="text-sm text-gray-400">{item.label}</span>
                            <span className="font-bold" style={{ color: item.color }}>{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Dashboard
