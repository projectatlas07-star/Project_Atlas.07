'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/claims', label: 'Claims', icon: '📋' },
  { href: '/admin/interviews', label: 'Interviews', icon: '💬' },
  { href: '/admin/supplements', label: 'Supplements', icon: '💰' },
  { href: '/admin/documents', label: 'Documents', icon: '📁' },
  { href: '/admin/adjusters', label: 'Adjusters', icon: '👷' },
  { href: '/admin/companies', label: 'Companies', icon: '🏢' },
  { href: '/admin/properties', label: 'Properties', icon: '🏠' },
  { href: '/admin/activity', label: 'Activity', icon: '📈' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-[var(--brand-navy)] border-r border-white/10 transition-all duration-300 z-50 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {!collapsed && (
          <div className="relative w-40 h-12">
            <Image
              src="/brand/logo-horizontal.svg"
              alt="Project Atlas"
              fill
              className="object-contain"
            />
          </div>
        )}
        {collapsed && (
          <div className="relative w-8 h-8 mx-auto">
            <Image
              src="/brand/logo-icon.svg"
              alt="Atlas"
              fill
              className="object-contain"
            />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-[var(--brand-cyan)] text-[var(--brand-navy)] font-medium'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <span className="text-lg">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle at Bottom */}
      <div className="absolute bottom-4 left-0 right-0 px-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span>{collapsed ? '→' : '←'}</span>
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
