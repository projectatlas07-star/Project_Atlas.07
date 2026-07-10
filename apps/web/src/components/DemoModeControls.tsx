'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';

interface DemoStatus {
  enabled: boolean;
  hasData: boolean;
  summary: {
    customers: number;
    properties: number;
    claims: number;
    adjusters: number;
    documents: number;
    interviews: number;
    supplements: number;
    activities: number;
    users: number;
    teams: number;
  } | null;
}

export default function DemoModeControls() {
  const [status, setStatus] = useState<DemoStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const response = await apiFetch('/demo/status');
      setStatus(response as DemoStatus);
      setError(null);
    } catch (err) {
      setError('Failed to fetch demo status');
      console.error(err);
    }
  };

  const generateDemoData = async () => {
    setLoading(true);
    setError(null);
    try {
      await apiFetch('/demo/generate', { method: 'POST' });
      await fetchStatus();
    } catch (err) {
      setError('Failed to generate demo data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetDemoData = async () => {
    setLoading(true);
    setError(null);
    try {
      await apiFetch('/demo/reset', { method: 'POST' });
      await fetchStatus();
    } catch (err) {
      setError('Failed to reset demo data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearDemoData = async () => {
    if (!confirm('Are you sure you want to clear all demo data? This cannot be undone.')) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await apiFetch('/demo/clear', { method: 'DELETE' });
      await fetchStatus();
    } catch (err) {
      setError('Failed to clear demo data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useState(() => {
    fetchStatus();
  });

  return (
    <div className="bg-[var(--surface)] rounded-xl shadow-lg border border-[var(--neutral-gray-200)] p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-[var(--foreground)]">Demo Mode</h2>
          <p className="text-sm text-[var(--neutral-gray-500)] mt-1">
            Generate and manage demo data for testing and demonstrations
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          status?.enabled 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {status?.enabled ? 'Enabled' : 'Disabled'}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Demo Status Summary */}
      {status?.hasData && status.summary && (
        <div className="mb-6 p-4 bg-[var(--background-alt)] rounded-lg">
          <h3 className="text-sm font-medium text-[var(--foreground)] mb-3">Demo Data Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-[var(--neutral-gray-500)]">Customers:</span>
              <span className="ml-2 font-medium text-[var(--foreground)]">{status.summary.customers}</span>
            </div>
            <div>
              <span className="text-[var(--neutral-gray-500)]">Properties:</span>
              <span className="ml-2 font-medium text-[var(--foreground)]">{status.summary.properties}</span>
            </div>
            <div>
              <span className="text-[var(--neutral-gray-500)]">Claims:</span>
              <span className="ml-2 font-medium text-[var(--foreground)]">{status.summary.claims}</span>
            </div>
            <div>
              <span className="text-[var(--neutral-gray-500)]">Adjusters:</span>
              <span className="ml-2 font-medium text-[var(--foreground)]">{status.summary.adjusters}</span>
            </div>
            <div>
              <span className="text-[var(--neutral-gray-500)]">Documents:</span>
              <span className="ml-2 font-medium text-[var(--foreground)]">{status.summary.documents}</span>
            </div>
            <div>
              <span className="text-[var(--neutral-gray-500)]">Interviews:</span>
              <span className="ml-2 font-medium text-[var(--foreground)]">{status.summary.interviews}</span>
            </div>
            <div>
              <span className="text-[var(--neutral-gray-500)]">Supplements:</span>
              <span className="ml-2 font-medium text-[var(--foreground)]">{status.summary.supplements}</span>
            </div>
            <div>
              <span className="text-[var(--neutral-gray-500)]">Activities:</span>
              <span className="ml-2 font-medium text-[var(--foreground)]">{status.summary.activities}</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={generateDemoData}
          disabled={loading}
          className="px-4 py-2 bg-[var(--brand-cyan)] hover:bg-[var(--brand-cyan-light)] text-[var(--brand-navy)] rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating...' : 'Generate Demo Data'}
        </button>
        
        {status?.enabled && (
          <>
            <button
              onClick={resetDemoData}
              disabled={loading}
              className="px-4 py-2 border border-[var(--brand-purple)] text-[var(--brand-purple)] hover:bg-[var(--brand-purple)]/10 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting...' : 'Reset Demo Data'}
            </button>
            
            <button
              onClick={clearDemoData}
              disabled={loading}
              className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-50 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Clearing...' : 'Clear Demo Data'}
            </button>
          </>
        )}
      </div>

      {/* Info Text */}
      <div className="mt-4 text-xs text-[var(--neutral-gray-400)]">
        <p>Demo data uses a deterministic random seed, so the same environment can always be recreated.</p>
        <p className="mt-1">Demo mode never interferes with production data.</p>
      </div>
    </div>
  );
}
