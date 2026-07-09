'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useRouter } from 'next/navigation';

interface Claim {
  id: string;
  claimNumber: string;
  status: string;
  dateOfLoss: string;
  description: string;
}

export default function ClaimsPage() {
  const { session, loading } = useSupabase();
  const router = useRouter();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    claimNumber: '',
    status: 'open',
    dateOfLoss: '',
    description: '',
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }
    loadClaims();
  }, [session, router]);

  const loadClaims = async () => {
    try {
      const data = await apiFetch<Claim[]>('/claims');
      setClaims(data);
    } catch (e: any) {
      setStatus(`Error loading: ${e.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch<Claim>('/claims', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setStatus('Claim created');
      setShowForm(false);
      setFormData({ claimNumber: '', status: 'open', dateOfLoss: '', description: '' });
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

  if (loading) return <p>Loading...</p>;
  if (!session) return null;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Claims</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Claim'}
        </button>
      </div>

      {status && <p className="mb-4 text-sm text-gray-600">{status}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-white p-6 rounded shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="claimNumber" className="block mb-1 text-sm font-medium text-gray-700">Claim Number</label>
              <input
                id="claimNumber"
                type="text"
                value={formData.claimNumber}
                onChange={(e) => setFormData({ ...formData, claimNumber: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="status" className="block mb-1 text-sm font-medium text-gray-700">Status</label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div>
              <label htmlFor="dateOfLoss" className="block mb-1 text-sm font-medium text-gray-700">Date of Loss</label>
              <input
                id="dateOfLoss"
                type="date"
                value={formData.dateOfLoss}
                onChange={(e) => setFormData({ ...formData, dateOfLoss: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save Claim
          </button>
        </form>
      )}

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claim #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Loss</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {claims.map((claim) => (
              <tr key={claim.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{claim.claimNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={`px-2 py-1 rounded text-xs ${
                    claim.status === 'open' ? 'bg-green-100 text-green-800' :
                    claim.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {claim.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{claim.dateOfLoss || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{claim.description || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDelete(claim.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {claims.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No claims found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
