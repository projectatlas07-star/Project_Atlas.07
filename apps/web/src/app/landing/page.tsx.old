'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CommandPalette from '@/components/landing/CommandPalette';

export default function LandingPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const questions = [
    {
      question: 'Where did we lose the most revenue this month?',
      answer: 'Revenue currently waiting: $42,380\n12 supplements awaiting carrier approval.\n3 claims inactive for 21 days.\nRecommended action: Follow up with Carrier X.'
    },
    {
      question: 'Which adjusters approve supplements fastest?',
      answer: 'Michael Turner\nAverage approval: 6.1 days\nConfidence: High'
    },
    {
      question: 'Which claims require attention today?',
      answer: 'NPP-2026-0048\nMissing engineer report.\nRevenue at risk: $5,200'
    },
    {
      question: 'What patterns are emerging?',
      answer: 'Atlas identified that Carrier X requests code documentation before approval in 83% of supplements.\nRecommendation: Attach code documentation before submission.'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTyping && !showAnswer) {
        setIsTyping(true);
        setShowAnswer(true);
        typeAnswer(questions[currentQuestion].answer);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentQuestion, isTyping, showAnswer]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const typeAnswer = (text: string) => {
    let i = 0;
    setTypedAnswer('');
    const timer = setInterval(() => {
      if (i < text.length) {
        setTypedAnswer(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
        setIsTyping(false);
        setTimeout(() => {
          setShowAnswer(false);
          setCurrentQuestion((prev) => (prev + 1) % questions.length);
        }, 4000);
      }
    }, 30);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center" aria-hidden="true">
              <span className="text-xl font-bold">A</span>
            </div>
            <span className="text-xl font-bold">Atlas</span>
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="text-white/70 hover:text-white transition-colors text-sm"
              aria-label="Open Ask Atlas command palette (Press ⌘K)"
            >
              <kbd className="px-2 py-1 bg-white/10 rounded text-xs mr-2" aria-hidden="true">⌘K</kbd>
              Ask Atlas
            </button>
            <Link href="/login" className="text-white/70 hover:text-white transition-colors">
              Sign In
            </Link>
            <button
              onClick={() => router.push('/login')}
              className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-colors"
            >
              Request Pilot Access
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
              Know Everything.<br />Miss Nothing.
            </h1>
            <p className="text-xl text-white/60 max-w-3xl mx-auto mb-8">
              Atlas is the AI Operating System for Insurance Restoration.
              It connects your claims, supplements, documents, interviews, estimates, photos and operational data into one continuously improving intelligence layer.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => router.push('/login')}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
              >
                Request Pilot Access
              </button>
              <button
                onClick={() => router.push('/admin/demo')}
                className="px-8 py-4 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors border border-white/20"
              >
                Explore Interactive Demo
              </button>
            </div>
          </div>

          {/* Interactive Atlas Intelligence Panel */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold">A</span>
                </div>
                <span className="text-lg font-medium">Ask Atlas...</span>
              </div>

              {/* Question */}
              <div className="mb-6">
                <p className="text-white/60 text-lg">{questions[currentQuestion].question}</p>
              </div>

              {/* Answer */}
              {showAnswer && (
                <div className="bg-black/30 rounded-xl p-6 border border-white/10">
                  <p className="text-white whitespace-pre-line font-mono text-sm">
                    {typedAnswer}
                  </p>
                  {isTyping && <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse" />}
                </div>
              )}

              {/* Suggested Prompts */}
              <div className="mt-6 flex flex-wrap gap-2">
                {questions.map((q, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentQuestion(index);
                      setShowAnswer(false);
                      setIsTyping(true);
                      setTimeout(() => {
                        setShowAnswer(true);
                        typeAnswer(q.answer);
                      }, 100);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      currentQuestion === index
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {q.question.slice(0, 30)}...
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="py-20 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">The Business Becomes Queryable</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Disconnected Systems */}
            <div className="space-y-4">
              {['CompanyCam', 'JobNimbus', 'Xactimate', 'Emails', 'Photos', 'Invoices', 'Documents', 'Interviews', 'Claims', 'Supplements', 'QuickBooks'].map((system, index) => (
                <div
                  key={system}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 text-center opacity-60"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {system}
                </div>
              ))}
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-2xl">→</span>
              </div>
            </div>

            {/* Atlas */}
            <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold">A</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">ATLAS</h3>
              <p className="text-white/60">Intelligence Layer</p>
            </div>
          </div>

          {/* Outputs */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-16">
            {['Answers', 'Insights', 'Recommendations', 'Automation', 'Business Memory', 'Learning'].map((output, index) => (
              <div
                key={output}
                className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-lg p-4 text-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {output}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Executive Dashboard */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Executive Dashboard</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Revenue At Risk', value: '$42,380', trend: '+12%' },
              { label: 'Revenue Recovered', value: '$127,500', trend: '+8%' },
              { label: 'Supplements Pending', value: '18', trend: '-3' },
              { label: 'Average Carrier Response', value: '14 days', trend: '-2 days' },
              { label: 'Approval Rate', value: '78%', trend: '+5%' },
              { label: 'Claims Awaiting Action', value: '4', trend: '-2' },
              { label: 'Top Adjuster', value: 'M. Turner', trend: '6.1 days' },
              { label: 'Top Denial Reason', value: 'Documentation', trend: '45%' }
            ].map((metric, index) => (
              <div
                key={metric.label}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <p className="text-white/60 text-sm mb-2">{metric.label}</p>
                <p className="text-2xl font-bold mb-1">{metric.value}</p>
                <p className={`text-sm ${metric.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {metric.trend}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Modules */}
      <section className="py-20 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Product Modules</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'Claims', icon: '📋' },
              { name: 'Supplements', icon: '💰' },
              { name: 'Documents', icon: '📁' },
              { name: 'Interviews', icon: '💬' },
              { name: 'Atlas Intelligence', icon: '🧠' },
              { name: 'Dashboard', icon: '📊' }
            ].map((module, index) => (
              <div
                key={module.name}
                className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 hover:border-cyan-500/30 transition-all cursor-pointer group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{module.icon}</div>
                <p className="font-medium">{module.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guided Demos */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Guided Demos</h2>
          <p className="text-white/60 text-center mb-16">Experience Atlas with realistic restoration scenarios</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'John & Sarah Mitchell', property: 'Residential Roof', carrier: 'State Farm', status: 'In Progress', revenue: '$15,200' },
              { name: 'Lisa Chen', property: 'Commercial Roof', carrier: 'Liberty Mutual', status: 'Supplement Pending', revenue: '$42,500' },
              { name: 'Emily Johnson', property: 'Multi-Family', carrier: 'Allstate', status: 'Approved', revenue: '$28,800' },
              { name: 'Robert Garcia', property: 'Residential Siding', carrier: 'Farmers', status: 'Inspection', revenue: '$12,300' },
              { name: 'Oak Valley Apartments', property: 'Commercial Complex', carrier: 'Travelers', status: 'Negotiation', revenue: '$85,000' },
              { name: 'Westgate Shopping Centre', property: 'Retail Complex', carrier: 'Nationwide', status: 'Documentation', revenue: '$125,000' }
            ].map((demo, index) => (
              <div
                key={demo.name}
                onClick={() => router.push('/admin/demo')}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-cyan-500/30 transition-all cursor-pointer group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="font-bold text-lg mb-3 group-hover:text-cyan-400 transition-colors">{demo.name}</h3>
                <div className="space-y-2 text-sm text-white/60">
                  <p>Property: {demo.property}</p>
                  <p>Carrier: {demo.carrier}</p>
                  <p>Status: {demo.status}</p>
                  <p className="text-white font-medium">Revenue: {demo.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Atlas Learning */}
      <section className="py-20 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Atlas Learning</h2>
          <p className="text-white/60 text-center mb-16">Atlas continuously builds company-specific organizational knowledge from historical operations and uses that knowledge to improve future recommendations and insights.</p>
          
          <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-4">
            {['Inspection', 'Interview', 'Claim', 'Supplement', 'Carrier Response', 'Approval', 'Atlas Learns', 'Future Recommendation Improves'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-xl p-4 text-center min-w-[120px]"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <p className="font-medium text-sm">{step}</p>
                </div>
                {index < 7 && <div className="w-8 h-0.5 bg-white/20 mx-2" />}
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-4">
            {['AI Recommendation', 'Estimator Edited', 'Atlas Records Feedback', 'Future Confidence Improves'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className="bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-xl p-4 text-center min-w-[120px]"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <p className="font-medium text-sm">{step}</p>
                </div>
                {index < 3 && <div className="w-8 h-0.5 bg-white/20 mx-2" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Comparison */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Why Atlas Is Different</h2>
          
          <div className="space-y-6">
            {[
              { traditional: 'Stores information', atlas: 'Understands information' },
              { traditional: 'Shows reports', atlas: 'Answers questions' },
              { traditional: 'Requires searching', atlas: 'Explains' },
              { traditional: 'Records history', atlas: 'Learns from history' }
            ].map((comparison, index) => (
              <div
                key={index}
                className="grid grid-cols-2 gap-6 items-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                  <p className="text-white/60 text-sm mb-2">Traditional Software</p>
                  <p className="font-medium">{comparison.traditional}</p>
                </div>
                <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-xl p-6 text-center">
                  <p className="text-cyan-400 text-sm mb-2">Atlas</p>
                  <p className="font-medium">{comparison.atlas}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Integrations</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'JobNimbus', status: 'Available' },
              { name: 'CompanyCam', status: 'Available' },
              { name: 'Xactimate', status: 'In Progress' },
              { name: 'QuickBooks', status: 'Planned' },
              { name: 'Google Workspace', status: 'Planned' },
              { name: 'Microsoft 365', status: 'Planned' },
              { name: 'Supabase', status: 'Available' },
              { name: 'OpenAI', status: 'Available' }
            ].map((integration, index) => (
              <div
                key={integration.name}
                className="bg-white/5 border border-white/10 rounded-xl p-6 text-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <p className="font-medium mb-2">{integration.name}</p>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  integration.status === 'Available' ? 'bg-green-500/20 text-green-400' :
                  integration.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-white/10 text-white/60'
                }`}>
                  {integration.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Who Should Use Atlas</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              'Roofing Contractors',
              'Restoration Contractors',
              'General Contractors',
              'Insurance Restoration Companies',
              'Operations Managers',
              'Project Managers',
              'Estimators',
              'Owners'
            ].map((audience, index) => (
              <div
                key={audience}
                className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-colors"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <p className="font-medium">{audience}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Your company already has the answers.</h2>
          <p className="text-xl text-white/60 mb-8">Atlas knows where to find them.</p>
          
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => router.push('/login')}
              className="px-8 py-4 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-colors"
            >
              Request Pilot Access
            </button>
            <button
              onClick={() => router.push('/admin/demo')}
              className="px-8 py-4 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors border border-white/20"
            >
              Explore Demo
            </button>
            <Link
              href="/login"
              className="px-8 py-4 text-white rounded-xl font-medium hover:text-white/80 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-white/40 text-sm">
          <p>© 2026 Project Atlas. AI Operating System for Insurance Restoration.</p>
        </div>
      </footer>
    </div>
  );
}
