'use client';

import { useSupabase } from '@/providers/SupabaseProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

interface DashboardStats {
  total: number;
  byStatus: Record<string, number>;
  awaitingSupplement: number;
  awaitingCarrier: number;
  recentlyUpdated: any[];
}

interface SupplementsStats {
  total: number;
  byStatus: Record<string, number>;
  pending: number;
  approved: number;
  denied: number;
  totalRequested: number;
  totalApproved: number;
  averageApprovalTime: number;
  approvalRate: number;
  recentlyUpdated: any[];
}

export default function Home() {
  const { session, loading, supabase } = useSupabase();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [supplementsStats, setSupplementsStats] = useState<SupplementsStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!loading && !session) {
      router.push('/landing');
    }
  }, [session, loading, router]);

  useEffect(() => {
    if (session) {
      loadDashboardStats();
      loadSupplementsStats();
    }
  }, [session]);

  const loadDashboardStats = async () => {
    try {
      setLoadingStats(true);
      const data = await apiFetch<DashboardStats>('/claims/dashboard/stats');
      setStats(data);
    } catch (e: any) {
      console.error('Error loading dashboard stats:', e);
    } finally {
      setLoadingStats(false);
    }
  };

  const loadSupplementsStats = async () => {
    try {
      const data = await apiFetch<SupplementsStats>('/supplements/dashboard/stats');
      setSupplementsStats(data);
    } catch (e: any) {
      console.error('Error loading supplements stats:', e);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-[var(--neutral-gray-600)]">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--background-alt)]">
      <nav className="bg-surface border-b border-[var(--neutral-gray-200)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-[var(--foreground)]">Project Atlas</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a href="/admin/companies" className="border-transparent text-[var(--neutral-gray-500)] hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Companies
                </a>
                <a href="/admin/interviews" className="border-transparent text-[var(--neutral-gray-500)] hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Interviews
                </a>
                <a href="/admin/properties" className="border-transparent text-[var(--neutral-gray-500)] hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Properties
                </a>
                <a href="/admin/claims" className="border-transparent text-[var(--neutral-gray-500)] hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Claims
                </a>
                <a href="/admin/adjusters" className="border-transparent text-[var(--neutral-gray-500)] hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Adjusters
                </a>
                <a href="/admin/supplements" className="border-transparent text-[var(--neutral-gray-500)] hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Supplements
                </a>
                <a href="/admin/documents" className="border-transparent text-[var(--neutral-gray-500)] hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Documents
                </a>
                <a href="/admin/activity" className="border-transparent text-[var(--neutral-gray-500)] hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Activity
                </a>
                <a href="/admin/tasks" className="border-transparent text-[var(--neutral-gray-500)] hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Tasks
                </a>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => {
                  if (supabase) {
                    supabase.auth.signOut();
                    router.push('/login');
                  }
                }}
                className="text-[var(--neutral-gray-500)] hover:text-gray-700 text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-[1.125rem] font-bold text-[var(--foreground)] mb-6">Dashboard</h2>
          
          {/* Claims Workflow Widgets */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Claims Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-surface overflow-hidden shadow rounded-lg p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--neutral-gray-500)]">Total Claims</p>
                    <p className="text-2xl font-bold text-[var(--foreground)]">{stats?.total || 0}</p>
                  </div>
                  <div className="h-10 w-10 bg-[var(--color-info)]/10 rounded-full flex items-center justify-center">
                    <span className="text-[var(--color-info)] font-bold">📋</span>
                  </div>
                </div>
              </div>
              <div className="bg-surface overflow-hidden shadow rounded-lg p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--neutral-gray-500)]">Awaiting Supplement</p>
                    <p className="text-2xl font-bold text-[var(--color-warning)]">{stats?.awaitingSupplement || 0}</p>
                  </div>
                  <div className="h-10 w-10 bg-[var(--color-warning)]/10 rounded-full flex items-center justify-center">
                    <span className="text-[var(--color-warning)] font-bold">⚠️</span>
                  </div>
                </div>
              </div>
              <div className="bg-surface overflow-hidden shadow rounded-lg p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--neutral-gray-500)]">Awaiting Carrier</p>
                    <p className="text-2xl font-bold text-[var(--color-error)]">{stats?.awaitingCarrier || 0}</p>
                  </div>
                  <div className="h-10 w-10 bg-[var(--color-error)]/10 rounded-full flex items-center justify-center">
                    <span className="text-[var(--color-error)] font-bold">🕐</span>
                  </div>
                </div>
              </div>
              <div className="bg-surface overflow-hidden shadow rounded-lg p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--neutral-gray-500)]">Recently Updated</p>
                    <p className="text-2xl font-bold text-[var(--color-success)]">{stats?.recentlyUpdated.length || 0}</p>
                  </div>
                  <div className="h-10 w-10 bg-[var(--color-success)]/10 rounded-full flex items-center justify-center">
                    <span className="text-[var(--color-success)] font-bold">🔄</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recently Updated Claims */}
          {stats?.recentlyUpdated && stats.recentlyUpdated.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Recently Updated Claims</h3>
              <div className="bg-surface shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-[var(--background-alt)]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-gray-500)] uppercase tracking-wider">Claim Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-gray-500)] uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-gray-500)] uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-gray-500)] uppercase tracking-wider">Updated</th>
                    </tr>
                  </thead>
                  <tbody className="bg-surface divide-y divide-gray-200">
                    {stats.recentlyUpdated.map((claim) => (
                      <tr key={claim.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a href={`/admin/claims/${claim.id}`} className="text-[var(--color-info)] hover:text-blue-800 font-medium">
                            {claim.claimNumber}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                          {claim.status}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                          {claim.customerName || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--neutral-gray-500)]">
                          {new Date(claim.updatedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Supplements Workflow Widgets */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Supplements Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-surface overflow-hidden shadow rounded-lg p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--neutral-gray-500)]">Total Supplements</p>
                    <p className="text-2xl font-bold text-[var(--foreground)]">{supplementsStats?.total || 0}</p>
                  </div>
                  <div className="h-10 w-10 bg-[var(--brand-purple)]/10 rounded-full flex items-center justify-center">
                    <span className="text-[var(--brand-purple)] font-bold">💰</span>
                  </div>
                </div>
              </div>
              <div className="bg-surface overflow-hidden shadow rounded-lg p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--neutral-gray-500)]">Pending</p>
                    <p className="text-2xl font-bold text-[var(--color-warning)]">{supplementsStats?.pending || 0}</p>
                  </div>
                  <div className="h-10 w-10 bg-[var(--color-warning)]/10 rounded-full flex items-center justify-center">
                    <span className="text-[var(--color-warning)] font-bold">⏳</span>
                  </div>
                </div>
              </div>
              <div className="bg-surface overflow-hidden shadow rounded-lg p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--neutral-gray-500)]">Approved</p>
                    <p className="text-2xl font-bold text-[var(--color-success)]">{supplementsStats?.approved || 0}</p>
                  </div>
                  <div className="h-10 w-10 bg-[var(--color-success)]/10 rounded-full flex items-center justify-center">
                    <span className="text-[var(--color-success)] font-bold">✅</span>
                  </div>
                </div>
              </div>
              <div className="bg-surface overflow-hidden shadow rounded-lg p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--neutral-gray-500)]">Approval Rate</p>
                    <p className="text-2xl font-bold text-[var(--color-info)]">{supplementsStats?.approvalRate.toFixed(1) || 0}%</p>
                  </div>
                  <div className="h-10 w-10 bg-[var(--color-info)]/10 rounded-full flex items-center justify-center">
                    <span className="text-[var(--color-info)] font-bold">📊</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Supplements Revenue Summary */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Revenue Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-surface overflow-hidden shadow rounded-lg p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--neutral-gray-500)]">Total Requested</p>
                    <p className="text-2xl font-bold text-[var(--foreground)]">${(supplementsStats?.totalRequested || 0).toLocaleString()}</p>
                  </div>
                  <div className="h-10 w-10 bg-[var(--brand-purple)]/10 rounded-full flex items-center justify-center">
                    <span className="text-[var(--brand-purple)] font-bold">📈</span>
                  </div>
                </div>
              </div>
              <div className="bg-surface overflow-hidden shadow rounded-lg p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--neutral-gray-500)]">Total Approved</p>
                    <p className="text-2xl font-bold text-[var(--color-success)]">${(supplementsStats?.totalApproved || 0).toLocaleString()}</p>
                  </div>
                  <div className="h-10 w-10 bg-[var(--color-success)]/10 rounded-full flex items-center justify-center">
                    <span className="text-[var(--color-success)] font-bold">💵</span>
                  </div>
                </div>
              </div>
              <div className="bg-surface overflow-hidden shadow rounded-lg p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--neutral-gray-500)]">Outstanding</p>
                    <p className="text-2xl font-bold text-[var(--color-warning)]">${((supplementsStats?.totalRequested || 0) - (supplementsStats?.totalApproved || 0)).toLocaleString()}</p>
                  </div>
                  <div className="h-10 w-10 bg-[var(--color-warning)]/10 rounded-full flex items-center justify-center">
                    <span className="text-[var(--color-warning)] font-bold">⚠️</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recently Updated Supplements */}
          {supplementsStats?.recentlyUpdated && supplementsStats.recentlyUpdated.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Recently Updated Supplements</h3>
              <div className="bg-surface shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-[var(--background-alt)]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-gray-500)] uppercase tracking-wider">Supplement #</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-gray-500)] uppercase tracking-wider">Version</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-gray-500)] uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-gray-500)] uppercase tracking-wider">Carrier</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-gray-500)] uppercase tracking-wider">Requested</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-gray-500)] uppercase tracking-wider">Updated</th>
                    </tr>
                  </thead>
                  <tbody className="bg-surface divide-y divide-gray-200">
                    {supplementsStats.recentlyUpdated.map((supplement) => (
                      <tr key={supplement.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a href={`/admin/supplements/${supplement.id}`} className="text-[var(--color-info)] hover:text-blue-800 font-medium">
                            {supplement.supplementNumber}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                          v{supplement.version}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                          {supplement.status}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                          {supplement.carrier || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                          ${supplement.requestedAmount?.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--neutral-gray-500)]">
                          {new Date(supplement.updatedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-surface overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-[var(--foreground)] font-bold">C</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-[var(--neutral-gray-500)] truncate">Companies</dt>
                      <dd className="text-lg font-medium text-[var(--foreground)]">Manage your companies</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-[var(--background-alt)] px-5 py-3">
                <div className="text-sm">
                  <a href="/admin/companies" className="font-medium text-blue-700 hover:text-blue-600">
                    View all
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-surface overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-[var(--color-success)] rounded-md flex items-center justify-center">
                      <span className="text-[var(--foreground)] font-bold">I</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-[var(--neutral-gray-500)] truncate">Interviews</dt>
                      <dd className="text-lg font-medium text-[var(--foreground)]">AI-powered interviews</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-[var(--background-alt)] px-5 py-3">
                <div className="text-sm">
                  <a href="/admin/interviews" className="font-medium text-blue-700 hover:text-blue-600">
                    View all
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-surface overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-[var(--brand-purple)] rounded-md flex items-center justify-center">
                      <span className="text-[var(--foreground)] font-bold">P</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-[var(--neutral-gray-500)] truncate">Properties</dt>
                      <dd className="text-lg font-medium text-[var(--foreground)]">Manage properties</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-[var(--background-alt)] px-5 py-3">
                <div className="text-sm">
                  <a href="/admin/properties" className="font-medium text-blue-700 hover:text-blue-600">
                    View all
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-surface overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-[var(--color-warning)] rounded-md flex items-center justify-center">
                      <span className="text-[var(--foreground)] font-bold">C</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-[var(--neutral-gray-500)] truncate">Claims</dt>
                      <dd className="text-lg font-medium text-[var(--foreground)]">Track insurance claims</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-[var(--background-alt)] px-5 py-3">
                <div className="text-sm">
                  <a href="/admin/claims" className="font-medium text-blue-700 hover:text-blue-600">
                    View all
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-surface overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-[var(--color-error)] rounded-md flex items-center justify-center">
                      <span className="text-[var(--foreground)] font-bold">T</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-[var(--neutral-gray-500)] truncate">Tasks</dt>
                      <dd className="text-lg font-medium text-[var(--foreground)]">Manage your tasks</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-[var(--background-alt)] px-5 py-3">
                <div className="text-sm">
                  <a href="/admin/tasks" className="font-medium text-blue-700 hover:text-blue-600">
                    View all
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
