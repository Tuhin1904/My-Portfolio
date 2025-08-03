import { FaGithub, FaLinkedin, FaInstagram, FaTimes, FaBars } from 'react-icons/fa';
import MobileMenu from './MobileMenu';

const Header = () => {
    const navLinks = [
        { title: "Home", href: "/" },
        { title: "Experience", href: "/experience" },
        { title: "About", href: "/about" },
        { title: "Articles", href: "/articles" },
    ];
    return (
        <header className="flex items-center justify-between px-8 py-4 border-b border-gray-800 bg-gray-900">
            {/* Left Navigation */}
            <nav className="hidden md:flex flex-1 gap-6 text-xl">
                {navLinks.map((link) => (
                    <a
                        key={link.title}
                        href={link.href}
                        className="hover:text-gray-300 relative after:block after:h-[2px] after:bg-white after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left"
                    >
                        {link.title}
                    </a>
                ))}
            </nav>
            {/* Mobile Menu Modal */}
            <div className="flex md:hidden">
                <MobileMenu navLinks={navLinks} />
            </div>

            {/* Center Logo */}
            <div className="flex-1 flex items-center justify-center">
                <div className="w-16 h-16 border-gray-300 text-gray-100 border-4 bg-gray-800 rounded-full flex justify-center items-center text-2xl font-bold">
                    TG
                </div>
            </div>

            {/* Right Social Icons */}
            <div className="flex-1 hidden md:flex gap-5 text-3xl justify-end">
                {/* <a href="#"><FaTwitter /></a> */}
                <a href="https://github.com/Tuhin1904"><FaGithub /></a>
                <a href="https://www.linkedin.com/in/tuhinghosh19/"><FaLinkedin /></a>
                <a href="https://www.instagram.com/tuhingh19/"><FaInstagram /></a>
                {/* <a href="#"><FaDribbble /></a> */}
            </div>
        </header>
    );
};

export default Header;
