'use client';

// apps/web/src/app/admin/companies/import/page.tsx
import { useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function CompaniesImport() {
  const [file, setFile] = useState<File | null>(null);
  const [mapping, setMapping] = useState<string>('{}');
  const [status, setStatus] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setStatus('Please select a CSV file');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('mapping', mapping);
      const response = await fetch(`/companies/import-csv`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Import failed');
      setStatus(`Imported ${data.insertedCount} companies`);
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Import Companies (CSV)</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="csvFile" className="block mb-1 font-medium text-gray-700 dark:text-gray-200">CSV File</label>
          <input
            id="csvFile"
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
          />
        </div>
        <div>
          <label htmlFor="columnMapping" className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Column Mapping (JSON)</label>
          <textarea
            id="columnMapping"
            rows={4}
            value={mapping}
            onChange={(e) => setMapping(e.target.value)}
            className="block w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Example: {`{"Company Name":"name","Email":"email"}`}
          </p>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Import
        </button>
        {status && <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">{status}</p>}
      </form>
    </div>
  );
}
