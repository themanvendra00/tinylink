'use client';

import { useState } from 'react';

interface AddLinkFormProps {
  onSuccess: () => void;
}

export default function AddLinkForm({ onSuccess }: AddLinkFormProps) {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalUrl: url,
          code: customCode || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create link');
      }

      setSuccess(true);
      setUrl('');
      setCustomCode('');
      onSuccess();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 shadow-2xl mb-8 border border-white/30">
      <div className="mb-6">
        <h2 className="text-2xl font-bold gradient-text mb-2">Create Short Link</h2>
        <p className="text-gray-600">Transform long URLs into short, shareable links</p>
      </div>
      
      <div className="space-y-5">
        <div>
          <label htmlFor="url" className="block text-sm font-semibold text-gray-700 mb-2">
            URL <span className="text-pink-500">*</span>
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            placeholder="https://example.com"
            className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-2">
            Custom Code <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            id="code"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            placeholder="6-8 alphanumeric characters"
            pattern="[A-Za-z0-9]{6,8}"
            className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
            disabled={loading}
          />
          <p className="mt-2 text-sm text-gray-500">
            Leave empty to generate automatically
          </p>
        </div>

        {error && (
          <div className="glass rounded-xl p-4 border-l-4 border-red-500 bg-red-50/50">
            <div className="flex items-center gap-2">
              <span className="text-red-500 text-xl">⚠</span>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="glass rounded-xl p-4 border-l-4 border-green-500 bg-green-50/50">
            <div className="flex items-center gap-2">
              <span className="text-green-500 text-xl">✓</span>
              <p className="text-green-700 font-medium">Link created successfully!</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !url}
          className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white py-3 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
        >
          <span className="relative z-10">{loading ? 'Creating...' : '✨ Create Link'}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        </button>
      </div>
    </form>
  );
}

