import Link from "next/link";

const ATLAS_APP_URL = process.env.NEXT_PUBLIC_ATLAS_APP_URL || 'http://localhost:3000';

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a1628' }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/10" style={{ backgroundColor: 'rgba(10, 22, 40, 0.9)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-[#00d4ff] to-[#0077ff] bg-clip-text text-transparent">PROJECT ATLAS</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#product" className="text-white/80 hover:text-white transition-colors">
                Product
              </Link>
              <Link href="#intelligence" className="text-white/80 hover:text-white transition-colors">
                Intelligence
              </Link>
              <Link href="#supplements" className="text-white/80 hover:text-white transition-colors">
                Supplements
              </Link>
              <Link href="#how-it-works" className="text-white/80 hover:text-white transition-colors">
                How It Works
              </Link>
            </div>
            <Link
              href={`${ATLAS_APP_URL}/login`}
              className="text-white px-6 py-2 rounded-lg font-medium transition-colors hover:bg-[#0077ff]"
              style={{ backgroundColor: '#00d4ff' }}
            >
              LOGIN TO ATLAS
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Your Restoration Company<br />
            <span className="bg-gradient-to-r from-[#00d4ff] to-[#0077ff] bg-clip-text text-transparent">Should Remember Everything.</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-10">
            Atlas turns claims, documents, supplements, adjuster interactions, and operational knowledge 
            into company intelligence. Every decision becomes data. Every outcome becomes context.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`${ATLAS_APP_URL}/login`}
              className="text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors hover:bg-[#0077ff]"
              style={{ backgroundColor: '#00d4ff' }}
            >
              ENTER ATLAS
            </Link>
            <Link
              href="#how-it-works"
              className="border border-white/30 hover:border-white/50 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              EXPLORE THE SYSTEM
            </Link>
          </div>
        </div>
      </section>

      {/* Closed Loop Intelligence Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'rgba(15, 39, 68, 0.5)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Closed-Loop Intelligence</h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Every operational event becomes context for future decisions
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { step: 'CLAIM', desc: 'Initial loss notice and claim details' },
              { step: 'DOCUMENTS', desc: 'Photos, estimates, and correspondence' },
              { step: 'ADJUSTER INTERACTIONS', desc: 'Communication history and notes' },
              { step: 'SUPPLEMENTS', desc: 'Additional revenue recovery requests' },
              { step: 'OUTCOMES', desc: 'Approvals, denials, and settlements' },
              { step: 'ATLAS INTELLIGENCE', desc: 'Actionable insights and patterns' },
            ].map((item, index) => (
              <div key={item.step} className="relative">
                <div className="rounded-lg p-6 h-full border border-white/10" style={{ backgroundColor: '#0a1628' }}>
                  <div className="font-bold text-sm mb-2" style={{ color: '#00d4ff' }}>STEP {index + 1}</div>
                  <div className="text-white font-semibold mb-2">{item.step}</div>
                  <div className="text-white/60 text-sm">{item.desc}</div>
                </div>
                {index < 5 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2" style={{ color: '#00d4ff' }}>
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supplement Intelligence Section */}
      <section id="supplements" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Supplement Intelligence</h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Understand the factors that drive supplement outcomes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Claims Analysis', desc: 'Historical claim patterns and outcomes' },
              { title: 'Estimate Review', desc: 'Line-item accuracy and completeness' },
              { title: 'Document Assessment', desc: 'Photo quality and documentation strength' },
              { title: 'Adjuster History', desc: 'Individual adjuster decision patterns' },
              { title: 'Supplement Tracking', desc: 'Revenue recovery success rates' },
              { title: 'Outcome Correlation', desc: 'Identify winning patterns' },
              { title: 'Risk Assessment', desc: 'Flag high-risk supplements early' },
              { title: 'Process Optimization', desc: 'Improve documentation workflows' },
            ].map((item) => (
              <div key={item.title} className="rounded-lg p-6 border border-white/10" style={{ backgroundColor: 'rgba(15, 39, 68, 0.3)' }}>
                <div className="font-semibold mb-2" style={{ color: '#00d4ff' }}>{item.title}</div>
                <div className="text-white/70">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Atlas Intelligence Section */}
      <section id="intelligence" className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'rgba(15, 39, 68, 0.5)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Atlas Intelligence</h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              The queryable intelligence layer of your restoration company
            </p>
          </div>

          <div className="rounded-lg p-8 border border-white/10" style={{ backgroundColor: '#0a1628' }}>
            <div className="space-y-4">
              {[
                "Which adjusters deny supplements most often?",
                "Where are we losing recoverable revenue?",
                "What documentation patterns lead to successful supplements?",
                "Which claims require immediate attention?",
                "How does documentation timing affect supplement outcomes?",
                "What are our most profitable claim types?",
              ].map((question, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg" style={{ backgroundColor: 'rgba(15, 39, 68, 0.3)' }}>
                  <div className="font-bold" style={{ color: '#00d4ff' }}>Q{index + 1}</div>
                  <div className="text-white/90">{question}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Operating System Section */}
      <section id="product" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Complete Operating System</h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Interconnected modules designed for restoration operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Intelligence', desc: 'Queryable insights and analytics' },
              { name: 'Claims', desc: 'Complete claim lifecycle management' },
              { name: 'Interviews', desc: 'Structured claim intake workflows' },
              { name: 'Supplements', desc: 'Revenue recovery tracking' },
              { name: 'Documents', desc: 'Centralized document management' },
              { name: 'Adjusters', desc: 'Adjuster relationship tracking' },
              { name: 'Companies', desc: 'Multi-tenant company management' },
              { name: 'Properties', desc: 'Property and loss location data' },
              { name: 'Contacts', desc: 'Stakeholder relationship management' },
              { name: 'Notes', desc: 'Collaborative documentation' },
              { name: 'Activity', desc: 'Complete audit trail' },
              { name: 'Tasks', desc: 'Task and workflow management' },
            ].map((module) => (
              <div key={module.name} className="rounded-lg p-6 border border-white/10 hover:border-[#00d4ff]/30 transition-colors bg-gradient-to-br" style={{ backgroundColor: 'rgba(15, 39, 68, 0.3)', backgroundImage: 'linear-gradient(to bottom right, rgba(15, 39, 68, 0.3), rgba(10, 22, 40, 1))' }}>
                <div className="font-bold text-lg mb-2" style={{ color: '#00d4ff' }}>{module.name}</div>
                <div className="text-white/70">{module.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(15, 39, 68, 0.5), #0a1628)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Turn Your Company Into<br />
            <span className="bg-gradient-to-r from-[#00d4ff] to-[#0077ff] bg-clip-text text-transparent">A Closed Loop.</span>
          </h2>
          <p className="text-xl text-white/70 mb-10">
            Stop losing operational knowledge to email threads and spreadsheets. 
            Transform your restoration company with Atlas intelligence.
          </p>
          <Link
            href={`${ATLAS_APP_URL}/login`}
            className="text-white px-10 py-4 rounded-lg font-semibold text-lg transition-colors inline-block hover:bg-[#0077ff]"
            style={{ backgroundColor: '#00d4ff' }}
          >
            LOGIN TO ATLAS
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-white/50">
          <p>&copy; 2026 Project Atlas. AI Operating System for Insurance Restoration.</p>
        </div>
      </footer>
    </div>
  );
}