'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { apiFetch } from '@/lib/api';

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

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

interface DemoStatus {
  enabled: boolean;
  hasData: boolean;
}

export default function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [demoStatus, setDemoStatus] = useState<DemoStatus | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);

  useEffect(() => {
    const fetchDemoStatus = async () => {
      try {
        const response = await apiFetch('/demo/status');
        setDemoStatus(response as DemoStatus);
      } catch (error) {
        // Demo endpoint might not be available, ignore error
      }
    };
    fetchDemoStatus();
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full bg-[var(--brand-navy)] border-r border-white/10 transition-all duration-300 z-50 ${
          collapsed ? 'w-16' : 'w-64'
        } ${isMobile && !mobileOpen ? '-translate-x-full' : ''}`}
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
            onClick={() => {
              setCollapsed(!collapsed);
              if (isMobile && onMobileClose) onMobileClose();
            }}
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
                onClick={() => isMobile && onMobileClose && onMobileClose()}
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

        {/* Demo Badge */}
        {demoStatus?.enabled && !collapsed && (
          <div className="mx-2 p-3 bg-gradient-to-r from-[var(--brand-cyan)] to-[var(--brand-purple)] rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">🎯</span>
              <span className="text-white font-semibold text-sm">Demo Mode Active</span>
            </div>
            <div className="space-y-1 text-xs text-white/80">
              <div className="flex justify-between">
                <span>Seed:</span>
                <span className="font-mono">42</span>
              </div>
              <div className="flex justify-between">
                <span>Data:</span>
                <span>{demoStatus.hasData ? 'Generated' : 'None'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Collapse Toggle at Bottom */}
        <div className="absolute bottom-4 left-0 right-0 px-2">
          <button
            onClick={() => {
              setCollapsed(!collapsed);
              if (isMobile && onMobileClose) onMobileClose();
            }}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <span>{collapsed ? '→' : '←'}</span>
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
