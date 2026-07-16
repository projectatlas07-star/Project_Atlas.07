'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import DemoModeControls from '@/components/DemoModeControls';
import GuidedDemoMode from '@/components/GuidedDemoMode';

interface DashboardStats {
  totalClaims: number;
  activeClaims: number;
  pendingSupplements: number;
  totalRevenue: number;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  createdAt: string;
}

interface DemoStatus {
  enabled: boolean;
  hasData: boolean;
}

export default function DashboardPage() {
  const { session, loading } = useSupabase();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalClaims: 0,
    activeClaims: 0,
    pendingSupplements: 0,
    totalRevenue: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [demoStatus, setDemoStatus] = useState<DemoStatus | null>(null);

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }
    checkDemoStatus();
    loadDashboardData();
  }, [session, router]);

  const checkDemoStatus = async () => {
    try {
      const response = await apiFetch('/demo/status');
      const status = response as DemoStatus;
      setDemoStatus(status);
      
      // If demo mode is enabled, redirect to demo experience
      if (status.enabled) {
        router.push('/admin/demo');
      }
    } catch (error) {
      // Demo endpoint might not be available, ignore error
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoadingStats(true);
      // Load claims for stats
      const claimsData = await apiFetch<any>('/claims?page=1&limit=100');
      const totalClaims = claimsData.pagination?.total || 0;
      const activeClaims = claimsData.data?.filter((c: any) => 
        c.status !== 'closed' && c.status !== 'archived'
      ).length || 0;

      // Load supplements for pending count
      const supplementsData = await apiFetch<any>('/supplements?page=1&limit=100');
      const pendingSupplements = supplementsData.data?.filter((s: any) => 
        s.status === 'draft' || s.status === 'submitted'
      ).length || 0;

      // Calculate total revenue from approved supplements
      const totalRevenue = supplementsData.data?.reduce((sum: number, s: any) => {
        return sum + (s.approvedAmount ? parseFloat(s.approvedAmount) : 0);
      }, 0) || 0;

      setStats({
        totalClaims,
        activeClaims,
        pendingSupplements,
        totalRevenue,
      });

      // Load recent activity
      const activityData = await apiFetch<RecentActivity[]>('/activity?page=1&limit=10');
      setRecentActivity(activityData || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (loading || loadingStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-[var(--brand-cyan)] rounded-full animate-bounce animate-delay-0" />
          <div className="w-3 h-3 bg-[var(--brand-purple)] rounded-full animate-bounce animate-delay-150" />
          <div className="w-3 h-3 bg-[var(--brand-cyan)] rounded-full animate-bounce animate-delay-300" />
        </div>
      </div>
    );
  }

  if (!session) return null;

  const statCards = [
    {
      title: 'Total Claims',
      value: stats.totalClaims,
      icon: '📋',
      gradientClass: 'gradient-cyan',
      link: '/admin/claims',
    },
    {
      title: 'Active Claims',
      value: stats.activeClaims,
      icon: '🔄',
      gradientClass: 'gradient-purple',
      link: '/admin/claims',
    },
    {
      title: 'Pending Supplements',
      value: stats.pendingSupplements,
      icon: '💰',
      gradientClass: 'gradient-mixed',
      link: '/admin/supplements',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: '💵',
      gradientClass: 'gradient-cyan',
      link: '/admin/supplements',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="relative w-12 h-12">
          <Image
            src="/brand/logo-icon.svg"
            alt="Atlas"
            fill
            className="object-contain"
          />
        </div>
        <div>
          <h1 className="text-[1.40625rem] font-bold text-[var(--foreground)]">Dashboard</h1>
          <p className="text-[var(--neutral-gray-500)]">Welcome back to Project Atlas</p>
        </div>
      </div>

      {/* Demo Mode Controls */}
      <DemoModeControls />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <a
            key={index}
            href={card.link}
            className="group relative overflow-hidden rounded-xl gradient-brand p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 ${card.gradientClass}`} />
            <div className="relative">
              <div className="text-4xl mb-2">{card.icon}</div>
              <p className="text-[var(--neutral-gray-400)] text-sm font-medium">{card.title}</p>
              <p className="text-3xl font-bold text-[var(--foreground)] mt-1">{card.value}</p>
            </div>
          </a>
        ))}
      </div>

      {/* Guided Demo Mode */}
      <GuidedDemoMode />

      {/* Recent Activity */}
      <div className="bg-[var(--surface)] rounded-xl shadow-lg p-6 border border-[var(--neutral-gray-200)]">
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">Recent Activity</h2>
        {recentActivity.length > 0 ? (
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-4 p-3 rounded-lg bg-[var(--background-alt)] hover:bg-[var(--neutral-gray-100)] transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-[var(--brand-cyan)]/20 flex items-center justify-center text-[var(--brand-cyan)]">
                  {activity.type === 'create' && '➕'}
                  {activity.type === 'update' && '✏️'}
                  {activity.type === 'delete' && '🗑️'}
                  {activity.type === 'status_change' && '🔄'}
                </div>
                <div className="flex-1">
                  <p className="text-[var(--foreground)] font-medium">{activity.description}</p>
                  <p className="text-sm text-[var(--neutral-gray-500)]">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-[var(--neutral-gray-500)]">
            <div className="text-4xl mb-2">📭</div>
            <p>No recent activity</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-[var(--surface)] rounded-xl shadow-lg p-6 border border-[var(--neutral-gray-200)]">
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/claims"
            className="flex items-center space-x-3 p-4 rounded-lg bg-[var(--brand-cyan)]/10 hover:bg-[var(--brand-cyan)]/20 transition-colors border border-[var(--brand-cyan)]/30"
          >
            <span className="text-2xl">📋</span>
            <span className="font-medium text-[var(--foreground)]">New Claim</span>
          </a>
          <a
            href="/admin/interviews"
            className="flex items-center space-x-3 p-4 rounded-lg bg-[var(--brand-purple)]/10 hover:bg-[var(--brand-purple)]/20 transition-colors border border-[var(--brand-purple)]/30"
          >
            <span className="text-2xl">💬</span>
            <span className="font-medium text-[var(--foreground)]">Start Interview</span>
          </a>
          <a
            href="/admin/supplements"
            className="flex items-center space-x-3 p-4 rounded-lg bg-[var(--color-success)]/10 hover:bg-green-500/20 transition-colors border border-[var(--color-success)]/30"
          >
            <span className="text-2xl">💰</span>
            <span className="font-medium text-[var(--foreground)]">Generate Supplement</span>
          </a>
        </div>
      </div>
    </div>
  );
}
