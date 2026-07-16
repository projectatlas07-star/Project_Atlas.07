'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

interface Recommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  type: 'action' | 'warning' | 'opportunity';
  title: string;
  reason: string;
  expectedImpact: {
    financial?: number;
    time?: string;
    quality?: string;
  };
  suggestedAction: string;
  relatedEntityId?: string;
  relatedEntityType?: 'claim' | 'supplement' | 'interview' | 'document';
  createdAt: string;
  acknowledged: boolean;
}

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await apiFetch('/intelligence/recommendations');
      setRecommendations(response as Recommendation[]);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const acknowledgeRecommendation = async (id: string) => {
    try {
      await apiFetch(`/intelligence/recommendations/${id}/acknowledge`, { method: 'POST' });
      setRecommendations(recommendations.map(r => 
        r.id === id ? { ...r, acknowledged: true } : r
      ));
    } catch (error) {
      console.error('Error acknowledging recommendation:', error);
    }
  };

  const filteredRecommendations = filter === 'all' 
    ? recommendations.filter(r => !r.acknowledged)
    : recommendations.filter(r => r.priority === filter && !r.acknowledged);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-[var(--color-error)] bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'action': return '⚡';
      case 'warning': return '⚠️';
      default: return '💡';
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
        <h2 className="text-2xl font-semibold text-[var(--foreground)]">Recommendations</h2>
        <p className="text-[var(--neutral-gray-500)] mt-1">Proactive AI-powered recommendations</p>
      </div>

      {/* Filter */}
      <div className="flex space-x-2">
        {(['all', 'high', 'medium', 'low'] as const).map((priority) => (
          <button
            key={priority}
            onClick={() => setFilter(priority)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${ filter === priority ? 'bg-[var(--brand-cyan)] text-[var(--brand-navy)]' : 'bg-[var(--background-alt)] text-[var(--foreground)] hover:bg-[var(--neutral-gray-100)]' }`}
          >
            {priority === 'all' ? 'All' : priority.charAt(0).toUpperCase() + priority.slice(1)}
          </button>
        ))}
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {filteredRecommendations.map((recommendation) => (
          <div
            key={recommendation.id}
            className={`bg-[var(--surface)] rounded-xl border-l-4 ${getPriorityColor(recommendation.priority)} p-5`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getTypeIcon(recommendation.type)}</span>
                <div>
                  <h3 className="font-semibold text-[var(--foreground)]">{recommendation.title}</h3>
                  <span className="text-xs text-[var(--neutral-gray-500)] capitalize">
                    {recommendation.priority} priority • {recommendation.type}
                  </span>
                </div>
              </div>
              <span className="text-xs text-[var(--neutral-gray-400)]">
                {new Date(recommendation.createdAt).toLocaleDateString()}
              </span>
            </div>

            <p className="text-[var(--neutral-gray-600)] mb-3">{recommendation.reason}</p>

            {/* Expected Impact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              {recommendation.expectedImpact.financial && (
                <div className="bg-[var(--background-alt)] p-3 rounded-lg">
                  <p className="text-xs text-[var(--neutral-gray-500)]">Financial Impact</p>
                  <p className="font-semibold text-[var(--foreground)]">
                    ${recommendation.expectedImpact.financial.toLocaleString()}
                  </p>
                </div>
              )}
              {recommendation.expectedImpact.time && (
                <div className="bg-[var(--background-alt)] p-3 rounded-lg">
                  <p className="text-xs text-[var(--neutral-gray-500)]">Time Impact</p>
                  <p className="font-semibold text-[var(--foreground)]">{recommendation.expectedImpact.time}</p>
                </div>
              )}
              {recommendation.expectedImpact.quality && (
                <div className="bg-[var(--background-alt)] p-3 rounded-lg">
                  <p className="text-xs text-[var(--neutral-gray-500)]">Quality Impact</p>
                  <p className="font-semibold text-[var(--foreground)]">{recommendation.expectedImpact.quality}</p>
                </div>
              )}
            </div>

            {/* Suggested Action */}
            <div className="bg-[var(--background-alt)] p-3 rounded-lg mb-4">
              <p className="text-xs text-[var(--neutral-gray-500)] mb-1">Suggested Action</p>
              <p className="text-[var(--foreground)]">{recommendation.suggestedAction}</p>
            </div>

            {/* Related Entity */}
            {recommendation.relatedEntityId && (
              <div className="text-xs text-[var(--neutral-gray-500)] mb-4">
                Related: {recommendation.relatedEntityType} • {recommendation.relatedEntityId}
              </div>
            )}

            {/* Acknowledge Button */}
            <button
              onClick={() => acknowledgeRecommendation(recommendation.id)}
              className="px-4 py-2 bg-[var(--brand-cyan)] hover:bg-[var(--brand-cyan-light)] text-[var(--brand-navy)] rounded-lg font-medium transition-colors"
            >
              Acknowledge
            </button>
          </div>
        ))}
      </div>

      {filteredRecommendations.length === 0 && (
        <div className="text-center py-12 text-[var(--neutral-gray-500)]">
          <div className="text-4xl mb-2">💡</div>
          <p>No recommendations at this time</p>
        </div>
      )}
    </div>
  );
}
