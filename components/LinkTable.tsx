'use client';

import { useState } from 'react';
import { truncateUrl, formatDate } from '@/lib/utils';

interface Link {
  id: string;
  code: string;
  originalUrl: string;
  clickCount: number;
  lastClickedAt: Date | null;
  createdAt: Date;
}

interface LinkTableProps {
  links: Link[];
  onDelete: (code: string) => void;
  baseUrl: string;
}

export default function LinkTable({ links, onDelete, baseUrl }: LinkTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'clickCount' | 'lastClickedAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [deletingCode, setDeletingCode] = useState<string | null>(null);

  const filteredLinks = links.filter((link) => {
    const search = searchTerm.toLowerCase();
    return (
      link.code.toLowerCase().includes(search) ||
      link.originalUrl.toLowerCase().includes(search)
    );
  });

  const sortedLinks = [...filteredLinks].sort((a, b) => {
    let aValue: string | number | Date | null;
    let bValue: string | number | Date | null;

    if (sortBy === 'clickCount') {
      aValue = a.clickCount;
      bValue = b.clickCount;
    } else if (sortBy === 'lastClickedAt') {
      aValue = a.lastClickedAt || new Date(0);
      bValue = b.lastClickedAt || new Date(0);
    } else {
      aValue = a.createdAt;
      bValue = b.createdAt;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handleDelete = async (code: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    setDeletingCode(code);
    try {
      await onDelete(code);
    } finally {
      setDeletingCode(null);
    }
  };

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string) => {
    const shortUrl = `${baseUrl}/${code}`;
    navigator.clipboard.writeText(shortUrl);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (links.length === 0) {
    return (
      <div className="glass rounded-2xl shadow-2xl p-12 text-center border border-white/30">
        <div className="text-6xl mb-4">🔗</div>
        <p className="text-gray-600 text-lg font-medium">No links yet. Create your first short link above!</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl shadow-2xl overflow-hidden border border-white/30">
      <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-purple-50/50 to-pink-50/50">
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Search by code or URL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-5 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-purple-100/50 to-pink-100/50">
            <tr>
              <th
                className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-purple-200/50 transition-colors"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center gap-2">
                  Code
                  {sortBy === 'createdAt' && (
                    <span className="text-purple-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                Target URL
              </th>
              <th
                className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-purple-200/50 transition-colors"
                onClick={() => handleSort('clickCount')}
              >
                <div className="flex items-center gap-2">
                  Clicks
                  {sortBy === 'clickCount' && (
                    <span className="text-purple-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th
                className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-purple-200/50 transition-colors hidden md:table-cell"
                onClick={() => handleSort('lastClickedAt')}
              >
                <div className="flex items-center gap-2">
                  Last Clicked
                  {sortBy === 'lastClickedAt' && (
                    <span className="text-purple-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white/50 divide-y divide-gray-200/50">
            {sortedLinks.map((link, index) => {
              const shortUrl = `${baseUrl}/${link.code}`;
              return (
                <tr 
                  key={link.id} 
                  className="hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 transition-all duration-200"
                >
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {link.code}
                      </span>
                      <button
                        onClick={() => copyToClipboard(link.code)}
                        className="text-purple-600 hover:text-purple-800 text-sm px-2 py-1 rounded-lg hover:bg-purple-100 transition-colors"
                        title="Copy short URL"
                      >
                        {copiedCode === link.code ? '✓ Copied!' : '📋'}
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 break-all font-mono">{shortUrl}</div>
                    <div className="text-xs text-gray-600 md:hidden mt-1 break-all" title={link.originalUrl}>
                      {truncateUrl(link.originalUrl, 40)}
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 hidden md:table-cell">
                    <div className="text-sm text-gray-700 font-medium" title={link.originalUrl}>
                      {truncateUrl(link.originalUrl, 50)}
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700">
                      {link.clickCount}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden md:table-cell">
                    {formatDate(link.lastClickedAt)}
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(link.code)}
                      disabled={deletingCode === link.code}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingCode === link.code ? 'Deleting...' : '🗑️ Delete'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredLinks.length === 0 && searchTerm && (
        <div className="p-12 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-gray-600 font-medium">No links match your search.</p>
        </div>
      )}
    </div>
  );
}

