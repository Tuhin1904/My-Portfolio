'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Link2,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Search,
  Trash2,
  BarChart2,
  RefreshCw,
  QrCode,
  Globe,
  Clock,
  CheckCircle2,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { apiRequest } from '@/apiFiles/apiClient';
import { apiEndpoints } from '@/apiFiles/apiEndpoints';

interface ShortUrlItem {
  _id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl?: string;
  title?: string;
  clicks: number;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
  analytics?: Array<{
    timestamp: string;
    referrer?: string;
    userAgent?: string;
    ip?: string;
  }>;
}

export default function UrlShortenerPage() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [title, setTitle] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<ShortUrlItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // List states
  const [shortLinks, setShortLinks] = useState<ShortUrlItem[]>([]);
  const [isLoadingLinks, setIsLoadingLinks] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [selectedLinkForStats, setSelectedLinkForStats] = useState<ShortUrlItem | null>(null);
  const [qrModalUrl, setQrModalUrl] = useState<string | null>(null);

  const fetchShortLinks = useCallback(async () => {
    setIsLoadingLinks(true);
    try {
      const response = await apiRequest({
        method: 'GET',
        url: apiEndpoints.getShortUrls,
        params: {
          query: searchQuery,
          pageSize: 20,
        },
      });

      if (response && response.success && Array.isArray(response.data)) {
        setShortLinks(response.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch short links:', err);
    } finally {
      setIsLoadingLinks(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchShortLinks();
  }, [fetchShortLinks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!originalUrl.trim()) {
      toast.error('Please enter a target URL');
      return;
    }

    let formattedUrl = originalUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    setIsSubmitting(true);
    try {
      const response = await apiRequest({
        method: 'POST',
        url: apiEndpoints.createShortUrl,
        data: {
          originalUrl: formattedUrl,
          customCode: customCode.trim() || undefined,
          title: title.trim() || undefined,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
        },
      });

      if (response && response.success && response.data) {
        setGeneratedLink(response.data);
        toast.success('Short link created successfully!');
        setOriginalUrl('');
        setCustomCode('');
        setTitle('');
        setExpiresAt('');
        fetchShortLinks();
      } else {
        toast.error(response?.message || 'Failed to create short link');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error creating short link. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = (urlStr: string, id: string) => {
    navigator.clipboard.writeText(urlStr);
    setCopiedId(id);
    toast.success('Short link copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this short link?')) return;

    try {
      const response = await apiRequest({
        method: 'DELETE',
        url: apiEndpoints.deleteShortUrl(id),
      });

      if (response && response.success) {
        toast.success('Short URL deleted');
        setShortLinks((prev) => prev.filter((item) => item._id !== id));
        if (selectedLinkForStats?._id === id) {
          setSelectedLinkForStats(null);
        }
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete short link');
    }
  };

  const getFullShortUrl = (item: ShortUrlItem): string => {
    if (item.shortUrl) return item.shortUrl;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://tuhindev.me';
    return `${origin}/s/${item.shortCode}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white flex flex-col transition-colors duration-200">
      <div className="flex-1 relative overflow-hidden py-10 px-4 md:px-8 max-w-6xl mx-auto w-full">
        {/* Glow Effects */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[250px] bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" /> URL Shortener & Link Analytics
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-indigo-100 dark:to-purple-300 leading-tight mb-4"
          >
            Shorten Links. Track Clicks. Elevate Your Reach.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-400 text-base sm:text-lg leading-relaxed"
          >
            Create sleek, branded short links for your portfolio, resume, projects, or social media. Built-in click analytics and fast HTTP 302 redirects.
          </motion.p>
        </div>

        {/* Creation Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-xl dark:shadow-2xl relative z-10 mb-12 backdrop-blur-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                Target URL <span className="text-indigo-600 dark:text-indigo-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                  <Globe className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="https://github.com/Tuhin1904/my-awesome-project"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-950/80 border border-gray-300 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                  Custom Slug (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500 text-xs font-mono">
                    /s/
                  </div>
                  <input
                    type="text"
                    placeholder="my-project"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-950/80 border border-gray-300 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                  Link Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="GitHub Repository"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950/80 border border-gray-300 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                  Expires At (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950/80 border border-gray-300 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Shortening...
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4" /> Shorten URL Now
                </>
              )}
            </button>
          </form>

          {/* Generated Result Banner */}
          <AnimatePresence>
            {generatedLink && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-400">
                    <CheckCircle2 className="w-4 h-4" /> Your Short URL is ready!
                  </div>
                  <div className="font-mono text-lg font-bold text-gray-900 dark:text-white tracking-wide truncate">
                    {getFullShortUrl(generatedLink)}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-lg">
                    Target: {generatedLink.originalUrl}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <button
                    onClick={() => handleCopy(getFullShortUrl(generatedLink), generatedLink._id)}
                    className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
                  >
                    {copiedId === generatedLink._id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-300" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </>
                    )}
                  </button>

                  <a
                    href={getFullShortUrl(generatedLink)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center p-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-medium transition-colors border border-gray-300 dark:border-white/10"
                    title="Open link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => setQrModalUrl(getFullShortUrl(generatedLink))}
                    className="inline-flex items-center justify-center p-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-medium transition-colors border border-gray-300 dark:border-white/10"
                    title="View QR Code"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Short Links Dashboard Listing */}
        <div className="space-y-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Recent Short Links
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">View and manage your created URLs, click statistics, and status.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search short links..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-white/10 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500 w-48 md:w-64"
                />
              </div>

              <button
                onClick={fetchShortLinks}
                className="p-2 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-300 dark:border-white/10 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                title="Refresh list"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingLinks ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Table / List */}
          <div className="bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden backdrop-blur-md shadow-md dark:shadow-none">
            {isLoadingLinks ? (
              <div className="p-12 text-center text-gray-500 text-sm flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" /> Loading short links...
              </div>
            ) : shortLinks.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 mx-auto">
                  <Link2 className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">No short links found</div>
                <div className="text-xs text-gray-500">Create your first short link using the form above.</div>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-white/5 overflow-x-auto">
                {shortLinks.map((item) => {
                  const fullUrl = getFullShortUrl(item);
                  return (
                    <div
                      key={item._id}
                      className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-300">
                            /{item.shortCode}
                          </span>
                          {item.title && (
                            <span className="text-xs px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300">
                              {item.title}
                            </span>
                          )}
                          <span
                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                              item.isActive
                                ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-500/20'
                                : 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-500/20'
                            }`}
                          >
                            {item.isActive ? 'Active' : 'Disabled'}
                          </span>
                        </div>

                        <div className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-xl">
                          {item.originalUrl}
                        </div>

                        <div className="flex items-center gap-4 text-[11px] text-gray-500 pt-1">
                          <span className="flex items-center gap-1">
                            <BarChart2 className="w-3 h-3 text-indigo-600 dark:text-indigo-400" /> {item.clicks || 0} clicks
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-center">
                        <button
                          onClick={() => handleCopy(fullUrl, item._id)}
                          className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-medium transition-colors border border-gray-300 dark:border-white/10 flex items-center gap-1.5 cursor-pointer"
                        >
                          {copiedId === item._id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Copy
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => setSelectedLinkForStats(item)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-medium transition-colors border border-indigo-200 dark:border-indigo-500/30 flex items-center gap-1.5 cursor-pointer"
                          title="View Analytics"
                        >
                          <BarChart2 className="w-3.5 h-3.5" /> Stats
                        </button>

                        <a
                          href={fullUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors border border-gray-300 dark:border-white/10"
                          title="Open Link"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 transition-colors border border-red-200 dark:border-red-500/20 cursor-pointer"
                          title="Delete Link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Analytics Detail Modal */}
        <AnimatePresence>
          {selectedLinkForStats && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 10 }}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-gray-900 dark:text-white"
              >
                <button
                  onClick={() => setSelectedLinkForStats(null)}
                  className="absolute top-4 right-4 p-1 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 mb-4">
                  <BarChart2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Link Analytics</h3>
                </div>

                <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-xl border border-gray-200 dark:border-white/5 space-y-2 mb-6">
                  <div className="text-xs text-gray-500">Short URL</div>
                  <div className="font-mono text-sm text-indigo-600 dark:text-indigo-300 font-semibold truncate">
                    {getFullShortUrl(selectedLinkForStats)}
                  </div>
                  <div className="text-xs text-gray-500 pt-1">Destination</div>
                  <div className="text-xs text-gray-700 dark:text-gray-200 truncate">{selectedLinkForStats.originalUrl}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-500/20 text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{selectedLinkForStats.clicks || 0}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Total Clicks</div>
                  </div>
                  <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-500/20 text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedLinkForStats.isActive ? 'Active' : 'Disabled'}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Status</div>
                  </div>
                </div>

                <h4 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2 tracking-wider">
                  Recent Click Log ({selectedLinkForStats.analytics?.length || 0})
                </h4>

                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {!selectedLinkForStats.analytics || selectedLinkForStats.analytics.length === 0 ? (
                    <div className="text-xs text-gray-500 text-center py-4">No click logs recorded yet.</div>
                  ) : (
                    selectedLinkForStats.analytics.slice().reverse().map((log, index) => (
                      <div key={index} className="p-2.5 bg-gray-50 dark:bg-gray-950/60 rounded-lg text-xs border border-gray-200 dark:border-white/5 flex items-center justify-between">
                        <div>
                          <div className="text-gray-800 dark:text-gray-300 font-mono text-[11px]">{new Date(log.timestamp).toLocaleString()}</div>
                          <div className="text-gray-500 text-[10px] truncate max-w-xs">{log.referrer || 'Direct / Bookmark'}</div>
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 text-[10px]">{log.ip || 'N/A'}</div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* QR Code Modal */}
        <AnimatePresence>
          {qrModalUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-2xl max-w-xs w-full p-6 shadow-2xl text-center relative text-gray-900 dark:text-white"
              >
                <button
                  onClick={() => setQrModalUrl(null)}
                  className="absolute top-4 right-4 p-1 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-2">
                  <QrCode className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> QR Code
                </h3>

                <div className="bg-white p-4 rounded-xl inline-block mb-4 shadow-md border border-gray-200">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrModalUrl)}`}
                    alt="QR Code"
                    className="w-44 h-44"
                  />
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-400 font-mono truncate">{qrModalUrl}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
