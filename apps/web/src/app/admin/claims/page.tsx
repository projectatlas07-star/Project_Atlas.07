'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useRouter } from 'next/navigation';
import { STATUS_LABELS, STATUS_COLORS, ClaimStatus } from '@/lib/claims-workflow';

interface Claim {
  id: string;
  claimNumber: string;
  status: ClaimStatus;
  dateOfLoss: string | null;
  dateReported: string | null;
  insuranceCompany: string | null;
  customerName: string | null;
  description: string | null;
  adjusterId: string | null;
  adjuster?: {
    id: string;
    fullName: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Adjuster {
  id: string;
  fullName: string;
}

interface ClaimsResponse {
  data: Claim[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function ClaimsPage() {
  const { session, loading } = useSupabase();
  const router = useRouter();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [adjusters, setAdjusters] = useState<Adjuster[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    claimNumber: '',
    status: 'new',
    dateOfLoss: '',
    insuranceCompany: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    description: '',
    adjusterId: '',
  });
  const [status, setStatus] = useState('');
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [adjusterFilter, setAdjusterFilter] = useState('');
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
    loadClaims();
    loadAdjusters();
  }, [session, router, statusFilter, adjusterFilter, search, page]);

  const loadClaims = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (adjusterFilter) params.append('adjusterId', adjusterFilter);
      if (search) params.append('search', search);
      params.append('page', page.toString());
      params.append('limit', '20');

      const data = await apiFetch<ClaimsResponse>(`/claims?${params.toString()}`);
      setClaims(data.data);
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
      await apiFetch<Claim>('/claims', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setStatus('Claim created');
      setShowForm(false);
      setFormData({ 
        claimNumber: '', 
        status: 'new', 
        dateOfLoss: '', 
        insuranceCompany: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        description: '', 
        adjusterId: '' 
      });
      loadClaims();
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    }
  };

  const handleAssignAdjuster = async (claimId: string, adjusterId: string) => {
    try {
      await apiFetch(`/claims/${claimId}`, {
        method: 'PUT',
        body: JSON.stringify({ adjusterId: adjusterId || null }),
      });
      setStatus('Adjuster assigned');
      loadClaims();
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this claim?')) return;
    try {
      await apiFetch(`/claims/${id}`, { method: 'DELETE' });
      setStatus('Claim deleted');
      loadClaims();
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    }
  };

  const clearFilters = () => {
    setStatusFilter('');
    setAdjusterFilter('');
    setSearch('');
    setPage(1);
  };

  if (loading) return <p>Loading...</p>;
  if (!session) return null;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Claims</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-[var(--brand-cyan)] hover:bg-[var(--brand-cyan-light)] text-[var(--brand-navy)] rounded-lg font-medium transition-colors"
        >
          {showForm ? 'Cancel' : 'Add Claim'}
        </button>
      </div>

      {status && <p className="mb-4 text-sm text-[var(--neutral-gray-600)]">{status}</p>}

      {/* Filters */}
      <div className="mb-6 bg-[var(--surface)] p-4 rounded-xl shadow-lg border border-[var(--neutral-gray-200)]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="statusFilter" className="block mb-1 text-sm font-medium text-[var(--foreground)]">Status</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full p-2 bg-[var(--neutral-gray-100)] dark:bg-[var(--surface-alt)] border border-[var(--neutral-gray-400)] dark:border-[var(--brand-navy-light)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--neutral-gray-500)] dark:placeholder:text-[var(--neutral-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-[var(--brand-cyan)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors hover:border-[var(--neutral-gray-500)] dark:hover:border-[var(--brand-cyan)]"
            >
              <option value="">All Statuses</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="adjusterFilter" className="block mb-1 text-sm font-medium text-[var(--foreground)]">Adjuster</label>
            <select
              id="adjusterFilter"
              value={adjusterFilter}
              onChange={(e) => {
                setAdjusterFilter(e.target.value);
                setPage(1);
              }}
              className="w-full p-2 bg-[var(--neutral-gray-100)] dark:bg-[var(--surface-alt)] border border-[var(--neutral-gray-400)] dark:border-[var(--brand-navy-light)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--neutral-gray-500)] dark:placeholder:text-[var(--neutral-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-[var(--brand-cyan)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors hover:border-[var(--neutral-gray-500)] dark:hover:border-[var(--brand-cyan)]"
            >
              <option value="">All Adjusters</option>
              {adjusters.map((adjuster) => (
                <option key={adjuster.id} value={adjuster.id}>{adjuster.fullName}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="search" className="block mb-1 text-sm font-medium text-[var(--foreground)]">Search</label>
            <input
              id="search"
              type="text"
              placeholder="Claim #, customer, insurance..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full p-2 bg-[var(--neutral-gray-100)] dark:bg-[var(--surface-alt)] border border-[var(--neutral-gray-400)] dark:border-[var(--brand-navy-light)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--neutral-gray-500)] dark:placeholder:text-[var(--neutral-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-[var(--brand-cyan)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors hover:border-[var(--neutral-gray-500)] dark:hover:border-[var(--brand-cyan)]"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-[var(--neutral-gray-200)] text-[var(--neutral-gray-700)] rounded-lg hover:bg-[var(--neutral-gray-300)] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-[var(--surface)] p-6 rounded-xl shadow-lg border border-[var(--neutral-gray-200)]">
          <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Create New Claim</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="claimNumber" className="block mb-1 text-sm font-medium text-[var(--foreground)]">Claim Number</label>
              <input
                id="claimNumber"
                type="text"
                value={formData.claimNumber}
                onChange={(e) => setFormData({ ...formData, claimNumber: e.target.value })}
                className="w-full p-2 bg-[var(--neutral-gray-100)] dark:bg-[var(--surface-alt)] border border-[var(--neutral-gray-400)] dark:border-[var(--brand-navy-light)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--neutral-gray-500)] dark:placeholder:text-[var(--neutral-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-[var(--brand-cyan)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors hover:border-[var(--neutral-gray-500)] dark:hover:border-[var(--brand-cyan)]"
                required
              />
            </div>
            <div>
              <label htmlFor="status" className="block mb-1 text-sm font-medium text-[var(--foreground)]">Status</label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2 bg-[var(--neutral-gray-100)] dark:bg-[var(--surface-alt)] border border-[var(--neutral-gray-400)] dark:border-[var(--brand-navy-light)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--neutral-gray-500)] dark:placeholder:text-[var(--neutral-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-[var(--brand-cyan)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors hover:border-[var(--neutral-gray-500)] dark:hover:border-[var(--brand-cyan)]"
              >
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="dateOfLoss" className="block mb-1 text-sm font-medium text-[var(--foreground)]">Date of Loss</label>
              <input
                id="dateOfLoss"
                type="date"
                value={formData.dateOfLoss}
                onChange={(e) => setFormData({ ...formData, dateOfLoss: e.target.value })}
                className="w-full p-2 bg-[var(--neutral-gray-100)] dark:bg-[var(--surface-alt)] border border-[var(--neutral-gray-400)] dark:border-[var(--brand-navy-light)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--neutral-gray-500)] dark:placeholder:text-[var(--neutral-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-[var(--brand-cyan)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors hover:border-[var(--neutral-gray-500)] dark:hover:border-[var(--brand-cyan)]"
              />
            </div>
            <div>
              <label htmlFor="insuranceCompany" className="block mb-1 text-sm font-medium text-[var(--foreground)]">Insurance Company</label>
              <input
                id="insuranceCompany"
                type="text"
                value={formData.insuranceCompany}
                onChange={(e) => setFormData({ ...formData, insuranceCompany: e.target.value })}
                className="w-full p-2 bg-[var(--neutral-gray-100)] dark:bg-[var(--surface-alt)] border border-[var(--neutral-gray-400)] dark:border-[var(--brand-navy-light)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--neutral-gray-500)] dark:placeholder:text-[var(--neutral-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-[var(--brand-cyan)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors hover:border-[var(--neutral-gray-500)] dark:hover:border-[var(--brand-cyan)]"
              />
            </div>
            <div>
              <label htmlFor="customerName" className="block mb-1 text-sm font-medium text-[var(--foreground)]">Customer Name</label>
              <input
                id="customerName"
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full p-2 bg-[var(--neutral-gray-100)] dark:bg-[var(--surface-alt)] border border-[var(--neutral-gray-400)] dark:border-[var(--brand-navy-light)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--neutral-gray-500)] dark:placeholder:text-[var(--neutral-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-[var(--brand-cyan)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors hover:border-[var(--neutral-gray-500)] dark:hover:border-[var(--brand-cyan)]"
              />
            </div>
            <div>
              <label htmlFor="customerEmail" className="block mb-1 text-sm font-medium text-[var(--foreground)]">Customer Email</label>
              <input
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                className="w-full p-2 bg-[var(--neutral-gray-100)] dark:bg-[var(--surface-alt)] border border-[var(--neutral-gray-400)] dark:border-[var(--brand-navy-light)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--neutral-gray-500)] dark:placeholder:text-[var(--neutral-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-[var(--brand-cyan)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors hover:border-[var(--neutral-gray-500)] dark:hover:border-[var(--brand-cyan)]"
              />
            </div>
            <div>
              <label htmlFor="customerPhone" className="block mb-1 text-sm font-medium text-[var(--foreground)]">Customer Phone</label>
              <input
                id="customerPhone"
                type="text"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                className="w-full p-2 bg-[var(--neutral-gray-100)] dark:bg-[var(--surface-alt)] border border-[var(--neutral-gray-400)] dark:border-[var(--brand-navy-light)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--neutral-gray-500)] dark:placeholder:text-[var(--neutral-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-[var(--brand-cyan)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors hover:border-[var(--neutral-gray-500)] dark:hover:border-[var(--brand-cyan)]"
              />
            </div>
            <div>
              <label htmlFor="adjuster" className="block mb-1 text-sm font-medium text-[var(--foreground)]">Assign Adjuster</label>
              <select
                id="adjuster"
                value={formData.adjusterId}
                onChange={(e) => setFormData({ ...formData, adjusterId: e.target.value })}
                className="w-full p-2 bg-[var(--neutral-gray-100)] dark:bg-[var(--surface-alt)] border border-[var(--neutral-gray-400)] dark:border-[var(--brand-navy-light)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--neutral-gray-500)] dark:placeholder:text-[var(--neutral-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-[var(--brand-cyan)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors hover:border-[var(--neutral-gray-500)] dark:hover:border-[var(--brand-cyan)]"
              >
                <option value="">No adjuster assigned</option>
                {adjusters.map((adjuster) => (
                  <option key={adjuster.id} value={adjuster.id}>
                    {adjuster.fullName}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="description" className="block mb-1 text-sm font-medium text-[var(--foreground)]">Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 bg-[var(--neutral-gray-100)] dark:bg-[var(--surface-alt)] border border-[var(--neutral-gray-400)] dark:border-[var(--brand-navy-light)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--neutral-gray-500)] dark:placeholder:text-[var(--neutral-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-[var(--brand-cyan)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors hover:border-[var(--neutral-gray-500)] dark:hover:border-[var(--brand-cyan)]"
                rows={3}
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-[var(--brand-cyan)] hover:bg-[var(--brand-cyan-light)] text-[var(--brand-navy)] rounded-lg font-medium transition-colors"
          >
            Save Claim
          </button>
        </form>
      )}

      <div className="bg-[var(--surface)] rounded-xl shadow-lg overflow-hidden border border-[var(--neutral-gray-200)]">
        <table className="min-w-full divide-y divide-[var(--neutral-gray-200)]">
          <thead className="bg-[var(--background-alt)]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-gray-500)] uppercase tracking-wider">Claim #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-gray-500)] uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-gray-500)] uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-gray-500)] uppercase tracking-wider">Insurance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-gray-500)] uppercase tracking-wider">Adjuster</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-gray-500)] uppercase tracking-wider">Date of Loss</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-[var(--neutral-gray-500)] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-[var(--surface)] divide-y divide-[var(--neutral-gray-200)]">
            {claims.map((claim) => (
              <tr key={claim.id} className="hover:bg-[var(--background-alt)] transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                  <a href={`/admin/claims/${claim.id}`} className="text-[var(--brand-cyan)] hover:text-[var(--brand-cyan-light)] font-medium transition-colors">
                    {claim.claimNumber}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                  <span className={`px-2 py-1 rounded text-xs ${STATUS_COLORS[claim.status]}`}>
                    {STATUS_LABELS[claim.status]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">{claim.customerName || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">{claim.insuranceCompany || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                  <select
                    value={claim.adjusterId || ''}
                    onChange={(e) => handleAssignAdjuster(claim.id, e.target.value)}
                    className="p-1 text-sm bg-[var(--neutral-gray-100)] dark:bg-[var(--surface-alt)] border border-[var(--neutral-gray-400)] dark:border-[var(--brand-navy-light)] rounded text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-[var(--brand-cyan)] disabled:opacity-60 transition-colors hover:border-[var(--neutral-gray-500)] dark:hover:border-[var(--brand-cyan)]"
                    aria-label="Assign adjuster"
                  >
                    <option value="">Unassigned</option>
                    {adjusters.map((adjuster) => (
                      <option key={adjuster.id} value={adjuster.id}>
                        {adjuster.fullName}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                  {claim.dateOfLoss ? new Date(claim.dateOfLoss).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDelete(claim.id)}
                    className="text-[var(--color-error)] hover:text-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {claims.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-[var(--neutral-gray-500)]">
                  No claims found
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
            className="px-4 py-2 border border-[var(--neutral-gray-300)] rounded-lg bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--background-alt)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-[var(--foreground)]">
            Page {page} of {pagination.totalPages} ({pagination.total} total)
          </span>
          <button
            onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
            disabled={page === pagination.totalPages}
            className="px-4 py-2 border border-[var(--neutral-gray-300)] rounded-lg bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--background-alt)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
