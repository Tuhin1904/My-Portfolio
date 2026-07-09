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
                className="text-gray-400 hover:text-indigo-400 transition-colors duration-200 cursor-pointer p-2 rounded-full hover:bg-white/5 flex items-center justify-center"
                aria-label="Open menu"
            >
                <FaBars size={20} />
            </button>

            {isMenuOpen && mounted && createPortal(
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 transition-all duration-300">
                    <div 
                        className="w-[90%] max-w-sm rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden animate-fadeIn"
                        style={{
                            border: "1px solid rgba(99, 102, 241, 0.25)",
                            background: "rgba(15, 15, 26, 0.95)",
                            backdropFilter: "blur(16px)",
                            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)"
                        }}
                    >
                        {/* Background blobs */}
                        <div className="absolute top-[-30%] left-[-30%] w-48 h-48 bg-indigo-600/20 rounded-full blur-2xl pointer-events-none" />
                        <div className="absolute bottom-[-30%] right-[-30%] w-48 h-48 bg-violet-600/15 rounded-full blur-2xl pointer-events-none" />

                        {/* Close Button */}
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors cursor-pointer p-2 rounded-full hover:bg-white/5"
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
                                    className="text-gray-300 hover:text-indigo-400 py-3 border-b border-white/5 last:border-0 transition-colors duration-200"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.title}
                                </a>
                            ))}
                        </nav>

                        {/* Social Icons */}
                        <div className="flex gap-6 text-2xl mt-8 pt-6 border-t border-white/5 w-full justify-center text-gray-400 z-10">
                            <a href="https://github.com/Tuhin1904" className="hover:text-white transition-colors"><FaGithub /></a>
                            <a href="https://www.linkedin.com/in/tuhinghosh19/" className="hover:text-white transition-colors"><FaLinkedin /></a>
                            <a href="https://www.instagram.com/tuhingh19/" className="hover:text-white transition-colors"><FaInstagram /></a>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
