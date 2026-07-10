'use client';

import { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import TopNavigation from '@/components/TopNavigation';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background-alt)]">
      <Sidebar />
      <TopNavigation />
      <main className="ml-64 mt-16 p-6">
        {children}
      </main>
    </div>
  );
}
