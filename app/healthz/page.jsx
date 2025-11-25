'use client';

import { useState, useEffect } from 'react';

export default function Healthz() {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/healthz")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setStatus(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "Unknown error");
        setStatus(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-purple-600 font-medium">Checking health status...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold gradient-text mb-3">Health Check</h2>
          <p className="text-gray-600 text-lg">System health status</p>
        </div>
        <div className="glass rounded-xl p-6 border-l-4 border-red-500 bg-red-50/50">
          <div className="flex items-center gap-3">
            <span className="text-red-500 text-2xl">⚠</span>
            <div>
              <h3 className="text-red-700 font-bold text-lg mb-1">Error</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold gradient-text mb-3">Health Check</h2>
        <p className="text-gray-600 text-lg">System health status</p>
      </div>

      <div className="glass rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-4 h-4 rounded-full ${status?.ok ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <h3 className="text-2xl font-bold text-gray-800">
            {status?.ok ? 'System Healthy' : 'System Unhealthy'}
          </h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
              <div className="text-sm text-gray-600 mb-1">Status</div>
              <div className="text-xl font-bold text-purple-700">
                {status?.ok ? '✓ OK' : '✗ Error'}
              </div>
            </div>
            {status?.version && (
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-4 border border-cyan-100">
                <div className="text-sm text-gray-600 mb-1">Version</div>
                <div className="text-xl font-bold text-cyan-700">{status.version}</div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600 mb-2 font-medium">Raw Response</div>
            <pre className="bg-gray-50 rounded-lg p-4 overflow-x-auto text-sm border border-gray-200">
              {JSON.stringify(status, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
