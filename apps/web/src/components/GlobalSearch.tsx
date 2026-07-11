'use client';

import { useState, useRef, useEffect } from 'react';

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
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="text-sm text-gray-600">Search...</span>
        <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 border border-gray-300 rounded">⌘K</kbd>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-3">
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search claims, documents, interviews..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>

          <div className="border-t border-gray-200">
            {results.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                {query.length < 2 ? 'Type at least 2 characters to search' : 'No results found'}
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto">
                {results.map((result, index) => (
                  <a
                    key={index}
                    href={result.href}
                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <div>
                      <div className="text-sm font-medium text-gray-900">{result.title}</div>
                      <div className="text-xs text-gray-500">{result.type}</div>
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 p-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span><kbd className="px-1 py-0.5 bg-gray-100 rounded">↑↓</kbd> Navigate</span>
              <span><kbd className="px-1 py-0.5 bg-gray-100 rounded">↵</kbd> Select</span>
              <span><kbd className="px-1 py-0.5 bg-gray-100 rounded">ESC</kbd> Close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}