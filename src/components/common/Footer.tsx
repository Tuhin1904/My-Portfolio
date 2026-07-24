'use client'
import { RootState } from '@/store';
import React from 'react'
import { FaEnvelope, FaGithub, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa'
import { useSelector } from 'react-redux';

const Footer = () => {
    const getToken = useSelector((state: RootState) => state.auth.accessToken);

    return (
        <footer className={`relative bg-gray-900 text-white pt-12 pb-6 overflow-hidden ${getToken && "hidden"}`}>
            {/* Top gradient border */}
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, #6366f1, #a855f7, transparent)' }} />

            {/* Subtle background glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-32 bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />

            <div className="relative max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Logo / Brand */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                            TG
                        </div>
                        <h3 className="text-xl font-bold text-white">Tuhin Ghosh</h3>
                    </div>
                    <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                        Transforming ideas into digital experiences with code and design.
                    </p>
                    <div className="flex gap-4 text-xl">
                        <a href="https://github.com/Tuhin1904" className="text-gray-500 hover:text-indigo-400 transition-colors duration-200">
                            <FaGithub />
                        </a>
                        <a href="https://www.linkedin.com/in/tuhinghosh19/" className="text-gray-500 hover:text-indigo-400 transition-colors duration-200">
                            <FaLinkedin />
                        </a>
                        <a href="https://www.instagram.com/tuhingh19/" className="text-gray-500 hover:text-indigo-400 transition-colors duration-200">
                            <FaInstagram />
                        </a>
                    </div>
                </div>

                {/* Sitemap */}
                <div>
                    <h4 className="font-semibold mb-5 text-sm uppercase tracking-widest text-gray-400">Sitemap</h4>
                    <ul className="space-y-3">
                        <li>
                            <a href="/" className="text-gray-500 hover:text-indigo-400 transition-colors duration-200 text-sm">Home</a>
                        </li>
                        <li>
                            <a href="/articles" className="text-gray-500 hover:text-indigo-400 transition-colors duration-200 text-sm">Articles</a>
                        </li>
                        <li>
                            <a href="/url-shortener" className="text-gray-500 hover:text-indigo-400 transition-colors duration-200 text-sm">URL Shortener</a>
                        </li>
                        <li>
                            <a href="/privacy-policy" className="text-gray-500 hover:text-indigo-400 transition-colors duration-200 text-sm">Privacy Policy</a>
                        </li>

                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="font-semibold mb-5 text-sm uppercase tracking-widest text-gray-400">Contact</h4>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-3 text-gray-500 text-sm">
                            <FaPhoneAlt className="text-indigo-500 flex-shrink-0" />
                            +91 824 017 1142
                        </li>
                        <li className="flex items-center gap-3 text-gray-500 text-sm">
                            <FaEnvelope className="text-indigo-500 flex-shrink-0" />
                            iamtuhinn@gmail.com
                        </li>
                        <li className="flex items-center gap-3 text-gray-500 text-sm">
                            <FaMapMarkerAlt className="text-indigo-500 flex-shrink-0" />
                            Krishnanagar, West Bengal, India
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="relative mt-10 pt-6 border-t border-white/5 text-center text-gray-600 text-xs">
                © {new Date().getFullYear()} Tuhin Ghosh · All rights reserved
            </div>
        </footer>
    )
}

export default Footer
