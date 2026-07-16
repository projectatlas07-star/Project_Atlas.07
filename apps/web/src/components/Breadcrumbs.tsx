'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ChevronRight } from 'lucide-react';

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  const pathSegments = pathname.split('/').filter(segment => segment !== '');
  
  if (pathSegments.length === 0) {
    return null;
  }

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
    
    return { href, label };
  });

  return (
    <nav className="flex items-center gap-2 text-sm mb-4" aria-label="Breadcrumb">
      <Link
        href="/admin"
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
        Dashboard
      </Link>
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.href} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          {index === breadcrumbs.length - 1 ? (
            <span className="text-foreground font-medium">{breadcrumb.label}</span>
          ) : (
            <Link
              href={breadcrumb.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {breadcrumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}