'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useRouter } from 'next/navigation';
import { STATUS_LABELS, STATUS_COLORS, SupplementStatus } from '@/lib/supplements-workflow';

interface Supplement {
  id: string;
  supplementNumber: string;
  version: number;
  status: SupplementStatus;
  carrier: string | null;
  requestedAmount: number | null;
  approvedAmount: number | null;
  difference: number | null;
  submissionDate: string | null;
  responseDate: string | null;
  approvalDate: string | null;
  createdAt: string;
  updatedAt: string;
  claimId: string;
  claimNumber: string | null;
  adjusterId: string | null;
  adjusterName: string | null;
}

interface Adjuster {
  id: string;
  fullName: string;
}

interface SupplementsResponse {
  data: Supplement[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function SupplementsPage() {
  const { session, loading } = useSupabase();
  const router = useRouter();
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [adjusters, setAdjusters] = useState<Adjuster[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    claimId: '',
    supplementNumber: '',
    carrier: '',
    adjusterId: '',
    status: 'draft',
  });
  const [status, setStatus] = useState('');
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [adjusterFilter, setAdjusterFilter] = useState('');
  const [carrierFilter, setCarrierFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }
    loadSupplements();
    loadAdjusters();
  }, [session, router, statusFilter, adjusterFilter, carrierFilter, search, page]);

  const loadSupplements = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (adjusterFilter) params.append('adjusterId', adjusterFilter);
      if (carrierFilter) params.append('carrier', carrierFilter);
      if (search) params.append('search', search);
      params.append('page', page.toString());
      params.append('limit', '20');

      const data = await apiFetch<SupplementsResponse>(`/supplements?${params.toString()}`);
      setSupplements(data.data);
      setPagination(data.pagination);
    } catch (e: any) {
      setStatus(`Error loading: ${e.message}`);
    }
  };

  const loadAdjusters = async () => {
    try {
      const data = await apiFetch<Adjuster[]>('/adjusters');
      setAdjusters(data);
    } catch (e: any) {
      console.error('Error loading adjusters:', e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        adjusterId: formData.adjusterId || null,
      };
      await apiFetch<Supplement>('/supplements', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setStatus('Supplement created');
      setShowForm(false);
      setFormData({ 
        claimId: '', 
        supplementNumber: '', 
        carrier: '',
        adjusterId: '',
        status: 'draft',
      });
      loadSupplements();
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this supplement?')) return;
    try {
      await apiFetch(`/supplements/${id}`, { method: 'DELETE' });
      setStatus('Supplement deleted');
      loadSupplements();
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    }
  };

  const clearFilters = () => {
    setStatusFilter('');
    setAdjusterFilter('');
    setCarrierFilter('');
    setSearch('');
    setPage(1);
  };

  if (loading) return <p>Loading...</p>;
  if (!session) return null;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Supplements</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Supplement'}
        </button>
      </div>

      {status && <p className="mb-4 text-sm text-gray-600">{status}</p>}

      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label htmlFor="statusFilter" className="block mb-1 text-sm font-medium text-gray-700">Status</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full p-2 bg-[var(--neutral-gray-100)] dark:bg-[var(--surface-alt)] border border-[var(--neutral-gray-400)] dark:border-[var(--brand-navy-light)] rounded text-[var(--foreground)] placeholder:text-[var(--neutral-gray-500)] dark:placeholder:text-[var(--neutral-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-[var(--brand-cyan)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors hover:border-[var(--neutral-gray-500)] dark:hover:border-[var(--brand-cyan)]"
            >
              <option value="">All Statuses</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="adjusterFilter" className="block mb-1 text-sm font-medium text-gray-700">Adjuster</label>
            <select
              id="adjusterFilter"
              value={adjusterFilter}
              onChange={(e) => {
                setAdjusterFilter(e.target.value);
                setPage(1);
              }}
              className="w-full p-2 bg-[var(--neutral-gray-100)] dark:bg-[var(--surface-alt)] border border-[var(--neutral-gray-400)] dark:border-[var(--brand-navy-light)] rounded text-[var(--foreground)] placeholder:text-[var(--neutral-gray-500)] dark:placeholder:text-[var(--neutral-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-[var(--brand-cyan)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors hover:border-[var(--neutral-gray-500)] dark:hover:border-[var(--brand-cyan)]"
            >
              <option value="">All Adjusters</option>
              {adjusters.map((adjuster) => (
                <option key={adjuster.id} value={adjuster.id}>{adjuster.fullName}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="carrierFilter" className="block mb-1 text-sm font-medium text-gray-700">Carrier</label>
            <input
              id="carrierFilter"
              type="text"
              placeholder="Filter by carrier..."
              value={carrierFilter}
              onChange={(e) => {
                setCarrierFilter(e.target.value);
                setPage(1);
              }}
              className="w-full p-2 bg-[var(--neutral-gray-100)] dark:bg-[var(--surface-alt)] border border-[var(--neutral-gray-400)] dark:border-[var(--brand-navy-light)] rounded text-[var(--foreground)] placeholder:text-[var(--neutral-gray-500)] dark:placeholder:text-[var(--neutral-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-[var(--brand-cyan)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors hover:border-[var(--neutral-gray-500)] dark:hover:border-[var(--brand-cyan)]"
            />
          </div>
          <div>
            <label htmlFor="search" className="block mb-1 text-sm font-medium text-gray-700">Search</label>
            <input
              id="search"
              type="text"
              placeholder="Supplement #, carrier..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full p-2 bg-[var(--neutral-gray-100)] dark:bg-[var(--surface-alt)] border border-[var(--neutral-gray-400)] dark:border-[var(--brand-navy-light)] rounded text-[var(--foreground)] placeholder:text-[var(--neutral-gray-500)] dark:placeholder:text-[var(--neutral-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-[var(--brand-cyan)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors hover:border-[var(--neutral-gray-500)] dark:hover:border-[var(--brand-cyan)]"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Create New Supplement</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="claimId" className="block mb-1 text-sm font-medium text-gray-700">Claim ID</label>
              <input
                id="claimId"
                type="text"
                value={formData.claimId}
                onChange={(e) => setFormData({ ...formData, claimId: e.target.value })}
                className="w-full p-2 bg-[var(--neutral-gray-100)] dark:bg-[var(--surface-alt)] border border-[var(--neutral-gray-400)] dark:border-[var(--brand-navy-light)] rounded text-[var(--foreground)] placeholder:text-[var(--neutral-gray-500)] dark:placeholder:text-[var(--neutral-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-[var(--brand-cyan)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors hover:border-[var(--neutral-gray-500)] dark:hover:border-[var(--brand-cyan)]"
                required
              />
            </div>
            <div>
              <label htmlFor="supplementNumber" className="block mb-1 text-sm font-medium text-gray-700">Supplement Number</label>
              <input
                id="supplementNumber"
                type="text"
                value={formData.supplementNumber}
                onChange={(e) => setFormData({ ...formData, supplementNumber: e.target.value })}
                className="w-full p-2 bg-[var(--neutral-gray-100)] dark:bg-[var(--surface-alt)] border border-[var(--neutral-gray-400)] dark:border-[var(--brand-navy-light)] rounded text-[var(--foreground)] placeholder:text-[var(--neutral-gray-500)] dark:placeholder:text-[var(--neutral-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-[var(--brand-cyan)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors hover:border-[var(--neutral-gray-500)] dark:hover:border-[var(--brand-cyan)]"
                required
              />
            </div>
            <div>
              <label htmlFor="carrier" className="block mb-1 text-sm font-medium text-gray-700">Carrier</label>
              <input
                id="carrier"
                type="text"
                value={formData.carrier}
                onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                className="w-full p-2 bg-[var(--neutral-gray-100)] dark:bg-[var(--surface-alt)] border border-[var(--neutral-gray-400)] dark:border-[var(--brand-navy-light)] rounded text-[var(--foreground)] placeholder:text-[var(--neutral-gray-500)] dark:placeholder:text-[var(--neutral-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-[var(--brand-cyan)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors hover:border-[var(--neutral-gray-500)] dark:hover:border-[var(--brand-cyan)]"
              />
            </div>
            <div>
              <label htmlFor="status" className="block mb-1 text-sm font-medium text-gray-700">Status</label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2 bg-[var(--neutral-gray-100)] dark:bg-[var(--surface-alt)] border border-[var(--neutral-gray-400)] dark:border-[var(--brand-navy-light)] rounded text-[var(--foreground)] placeholder:text-[var(--neutral-gray-500)] dark:placeholder:text-[var(--neutral-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-[var(--brand-cyan)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors hover:border-[var(--neutral-gray-500)] dark:hover:border-[var(--brand-cyan)]"
              >
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="adjuster" className="block mb-1 text-sm font-medium text-gray-700">Assign Adjuster</label>
              <select
                id="adjuster"
                value={formData.adjusterId}
                onChange={(e) => setFormData({ ...formData, adjusterId: e.target.value })}
                className="w-full p-2 bg-[var(--neutral-gray-100)] dark:bg-[var(--surface-alt)] border border-[var(--neutral-gray-400)] dark:border-[var(--brand-navy-light)] rounded text-[var(--foreground)] placeholder:text-[var(--neutral-gray-500)] dark:placeholder:text-[var(--neutral-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-[var(--brand-cyan)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors hover:border-[var(--neutral-gray-500)] dark:hover:border-[var(--brand-cyan)]"
              >
                <option value="">No adjuster assigned</option>
                {adjusters.map((adjuster) => (
                  <option key={adjuster.id} value={adjuster.id}>
                    {adjuster.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save Supplement
          </button>
        </form>
      )}

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplement #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claim</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carrier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adjuster</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {supplements.map((supplement) => (
              <tr key={supplement.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <a href={`/admin/supplements/${supplement.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                    {supplement.supplementNumber}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  v{supplement.version}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={`px-2 py-1 rounded text-xs ${STATUS_COLORS[supplement.status]}`}>
                    {STATUS_LABELS[supplement.status]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {supplement.claimNumber || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {supplement.carrier || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {supplement.adjusterName || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${supplement.requestedAmount?.toFixed(2) || '0.00'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${supplement.approvedAmount?.toFixed(2) || '0.00'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDelete(supplement.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {supplements.length === 0 && (
              <tr>
                <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
                  No supplements found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {pagination.totalPages} ({pagination.total} total)
          </span>
          <button
            onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
            disabled={page === pagination.totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
