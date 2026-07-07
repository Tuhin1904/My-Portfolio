'use client'

import React from 'react'
import StatCard from './StatCard'
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { Activity, Clock, Users, XCircle, CheckCircle2, AlertCircle } from 'lucide-react'

const Dashboard = () => {
    const stats = {
        total: 120,
        guest: 50,
        registered: 70,
        pending: 20,
        ongoing: 60,
        cancelled: 40,
    };

    const pieData = [
        { name: "Registered", value: stats.registered },
        { name: "Guest", value: stats.guest },
    ];

    const COLORS = ["#6366f1", "#a855f7"];

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-card rounded-xl px-4 py-2 text-sm text-white border border-white/10">
                    <p className="font-semibold">{payload[0].name}</p>
                    <p style={{ color: payload[0].payload.fill }}>{payload[0].value} queries</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-8">
            {/* Page heading */}
            <div>
                <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-1">Overview</p>
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            </div>

            {/* Top stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <StatCard title="Total Queries" value={stats.total} accent="#6366f1"
                    icon={<Activity size={20} />} />
                <StatCard title="Guest Queries" value={stats.guest} accent="#a855f7"
                    icon={<Users size={20} />} />
                <StatCard title="Registered Queries" value={stats.registered} accent="#06b6d4"
                    icon={<CheckCircle2 size={20} />} />
            </div>

            {/* Status row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <StatCard title="Pending" value={stats.pending} accent="#f59e0b"
                    icon={<Clock size={20} />} />
                <StatCard title="Undergoing" value={stats.ongoing} accent="#22c55e"
                    icon={<AlertCircle size={20} />} />
                <StatCard title="Cancelled / Rejected" value={stats.cancelled} accent="#ef4444"
                    icon={<XCircle size={20} />} />
            </div>

            {/* Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="mb-5">
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Distribution</p>
                        <h3 className="text-white font-semibold">User Type Breakdown</h3>
                    </div>
                    <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={4}
                                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                                    labelLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                                >
                                    {pieData.map((_, index) => (
                                        <Cell key={index} fill={COLORS[index]}
                                            style={{ filter: `drop-shadow(0 0 8px ${COLORS[index]}60)` }} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    formatter={(value) => <span className="text-gray-400 text-sm">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quick insights */}
                <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="mb-5">
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Insights</p>
                        <h3 className="text-white font-semibold">Quick Summary</h3>
                    </div>
                    <div className="flex flex-col gap-4">
                        {[
                            { label: 'Pending attention', value: stats.pending, color: '#f59e0b' },
                            { label: 'Active projects', value: stats.ongoing, color: '#22c55e' },
                            { label: 'Conversion rate', value: `${Math.round((stats.registered / stats.total) * 100)}%`, color: '#6366f1' },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center justify-between p-3 rounded-xl"
                                style={{ background: `${item.color}10`, border: `1px solid ${item.color}25` }}>
                                <span className="text-sm text-gray-400">{item.label}</span>
                                <span className="font-bold text-white" style={{ color: item.color }}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard