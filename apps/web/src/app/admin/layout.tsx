'use client';

import { ReactNode, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopNavigation from '@/components/TopNavigation';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-atmosphere text-foreground">
      <Sidebar 
        mobileOpen={mobileMenuOpen} 
        onMobileClose={() => setMobileMenuOpen(false)} 
      />
      <TopNavigation onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
      <main className="ml-0 md:ml-64 mt-16 p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}
