'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

interface BusinessInsight {
  id: string;
  title: string;
  value: number | string;
  trend: 'up' | 'down' | 'stable';
  trendValue?: number;
  description: string;
  category: 'revenue' | 'claims' | 'supplements' | 'operations' | 'ai';
  priority: 'high' | 'medium' | 'low';
  lastUpdated: string;
}

export default function BusinessInsights() {
  const [insights, setInsights] = useState<BusinessInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const response = await apiFetch('/intelligence/insights');
      setInsights(response as BusinessInsight[]);
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInsights = selectedCategory === 'all' 
    ? insights 
    : insights.filter(i => i.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'revenue', label: 'Revenue' },
    { id: 'claims', label: 'Claims' },
    { id: 'supplements', label: 'Supplements' },
    { id: 'operations', label: 'Operations' },
    { id: 'ai', label: 'AI' }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-[var(--color-success)]';
      case 'down': return 'text-[var(--color-error)]';
      default: return 'text-[var(--neutral-gray-600)]';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-[var(--color-error)]/10 text-[var(--color-error)]';
      case 'medium': return 'bg-[var(--color-warning)]/10 text-[var(--color-warning)]';
      default: return 'bg-[var(--neutral-gray-100)] text-[var(--neutral-gray-800)]';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-[var(--brand-cyan)] rounded-full animate-bounce animate-delay-0" />
          <div className="w-3 h-3 bg-[var(--brand-purple)] rounded-full animate-bounce animate-delay-150" />
          <div className="w-3 h-3 bg-[var(--brand-cyan)] rounded-full animate-bounce animate-delay-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-[var(--foreground)]">Business Insights</h2>
        <p className="text-[var(--neutral-gray-500)] mt-1">Real-time business intelligence and metrics</p>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${ selectedCategory === category.id ? 'bg-[var(--brand-cyan)] text-[var(--brand-navy)]' : 'bg-[var(--background-alt)] text-[var(--foreground)] hover:bg-[var(--neutral-gray-100)]' }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInsights.map((insight) => (
          <div
            key={insight.id}
            className="bg-[var(--surface)] rounded-xl border border-[var(--neutral-gray-200)] p-5 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-[var(--foreground)]">{insight.title}</h3>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(insight.priority)}`}>
                {insight.priority}
              </span>
            </div>
            
            <div className="flex items-baseline space-x-2 mb-2">
              <span className="text-2xl font-bold text-[var(--foreground)]">{insight.value}</span>
              {insight.trendValue && (
                <span className={`text-sm ${getTrendColor(insight.trend)}`}>
                  {getTrendIcon(insight.trend)} {insight.trendValue}%
                </span>
              )}
            </div>

            <p className="text-sm text-[var(--neutral-gray-500)] mb-3">{insight.description}</p>

            <div className="flex items-center justify-between text-xs text-[var(--neutral-gray-400)]">
              <span className="capitalize">{insight.category}</span>
              <span>{new Date(insight.lastUpdated).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredInsights.length === 0 && (
        <div className="text-center py-12 text-[var(--neutral-gray-500)]">
          <div className="text-4xl mb-2">📊</div>
          <p>No insights available for this category</p>
        </div>
      )}
    </div>
  );
}
