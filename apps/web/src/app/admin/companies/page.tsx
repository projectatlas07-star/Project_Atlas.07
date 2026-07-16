'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Company {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch companies from API
    setCompanies([]);
    setLoading(false);
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Companies</h1>
          <p className="text-[var(--neutral-gray-600)]">Manage your companies</p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/admin/companies/import"
            className="px-4 py-2 bg-[var(--neutral-gray-100)] dark:bg-[var(--surface-alt)] border border-[var(--neutral-gray-400)] dark:border-[var(--brand-navy-light)] rounded-lg hover:bg-[var(--neutral-gray-200)] dark:hover:bg-[var(--surface)] transition-colors text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)]"
          >
            Import CSV
          </Link>
          <button className="px-4 py-2 bg-[var(--color-info)] text-[var(--foreground)] rounded-lg hover:bg-[var(--color-info)] transition-colors">
            Add Company
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-[var(--neutral-gray-600)]">Loading companies...</p>
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-12 bg-surface rounded-lg border border-[var(--neutral-gray-200)]">
          <p className="text-[var(--neutral-gray-600)] mb-4">No companies found</p>
          <Link
            href="/admin/companies/import"
            className="px-4 py-2 bg-[var(--color-info)] text-[var(--foreground)] rounded-lg hover:bg-[var(--color-info)] transition-colors"
          >
            Import Companies
          </Link>
        </div>
      ) : (
        <div className="bg-surface rounded-lg border border-[var(--neutral-gray-200)] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[var(--background-alt)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-gray-500)] uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-gray-500)] uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-gray-500)] uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[var(--neutral-gray-500)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-gray-200">
              {companies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[var(--foreground)]">{company.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[var(--neutral-gray-500)]">{company.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[var(--neutral-gray-500)]">
                      {new Date(company.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-[var(--color-info)] hover:text-blue-900 mr-3">Edit</button>
                    <button className="text-[var(--color-error)] hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}