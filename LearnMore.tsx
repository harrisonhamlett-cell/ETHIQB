import { Button } from './ui/Button';
import { ArrowLeft, CheckCircle, Users, Zap, Shield, TrendingUp } from 'lucide-react';
import { Logo } from './ui/Logo';

interface LearnMoreProps {
  onBack: () => void;
  onGoToDashboard: () => void;
}

export function LearnMore({ onBack, onGoToDashboard }: LearnMoreProps) {
  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center">
            <Logo className="h-10 w-auto" />
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-white border-b border-gray-200 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="max-w-5xl mx-auto text-center">
            {/* Headline */}
            <h1 className="text-6xl leading-normal mb-8 pb-2">
              <span className="text-gray-900">Streamline Your </span>
              <span className="bg-gradient-to-r from-[#163BB5] to-[#2D5FE8] bg-clip-text text-transparent">Advisor</span>
              <br />
              <span className="bg-gradient-to-r from-[#4A90E2] to-[#5CA4F5] bg-clip-text text-transparent">Engagement</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              EthIQ is a B2B workflow platform that transforms how companies manage 
              relationships with advisors through structured, transparent engagement.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={onGoToDashboard}
                className="bg-[#163BB5] text-white hover:bg-[#0D2A7A] text-lg px-10 py-7 shadow-lg hover:shadow-xl transition-all"
              >
                Go to Company Dashboard
              </Button>
              <button
                onClick={onGoToDashboard}
                className="inline-flex items-center justify-center rounded-lg bg-white border-2 border-gray-200 text-gray-900 hover:bg-[#163BB5] hover:border-[#163BB5] hover:text-white text-lg px-10 py-7 transition-all"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* The Playbook Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#EEF0F8] to-white rounded-2xl p-12 border border-gray-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#163BB5] to-[#2D5FE8] flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-gray-900 mb-4">Built on a Proven Playbook</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  EthIQ was built from a proven advisory-board playbook shaped across VC 
                  portfolios and high-growth companies. It turns advisor engagement into a 
                  repeatable operating system—clear requests, clean follow-through, and a 
                  real record of impact—so companies get faster decisions, stronger 
                  introductions, and measurable outcomes instead of relationship drift.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose EthIQ */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-12 border border-gray-200">
          <h2 className="text-gray-900 mb-8 text-center">Why Choose EthIQ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="flex gap-3">
              <CheckCircle className="w-6 h-6 text-[#163BB5] flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-gray-900 mb-1">Transparent Workflows</h4>
                <p className="text-gray-600 text-sm">
                  Every step is clear and trackable, from initial contact to completion
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle className="w-6 h-6 text-[#163BB5] flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-gray-900 mb-1">Two-Party Completion</h4>
                <p className="text-gray-600 text-sm">
                  Both advisors and companies confirm work is complete
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle className="w-6 h-6 text-[#163BB5] flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-gray-900 mb-1">Curated Network</h4>
                <p className="text-gray-600 text-sm">
                  Work with pre-vetted advisors who've completed comprehensive onboarding
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle className="w-6 h-6 text-[#163BB5] flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-gray-900 mb-1">Scalable Engagement</h4>
                <p className="text-gray-600 text-sm">
                  Manage relationships with multiple advisors effortlessly
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle className="w-6 h-6 text-[#163BB5] flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-gray-900 mb-1">Intelligent Insights</h4>
                <p className="text-gray-600 text-sm">
                  Make data-driven decisions with workload and performance metrics
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle className="w-6 h-6 text-[#163BB5] flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-gray-900 mb-1">Intuitive Interface</h4>
                <p className="text-gray-600 text-sm">
                  Clean, effortless design makes EthIQ easy for anyone to navigate and accomplish tasks
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-12 border border-gray-200">
          <h3 className="text-gray-900 text-center mb-8">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="flex gap-3">
              <CheckCircle className="w-6 h-6 text-[#163BB5] flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-gray-900 mb-1">Structured Relationships</h4>
                <p className="text-gray-600 text-sm">
                  Move through a clear progression: Discover advisors, send Contacts, 
                  propose Handshakes, and send Nudges for ongoing work requests
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle className="w-6 h-6 text-[#163BB5] flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-gray-900 mb-1">Intelligent Nudges</h4>
                <p className="text-gray-600 text-sm">
                  Send structured work requests to advisors with two-party 
                  confirmation before marking complete
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle className="w-6 h-6 text-[#163BB5] flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-gray-900 mb-1">Quality Control</h4>
                <p className="text-gray-600 text-sm">
                  Work with pre-vetted advisors who've completed comprehensive 
                  onboarding with expertise verification
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle className="w-6 h-6 text-[#163BB5] flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-gray-900 mb-1">Data-Driven Decisions</h4>
                <p className="text-gray-600 text-sm">
                  Track advisor workload, nudge response rates, and engagement 
                  metrics for informed decisions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center">
          <h2 className="text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Transform how you engage with advisors. Start managing your relationships 
            with EthIQ today.
          </p>
          <Button
            onClick={onGoToDashboard}
            className="bg-[#163BB5] text-white hover:bg-[#0D2A7A]"
          >
            Go to Company Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}