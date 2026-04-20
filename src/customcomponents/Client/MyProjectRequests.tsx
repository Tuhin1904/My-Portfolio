'use client'
import { apiRequest } from '@/apiFiles/apiClient'
import { apiEndpoints } from '@/apiFiles/apiEndpoints'
import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import SkeletonTable from '@/customcomponents/SkeletonTable';
import { getLabel } from '@/const/masterData';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import PaginationComp from '../Pagination/Pagination';

type Inquiry = {
    _id: string;
    workType: string;
    budget: string;
    typeOfUser: string;
    name: string;
    email: string;
    message: string;
};

const MyProjectRequests = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState<Inquiry[]>([]);
    const ITEMS_PER_PAGE = 5;
    const [currentPage, setCurrentPage] = useState(1);

    const getMyProjects = async () => {
        try {
            setLoading(true);
            const res = await apiRequest({
                method: "GET",
                url: apiEndpoints.getMyQueries
            })
            // console.log("My projects are :", res?.data)
            setProjects(res?.data || [])
        } catch (err) {
            console.log("Error is :", err)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getMyProjects();
    }, [])

    const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);

    const paginatedProjects = projects.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="p-1 sm:p-6">
            <h2 className="text-2xl font-semibold mb-4">My Project Enquiries</h2>

            <div className="border rounded-lg overflow-hidden max-w-md sm:max-w-full">
                <div className="w-full overflow-x-auto">
                    <Table className='bg-white'>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Work Type</TableHead>
                                <TableHead>Budget</TableHead>
                                {/* <TableHead>User Type</TableHead> */}
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Message</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        {loading ? <SkeletonTable /> : <TableBody>
                            {paginatedProjects.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-6">
                                        No data found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedProjects.map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell >
                                            <span className="text-xs px-2 py-1 rounded-sm">
                                                {getLabel(item.workType)}
                                            </span>
                                        </TableCell>
                                        <TableCell>{item.budget}</TableCell>
                                        {/* <TableCell>{item.typeOfUser}</TableCell> */}
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.email}</TableCell>
                                        <TableCell className="max-w-[250px] truncate">
                                            {item.message}
                                        </TableCell>
                                        <TableCell className="max-w-[250px] truncate">
                                            <Button className='cursor-pointer' onClick={() => router.push(`/my-project-requests/${item._id}`)}>View Status</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>}
                    </Table>
                </div>
                <PaginationComp currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
            </div>
        </div>
    )
}

export default MyProjectRequests;