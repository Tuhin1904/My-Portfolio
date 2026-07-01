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

const AllProjectRequests = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState<Inquiry[]>([]);
    const ITEMS_PER_PAGE = 6;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [mobileColIndex, setMobileColIndex] = useState(0);

    const mobileColumns = [
        "Work Type",
        "Budget",
        "User Type",
        "Email",
        "Message",
        "Actions"
    ];

    const getMyProjects = async (page: number) => {
        try {
            setLoading(true);
            const res = await apiRequest({
                method: "GET",
                url: apiEndpoints.getAllQueries,
                params: {
                    page: page,
                    pageSize: ITEMS_PER_PAGE
                }
            });
            // console.log("My projects are :", res?.data)
            setProjects(res?.data || []);
            if (res?.pagination) {
                setTotalPages(res.pagination.totalPages);
            }
        } catch (err) {
            console.log("Error is :", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getMyProjects(currentPage);
    }, [currentPage]);

    return (
        <div className="p-1 sm:p-6">
            <h2 className="text-2xl font-semibold mb-4">All Project Enquiries</h2>

            <div className="border rounded-lg overflow-hidden max-w-md sm:max-w-full">
                <div className="w-full overflow-x-auto">
                    <Table className='bg-white'>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead className={mobileColIndex === 0 ? "table-cell" : "hidden md:table-cell"}>Work Type</TableHead>
                                <TableHead className={mobileColIndex === 1 ? "table-cell" : "hidden md:table-cell"}>Budget</TableHead>
                                <TableHead className={mobileColIndex === 2 ? "table-cell" : "hidden md:table-cell"}>User Type</TableHead>
                                <TableHead className={mobileColIndex === 3 ? "table-cell" : "hidden md:table-cell"}>Email</TableHead>
                                <TableHead className={mobileColIndex === 4 ? "table-cell" : "hidden md:table-cell"}>Message</TableHead>
                                <TableHead className={mobileColIndex === 5 ? "table-cell" : "hidden md:table-cell"}>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        {loading ? <SkeletonTable /> : <TableBody>
                            {projects.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-6 text-zinc-500">
                                        No data found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                projects.map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell className={mobileColIndex === 0 ? "table-cell" : "hidden md:table-cell"}>
                                            <span className="text-xs px-2 py-1 rounded-sm">
                                                {getLabel(item.workType)}
                                            </span>
                                        </TableCell>
                                        <TableCell className={mobileColIndex === 1 ? "table-cell" : "hidden md:table-cell"}>{item.budget}</TableCell>
                                        <TableCell className={`capitalize ${mobileColIndex === 2 ? "table-cell" : "hidden md:table-cell"}`}>{item.typeOfUser}</TableCell>
                                        <TableCell className={mobileColIndex === 3 ? "table-cell" : "hidden md:table-cell"}>{item.email}</TableCell>
                                        <TableCell className={`max-w-[250px] truncate ${mobileColIndex === 4 ? "table-cell" : "hidden md:table-cell"}`}>
                                            {item.message}
                                        </TableCell>
                                        <TableCell className={`max-w-[250px] truncate ${mobileColIndex === 5 ? "table-cell" : "hidden md:table-cell"}`}>
                                            <Button className='cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white' onClick={() => router.push(`/view-clients-req/${item._id}`)}>View Status</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>}
                    </Table>
                </div>
                {/* Mobile Column Navigator */}
                <div className="flex md:hidden justify-center items-center gap-2 py-4 border-t bg-zinc-50">
                    {mobileColumns.map((label, idx) => (
                        <button
                            key={idx}
                            onClick={() => setMobileColIndex(idx)}
                            className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 cursor-pointer ${
                                mobileColIndex === idx ? "bg-emerald-600 scale-125" : "bg-zinc-300 hover:bg-zinc-400"
                            }`}
                            aria-label={`Show ${label} column`}
                        />
                    ))}
                </div>
                <PaginationComp currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
            </div>
        </div>
    )
}

export default AllProjectRequests;