'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CommandPalette from '@/components/CommandPalette';

const ATLAS_APP_URL = process.env.NEXT_PUBLIC_ATLAS_APP_URL || 'http://localhost:3000';

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

export default function LandingPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

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

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
      
      {/* Cinematic Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold">A</span>
            </div>
            <span className="text-xl font-bold">Atlas</span>
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="text-white/70 hover:text-white transition-colors text-sm"
            >
              <kbd className="px-2 py-1 bg-white/10 rounded text-xs mr-2">⌘K</kbd>
              Ask Atlas
            </button>
            <Link href={`${ATLAS_APP_URL}/login`} className="text-white/70 hover:text-white transition-colors">
              Sign In
            </Link>
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
      <section className="min-h-screen flex items-center justify-center px-6 pt-20 relative">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
              KNOW EVERYTHING.
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-200 via-purple-200 to-white bg-clip-text text-transparent">
              MISS NOTHING.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto mb-12 leading-relaxed">
            Atlas turns the operational memory of an insurance restoration company into intelligence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`${ATLAS_APP_URL}/login`}
              className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-medium text-lg hover:opacity-90 transition-opacity text-center"
            >
              REQUEST PILOT ACCESS
            </a>
            <a
              href="#ask-atlas"
              className="px-10 py-4 bg-white/10 text-white rounded-xl font-medium text-lg hover:bg-white/20 transition-colors border border-white/20 text-center"
            >
              EXPLORE ATLAS
            </a>
          </div>

          {/* Floating Ask Atlas Interface */}
          <div className="mt-20 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative">
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />
              
              <div className="relative">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center">
                    <span className="text-lg font-bold">A</span>
                  </div>
                  <span className="text-xl font-medium">Ask Atlas...</span>
                </div>

                <div className="mb-6">
                  <p className="text-white/60 text-xl">{questions[currentQuestion].question}</p>
                </div>

                {showAnswer && (
                  <div className="bg-black/40 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
                    <p className="text-white whitespace-pre-line font-mono text-lg leading-relaxed">
                      {typedAnswer}
                    </p>
                    {isTyping && <span className="inline-block w-2 h-6 bg-cyan-400 ml-1 animate-pulse" />}
                  </div>
                )}

                <div className="mt-6 flex flex-wrap gap-2 justify-center">
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
                      className={`px-4 py-2 rounded-lg text-sm transition-all ${
                        currentQuestion === index
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 scale-105'
                          : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {q.question.slice(0, 25)}...
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ask Atlas Product Moment */}
      <section id="ask-atlas" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-200 to-purple-200 bg-clip-text text-transparent">
              ASK YOUR COMPANY<br />ANYTHING.
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              Natural language queries across your entire operation. No training required.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/10 to-purple-500/10" />
              
              <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center">
                    <span className="text-2xl font-bold">A</span>
                  </div>
                  <div className="flex-1">
                    <div className="h-3 bg-white/20 rounded w-64 mb-2" />
                    <div className="h-2 bg-white/10 rounded w-48" />
                  </div>
                </div>

                <div className="bg-black/40 rounded-2xl p-8 border border-white/10 backdrop-blur-sm">
                  <p className="text-white/40 text-lg mb-4">Where is revenue getting stuck?</p>
                  <p className="text-white text-xl leading-relaxed">
                    Revenue currently waiting: <span className="text-cyan-400 font-semibold">$42,380</span>
                    <br /><br />
                    12 supplements awaiting carrier approval.
                    <br />
                    3 claims inactive for 21 days.
                    <br /><br />
                    <span className="text-purple-400">Recommended action:</span> Follow up with Carrier X.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Becomes Queryable */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-bold mb-6">
              THE BUSINESS BECOMES<br />
              <span className="bg-gradient-to-r from-cyan-200 to-purple-200 bg-clip-text text-transparent">QUERYABLE.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-center mb-16">
            {/* Data Sources */}
            <div className="space-y-4">
              {['Claims', 'Documents', 'Interviews', 'Supplements', 'Adjuster Interactions', 'Photos', 'Estimates'].map((source, index) => (
                <div
                  key={source}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 text-center transform hover:scale-105 transition-all"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {source}
                </div>
              ))}
            </div>

            {/* Flow Arrow */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-3xl">→</span>
              </div>
            </div>

            {/* Atlas Intelligence */}
            <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-2xl p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl font-bold">A</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">ATLAS INTELLIGENCE</h3>
              <p className="text-white/60">Every operational event becomes context</p>
            </div>
          </div>

          {/* Outputs */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {['Answers', 'Signals', 'Recommendations', 'Automation', 'Business Memory'].map((output, index) => (
              <div
                key={output}
                className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-xl p-6 text-center transform hover:scale-105 transition-all"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {output}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supplement Intelligence */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-bold mb-6">
              FIND THE REVENUE<br />
              <span className="bg-gradient-to-r from-cyan-200 to-purple-200 bg-clip-text text-transparent">HIDING IN THE CLAIM.</span>
            </h2>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span className="text-white/60">Missing documentation</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <span className="text-white/60">Supplement opportunity</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full" />
                      <span className="text-white/60">Adjuster pattern detected</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-cyan-500 rounded-full" />
                      <span className="text-white/60">Estimate discrepancy</span>
                    </div>
                  </div>
                  
                  <div className="bg-black/40 rounded-2xl p-6 border border-white/10">
                    <p className="text-white/40 text-sm mb-2">RECOMMENDED ACTION</p>
                    <p className="text-white text-lg">
                      Attach code documentation before submission. This adjuster approves 73% faster with complete documentation.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl p-6 border border-cyan-500/20">
                  <p className="text-white/60 text-sm mb-1">POTENTIAL REVENUE RECOVERY</p>
                  <p className="text-4xl font-bold text-cyan-400">$3,200</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Intelligence */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-bold mb-6">
              SEE THE BUSINESS<br />
              <span className="bg-gradient-to-r from-cyan-200 to-purple-200 bg-clip-text text-transparent">BEFORE IT BECOMES A PROBLEM.</span>
            </h2>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { label: 'Revenue At Risk', value: '$42,380', change: '+12%', positive: false },
                { label: 'Revenue Recovered', value: '$127,500', change: '+8%', positive: true },
                { label: 'Supplements Pending', value: '18', change: '-3', positive: true }
              ].map((metric, index) => (
                <div
                  key={metric.label}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center transform hover:scale-105 transition-all"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <p className="text-white/60 text-sm mb-4">{metric.label}</p>
                  <p className="text-5xl font-bold mb-4">{metric.value}</p>
                  <p className={`text-xl ${metric.positive ? 'text-green-400' : 'text-red-400'}`}>
                    {metric.change}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Atlas Learns */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-bold mb-6">
              THE SYSTEM GETS SMARTER<br />
              <span className="bg-gradient-to-r from-cyan-200 to-purple-200 bg-clip-text text-transparent">AS THE COMPANY OPERATES.</span>
            </h2>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
              {['Inspection', 'Interview', 'Claim', 'Supplement', 'Carrier Response', 'Adjuster', 'Atlas Learns', 'Future Recommendation Improves'].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-xl p-6 text-center min-w-[140px] transform hover:scale-105 transition-all"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <p className="font-medium text-sm">{step}</p>
                  </div>
                  {index < 7 && <div className="w-12 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 mx-2" />}
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <p className="text-xl text-white/60 max-w-3xl mx-auto">
                Atlas builds institutional memory from every interaction, making each recommendation more accurate than the last.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Guided Experience */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-bold mb-6">
              EXPERIENCE<br />
              <span className="bg-gradient-to-r from-cyan-200 to-purple-200 bg-clip-text text-transparent">ATLAS IN ACTION.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Claim Intelligence',
                description: 'See every claim with complete context, documents, and intelligence.',
                metric: '94% accuracy'
              },
              {
                title: 'Supplement Opportunity',
                description: 'Identify missed revenue opportunities before they become lost revenue.',
                metric: '$3.2K avg recovery'
              },
              {
                title: 'Adjuster Intelligence',
                description: 'Understand adjuster patterns and optimize your approach.',
                metric: '6.1 day avg approval'
              }
            ].map((experience, index) => (
              <div
                key={experience.title}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 transform hover:scale-105 transition-all group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl p-6 mb-6">
                  <p className="text-3xl font-bold text-cyan-400">{experience.metric}</p>
                </div>
                <h3 className="text-2xl font-bold mb-4">{experience.title}</h3>
                <p className="text-white/60 leading-relaxed">{experience.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-32 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ATLAS SITS ABOVE<br />
            <span className="bg-gradient-to-r from-cyan-200 to-purple-200 bg-clip-text text-transparent">YOUR EXISTING STACK.</span>
          </h2>
          <p className="text-xl text-white/60 mb-12">
            Connect operational systems rather than replacing them. Atlas learns from your existing tools.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {['JobNimbus', 'CompanyCam', 'Xactimate', 'QuickBooks'].map((integration, index) => (
              <div
                key={integration}
                className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white/60 hover:text-white hover:border-white/30 transition-all"
              >
                {integration}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-purple-500/10" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            YOUR COMPANY ALREADY HAS<br />
            <span className="bg-gradient-to-r from-cyan-200 to-purple-200 bg-clip-text text-transparent">THE ANSWERS.</span>
          </h2>
          <p className="text-2xl text-white/60 mb-12">
            Atlas knows where to find them.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`${ATLAS_APP_URL}/login`}
              className="px-12 py-5 bg-white text-black rounded-xl font-medium text-xl hover:bg-white/90 transition-colors text-center"
            >
              REQUEST PILOT ACCESS
            </a>
            <Link
              href={`${ATLAS_APP_URL}/login`}
              className="px-12 py-5 text-white rounded-xl font-medium text-xl hover:text-white/80 transition-colors text-center"
            >
              SIGN IN
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