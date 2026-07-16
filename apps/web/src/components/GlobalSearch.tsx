'use client';

import { useState, useRef, useEffect } from 'react';
import { Button, Input } from '@project-atlas/ui';
import { Search, Command, ChevronRight, ArrowUp, ArrowDown, CornerDownLeft } from 'lucide-react';

interface SearchResult {
  type: string;
  title: string;
  href: string;
}

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    // Mock search results - in production, this would call an API
    const mockResults: SearchResult[] = [
      { type: 'Claim', title: `Claim matching "${searchQuery}"`, href: '/admin/claims' },
      { type: 'Document', title: `Document matching "${searchQuery}"`, href: '/admin/documents' },
      { type: 'Interview', title: `Interview matching "${searchQuery}"`, href: '/admin/interviews' },
    ];

    setResults(mockResults);
  };

  return (
    <div className="relative" ref={searchRef}>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="h-9 gap-2 text-muted-foreground"
      >
        <Search className="h-4 w-4" />
        <span className="text-sm">Search...</span>
        <kbd className="ml-auto px-1.5 py-0.5 text-xs bg-muted border border-[var(--border)] rounded">
          <Command className="h-3 w-3 inline" />K
        </kbd>
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 panel-atlas rounded-lg shadow-xl z-50">
          <div className="p-3">
            <Input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search claims, documents, interviews..."
              autoFocus
              className="w-full"
            />
          </div>

          <div className="border-t border-[var(--border)]">
            {results.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                {query.length < 2 ? 'Type at least 2 characters to search' : 'No results found'}
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto">
                {results.map((result, index) => (
                  <a
                    key={index}
                    href={result.href}
                    className="flex items-center justify-between px-4 py-3 hover:bg-accent transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <div>
                      <div className="text-sm font-medium text-foreground">{result.title}</div>
                      <div className="text-xs text-muted-foreground">{result.type}</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-[var(--border)] p-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-muted rounded"><ArrowUp className="h-3 w-3 inline" /></kbd><kbd className="px-1 py-0.5 bg-muted rounded"><ArrowDown className="h-3 w-3 inline" /></kbd> Navigate</span>
              <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-muted rounded"><CornerDownLeft className="h-3 w-3 inline" /></kbd> Select</span>
              <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-muted rounded">ESC</kbd> Close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}