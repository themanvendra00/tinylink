'use client';

import { useState } from 'react';
import { formatDate, formatRelativeTime } from '@/lib/utils';

interface Link {
  code: string;
  originalUrl: string;
  clickCount: number;
  lastClickedAt: Date | null;
  createdAt: Date;
}

interface StatsCardProps {
  link: Link;
  baseUrl: string;
}

export default function StatsCard({ link, baseUrl }: StatsCardProps) {
  const shortUrl = `${baseUrl}/${link.code}`;

  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass rounded-2xl shadow-2xl p-8 border border-white/30">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Link Statistics</h1>
        <p className="text-gray-600 text-lg">Detailed information about this short link</p>
      </div>

      <div className="space-y-6">
        <div className="glass rounded-xl p-5 border border-white/20">
          <label className="block text-sm font-semibold text-gray-600 mb-2">Short Code</label>
          <div className="flex items-center gap-2">
            <span className="text-xl font-mono font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {link.code}
            </span>
          </div>
        </div>

        <div className="glass rounded-xl p-5 border border-white/20">
          <label className="block text-sm font-semibold text-gray-600 mb-2">Short URL</label>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-lg font-mono text-purple-600 break-all font-medium">{shortUrl}</span>
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={copied}
            >
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
          </div>
        </div>

        <div className="glass rounded-xl p-5 border border-white/20">
          <label className="block text-sm font-semibold text-gray-600 mb-2">Original URL</label>
          <a
            href={link.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg text-cyan-600 hover:text-cyan-800 break-all font-medium hover:underline transition-colors"
          >
            {link.originalUrl}
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200/50">
          <div className="glass rounded-xl p-6 border border-white/20 text-center">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Total Clicks</label>
            <p className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              {link.clickCount}
            </p>
          </div>

          <div className="glass rounded-xl p-6 border border-white/20 text-center">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Last Clicked</label>
            <p className="text-lg font-bold text-gray-900">{formatDate(link.lastClickedAt)}</p>
            <p className="text-sm text-gray-500 mt-1">{formatRelativeTime(link.lastClickedAt)}</p>
          </div>

          <div className="glass rounded-xl p-6 border border-white/20 text-center">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Created</label>
            <p className="text-lg font-bold text-gray-900">{formatDate(link.createdAt)}</p>
            <p className="text-sm text-gray-500 mt-1">{formatRelativeTime(link.createdAt)}</p>
          </div>
        </div>

        <div className="pt-6">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

