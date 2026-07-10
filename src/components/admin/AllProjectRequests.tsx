'use client'
import { apiRequest } from '@/apiFiles/apiClient'
import { apiEndpoints } from '@/apiFiles/apiEndpoints'
import React, { useEffect, useState } from 'react'
import SkeletonTable from '@/components/common/SkeletonTable'
import { getLabel } from '@/const/masterData'
import { useRouter } from 'next/navigation'
import PaginationComp from '@/components/common/Pagination'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { STATUS_CONFIG, getStatusLabel } from '@/const/milestones'

type Inquiry = {
    _id: string;
    workType: string;
    budget: string;
    typeOfUser: string;
    name: string;
    email: string;
    message: string;
    status: string;
};

const mobileColumns = ["Work Type", "Budget", "User Type", "Status", "Email", "Message", "Actions"];

const AllProjectRequests = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState<Inquiry[]>([]);
    const ITEMS_PER_PAGE = 6;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [mobileColIndex, setMobileColIndex] = useState(0);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const getMyProjects = async (page: number) => {
        try {
            setLoading(true);
            const querySearch = statusFilter !== "all" ? statusFilter : search;
            const res = await apiRequest({
                method: "GET",
                url: apiEndpoints.getAllQueries,
                params: { 
                    page, 
                    pageSize: ITEMS_PER_PAGE,
                    search: querySearch || undefined
                }
            });
            setProjects(res?.data || []);
            if (res?.pagination) setTotalPages(res.pagination.totalPages);
        } catch (err) {
            console.log("Error:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { getMyProjects(currentPage); }, [currentPage, search, statusFilter]);

    return (
        <div className="space-y-6">
            {/* Heading */}
            <div>
                <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-1">Admin</p>
                <h1 className="text-2xl font-bold text-white">Project Enquiries</h1>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                {/* Search Bar */}
                <div className="relative w-full sm:w-72">
                    <input
                        type="text"
                        placeholder="Search queries..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full bg-gray-800/60 border border-white/8 text-white placeholder-gray-500 rounded-xl pl-4 pr-10 py-2 text-sm outline-none transition-all duration-200 focus:border-indigo-500/60"
                    />
                </div>

                {/* Dropdown Filter */}
                <div className="w-full sm:w-48">
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full bg-gray-800/60 border border-white/8 text-white rounded-xl px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-indigo-500/60 cursor-pointer"
                    >
                        <option value="all" className="bg-gray-900 text-white">All Statuses</option>
                        <option value="pending" className="bg-gray-900 text-white">Pending</option>
                        <option value="accepted" className="bg-gray-900 text-white">Accepted</option>
                        <option value="accepted_by_client" className="bg-gray-900 text-white">Accepted by Client</option>
                        <option value="working" className="bg-gray-900 text-white">Working</option>
                        <option value="delivered" className="bg-gray-900 text-white">Delivered</option>
                        <option value="completed" className="bg-gray-900 text-white">Completed</option>
                        <option value="rejected" className="bg-gray-900 text-white">Rejected</option>
                        <option value="cancelled" className="bg-gray-900 text-white">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Table card */}
            <div className="glass-card rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>

                {/* Table */}
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left px-5 py-3.5 text-xs text-gray-500 uppercase tracking-wider font-semibold">Name</th>
                                <th className={`text-left px-5 py-3.5 text-xs text-gray-500 uppercase tracking-wider font-semibold ${mobileColIndex === 0 ? "table-cell" : "hidden md:table-cell"}`}>Work Type</th>
                                <th className={`text-left px-5 py-3.5 text-xs text-gray-500 uppercase tracking-wider font-semibold ${mobileColIndex === 1 ? "table-cell" : "hidden md:table-cell"}`}>Budget</th>
                                <th className={`text-left px-5 py-3.5 text-xs text-gray-500 uppercase tracking-wider font-semibold ${mobileColIndex === 2 ? "table-cell" : "hidden md:table-cell"}`}>User Type</th>
                                <th className={`text-left px-5 py-3.5 text-xs text-gray-500 uppercase tracking-wider font-semibold ${mobileColIndex === 3 ? "table-cell" : "hidden md:table-cell"}`}>Status</th>
                                <th className={`text-left px-5 py-3.5 text-xs text-gray-500 uppercase tracking-wider font-semibold ${mobileColIndex === 4 ? "table-cell" : "hidden md:table-cell"}`}>Email</th>
                                <th className={`text-left px-5 py-3.5 text-xs text-gray-500 uppercase tracking-wider font-semibold ${mobileColIndex === 5 ? "table-cell" : "hidden md:table-cell"}`}>Message</th>
                                <th className={`text-left px-5 py-3.5 text-xs text-gray-500 uppercase tracking-wider font-semibold ${mobileColIndex === 6 ? "table-cell" : "hidden md:table-cell"}`}>Actions</th>
                            </tr>
                        </thead>
                        {loading ? (
                            <SkeletonTable />
                        ) : (
                            <tbody>
                                {projects.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center py-16 text-gray-600">
                                            <div className="flex flex-col items-center gap-2">
                                                <span className="text-3xl">📭</span>
                                                <span className="text-sm">No enquiries found</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    projects.map((item, idx) => (
                                        <tr key={item._id}
                                            className={`border-b border-white/5 transition-colors duration-150 hover:bg-white/3 ${idx % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                                            <td className="px-5 py-4 text-white font-medium">{item.name}</td>
                                            <td className={`px-5 py-4 ${mobileColIndex === 0 ? "table-cell" : "hidden md:table-cell"}`}>
                                                <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                                                    style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)', color: '#a5b4fc' }}>
                                                    {getLabel(item.workType)}
                                                </span>
                                            </td>
                                            <td className={`px-5 py-4 text-gray-400 ${mobileColIndex === 1 ? "table-cell" : "hidden md:table-cell"}`}>{item.budget}</td>
                                            <td className={`px-5 py-4 capitalize ${mobileColIndex === 2 ? "table-cell" : "hidden md:table-cell"}`}>
                                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${item.typeOfUser === 'guest' ? 'badge-past' : 'badge-active'}`}>
                                                    {item.typeOfUser}
                                                </span>
                                            </td>
                                            <td className={`px-5 py-4 ${mobileColIndex === 3 ? "table-cell" : "hidden md:table-cell"}`}>
                                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_CONFIG[item.status] || 'bg-gray-600 text-white'}`}>
                                                    {getStatusLabel(item.status, 'admin')}
                                                </span>
                                            </td>
                                            <td className={`px-5 py-4 text-gray-400 text-xs ${mobileColIndex === 4 ? "table-cell" : "hidden md:table-cell"}`}>{item.email}</td>
                                            <td className={`px-5 py-4 max-w-[200px] truncate text-gray-400 text-xs ${mobileColIndex === 5 ? "table-cell" : "hidden md:table-cell"}`}>{item.message}</td>
                                            <td className={`px-5 py-4 ${mobileColIndex === 6 ? "table-cell" : "hidden md:table-cell"}`}>
                                                <button
                                                    onClick={() => router.push(`/view-clients-req/${item._id}`)}
                                                    className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 hover:border-indigo-400/50 px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer hover:bg-indigo-500/10"
                                                 >
                                                     View <FaExternalLinkAlt size={10} />
                                                 </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        )}
                    </table>
                </div>

                {/* Mobile Column Navigator */}
                <div className="flex md:hidden justify-between items-center px-5 py-3 border-t border-white/5">
                    <button
                        onClick={() => setMobileColIndex(i => Math.max(0, i - 1))}
                        disabled={mobileColIndex === 0}
                        className="text-gray-500 hover:text-white disabled:opacity-30 cursor-pointer transition-colors"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <div className="flex gap-2">
                        {mobileColumns.map((label, idx) => (
                            <button
                                key={idx}
                                onClick={() => setMobileColIndex(idx)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${mobileColIndex === idx ? "scale-125" : "bg-gray-700 hover:bg-gray-500"}`}
                                style={mobileColIndex === idx ? { background: 'linear-gradient(135deg, #6366f1, #a855f7)' } : {}}
                                aria-label={`Show ${label}`}
                            />
                        ))}
                    </div>
                    <button
                        onClick={() => setMobileColIndex(i => Math.min(mobileColumns.length - 1, i + 1))}
                        disabled={mobileColIndex === mobileColumns.length - 1}
                        className="text-gray-500 hover:text-white disabled:opacity-30 cursor-pointer transition-colors"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>

                {/* Pagination */}
                <div className="border-t border-white/5 px-5 py-3">
                    <PaginationComp currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
                </div>
            </div>
        </div>
    )
}

export default AllProjectRequests;
