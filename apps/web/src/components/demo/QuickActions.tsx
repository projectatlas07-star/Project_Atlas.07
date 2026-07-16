'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface DemoStatus {
  enabled: boolean;
  hasData: boolean;
}

export default function QuickActions() {
  const router = useRouter();
  const [status, setStatus] = useState<DemoStatus | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await apiFetch('/demo/status');
      setStatus(response as DemoStatus);
    } catch (error) {
      console.error('Error fetching demo status:', error);
    }
  };

  const generateDemoData = async () => {
    setLoading(true);
    try {
      await apiFetch('/demo/generate', { method: 'POST' });
      await fetchStatus();
    } catch (error) {
      console.error('Error generating demo data:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetDemoData = async () => {
    setLoading(true);
    try {
      await apiFetch('/demo/reset', { method: 'POST' });
      await fetchStatus();
    } catch (error) {
      console.error('Error resetting demo data:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearDemoData = async () => {
    if (!confirm('Are you sure you want to clear all demo data? This cannot be undone.')) {
      return;
    }
    setLoading(true);
    try {
      await apiFetch('/demo/clear', { method: 'DELETE' });
      await fetchStatus();
      // Redirect to normal dashboard after clearing
      router.push('/admin');
    } catch (error) {
      console.error('Error clearing demo data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDemoMode = async () => {
    setLoading(true);
    try {
      if (status?.enabled) {
        // Disable demo mode by clearing data
        await clearDemoData();
      } else {
        // Enable demo mode by generating data
        await generateDemoData();
      }
    } catch (error) {
      console.error('Error toggling demo mode:', error);
    } finally {
      setLoading(false);
    }
  };

  const actions = [
    {
      label: 'Generate Demo Data',
      icon: '🎲',
      onClick: generateDemoData,
      disabled: status?.hasData || loading,
      color: 'bg-[var(--brand-cyan)] hover:bg-[var(--brand-cyan-light)] text-[var(--brand-navy)]'
    },
    {
      label: 'Reset Demo',
      icon: '🔄',
      onClick: resetDemoData,
      disabled: !status?.hasData || loading,
      color: 'bg-[var(--brand-purple)] hover:bg-[var(--brand-purple-light)] text-[var(--foreground)]'
    },
    {
      label: 'Clear Demo',
      icon: '🗑️',
      onClick: clearDemoData,
      disabled: !status?.hasData || loading,
      color: 'bg-[var(--color-error)] hover:bg-red-600 text-[var(--foreground)]'
    },
    {
      label: 'Toggle Demo Mode',
      icon: status?.enabled ? '🔴' : '🟢',
      onClick: toggleDemoMode,
      disabled: loading,
      color: status?.enabled 
        ? 'bg-[var(--neutral-gray-500)] hover:bg-gray-600 text-[var(--foreground)]'
        : 'bg-[var(--color-success)] hover:bg-green-600 text-[var(--foreground)]'
    },
    {
      label: 'Open Dashboard',
      icon: '📊',
      onClick: () => router.push('/admin'),
      disabled: false,
      color: 'bg-[var(--background-alt)] hover:bg-[var(--neutral-gray-100)] text-[var(--foreground)] border border-[var(--neutral-gray-200)]'
    },
    {
      label: 'Open Companies',
      icon: '🏢',
      onClick: () => router.push('/admin/companies'),
      disabled: false,
      color: 'bg-[var(--background-alt)] hover:bg-[var(--neutral-gray-100)] text-[var(--foreground)] border border-[var(--neutral-gray-200)]'
    },
    {
      label: 'Open Claims',
      icon: '📋',
      onClick: () => router.push('/admin/claims'),
      disabled: false,
      color: 'bg-[var(--background-alt)] hover:bg-[var(--neutral-gray-100)] text-[var(--foreground)] border border-[var(--neutral-gray-200)]'
    },
    {
      label: 'Open Supplements',
      icon: '💰',
      onClick: () => router.push('/admin/supplements'),
      disabled: false,
      color: 'bg-[var(--background-alt)] hover:bg-[var(--neutral-gray-100)] text-[var(--foreground)] border border-[var(--neutral-gray-200)]'
    },
    {
      label: 'Open Interviews',
      icon: '💬',
      onClick: () => router.push('/admin/interviews'),
      disabled: false,
      color: 'bg-[var(--background-alt)] hover:bg-[var(--neutral-gray-100)] text-[var(--foreground)] border border-[var(--neutral-gray-200)]'
    }
  ];

  return (
    <div className="bg-[var(--surface)] rounded-xl shadow-lg border border-[var(--neutral-gray-200)] p-6">
      <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            disabled={action.disabled}
            className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all duration-200 ${ action.disabled ? 'opacity-50 cursor-not-allowed bg-[var(--neutral-gray-100)]' : action.color }`}
          >
            <span className="text-2xl mb-2">{action.icon}</span>
            <span className="text-sm font-medium text-center">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
