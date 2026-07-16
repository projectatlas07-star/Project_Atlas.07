'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useRouter } from 'next/navigation';

interface Document {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  claimId: string | null;
  createdAt: string;
}

interface Claim {
  id: string;
  claimNumber: string;
}

export default function DocumentsPage() {
  const { session, loading } = useSupabase();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedClaimId, setSelectedClaimId] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }
    loadDocuments();
    loadClaims();
  }, [session, router]);

  const loadDocuments = async () => {
    try {
      const data = await apiFetch<Document[]>('/documents');
      setDocuments(data);
    } catch (e: any) {
      setStatus(`Error loading: ${e.message}`);
    }
  };

  const loadClaims = async () => {
    try {
      const data = await apiFetch<Claim[]>('/claims');
      setClaims(data);
    } catch (e: any) {
      console.error('Error loading claims:', e);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setStatus('Please select a file');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (selectedClaimId) {
        formData.append('claimId', selectedClaimId);
      }

      const endpoint = selectedClaimId 
        ? `/documents/claims/${selectedClaimId}/upload`
        : '/documents/upload';

      const response = await fetch(`${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      setStatus('Document uploaded successfully');
      setShowForm(false);
      setFile(null);
      setSelectedClaimId('');
      loadDocuments();
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      await apiFetch(`/documents/${id}`, { method: 'DELETE' });
      setStatus('Document deleted');
      loadDocuments();
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    }
  };

  const handleDownload = (document: Document) => {
    window.open(document.url, '_blank');
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '-';
    if (bytes < 1024) return bytes + 'B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB';
    return (bytes / (1024 * 1024)).toFixed(1) + 'MB';
  };

  if (loading) return <p>Loading...</p>;
  if (!session) return null;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Documents</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-[var(--color-info)] text-[var(--foreground)] rounded hover:bg-[var(--color-info)]"
        >
          {showForm ? 'Cancel' : 'Upload Document'}
        </button>
      </div>

      {status && <p className="mb-4 text-sm text-[var(--neutral-gray-600)]">{status}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-surface p-6 rounded shadow">
          <div className="space-y-4">
            <div>
              <label htmlFor="claim" className="block mb-1 text-sm font-medium text-[var(--neutral-gray-700)]">
                Link to Claim (Optional)
              </label>
              <select
                id="claim"
                value={selectedClaimId}
                onChange={(e) => setSelectedClaimId(e.target.value)}
                className="w-full p-2 bg-[var(--neutral-gray-100)] dark:bg-[var(--surface-alt)] border border-[var(--neutral-gray-400)] dark:border-[var(--brand-navy-light)] rounded text-[var(--foreground)] placeholder:text-[var(--neutral-gray-500)] dark:placeholder:text-[var(--neutral-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-[var(--brand-cyan)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors hover:border-[var(--neutral-gray-500)] dark:hover:border-[var(--brand-cyan)]"
              >
                <option value="">No claim selected</option>
                {claims.map((claim) => (
                  <option key={claim.id} value={claim.id}>
                    {claim.claimNumber}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="file" className="block mb-1 text-sm font-medium text-[var(--neutral-gray-700)]">
                File
              </label>
              <input
                id="file"
                type="file"
                onChange={handleFileChange}
                className="w-full p-2 bg-[var(--neutral-gray-100)] dark:bg-[var(--surface-alt)] border border-[var(--neutral-gray-400)] dark:border-[var(--brand-navy-light)] rounded text-[var(--foreground)] placeholder:text-[var(--neutral-gray-500)] dark:placeholder:text-[var(--neutral-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-[var(--brand-cyan)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors hover:border-[var(--neutral-gray-500)] dark:hover:border-[var(--brand-cyan)]"
                required
              />
            </div>
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-2 bg-[var(--color-success)] text-[var(--foreground)] rounded hover:bg-[var(--color-success)] disabled:bg-gray-400"
            >
              {uploading ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-surface rounded shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[var(--background-alt)]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-gray-500)] uppercase tracking-wider">
                File Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-gray-500)] uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-gray-500)] uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-gray-500)] uppercase tracking-wider">
                Claim
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-gray-500)] uppercase tracking-wider">
                Uploaded
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-[var(--neutral-gray-500)] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-surface divide-y divide-gray-200">
            {documents.map((document) => (
              <tr key={document.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                  {document.fileName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                  {document.mimeType || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                  {formatFileSize(document.sizeBytes)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                  {document.claimId ? (
                    <span className="px-2 py-1 bg-[var(--color-info)]/10 text-blue-800 rounded text-xs">
                      Linked
                    </span>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                  {new Date(document.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDownload(document)}
                    className="text-[var(--color-info)] hover:text-blue-900 mr-3"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(document.id)}
                    className="text-[var(--color-error)] hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {documents.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-[var(--neutral-gray-500)]">
                  No documents found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
