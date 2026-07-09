"use client";

import { useState } from "react";
import Link from "next/link";
import { FolderKanban, LogOut, Menu, PlusCircle, User, UserCircle2, X, Sun, Moon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import useAuthChecker from "@/hooks/useAuthChecker";
import LogoutButton from "../../customcomponents/LogoutConfirm";
import Image from "next/image";
import { toggleTheme } from "@/store/slices/ThemeSlice";
import NotificationBell from "@/customcomponents/NotificationBell";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const userInfo = useSelector((state: RootState) => state.user);
    const isDark = useSelector((state: RootState) => state.theme?.isDark ?? true);
    const pathname = usePathname();

    const navLinks = [
        { href: "/my-project-requests", label: "My Enquiries", icon: FolderKanban },
        { href: "/create-project", label: "New Request", icon: PlusCircle },
        { href: "/my-profile", label: "My Profile", icon: User },
    ];

    const { isAuthenticated } = useAuthChecker();
    if (!isAuthenticated) return null;

    return (
        <div className="flex min-h-screen bg-gray-950">

            {/* ── Sidebar ── */}
            {/* ── Sidebar ── */}
            <aside
                className={`fixed md:static top-0 left-0 z-50 h-full w-72 shrink-0 flex flex-col transform transition-transform duration-300
                    ${open ? "translate-x-0" : "-translate-x-full min-h-screen"} md:translate-x-0 sidebar-bg`}
            >
                {/* ── Brand — h-14 matches topbar exactly ── */}
                <div className="h-14 flex items-center gap-3 px-5 shrink-0 sidebar-brand-border">
                    <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold text-white pulse-glow shrink-0"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
                    >
                        TG
                    </div>
                    <div>
                        <p className="text-white font-semibold text-sm leading-tight">My Portal</p>
                        <p className="text-gray-600 text-[11px] leading-tight">tuhindev.me</p>
                    </div>
                    {/* Mobile close button */}
                    <button
                        className="ml-auto md:hidden text-gray-500 hover:text-white cursor-pointer"
                        onClick={() => setOpen(false)}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* ── Nav Links ── */}
                <nav className="flex flex-col px-3 py-4 gap-1 flex-1">
                    <p className="text-xs text-gray-600 uppercase tracking-widest font-semibold px-3 mb-2">Navigation</p>
                    {navLinks.map(({ href, label, icon: Icon }) => {
                        const isActive = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setOpen(false)}
                                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                                    ${isActive
                                        ? "text-white sidebar-link-active"
                                        : "text-gray-500 hover:text-gray-200 hover:bg-white/5"
                                    }`}
                            >
                                {/* Left accent bar */}
                                {isActive && (
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                                        style={{ background: 'linear-gradient(to bottom, #6366f1, #a855f7)' }} />
                                )}
                                <Icon size={16} className={`shrink-0 ${isActive ? "text-indigo-400" : ""}`} />
                                <span>{label}</span>
                                {isActive && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400"
                                        style={{ boxShadow: '0 0 6px rgba(99,102,241,0.8)' }} />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* ── Logout ── */}
                <div className="px-3 pb-5 border-t border-white/5 pt-3">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 cursor-pointer">
                        <LogOut size={15} />
                        <LogoutButton />
                    </button>
                </div>
            </aside>

            {/* Overlay (mobile) */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden z-40"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* ── Main Content ── */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Topbar — h-14, same border as sidebar brand row */}
                <header className="flex items-center justify-between px-5 h-14 shrink-0"
                    style={{ background: 'rgba(15,15,26,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(99,102,241,0.18)' }}>
                    <button
                        className="md:hidden cursor-pointer text-gray-500 hover:text-white transition-colors"
                        onClick={() => setOpen(true)}
                    >
                        <Menu size={20} />
                    </button>

                    {/* Page breadcrumb */}
                    <div className="hidden md:flex items-center gap-2 text-sm">
                        <span className="text-gray-600">Portal</span>
                        <span className="text-gray-700">/</span>
                        <span className="text-gray-300 capitalize">
                            {navLinks.find(l => l.href === pathname)?.label || "Dashboard"}
                        </span>
                    </div>

                    {/* Right: name + email + avatar */}
                    <div className="flex items-center gap-4 ms-auto">
                        <NotificationBell align="right" />
                        <button
                            onClick={() => dispatch(toggleTheme())}
                            className="text-gray-500 hover:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200 cursor-pointer p-1.5 rounded-lg hover:bg-white/5 flex items-center justify-center"
                            aria-label="Toggle Theme"
                        >
                            {isDark ? <Sun size={17} /> : <Moon size={17} />}
                        </button>

                        <div className="text-right hidden md:block">
                            <p className="text-sm font-semibold text-white capitalize leading-tight">{userInfo?.name || "User"}</p>
                            <p className="text-xs text-gray-500 leading-tight">{userInfo?.email || ""}</p>
                        </div>
                        {userInfo?.profilePicUrl ? (
                            <Image
                                width={32}
                                height={32}
                                src={userInfo.profilePicUrl}
                                alt="profile"
                                className="w-8 h-8 rounded-full object-cover"
                                style={{ boxShadow: '0 0 0 2px rgba(99,102,241,0.5)' }}
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full flex items-center justify-center"
                                style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
                                <UserCircle2 size={18} className="text-indigo-400" />
                            </div>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6 flex-1 overflow-auto">{children}</main>
            </div>
        </div>
    );
}