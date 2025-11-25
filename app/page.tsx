'use client';

import { useState, useEffect } from 'react';
import AddLinkForm from '@/components/AddLinkForm';
import LinkTable from '@/components/LinkTable';

interface Link {
  id: string;
  code: string;
  originalUrl: string;
  clickCount: number;
  lastClickedAt: string | null;
  createdAt: string;
}

export default function Dashboard() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    setBaseUrl(process.env.NEXT_PUBLIC_BASE_URL || window.location.origin);
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/links');
      if (!response.ok) {
        throw new Error('Failed to fetch links');
      }
      const data = await response.json();
      setLinks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleDelete = async (code: string) => {
    try {
      const response = await fetch(`/api/links/${code}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete link');
      }

      // Refresh the links list
      await fetchLinks();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete link');
    }
  };

  if (loading && links.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-purple-600 font-medium">Loading links...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold gradient-text mb-3">Shorten Your Links</h2>
        <p className="text-gray-600 text-lg">Create short, memorable links in seconds</p>
      </div>

      <AddLinkForm onSuccess={fetchLinks} />
      
      {error && (
        <div className="glass rounded-xl p-4 border-l-4 border-red-500 bg-red-50/50">
          <div className="flex items-center gap-2">
            <span className="text-red-500 text-xl">⚠</span>
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      {baseUrl && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Links</h2>
            <p className="text-gray-600">Manage and track all your shortened URLs</p>
          </div>
          <LinkTable
            links={links.map((link) => ({
              ...link,
              lastClickedAt: link.lastClickedAt ? new Date(link.lastClickedAt) : null,
              createdAt: new Date(link.createdAt),
            }))}
            onDelete={handleDelete}
            baseUrl={baseUrl}
          />
        </div>
      )}
    </div>
  );
}

