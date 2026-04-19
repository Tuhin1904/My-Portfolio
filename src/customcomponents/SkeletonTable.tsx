import React from 'react'

const SkeletonTable = () => {
    return (
        <div className="p-6">
            <div className="border rounded-lg p-4 space-y-3">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="h-6 bg-gray-200 rounded animate-pulse"
                    />
                ))}
            </div>
        </div>
    )
}

export default SkeletonTable