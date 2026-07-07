'use client'
import { FaGithub, FaLinkedin, FaInstagram, FaSun, FaMoon } from 'react-icons/fa';
import dynamic from 'next/dynamic';

const MobileMenu = dynamic(() => import('./MobileMenu'));
const GetStarted = dynamic(() => import('./GetStarted/GetStarted'));
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toggleTheme } from '@/store/slices/ThemeSlice';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const navLinks = [
    { title: 'Home', href: '/' },
    { title: 'Articles', href: '/articles' },
  ];

  const getToken = useSelector((state: RootState) => state.auth.accessToken);
  const isDark = useSelector((state: RootState) => state.theme?.isDark ?? true);
  const allowedRoutes = navLinks.map(link => link.href);

  const shouldShowHeader =
    allowedRoutes.includes(pathname) || !getToken;

  return (
    <header className={`flex items-center justify-between px-8 py-4 border-b border-white/8 bg-gray-900/85 backdrop-blur-md sticky top-0 z-40 ${!shouldShowHeader ? "hidden" : ""}`}>
      {/* Left Navigation */}
      <nav className='hidden md:flex flex-1 gap-8 text-base text-white'>
        {navLinks.map((link) => (
          <a
            key={link.title}
            href={link.href}
            className={`relative py-1 transition-colors duration-200 hover:text-indigo-400 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:transition-all after:duration-300 ${
              pathname === link.href
                ? 'text-indigo-400 after:w-full after:bg-gradient-to-r after:from-indigo-500 after:to-violet-500'
                : 'after:w-0 hover:after:w-full after:bg-gradient-to-r after:from-indigo-500 after:to-violet-500'
            }`}>
            {link.title}
          </a>
        ))}
      </nav>
      {/* Mobile Menu Modal & Theme Toggle */}
      <div className='flex flex-1 md:hidden items-center gap-4'>
        <MobileMenu navLinks={navLinks} />
        <button
          onClick={() => dispatch(toggleTheme())}
          className="text-gray-400 hover:text-indigo-400 transition-colors duration-200 cursor-pointer p-2 rounded-full"
          aria-label="Toggle Theme"
        >
          {isDark ? <FaSun size={20} className="text-white" /> : <FaMoon size={20} className="text-white" />}
        </button>
      </div>

      {/* Center Logo */}
      <div className='flex-1 flex items-center justify-center'>
        <div className='w-14 h-14 rounded-full flex justify-center items-center text-xl font-bold text-white pulse-glow'
          style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
          TG
        </div>
      </div>

      {!getToken ?
        <div className='flex-1 flex md:hidden ms-auto items-center gap-2 scale-[0.85]'>
          <Link
            href="/sign-in"
            className="text-gray-400 hover:text-white text-sm transition-colors whitespace-nowrap"
          >
            Login
          </Link>
          <GetStarted />
        </div> :
        <button className="border border-indigo-500/50 text-indigo-400 text-lg px-3 py-1 rounded-xl hover:bg-indigo-500/10 transition-all cursor-pointer whitespace-nowrap w-fit max-w-full ms-auto block md:hidden" id="startButton" onClick={() => router.push("/my-project-requests")}>
          View Projects
        </button>
      }

      {/* Right Social Icons & Theme Toggle */}
      <div className='flex-1 hidden md:flex gap-5 text-2xl justify-end items-center'>
        <button
          onClick={() => dispatch(toggleTheme())}
          className="text-gray-400 hover:text-indigo-400 transition-colors duration-200 cursor-pointer p-2 rounded-full hover:bg-white/5 flex items-center justify-center"
          aria-label="Toggle Theme"
        >
          {isDark ? <FaSun size={18} /> : <FaMoon size={18} />}
        </button>

        {!getToken ? (
          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="text-gray-400 hover:text-white text-sm transition-colors whitespace-nowrap"
            >
              Login
            </Link>
            <GetStarted />
          </div>
        ) : (
          <button className="border border-indigo-500/50 text-indigo-400 text-base px-3 py-1 rounded-xl hover:bg-indigo-500/10 transition-all cursor-pointer whitespace-nowrap" id="startButton" onClick={() => router.push("/my-project-requests")}>
            View Projects
          </button>
        )}

        <a className='text-gray-400 hover:text-indigo-400 transition-colors duration-200' href='https://github.com/Tuhin1904'>
          <FaGithub />
        </a>
        <a className='text-gray-400 hover:text-indigo-400 transition-colors duration-200' href='https://www.linkedin.com/in/tuhinghosh19/'>
          <FaLinkedin />
        </a>
        <a className='text-gray-400 hover:text-indigo-400 transition-colors duration-200' href='https://www.instagram.com/tuhingh19/'>
          <FaInstagram />
        </a>
      </div>
    </header>
  );
};

export default Header;
