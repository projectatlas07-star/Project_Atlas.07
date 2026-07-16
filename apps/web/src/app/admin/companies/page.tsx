"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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
          <p className="text-muted-foreground">Manage your companies</p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/admin/companies/import"
            className="px-4 py-2 bg-muted dark:bg-card border border-input rounded-lg hover:bg-muted dark:hover:bg-surface transition-colors text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            Import CSV
          </Link>
          <button className="px-4 py-2 bg-info text-foreground rounded-lg hover:bg-info transition-colors">
            Add Company
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-muted-foreground">Loading companies...</p>
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-12 bg-surface rounded-lg border">
          <p className="text-muted-foreground mb-4">No companies found</p>
          <Link
            href="/admin/companies/import"
            className="px-4 py-2 bg-info text-foreground rounded-lg hover:bg-info transition-colors"
          >
            Import Companies
          </Link>
        </div>
      ) : (
        <div className="bg-surface rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-gray-200">
              {companies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">
                      {company.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-muted-foreground">
                      {company.slug}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-muted-foreground">
                      {new Date(company.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-info hover:text-blue-900 mr-3">
                      Edit
                    </button>
                    <button className="text-destructive hover:text-red-900">
                      Delete
                    </button>
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
