"use client";

import { RootState } from "@/store";
import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { useSelector } from "react-redux";
import { createPortal } from "react-dom";

interface MobileMenuProps {
    navLinks: { title: string; href: string }[];
}

export default function MobileMenu({ navLinks }: MobileMenuProps) {
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);
    const isDark = useSelector((state: RootState) => state.theme?.isDark ?? true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const additionalLink = accessToken ? { title: 'View Projects', href: '/my-project-requests' } : { title: 'Sign In', href: '/sign-in' }

    return (
        <>
            <button 
                onClick={() => setIsMenuOpen(true)} 
                className={`text-gray-400 hover:text-indigo-400 transition-colors duration-200 cursor-pointer p-2 rounded-full flex items-center justify-center ${
                    isDark ? "hover:bg-white/5" : "hover:bg-black/5"
                }`}
                aria-label="Open menu"
            >
                <FaBars size={20} />
            </button>

            {isMenuOpen && mounted && createPortal(
                <div className={`fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 transition-all duration-300 ${
                    isDark ? "bg-black/60" : "bg-black/20"
                }`}>
                    <div 
                        className="w-[90%] max-w-sm rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden animate-fadeIn"
                        style={{
                            border: isDark ? "1px solid rgba(99, 102, 241, 0.25)" : "1px solid rgba(99, 102, 241, 0.15)",
                            background: isDark ? "rgba(15, 15, 26, 0.95)" : "rgba(255, 255, 255, 0.95)",
                            backdropFilter: "blur(16px)",
                            boxShadow: isDark ? "0 20px 40px rgba(0, 0, 0, 0.5)" : "0 20px 40px rgba(0, 0, 0, 0.08)"
                        }}
                    >
                        {/* Background blobs */}
                        <div className="absolute top-[-30%] left-[-30%] w-48 h-48 bg-indigo-600/20 rounded-full blur-2xl pointer-events-none" />
                        <div className="absolute bottom-[-30%] right-[-30%] w-48 h-48 bg-violet-600/15 rounded-full blur-2xl pointer-events-none" />

                        {/* Close Button */}
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className={`absolute top-5 right-5 text-gray-400 transition-colors cursor-pointer p-2 rounded-full ${
                                isDark ? "hover:text-white hover:bg-white/5" : "hover:text-gray-900 hover:bg-black/5"
                            }`}
                            aria-label="Close menu"
                        >
                            <FaTimes size={18} />
                        </button>

                        {/* Navigation Links */}
                        <nav className="flex flex-col gap-2 text-lg text-center font-medium mt-6 w-full z-10">
                            {[additionalLink, ...navLinks].map((link) => (
                                <a
                                    key={link.title}
                                    href={link.href}
                                    className={`py-3 border-b border-white/5 last:border-0 transition-colors duration-200 ${
                                        isDark ? "text-gray-300 hover:text-indigo-400" : "text-gray-700 hover:text-indigo-650"
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.title}
                                </a>
                            ))}
                        </nav>

                        {/* Social Icons */}
                        <div className="flex gap-6 text-2xl mt-8 pt-6 border-t border-white/5 w-full justify-center text-gray-400 z-10">
                            <a href="https://github.com/Tuhin1904" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-gray-900"}`}><FaGithub /></a>
                            <a href="https://www.linkedin.com/in/tuhinghosh19/" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-gray-900"}`}><FaLinkedin /></a>
                            <a href="https://www.instagram.com/tuhingh19/" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-gray-900"}`}><FaInstagram /></a>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
