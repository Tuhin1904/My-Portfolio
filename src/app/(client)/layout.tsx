"use client";

import { useState } from "react";
import Link from "next/link";
import { FolderKanban, LogOut, Menu, PlusCircle, User, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import useAuthChecker from "@/hooks/useAuthChecker";
import LogoutButton from "../../customcomponents/LogoutConfirm";
import Image from "next/image";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const userInfo = useSelector((state: RootState) => state.user);
    const pathname = usePathname();

    const getClass = (path: string) =>
        `p-2 rounded cursor-pointer ${pathname === path
            ? "bg-gray-800 text-white"
            : "hover:bg-gray-800"
        }`;

    const { isAuthenticated } = useAuthChecker();
    if (!isAuthenticated) return null;

    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* Sidebar */}
            <aside
                className={`fixed md:static top-0 left-0 z-50 h-full w-64 bg-gray-900 text-white transform transition-transform duration-300 
        ${open ? "translate-x-0" : "-translate-x-full min-h-screen"} md:translate-x-0`}
            >
                <div className="flex items-center justify-between py-2 px-4 h-12 border-b border-gray-700">
                    <div className='w-8 h-8 border-gray-300 text-gray-100 border-4 bg-gray-800 rounded-full flex justify-center items-center text-sm font-semibold cursor-pointer' onClick={() => router.push("/")}>
                        TG
                    </div>
                    <button
                        className="md:hidden cursor-pointer"
                        onClick={() => setOpen(false)}
                    >
                        <X size={22} />
                    </button>
                </div>

                <nav className="flex flex-col p-4 gap-3">
                    {/* <Link href="/my-dashboard" className={getClass("/my-dashboard")}>
                        Dashboard
                    </Link> */}
                    <Link href="/my-project-requests" className={getClass("/project-requests")}>
                        <div className="flex items-center gap-2">
                            <FolderKanban size={18} />
                            <span>Request</span>
                        </div>
                    </Link>
                    <Link href="/create-project" className={getClass("/project-requests")}>
                        <div className="flex items-center gap-2">
                            <PlusCircle size={18} />
                            <span>Make Project</span>
                        </div>
                    </Link>
                    <Link href="/my-profile" className={getClass("/my-profile")}>
                        <div className="flex items-center gap-2">
                            <User size={18} />
                            <span>My Profile</span>
                        </div>
                    </Link>

                    <button className="flex items-center gap-2 text-left hover:border hover:border-red-300 hover:bg-gray-800 hover:text-red-300 p-2 rounded mt-4 cursor-pointer">
                        <LogOut size={18} />
                        <LogoutButton />
                    </button>
                </nav>
            </aside>

            {/* Overlay (mobile) */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/50 md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Main */}
            <div className="flex-1 flex flex-col">

                {/* Topbar */}
                <header className="flex items-center justify-between bg-white shadow p-4 h-12">
                    <button
                        className="md:hidden cursor-pointer"
                        onClick={() => setOpen(true)}
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex items-center gap-3 ms-auto">
                        <h1 className="text-lg font-semibold capitalize">
                            Welcome {userInfo?.name || "Name"}
                        </h1>

                        {userInfo?.profilePicUrl ? (
                            <Image
                                width={8}
                                height={8}
                                src={userInfo.profilePicUrl}
                                alt="profile"
                                className="w-8 h-8 rounded-full object-cover border"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <User size={18} />
                            </div>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}