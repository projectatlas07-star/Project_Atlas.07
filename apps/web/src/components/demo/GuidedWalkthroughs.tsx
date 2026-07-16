'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface Walkthrough {
  id: string;
  title: string;
  description: string;
  workflow: 'A' | 'B';
  claimId: string;
  customerId: string;
  propertyId: string;
  steps: string[];
}

export default function GuidedWalkthroughs() {
  const router = useRouter();
  const [walkthroughs, setWalkthroughs] = useState<Walkthrough[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWalkthroughs();
  }, []);

  const fetchWalkthroughs = async () => {
    try {
      const response = await apiFetch('/demo/walkthroughs');
      setWalkthroughs((response as { walkthroughs: Walkthrough[] }).walkthroughs);
    } catch (error) {
      console.error('Error fetching walkthroughs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWalkthroughClick = (walkthrough: Walkthrough) => {
    // Navigate to the claim detail page to start the walkthrough
    router.push(`/admin/claims/${walkthrough.claimId}`);
  };

  const walkthroughData = [
    {
      id: 'walkthrough-1',
      title: 'Lead to Closed Claim',
      description: 'Follow the complete journey from initial lead through claim closure',
      icon: '🎯',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'walkthrough-2',
      title: 'Inspection to Supplement',
      description: 'Experience the contractor-first workflow from inspection to supplement',
      icon: '🔍',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'walkthrough-3',
      title: 'Denied Supplement Recovery',
      description: 'Learn how to recover from denied supplements with AI assistance',
      icon: '⚠️',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'walkthrough-4',
      title: 'Commercial Restoration',
      description: 'Navigate complex commercial claims with multiple stakeholders',
      icon: '🏢',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'walkthrough-5',
      title: 'Interview Driven Claim Creation',
      description: 'Create claims through the FNOL interview process',
      icon: '💬',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      id: 'walkthrough-6',
      title: 'AI Supplement Generation',
      description: 'Watch AI generate and optimize supplement requests',
      icon: '🤖',
      color: 'from-cyan-500 to-teal-500'
    }
  ];

  if (loading) {
    return (
      <div className="bg-[var(--surface)] rounded-xl shadow-lg border border-[var(--neutral-gray-200)] p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-[var(--neutral-gray-200)] rounded w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-[var(--neutral-gray-200)] rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--surface)] rounded-xl shadow-lg border border-[var(--neutral-gray-200)] p-6">
      <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6">Guided Walkthroughs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {walkthroughData.map((walkthrough) => {
          const matchedWalkthrough = walkthroughs.find(w => w.id.includes(walkthrough.id.split('-')[1]));
          return (
            <button
              key={walkthrough.id}
              onClick={() => matchedWalkthrough && handleWalkthroughClick(matchedWalkthrough)}
              className="text-left bg-gradient-to-br bg-[var(--background-alt)] hover:bg-[var(--neutral-gray-100)] rounded-xl border border-[var(--neutral-gray-200)] hover:border-[var(--brand-cyan)] transition-all duration-300 hover:shadow-lg group p-5"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${walkthrough.color} flex items-center justify-center text-[var(--foreground)] text-2xl shadow-md`}>
                  {walkthrough.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[var(--foreground)] group-hover:text-[var(--brand-cyan)] transition-colors">
                    {walkthrough.title}
                  </h3>
                  <p className="text-sm text-[var(--neutral-gray-500)] mt-1">
                    {walkthrough.description}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center text-[var(--brand-cyan)] opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm font-medium">Start Walkthrough →</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
