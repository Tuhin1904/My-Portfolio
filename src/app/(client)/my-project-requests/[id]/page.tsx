'use client'

import { apiRequest } from '@/apiFiles/apiClient';
import { apiEndpoints } from '@/apiFiles/apiEndpoints';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { STATUS_CONFIG, STATUS_FLOW, TERMINAL_STATUS } from '@/const/milestones';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getLabel } from '@/const/masterData';

const page = () => {
    const { id } = useParams();
    const [data, setData] = useState<any>(null);
    const [status, setStatus] = useState("");

    const getQuery = async () => {
        const res = await apiRequest({
            method: "GET",
            url: `${apiEndpoints.getMyQueries}/${id}`
        })
        console.log("My query : ", res)
        setStatus(res.status)
        setData(res || null);
    }

    useEffect(() => {
        if (id) {
            getQuery();
        }
    }, [id]);

    const getAllowedStatuses = () => {
        if (!status) return [];

        // If terminal → no changes
        if (TERMINAL_STATUS.includes(status)) return [status];

        const currentIndex = STATUS_FLOW.indexOf(status);

        return [
            STATUS_FLOW[currentIndex],
            STATUS_FLOW[currentIndex + 1],
            ...TERMINAL_STATUS,
        ].filter(Boolean);
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        // TODO: call API update here
    };

    if (!data) return <div className="p-6">Loading...</div>

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            {/* Main Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span className="capitalize">{data?.name}</span>
                        <Badge variant="secondary" className={`capitalize ${STATUS_CONFIG[status]}`}>{status}</Badge>
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <p>
                        <strong>Email:</strong> {data.email}
                    </p>
                    <p>
                        <strong>Work Type:</strong> {getLabel(data.workType)}
                    </p>
                    <p>
                        <strong>Budget:</strong> {data.budget}
                    </p>
                    <p>
                        <strong>User Type:</strong>{" "}
                        <span className="capitalize">{data.typeOfUser}</span>{" "}
                    </p>

                    <Separator />

                    <p>
                        <strong>Message:</strong>
                    </p>
                    <p className="text-muted-foreground">{data.message}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span>Status Progress</span>
                        <span className="text-sm capitalize">{status}</span>
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* 🔷 Stepper */}
                    {!TERMINAL_STATUS.includes(status) && (
                        <div className="flex items-center">
                            {STATUS_FLOW.map((step, index) => {
                                const normalizedStatus = status?.trim().toLowerCase();

                                const currentIndex = STATUS_FLOW.indexOf(normalizedStatus);
                                const isActive = index <= currentIndex;
                                const isCompletedLine = index < currentIndex;

                                return (
                                    <React.Fragment key={step}>
                                        {/* Step Circle */}
                                        <div className="flex flex-col items-center">
                                            <div
                                                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all
  ${isActive ? STATUS_CONFIG[step] : "bg-gray-300 text-white"}`}
                                            >
                                                {index + 1}
                                            </div>

                                            <p className="text-xs mt-1 capitalize">{step}</p>
                                        </div>

                                        {/* Connector Line */}
                                        {index !== STATUS_FLOW.length - 1 && (
                                            <div className="flex-1 h-1 mx-2 rounded">
                                                <div
                                                    className={`h-full rounded transition-all
                                                ${isCompletedLine
                                                            ? "bg-green-500"
                                                            : "bg-gray-300 opacity-50"
                                                        }`}
                                                />
                                            </div>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    )}

                    {/* 🔷 Status Dropdown */}
                    <div>
                        <p className="text-sm mb-2 font-medium">Update Status</p>

                        <Select value={status} onValueChange={handleStatusChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>

                            <SelectContent>
                                {getAllowedStatuses().map((s) => (
                                    <SelectItem key={s} value={s}>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`w-3 h-3 rounded-full ${STATUS_CONFIG[s]}`}
                                            />
                                            <span className="capitalize">{s}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default page