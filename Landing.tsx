import { ArrowRight, Building2, TrendingUp, Sparkles } from 'lucide-react';
import { Logo } from './ui/Logo';

interface LandingProps {
  onSelectRole: (role: 'company' | 'advisor') => void;
  onLogin: () => void;
  onLearnMore: () => void;
  onLearnMoreAdvisor: () => void;
  onJoinUs?: () => void;
}

export function Landing({ onSelectRole, onLogin, onLearnMore, onLearnMoreAdvisor, onJoinUs }: LandingProps) {
  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center">
            <Logo className="h-10 w-auto" />
          </div>
          <button
            onClick={onLogin}
            className="px-6 py-2.5 bg-[#163BB5] text-white rounded-lg hover:bg-[#0D2A7A] transition-colors"
          >
            Log In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 mb-8">
            <Sparkles className="w-4 h-4 text-[#163BB5]" />
            <span className="text-gray-700 text-sm">Built with a proven playbook designed to enhance engagement</span>
          </div>

          {/* Headline */}
          <h1 className="text-6xl leading-normal mb-8 pb-2">
            <span className="text-gray-900">Better advice demands </span>
            <span className="bg-gradient-to-r from-[#163BB5] to-[#2D5FE8] bg-clip-text text-transparent">visibility</span>
            <span className="text-gray-900">,</span>
            <br />
            <span className="bg-gradient-to-r from-[#4A90E2] to-[#5CA4F5] bg-clip-text text-transparent">structure</span>
            <span className="text-gray-900">, and </span>
            <span className="bg-gradient-to-r from-[#0D47A1] to-[#1976D2] bg-clip-text text-transparent">responsibility</span>
            <span className="text-gray-900">.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A community built around transparent advisory systems that align companies and advisors when decisions create real impact.
          </p>
        </div>
      </section>

      {/* Cards Section */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* For Companies Card */}
          <div className="bg-white rounded-3xl p-12 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-[#EEF0F8] rounded-2xl flex items-center justify-center mb-8">
              <Building2 className="w-7 h-7 text-[#163BB5]" />
            </div>
            <h2 className="text-3xl text-gray-900 mb-4">For Companies</h2>
            <p className="text-gray-600 text-lg mb-8">
              Manage and grow your advisory relationships to support better decisions and accelerate growth.
            </p>
            <button
              onClick={onLearnMore}
              className="flex items-center gap-2 text-[#163BB5] hover:gap-3 transition-all"
            >
              <span className="text-lg">Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* For Advisors Card */}
          <div className="bg-gradient-to-br from-[#163BB5] via-[#2D5FE8] to-[#4A90E2] rounded-3xl p-12 text-white hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-8">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl mb-4">For Advisors</h2>
            <p className="text-white/90 text-lg mb-8">
              Apply your expertise where it matters, track your advisory impact, and expand your opportunities with intention.
            </p>
            <button
              onClick={onLearnMoreAdvisor}
              className="flex items-center gap-2 text-white hover:gap-3 transition-all"
            >
              <span className="text-lg">Join Us</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Core Tenets Section */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl leading-tight bg-gradient-to-r from-[#163BB5] to-[#4A90E2] bg-clip-text text-transparent">Core Tenets</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tenet 1 */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <div className="mb-4">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#163BB5] text-white mb-4">
                1
              </span>
              <h3 className="text-gray-900">Ethics must be built into the system.</h3>
            </div>
            <p className="text-gray-600 text-sm">
              We believe ethics cannot rely on intention alone. Transparency, fairness, and accountability should live in the structures themselves...visible, measurable, and persistent.
            </p>
          </div>

          {/* Tenet 2 */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <div className="mb-4">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#163BB5] text-white mb-4">
                2
              </span>
              <h3 className="text-gray-900">Clarity amplifies trust and impact.</h3>
            </div>
            <p className="text-gray-600 text-sm">
              We believe understanding is the foundation of better decisions. When expectations, incentives, and responsibilities are clear, relationships thrive, friction fades, and value flows where it belongs.
            </p>
          </div>

          {/* Tenet 3 */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <div className="mb-4">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#163BB5] text-white mb-4">
                3
              </span>
              <h3 className="text-gray-900">Relationships are measurable infrastructure.</h3>
            </div>
            <p className="text-gray-600 text-sm">
              We believe advisory connections are not casual; they are systems to be designed, nurtured, and observed. By making contributions visible, leveling power, and tracking impact, we ensure fit, judgment, and long-term alignment guide every decision.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}