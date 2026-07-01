"use client";

import { useState } from "react";
import Link from "next/link";
import { BarChart2, ListChevronsDownUp, LogOut, Menu, User, UserCircle2, X } from "lucide-react";
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

    const navLinks = [
        { href: "/admin-dashboard", label: "Admin Dashboard", icon: BarChart2 },
        { href: "/view-clients-req", label: "Projects Queries", icon: ListChevronsDownUp },
        { href: "/admin-profile", label: "Profile", icon: User },
    ];

    const { isAuthenticated } = useAuthChecker();
    if (!isAuthenticated) return null;

    return (
        <div className="flex min-h-screen bg-zinc-50">

            {/* ── Sidebar ── */}
            <aside
                className={`fixed md:static top-0 left-0 z-50 h-full w-72 shrink-0 bg-zinc-950 text-zinc-100 flex flex-col transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full min-h-screen"} md:translate-x-0`}
            >
                {/* ── Profile Section ── */}
                <div className="relative flex flex-col items-center gap-2 px-5 pt-7 pb-6 border-b border-zinc-800/60">
                    {/* Close button (mobile only) */}
                    <button
                        className="absolute top-3 right-3 md:hidden text-zinc-400 hover:text-zinc-100 cursor-pointer"
                        onClick={() => setOpen(false)}
                    >
                        <X size={20} />
                    </button>

                    {/* Avatar */}
                    {userInfo?.profilePicUrl ? (
                        <Image
                            width={64}
                            height={64}
                            src={userInfo.profilePicUrl}
                            alt="profile"
                            className="w-16 h-16 rounded-full object-cover ring-2 ring-emerald-400/60 shadow-lg"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center ring-2 ring-emerald-400/40 shadow-lg">
                            <UserCircle2 size={40} className="text-zinc-400" />
                        </div>
                    )}

                    {/* Name & Email */}
                    <div className="text-center mt-1">
                        <p className="text-sm font-semibold text-zinc-100 capitalize leading-tight">
                            {userInfo?.name || "Admin"}
                        </p>
                        <p className="text-xs text-zinc-400 mt-0.5 truncate max-w-[170px]">
                            {userInfo?.email || "—"}
                        </p>
                    </div>

                    {/* Portfolio link */}
                    {/* <button
                        onClick={() => router.push("/")}
                        className="mt-1 text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                    >
                        ← Back to portfolio
                    </button> */}
                </div>

                {/* ── Nav Links ── */}
                <nav className="flex flex-col p-4 gap-1 flex-1">
                    {navLinks.map(({ href, label, icon: Icon }) => {
                        const isActive = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setOpen(false)}
                                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                                    ${isActive
                                        ? "bg-emerald-600/20 text-emerald-300"
                                        : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                                    }`}
                            >
                                {/* Left accent bar */}
                                {isActive && (
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-emerald-400 rounded-r-full" />
                                )}

                                <Icon size={17} className={`shrink-0 ${isActive ? "text-emerald-400" : ""}`} />
                                <span className="whitespace-nowrap">{label}</span>

                                {/* Glowing dot */}
                                {isActive && (
                                    <span className="ml-auto shrink-0 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.6)]" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* ── Logout ── */}
                <div className="p-4 border-t border-zinc-800/60">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 cursor-pointer">
                        <LogOut size={16} />
                        <LogoutButton />
                    </button>
                </div>
            </aside>

            {/* Overlay (mobile) */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/50 md:hidden z-40"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* ── Main Content ── */}
            <div className="flex-1 flex flex-col">

                {/* Topbar */}
                <header className="flex items-center justify-between bg-white/80 backdrop-blur border-b border-zinc-200 shadow-sm px-5 h-14">
                    <button
                        className="md:hidden cursor-pointer text-zinc-600 hover:text-zinc-900 transition-colors"
                        onClick={() => setOpen(true)}
                    >
                        <Menu size={22} />
                    </button>

                    <div className="flex items-center gap-3 ms-auto">
                        <div className="text-right">
                            <p className="text-sm font-semibold text-zinc-700 capitalize leading-tight">
                                {userInfo?.name || "Admin"}
                            </p>
                            <p className="text-xs text-zinc-400 leading-tight">
                                {userInfo?.email || ""}
                            </p>
                        </div>

                        {userInfo?.profilePicUrl ? (
                            <Image
                                width={36}
                                height={36}
                                src={userInfo.profilePicUrl}
                                alt="profile"
                                className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-400/50"
                            />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-zinc-200 flex items-center justify-center">
                                <UserCircle2 size={22} className="text-zinc-500" />
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