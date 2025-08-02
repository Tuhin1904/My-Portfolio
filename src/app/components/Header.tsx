import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Header = () => {
    return (
        <header className="flex items-center justify-between px-8 py-4 border-b border-gray-800 bg-gray-900">
            {/* Left Navigation */}
            <nav className="flex-1 flex gap-6 text-xl">
                <a href="#" className="hover:text-gray-300 relative after:block after:h-[2px] after:bg-white after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">
                    Home
                </a>
                <a href="#" className="hover:text-gray-300 relative after:block after:h-[2px] after:bg-white after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">About</a>
                <a href="#" className="hover:text-gray-300 relative after:block after:h-[2px] after:bg-white after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">Projects</a>
                <a href="#" className="hover:text-gray-300 relative after:block after:h-[2px] after:bg-white after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">Articles</a>
            </nav>

            {/* Center Logo */}
            <div className="flex-1 flex items-center justify-center">
                <div className="w-16 h-16 border-gray-300 text-gray-100 border-4 bg-gray-800 rounded-full flex justify-center items-center text-2xl font-bold">
                    TG
                </div>
            </div>

            {/* Right Social Icons */}
            <div className="flex-1 flex gap-5 text-3xl justify-end">
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
