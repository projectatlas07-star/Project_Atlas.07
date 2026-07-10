'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

interface DemoMetrics {
  totalClaims: number;
  activeClaims: number;
  pendingSupplements: number;
  approvedSupplements: number;
  totalRevenueRequested: number;
  totalRevenueApproved: number;
  approvalRate: number;
  aiAcceptanceRate: number;
  activeUsers: number;
  topCarriers: Array<{ name: string; count: number }>;
  topAdjusters: Array<{ name: string; count: number }>;
}

export default function DemoMetrics() {
  const [metrics, setMetrics] = useState<DemoMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await apiFetch('/demo/metrics');
      setMetrics(response as DemoMetrics);
    } catch (error) {
      console.error('Error fetching demo metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[var(--surface)] rounded-xl shadow-lg border border-[var(--neutral-gray-200)] p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-[var(--neutral-gray-200)] rounded w-1/4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-20 bg-[var(--neutral-gray-200)] rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const metricCards = [
    { label: 'Companies', value: '1', icon: '🏢' },
    { label: 'Customers', value: metrics?.totalClaims || 0, icon: '👥' },
    { label: 'Properties', value: metrics?.totalClaims || 0, icon: '🏠' },
    { label: 'Claims', value: metrics?.totalClaims || 0, icon: '📋' },
    { label: 'Supplements', value: metrics?.approvedSupplements || 0, icon: '💰' },
    { label: 'Documents', value: '100', icon: '📁' },
    { label: 'Interviews', value: '25', icon: '💬' },
    { label: 'Adjusters', value: '15', icon: '👷' },
    { label: 'Activities', value: '1,000+', icon: '📈' },
    { label: 'Revenue Requested', value: `$${(metrics?.totalRevenueRequested || 0).toLocaleString()}`, icon: '💵' },
    { label: 'Revenue Approved', value: `$${(metrics?.totalRevenueApproved || 0).toLocaleString()}`, icon: '✅' },
    { label: 'Approval Rate', value: `${metrics?.approvalRate || 0}%`, icon: '📊' },
  ];

  return (
    <div className="bg-[var(--surface)] rounded-xl shadow-lg border border-[var(--neutral-gray-200)] p-6">
      <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6">Demo Metrics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {metricCards.map((card, index) => (
          <div
            key={index}
            className="bg-[var(--background-alt)] rounded-lg p-4 border border-[var(--neutral-gray-200)] hover:border-[var(--brand-cyan)] transition-colors"
          >
            <div className="text-2xl mb-2">{card.icon}</div>
            <p className="text-xs text-[var(--neutral-gray-500)] font-medium">{card.label}</p>
            <p className="text-lg font-bold text-[var(--foreground)]">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
