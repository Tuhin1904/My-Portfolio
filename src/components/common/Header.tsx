'use client';
import { useState, useRef, useEffect } from 'react';
import { FaGithub, FaLinkedin, FaInstagram, FaSun, FaMoon, FaSignInAlt } from 'react-icons/fa';
import dynamic from 'next/dynamic';

const MobileMenu = dynamic(() => import('./MobileMenu'));
const GetStarted = dynamic(() => import('@/components/client/GetStarted'));
import NotificationBell from './NotificationBell';
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
    { title: 'Tools', href: '/tools' },
  ];

  const getToken = useSelector((state: RootState) => state.auth.accessToken);
  const isDark = useSelector((state: RootState) => state.theme?.isDark ?? true);
  const allowedRoutes = ['/', '/articles', '/tools', '/tools/url-shortener', '/url-shortener'];

  const shouldShowHeader =
    allowedRoutes.includes(pathname) || !getToken;


  const [isActionsExpanded, setIsActionsExpanded] = useState(false);
  const actionRef = useRef<HTMLDivElement>(null);
  const autoCollapseTimerRef = useRef<any>(null);

  const resetAutoCollapseTimer = () => {
    if (autoCollapseTimerRef.current) {
      clearTimeout(autoCollapseTimerRef.current);
    }
    autoCollapseTimerRef.current = setTimeout(() => {
      setIsActionsExpanded(false);
    }, 3500);
  };

  useEffect(() => {
    if (isActionsExpanded) {
      resetAutoCollapseTimer();
    } else {
      if (autoCollapseTimerRef.current) {
        clearTimeout(autoCollapseTimerRef.current);
      }
    }
    return () => {
      if (autoCollapseTimerRef.current) {
        clearTimeout(autoCollapseTimerRef.current);
      }
    };
  }, [isActionsExpanded]);

  useEffect(() => {
    if (!isActionsExpanded) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (actionRef.current && !actionRef.current.contains(event.target as Node)) {
        setIsActionsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isActionsExpanded]);

  const handleRoute = () => {
    router.push("/")
  }

  return (
    <header className={`relative flex items-center justify-between px-4 md:px-8 py-4 border-b border-white/8 bg-gray-900/85 backdrop-blur-md sticky top-0 z-40 ${!shouldShowHeader ? "hidden" : ""}`}>
      {/* Left Navigation */}
      <nav className='hidden md:flex flex-1 gap-8 text-base text-white'>
        {navLinks.map((link) => (
          <a
            key={link.title}
            href={link.href}
            className={`relative py-1 transition-colors duration-200 hover:text-indigo-400 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:transition-all after:duration-300 ${pathname === link.href
              ? 'text-indigo-400 after:w-full after:bg-gradient-to-r after:from-indigo-500 after:to-violet-500'
              : 'after:w-0 hover:after:w-full after:bg-gradient-to-r after:from-indigo-500 after:to-violet-500'
              }`}>
            {link.title}
          </a>
        ))}
      </nav>
      {/* Mobile Menu Modal & Theme Toggle */}
      <div className='flex md:hidden items-center gap-2 z-10'>
        <MobileMenu navLinks={navLinks} />
        <NotificationBell align="left" />
        <button
          onClick={() => dispatch(toggleTheme())}
          className="text-gray-400 hover:text-indigo-400 transition-colors duration-200 cursor-pointer p-2 rounded-full"
          aria-label="Toggle Theme"
        >
          {isDark ? <FaSun size={20} className="text-white" /> : <FaMoon size={20} className="text-white" />}
        </button>
      </div>

      {/* Center Logo */}
      <div className='hidden md:flex flex-1 items-center justify-center'>
        <div className='w-14 h-14 rounded-full flex justify-center items-center text-xl font-bold text-white pulse-glow'
          style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }} onClick={handleRoute}>
          TG
        </div>
      </div>
      <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex md:hidden items-center justify-center pointer-events-none z-0'>
        <div className='w-11 h-11 rounded-full flex justify-center items-center text-base font-bold text-white pulse-glow'
          style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }} onClick={handleRoute}>
          TG
        </div>
      </div>

      {!getToken ? (
        <div
          ref={actionRef}
          className="flex md:hidden ms-auto items-center relative z-20 transition-all duration-300"
          style={{ width: isActionsExpanded ? '205px' : '82px' }}
          onClick={() => {
            if (isActionsExpanded) {
              resetAutoCollapseTimer();
            }
          }}
          onTouchStart={() => {
            if (isActionsExpanded) {
              resetAutoCollapseTimer();
            }
          }}
        >
          <div
            onClick={() => {
              if (!isActionsExpanded) {
                setIsActionsExpanded(true);
              }
            }}
            className={`flex items-center justify-between p-1 rounded-full border transition-all duration-300 w-full overflow-hidden cursor-pointer ${isDark
              ? "bg-gray-900/90 border-indigo-500/20 shadow-lg shadow-black/40"
              : "bg-white/95 border-indigo-500/25 shadow-md shadow-indigo-100/50"
              }`}
          >
            {/* Login Section */}
            {isActionsExpanded ? (
              <Link
                href="/sign-in"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${isDark ? "text-gray-300 hover:text-white hover:bg-white/5" : "text-gray-600 hover:text-gray-900 hover:bg-black/5"
                  }`}
              >
                <FaSignInAlt className="text-indigo-400 text-xs shrink-0" />
                <span className="whitespace-nowrap">Login</span>
              </Link>
            ) : (
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDark ? "text-gray-400 hover:text-white hover:bg-white/5" : "text-gray-500 hover:text-gray-900 hover:bg-black/5"
                  }`}
              >
                <FaSignInAlt size={15} />
              </div>
            )}

            {/* Divider */}
            <div className={`w-[1px] h-4 shrink-0 ${isDark ? "bg-white/10" : "bg-black/10"}`} />

            {/* Get Started Section */}
            <div
              className="shrink-0"
              onClick={(e) => {
                if (!isActionsExpanded) {
                  e.stopPropagation();
                  setIsActionsExpanded(true);
                }
              }}
            >
              {isActionsExpanded ? (
                <GetStarted />
              ) : (
                <GetStarted compact disabledTrigger />
              )}
            </div>
          </div>
        </div>
      ) : (
        <button className="border border-indigo-500/50 text-indigo-400 text-base px-3 py-1 rounded-xl hover:bg-indigo-500/10 transition-all cursor-pointer whitespace-nowrap w-fit max-w-full ms-auto block md:hidden z-10" id="startButton" onClick={() => router.push("/my-project-requests")}>
          View Projects
        </button>
      )}

      {/* Right Social Icons & Theme Toggle */}
      <div className='flex-1 hidden md:flex gap-5 text-2xl justify-end items-center'>
        <NotificationBell align="right" />
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
