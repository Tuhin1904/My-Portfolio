"use client";

import { useState } from "react";
import { FaBars, FaTimes, FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

interface MobileMenuProps {
    navLinks: { title: string; href: string }[];
}

export default function MobileMenu({ navLinks }: MobileMenuProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <button onClick={() => setIsMenuOpen(true)} >
                <FaBars size={42} className="cursor-pointer" />
            </button>

            {isMenuOpen && (
                <div className="fixed w-[80%] h-[50vh] m-auto inset-0 bg-gray-600/95 bg-opacity-95 flex flex-col items-center justify-center z-50  transition-all duration-500 ease-in-out opacity-0 translate-y-10  animate-fadeIn">
                    {/* Close Button */}
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="absolute top-6 right-6 text-white text-4xl cursor-pointer"
                    >
                        <FaTimes />
                    </button>

                    {/* Navigation Links */}
                    <nav className="flex flex-col gap-6 text-2xl text-white mt-10">
                        {navLinks.map((link) => (
                            <a
                                key={link.title}
                                href={link.href}
                                className="hover:text-gray-400"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.title}
                            </a>
                        ))}
                    </nav>

                    {/* Social Icons */}
                    <div className="flex gap-6 text-4xl mt-12">
                        <a href="https://github.com/Tuhin1904"><FaGithub /></a>
                        <a href="https://www.linkedin.com/in/tuhinghosh19/"><FaLinkedin /></a>
                        <a href="https://www.instagram.com/tuhingh19/"><FaInstagram /></a>
                    </div>
                </div>
            )}
        </>
    );
}
