'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Link2, FileText, Compass, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white flex flex-col justify-center items-center p-6 md:p-12 transition-colors duration-200">
      {/* Glowing Background Spheres */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-xl w-full backdrop-blur-2xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 p-8 md:p-12 rounded-3xl shadow-xl dark:shadow-2xl text-center relative z-10"
      >
        {/* Animated 404 Badge */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: [0.95, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/25 text-indigo-700 dark:text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-6"
        >
          <Sparkles className="w-3.5 h-3.5" /> Error 404
        </motion.div>

        {/* Large 404 Text */}
        <h1 className="text-7xl sm:text-8xl font-black text-indigo-600 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-indigo-400 dark:via-purple-300 dark:to-indigo-500 tracking-tighter mb-2 drop-shadow-sm">
          404
        </h1>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-3">
          Lost in Cyberspace?
        </h2>

        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto">
          The page or short link you are trying to reach does not exist, has been removed, or is temporarily unavailable.
        </p>

        {/* Main Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold transition-all duration-300 shadow-lg shadow-indigo-500/25"
          >
            <Home className="w-4 h-4" /> Return to Home
          </Link>

          <Link
            href="/url-shortener"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gray-100 dark:bg-gray-800/90 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-semibold transition-all duration-200 border border-gray-300 dark:border-white/10"
          >
            <Link2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> URL Shortener
          </Link>
        </div>

        {/* Additional Quick Navigation Links */}
        <div className="pt-6 border-t border-gray-200 dark:border-white/10">
          <div className="text-xs uppercase font-medium text-gray-500 dark:text-gray-500 mb-3 tracking-wider flex items-center justify-center gap-1.5">
            <Compass className="w-3.5 h-3.5" /> Popular Destinations
          </div>

          <div className="flex items-center justify-center gap-4 text-xs font-medium text-gray-600 dark:text-gray-400">
            <Link href="/articles" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> Articles
            </Link>
            <span className="text-gray-400 dark:text-gray-700">•</span>
            <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
