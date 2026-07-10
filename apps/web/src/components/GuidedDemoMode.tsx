'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';

interface DemoPersona {
  id: string;
  customerName: string;
  claimNumber: string;
  insuranceCompany: string;
  damageType: string;
  status: string;
  workflow: 'A' | 'B';
  story: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  supplements: Array<{
    supplementNumber: string;
    status: string;
    requestedAmount: number;
    approvedAmount: number;
  }>;
}

interface DemoScenarios {
  personas: DemoPersona[];
}

export default function GuidedDemoMode() {
  const [scenarios, setScenarios] = useState<DemoScenarios | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  const fetchScenarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFetch('/demo/personas') as DemoScenarios;
      setScenarios(response);
    } catch (err) {
      setError('Failed to fetch demo scenarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useState(() => {
    fetchScenarios();
  });

  const scenariosList = [
    {
      id: 'lisa-chen',
      title: 'Lisa Chen - Contractor First Workflow',
      description: 'Demonstrates contractor-first workflow from inspection to claim creation. NPP discovered storm damage, claim was created, and AI identified missing line items.',
      icon: '🔍',
      workflow: 'B',
      claimNumber: 'CLM-20240004'
    },
    {
      id: 'john-sarah',
      title: 'John & Sarah Mitchell - Approved Supplement',
      description: 'Demonstrates an approved supplement with AI recommendations. Hidden decking was discovered and AI suggested additional line items.',
      icon: '✅',
      workflow: 'A',
      claimNumber: 'CLM-20240001'
    },
    {
      id: 'emily-johnson',
      title: 'Emily Johnson - Multiple Revisions',
      description: 'Demonstrates multiple supplement revisions and engineering reports. Hidden mold required two supplement revisions.',
      icon: '🔄',
      workflow: 'A',
      claimNumber: 'CLM-20240002'
    },
    {
      id: 'robert-garcia',
      title: 'Robert Garcia - Denied Supplement',
      description: 'Demonstrates denied supplements and appeal workflow. Structural damage was deemed pre-existing by carrier.',
      icon: '⚠️',
      workflow: 'A',
      claimNumber: 'CLM-20240003'
    },
    {
      id: 'westgate',
      title: 'Westgate Shopping Centre - Commercial',
      description: 'Demonstrates commercial claims, executive dashboard metrics, multiple supplements, and outstanding revenue. 48,000 sq ft roof.',
      icon: '🏢',
      workflow: 'A',
      claimNumber: 'CLM-20240005'
    },
    {
      id: 'oak-valley',
      title: 'Oak Valley Apartments - Complex',
      description: 'Demonstrates emergency mitigation, multiple buildings, several adjusters, many documents, and long-running claim with large activity history.',
      icon: '🏘️',
      workflow: 'B',
      claimNumber: 'CLM-20240006'
    }
  ];

  const handleScenarioClick = (scenario: typeof scenariosList[0]) => {
    setSelectedScenario(scenario.id);
    // Navigate to the claim detail page
    window.location.href = `/admin/claims/${scenario.claimNumber}`;
  };

  return (
    <div className="bg-[var(--surface)] rounded-xl shadow-lg border border-[var(--neutral-gray-200)] p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Guided Demo Mode</h2>
        <p className="text-sm text-[var(--neutral-gray-500)] mt-1">
          Follow recommended demo scenarios to explore Project Atlas capabilities
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {scenariosList.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => handleScenarioClick(scenario)}
            className="w-full text-left p-4 bg-[var(--background-alt)] hover:bg-[var(--neutral-gray-100)] rounded-lg border border-[var(--neutral-gray-200)] hover:border-[var(--brand-cyan)] transition-all duration-200 group"
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">{scenario.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-[var(--foreground)] group-hover:text-[var(--brand-cyan)] transition-colors">
                    {scenario.title}
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    scenario.workflow === 'A' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    Workflow {scenario.workflow}
                  </span>
                </div>
                <p className="text-sm text-[var(--neutral-gray-500)] mb-2">
                  {scenario.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-[var(--neutral-gray-400)]">
                  <span>Claim: {scenario.claimNumber}</span>
                  <span>→</span>
                  <span className="text-[var(--brand-cyan)]">View Claim</span>
                </div>
              </div>
              <div className="text-[var(--brand-cyan)] opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Workflow Legend */}
      <div className="mt-6 p-4 bg-[var(--background-alt)] rounded-lg">
        <h4 className="text-sm font-medium text-[var(--foreground)] mb-2">Workflow Types</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-100 rounded-full"></span>
            <span className="text-[var(--neutral-gray-600)]">
              <strong>Workflow A:</strong> Insurance claim already exists
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-purple-100 rounded-full"></span>
            <span className="text-[var(--neutral-gray-600)]">
              <strong>Workflow B:</strong> Contractor finds damage first
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
