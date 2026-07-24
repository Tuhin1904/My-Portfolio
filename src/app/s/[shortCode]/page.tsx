'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ExternalLink, AlertTriangle, ArrowLeft, Loader2, Link2 } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ shortCode: string }>;
}

export default function ShortCodeRedirectPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const shortCode = resolvedParams.shortCode;
  const router = useRouter();

  const [status, setStatus] = useState<'loading' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('');

  useEffect(() => {
    if (!shortCode) return;

    const resolveUrl = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
        const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
        
        // Fetch original URL from backend API
        const response = await fetch(`${cleanBaseUrl}/url-shortener/redirect/${encodeURIComponent(shortCode)}?json=true`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok && data.success && data.originalUrl) {
          setDestinationUrl(data.originalUrl);
          // Instant redirect
          window.location.replace(data.originalUrl);
        } else {
          setStatus('error');
          setErrorMessage(data.message || 'The short link you are looking for does not exist or has expired.');
        }
      } catch (err) {
        console.error('Failed to resolve short URL:', err);
        setStatus('error');
        setErrorMessage('Unable to connect to link redirection service. Please check your connection.');
      }
    };

    resolveUrl();
  }, [shortCode]);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full backdrop-blur-xl bg-gray-900/80 border border-white/10 p-8 rounded-2xl shadow-2xl text-center relative z-10"
      >
        {status === 'loading' ? (
          <div className="flex flex-col items-center py-6">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 animate-pulse">
                <Link2 className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-gray-950 p-1.5 rounded-full border border-indigo-500/40">
                <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
              </div>
            </div>

            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-indigo-300 mb-2">
              Redirecting...
            </h2>
            
            <p className="text-gray-400 text-sm mb-4">
              Taking you to destination website for short code <span className="font-mono text-indigo-400">/{shortCode}</span>
            </p>

            {destinationUrl && (
              <a
                href={destinationUrl}
                className="inline-flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 underline underline-offset-4 mt-2 transition-colors"
              >
                Click here if not redirected automatically <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-5">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-bold text-white mb-2">Link Unavailable</h2>
            
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              {errorMessage}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Link
                href="/"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-medium transition-all duration-200 border border-white/10"
              >
                <ArrowLeft className="w-4 h-4" /> Go Home
              </Link>
              <Link
                href="/url-shortener"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-indigo-500/20"
              >
                Shorten URL
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
