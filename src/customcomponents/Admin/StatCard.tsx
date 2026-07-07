import React from 'react'

type CardProps = {
    title: string;
    value: number;
    icon?: React.ReactNode;
    accent?: string;
};

const StatCard = ({ title, value, icon, accent = '#6366f1' }: CardProps) => {
    return (
        <div className="glass-card glow-card rounded-2xl p-6 flex items-center gap-4"
            style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
            {icon && (
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-xl"
                    style={{ background: `${accent}22`, border: `1px solid ${accent}44`, color: accent }}>
                    {icon}
                </div>
            )}
            <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">{title}</p>
                <p className="text-3xl font-bold text-white">{value}</p>
            </div>
        </div>
    )
}

export default StatCard