'use client';

import { useState, useEffect } from 'react';
import CommandPalette from '@/components/landing/CommandPalette';

const ATLAS_APP_URL = process.env.NEXT_PUBLIC_ATLAS_APP_URL || 'http://localhost:3000';

export default function LandingPage() {
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
            <a
              href={`${ATLAS_APP_URL}/login`}
              className="text-white/70 hover:text-white transition-colors"
            >
              Sign In
            </a>
            <a
              href={`${ATLAS_APP_URL}/login`}
              className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-colors"
            >
              Request Pilot Access
            </a>
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
              <a
              href={`${ATLAS_APP_URL}/login`}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              Request Pilot Access
            </a>
            <a
              href={`${ATLAS_APP_URL}/demo`}
              className="px-8 py-4 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors border border-white/20"
            >
              Explore Interactive Demo
            </a>
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

      {/* Features Section */}
      <section className="py-20 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">The Business Becomes Queryable</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Claims Intelligence</h3>
              <p className="text-white/60">Every claim, supplement, and document becomes part of your organizational knowledge base.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">AI-Powered Insights</h3>
              <p className="text-white/60">Atlas learns from every interaction to provide increasingly accurate recommendations.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Revenue Recovery</h3>
              <p className="text-white/60">Identify missed supplement opportunities and revenue at risk before it's too late.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Restoration Business?</h2>
          <p className="text-xl text-white/60 mb-8">Join the pilot program and experience the future of insurance restoration management.</p>
          <a
            href={`${ATLAS_APP_URL}/login`}
            className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            Request Pilot Access
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-white/40 text-sm">
          <p>© 2026 Project Atlas. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}