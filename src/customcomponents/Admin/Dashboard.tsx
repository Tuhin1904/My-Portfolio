'use client'

import React from 'react'
import StatCard from './StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

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
        { name: "Guest", value: stats.guest }];

    const COLORS = ["#822909", "#f0b37a"];

    return (
        <div className="p-4 space-y-6">
            {/* 🔹 TOP CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard title="Total Queries" value={stats.total} />
                <StatCard title="Guest Queries" value={stats.guest} />
                <StatCard title="Registered Queries" value={stats.registered} />
            </div>

            {/* 🔹 STATUS ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard title="Pending" value={stats.pending} />
                <StatCard title="Undergoing" value={stats.ongoing} />
                <StatCard title="Cancelled / Rejected" value={stats.cancelled} />
            </div>

            {/* 🔹 CHART + EXTRA */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* PIE CHART */}
                <Card>
                    <CardHeader>
                        <CardTitle>User Type Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    outerRadius={100}
                                    label
                                >
                                    {pieData.map((_, index) => (
                                        <Cell key={index} fill={COLORS[index]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* EXTRA SECTION */}
                {/* <Card>
                    <CardHeader>
                        <CardTitle>Quick Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-gray-600">
                        <p>• {stats.pending} queries need attention</p>
                        <p>• {stats.ongoing} projects currently active</p>
                        <p>• Conversion rate: {Math.round((stats.registered / stats.total) * 100)}%</p>
                    </CardContent>
                </Card> */}

            </div>
        </div>
    )
}

export default Dashboard