import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

type CardProps = {
    title: string;
    value: number;
};

const StatCard = ({ title, value }: CardProps) => {
    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="text-sm text-gray-500">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">{value}</p>
            </CardContent>
        </Card>
    )
}

export default StatCard