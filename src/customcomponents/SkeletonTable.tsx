import { TableBody, TableCell, TableRow } from '@/components/ui/table'
import React from 'react'

const SkeletonTable = () => {
    return (
        <TableBody>
            {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                    {/* Work Type */}
                    <TableCell>
                        <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                    </TableCell>

                    {/* Budget */}
                    <TableCell>
                        <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                    </TableCell>

                    {/* User Type */}
                    <TableCell>
                        <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                    </TableCell>

                    {/* Name */}
                    <TableCell>
                        <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                    </TableCell>

                    {/* Email */}
                    <TableCell>
                        <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
                    </TableCell>

                    {/* Message */}
                    <TableCell>
                        <div className="h-5 w-[200px] bg-gray-200 rounded animate-pulse" />
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                        <div className="h-8 w-28 bg-gray-200 rounded animate-pulse" />
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    )
}

export default SkeletonTable