import React from 'react'
import { FaEnvelope, FaGithub, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa'

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-10">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Logo / Brand */}
                <div>
                    <h3 className="text-2xl font-bold text-gray-300 mb-4">Tuhin</h3>
                    <p className="text-gray-400 text-sm">
                        Maintained by <span className="font-semibold text-white">Tuhin</span>
                    </p>
                    <div className="flex gap-4 mt-4 text-xl">
                        <a href="https://github.com/Tuhin1904" className="hover:text-gray-400">
                            <FaGithub />
                        </a>
                        <a href="https://www.linkedin.com/in/tuhinghosh19/" className="hover:text-gray-400">
                            <FaLinkedin />
                        </a>
                        <a href="https://www.instagram.com/tuhingh19/" className="hover:text-gray-400">
                            <FaInstagram />
                        </a>
                    </div>
                </div>

                {/* Sitemap */}
                <div>
                    <h4 className="font-semibold mb-4 text-lg">Sitemap</h4>
                    <ul className="space-y-4">
                        {/* <li><a href="#" className="hover:text-gray-400">References</a></li> */}
                        {/* <li><a href="#" className="hover:text-gray-400">Contact Me</a></li> */}
                        <li><a href="#" className="hover:text-gray-400">Privacy Policy</a></li>
                    </ul>
                </div>

                {/* Address */}
                <div>
                    <h4 className="font-semibold mb-4 text-lg">Address</h4>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-2">
                            <FaPhoneAlt /> +91 824 017 1142
                        </li>
                        <li className="flex items-center gap-2">
                            <FaEnvelope /> iamtuhinn@gmail.com
                        </li>
                        <li className="flex items-center gap-2">
                            <FaMapMarkerAlt /> Krishnanagar, West Bengal, India
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="text-center text-gray-500 mt-8 text-sm border-t border-gray-700 pt-4">
                © {new Date().getFullYear()} All rights reserved | Maintained by Tuhin
            </div>
        </footer>
    )
}

export default Footer