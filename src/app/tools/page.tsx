'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Wrench,
  Link2,
  QrCode,
  Code2,
  Globe2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface ToolCard {
  id: string;
  title: string;
  description: string;
  icon: any;
  href?: string;
  status: 'active' | 'coming-soon';
  category: string;
  badge?: string;
}

const toolsList: ToolCard[] = [
  {
    id: 'url-shortener',
    title: 'Branded URL Shortener',
    description: 'Create custom short links, track click analytics, monitor GeoIP locations, and configure expiration rules.',
    icon: Link2,
    href: '/tools/url-shortener',
    status: 'active',
    category: 'Utilities & Links',
    badge: 'Popular',
  },
  {
    id: 'qr-studio',
    title: 'QR Code Studio & Scanner',
    description: 'Generate high-resolution custom vector QR codes with branded logos, custom colors, and instant scanning.',
    icon: QrCode,
    status: 'coming-soon',
    category: 'Media & Asset Studio',
    badge: 'In Development',
  },
  {
    id: 'snippet-vault',
    title: 'Developer Snippet Vault',
    description: 'Save, format, and share reusable code snippets, environment configs, and markdown cheatsheets.',
    icon: Code2,
    status: 'coming-soon',
    category: 'Developer Productivity',
    badge: 'Planned',
  },
  {
    id: 'network-inspector',
    title: 'GeoIP & Network Inspector',
    description: 'Inspect HTTP request headers, IP locations, SSL details, and CORS endpoint configurations in real time.',
    icon: Globe2,
    status: 'coming-soon',
    category: 'API & Networking',
    badge: 'Planned',
  },
];

export default function ToolsHubPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white flex flex-col transition-colors duration-200">
      <div className="flex-1 relative overflow-hidden py-12 px-4 md:px-8 max-w-6xl mx-auto w-full">
        {/* Glow Background Elements */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[250px] bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <Wrench className="w-3.5 h-3.5" /> Developer Tools & Utilities
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-indigo-100 dark:to-purple-300 leading-tight mb-4"
          >
            Powerful Utilities. Built for Developers.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-400 text-base sm:text-lg leading-relaxed"
          >
            A curated suite of custom developer tools, link shorteners, QR generators, and productivity utilities built with speed and elegance.
          </motion.p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 mb-16">
          {toolsList.map((tool, idx) => {
            const Icon = tool.icon;
            const isActive = tool.status === 'active';

            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx + 0.2 }}
                className={`group relative rounded-3xl p-6 sm:p-8 transition-all duration-300 border backdrop-blur-xl flex flex-col justify-between ${
                  isActive
                    ? 'bg-white dark:bg-gray-900/80 border-gray-200 dark:border-white/10 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10'
                    : 'bg-gray-100/70 dark:bg-gray-900/40 border-gray-200/60 dark:border-white/5 opacity-85'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div
                      className={`p-3.5 rounded-2xl ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                          : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex items-center gap-2">
                      {tool.badge && (
                        <span
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            isActive
                              ? 'bg-indigo-100 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30'
                              : 'bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/20'
                          }`}
                        >
                          {tool.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    {tool.category}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {tool.title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                    {tool.description}
                  </p>
                </div>

                <div>
                  {isActive && tool.href ? (
                    <Link
                      href={tool.href}
                      className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 group-hover:translate-x-1 transition-all"
                    >
                      Launch Tool <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 dark:text-gray-500">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Coming Soon
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Feature Banner Footer */}
        <div className="relative z-10 rounded-2xl bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border border-indigo-500/20 p-6 md:p-8 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6 text-white">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-sm font-bold text-indigo-300 flex items-center justify-center sm:justify-start gap-2">
              <ShieldCheck className="w-4 h-4" /> Built with Privacy & High Performance
            </div>
            <div className="text-xs text-gray-300 max-w-xl">
              All tools run with fast server-side processing, client-side session privacy, and GeoIP analytics.
            </div>
          </div>

          <Link
            href="/tools/url-shortener"
            className="px-5 py-2.5 rounded-xl bg-white text-gray-900 font-bold text-xs hover:bg-gray-100 transition-colors shrink-0 shadow-lg"
          >
            Try URL Shortener
          </Link>
        </div>
      </div>
    </div>
  );
}
