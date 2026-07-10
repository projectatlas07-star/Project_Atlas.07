'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

interface LearningStatistics {
  totalInteractions: number;
  acceptanceRate: number;
  rejectionRate: number;
  editRate: number;
  patternsIdentified: number;
}

interface LearningPattern {
  id: string;
  patternType: string;
  pattern: string;
  frequency: number;
  confidence: number;
  lastObserved: string;
  impact: {
    financial?: number;
    approvalRate?: number;
    timeDelay?: number;
  };
}

export default function LearningStats() {
  const [stats, setStats] = useState<LearningStatistics | null>(null);
  const [patterns, setPatterns] = useState<LearningPattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatternType, setSelectedPatternType] = useState<string>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsResponse, patternsResponse] = await Promise.all([
        apiFetch('/intelligence/learning/statistics'),
        apiFetch('/intelligence/learning/patterns/denial_reasons')
      ]);
      setStats(statsResponse as LearningStatistics);
      setPatterns(patternsResponse as LearningPattern[]);
    } catch (error) {
      console.error('Error fetching learning data:', error);
    } finally {
      setLoading(false);
    }
  };

  const patternTypes = [
    { id: 'all', label: 'All Patterns' },
    { id: 'denial_reasons', label: 'Denial Reasons' },
    { id: 'supplement_revisions', label: 'Supplement Revisions' },
    { id: 'documentation_requests', label: 'Documentation Requests' },
    { id: 'carrier_preferences', label: 'Carrier Preferences' }
  ];

  const fetchPatternsByType = async (type: string) => {
    try {
      const endpoint = type === 'all' ? 'denial_reasons' : type;
      const response = await apiFetch(`/intelligence/learning/patterns/${endpoint}`);
      setPatterns(response as LearningPattern[]);
    } catch (error) {
      console.error('Error fetching patterns:', error);
    }
  };

  const handlePatternTypeChange = (type: string) => {
    setSelectedPatternType(type);
    fetchPatternsByType(type);
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
        <h2 className="text-2xl font-semibold text-[var(--foreground)]">Atlas Learning</h2>
        <p className="text-[var(--neutral-gray-500)] mt-1">AI learning repository and pattern analysis</p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-[var(--surface)] rounded-xl border border-[var(--neutral-gray-200)] p-4">
            <p className="text-xs text-[var(--neutral-gray-500)]">Total Interactions</p>
            <p className="text-2xl font-bold text-[var(--foreground)]">{stats.totalInteractions}</p>
          </div>
          <div className="bg-[var(--surface)] rounded-xl border border-[var(--neutral-gray-200)] p-4">
            <p className="text-xs text-[var(--neutral-gray-500)]">Acceptance Rate</p>
            <p className="text-2xl font-bold text-green-600">{Math.round(stats.acceptanceRate * 100)}%</p>
          </div>
          <div className="bg-[var(--surface)] rounded-xl border border-[var(--neutral-gray-200)] p-4">
            <p className="text-xs text-[var(--neutral-gray-500)]">Rejection Rate</p>
            <p className="text-2xl font-bold text-red-600">{Math.round(stats.rejectionRate * 100)}%</p>
          </div>
          <div className="bg-[var(--surface)] rounded-xl border border-[var(--neutral-gray-200)] p-4">
            <p className="text-xs text-[var(--neutral-gray-500)]">Edit Rate</p>
            <p className="text-2xl font-bold text-yellow-600">{Math.round(stats.editRate * 100)}%</p>
          </div>
          <div className="bg-[var(--surface)] rounded-xl border border-[var(--neutral-gray-200)] p-4">
            <p className="text-xs text-[var(--neutral-gray-500)]">Patterns Identified</p>
            <p className="text-2xl font-bold text-[var(--brand-cyan)]">{stats.patternsIdentified}</p>
          </div>
        </div>
      )}

      {/* Pattern Type Filter */}
      <div className="flex space-x-2">
        {patternTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => handlePatternTypeChange(type.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedPatternType === type.id
                ? 'bg-[var(--brand-cyan)] text-[var(--brand-navy)]'
                : 'bg-[var(--background-alt)] text-[var(--foreground)] hover:bg-[var(--neutral-gray-100)]'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Patterns List */}
      <div className="space-y-4">
        {patterns.map((pattern) => (
          <div
            key={pattern.id}
            className="bg-[var(--surface)] rounded-xl border border-[var(--neutral-gray-200)] p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-[var(--foreground)]">{pattern.pattern}</h3>
                <span className="text-xs text-[var(--neutral-gray-500)] capitalize">
                  {pattern.patternType.replace('_', ' ')}
                </span>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-[var(--foreground)]">{pattern.frequency}</p>
                <p className="text-xs text-[var(--neutral-gray-500)]">occurrences</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <div className="bg-[var(--background-alt)] p-3 rounded-lg">
                <p className="text-xs text-[var(--neutral-gray-500)]">Confidence</p>
                <p className="font-semibold text-[var(--foreground)]">{Math.round(pattern.confidence * 100)}%</p>
              </div>
              {pattern.impact.financial && (
                <div className="bg-[var(--background-alt)] p-3 rounded-lg">
                  <p className="text-xs text-[var(--neutral-gray-500)]">Financial Impact</p>
                  <p className="font-semibold text-[var(--foreground)]">${pattern.impact.financial.toLocaleString()}</p>
                </div>
              )}
              {pattern.impact.approvalRate && (
                <div className="bg-[var(--background-alt)] p-3 rounded-lg">
                  <p className="text-xs text-[var(--neutral-gray-500)]">Approval Rate</p>
                  <p className="font-semibold text-[var(--foreground)]">{Math.round(pattern.impact.approvalRate * 100)}%</p>
                </div>
              )}
              {pattern.impact.timeDelay && (
                <div className="bg-[var(--background-alt)] p-3 rounded-lg">
                  <p className="text-xs text-[var(--neutral-gray-500)]">Time Delay</p>
                  <p className="font-semibold text-[var(--foreground)]">{pattern.impact.timeDelay} days</p>
                </div>
              )}
            </div>

            <div className="text-xs text-[var(--neutral-gray-400)]">
              Last observed: {new Date(pattern.lastObserved).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {patterns.length === 0 && (
        <div className="text-center py-12 text-[var(--neutral-gray-500)]">
          <div className="text-4xl mb-2">🧠</div>
          <p>No patterns identified yet</p>
        </div>
      )}

      {/* Learning Info */}
      <div className="bg-[var(--background-alt)] rounded-xl p-4 border border-[var(--neutral-gray-200)]">
        <h3 className="font-semibold text-[var(--foreground)] mb-2">About Atlas Learning</h3>
        <p className="text-sm text-[var(--neutral-gray-600)]">
          Atlas Learning records all AI interactions to identify patterns in denials, revisions, and documentation requests.
          This structured learning repository will become the foundation for future self-improving AI capabilities.
          The system does not automatically retrain - all learning is human-supervised.
        </p>
      </div>
    </div>
  );
}
