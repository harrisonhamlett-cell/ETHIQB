import { Button } from './ui/Button';
import { ArrowLeft, CheckCircle, Mail, Clock, TrendingUp, Award, Inbox, MessageSquare } from 'lucide-react';
import { Logo } from './ui/Logo';

interface LearnMoreAdvisorProps {
  onBack: () => void;
  onGoToDashboard: () => void;
  onJoinUs?: () => void;
}

export function LearnMoreAdvisor({ onBack, onGoToDashboard, onJoinUs }: LearnMoreAdvisorProps) {
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
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-gray-900 mb-6">
              Advisory Work, Without the Chaos
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Managing multiple advisory board relationships shouldn't mean drowning in 
              emails and texts. EthIQ gives you one clear place to see everything, respond 
              to requests, and build a record of your impact.
            </p>
            <div className="flex gap-4 justify-center">
              {onJoinUs && (
                <Button
                  onClick={onJoinUs}
                  className="bg-[#163BB5] text-white hover:bg-[#0D2A7A]"
                >
                  Apply to Join
                </Button>
              )}
              <Button
                onClick={onGoToDashboard}
                variant="secondary"
              >
                Go to Advisor Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* The Problem */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-gray-900 mb-4">The Advisory Board Problem</h2>
          <p className="text-xl text-gray-600 mb-8">
            As an advisor, you're valuable because of your expertise and network. But 
            managing multiple advisory relationships often becomes a mess of scattered 
            communication, unclear expectations, and lost track records.
          </p>
          
          {/* Problem Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <Mail className="w-8 h-8 text-red-600 mb-3" />
              <h3 className="text-gray-900 text-lg mb-2">Communication Chaos</h3>
              <p className="text-gray-600 text-sm">
                Requests buried in email threads, texts, and DMs across multiple companies
              </p>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <MessageSquare className="w-8 h-8 text-orange-600 mb-3" />
              <h3 className="text-gray-900 text-lg mb-2">Vague Requests</h3>
              <p className="text-gray-600 text-sm">
                "Can you help with something?" leads to endless back-and-forth clarifications
              </p>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <Inbox className="w-8 h-8 text-yellow-600 mb-3" />
              <h3 className="text-gray-900 text-lg mb-2">No Track Record</h3>
              <p className="text-gray-600 text-sm">
                Your valuable contributions disappear into the void—hard to showcase later
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Advisors Use EthIQ */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-12 border border-gray-200">
          <h2 className="text-gray-900 mb-8 text-center">Why Advisors Use EthIQ</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Benefit 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-[#163BB5] to-[#2D5FE8] flex items-center justify-center">
                <Inbox className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-gray-900 mb-2">Everything in one place</h3>
                <p className="text-gray-600">
                  See every company you support, what's pending, and what you've already 
                  done—without digging through email and texts. Your entire advisory 
                  portfolio lives in one organized dashboard.
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-[#163BB5] to-[#2D5FE8] flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-gray-900 mb-2">Clear, respectful requests</h3>
                <p className="text-gray-600">
                  Requests come with context and a clear outcome, so you can say yes/no 
                  quickly and avoid vague, time-draining back-and-forth. Every "Nudge" 
                  is structured so you know exactly what's being asked and why.
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-[#163BB5] to-[#2D5FE8] flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-gray-900 mb-2">Track your time and contributions</h3>
                <p className="text-gray-600">
                  Know how much you're spending and how you're helping across companies—useful 
                  for staying within your limits and keeping things fair. See your workload 
                  at a glance before accepting new opportunities.
                </p>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-[#163BB5] to-[#2D5FE8] flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-gray-900 mb-2">Build a living record of impact</h3>
                <p className="text-gray-600">
                  EthIQ automatically organizes your work into resume-ready proof of what 
                  you contributed (intros, reviews, strategic input, etc.). Your advisory 
                  work becomes tangible evidence of your expertise and network.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What You Get */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-12 border border-gray-200">
          <h2 className="text-gray-900 mb-8 text-center">What You Get with EthIQ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="flex gap-3">
              <CheckCircle className="w-6 h-6 text-[#163BB5] flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-gray-900 mb-1">Unified Dashboard</h4>
                <p className="text-gray-600 text-sm">
                  All companies, requests, and contributions in one place
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle className="w-6 h-6 text-[#163BB5] flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-gray-900 mb-1">Workload Visibility</h4>
                <p className="text-gray-600 text-sm">
                  See your capacity before accepting new opportunities
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle className="w-6 h-6 text-[#163BB5] flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-gray-900 mb-1">Structured Communication</h4>
                <p className="text-gray-600 text-sm">
                  No more vague requests—everything comes with clear context
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle className="w-6 h-6 text-[#163BB5] flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-gray-900 mb-1">Impact Tracking</h4>
                <p className="text-gray-600 text-sm">
                  Automatic record of every intro, review, and strategic contribution
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle className="w-6 h-6 text-[#163BB5] flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-gray-900 mb-1">Smart Decision-Making</h4>
                <p className="text-gray-600 text-sm">
                  Company metrics help you evaluate new opportunities
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle className="w-6 h-6 text-[#163BB5] flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-gray-900 mb-1">Two-Party Completion</h4>
                <p className="text-gray-600 text-sm">
                  Both you and companies confirm work is done—full transparency
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works for Advisors */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl p-12 border border-gray-200">
          <h2 className="text-gray-900 mb-12 text-center">How It Works</h2>
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#163BB5] flex items-center justify-center text-white font-semibold">
                1
              </div>
              <div>
                <h3 className="text-gray-900 mb-2">Complete Your Profile</h3>
                <p className="text-gray-600">
                  Share your expertise, background, and interests through our structured 
                  onboarding. This helps companies find you for the right opportunities.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#163BB5] flex items-center justify-center text-white font-semibold">
                2
              </div>
              <div>
                <h3 className="text-gray-900 mb-2">Review New Opportunities</h3>
                <p className="text-gray-600">
                  When companies reach out, you'll see their activity metrics, request 
                  types, and your current workload—all the info you need to make informed 
                  decisions about accepting.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#163BB5] flex items-center justify-center text-white font-semibold">
                3
              </div>
              <div>
                <h3 className="text-gray-900 mb-2">Accept Handshakes</h3>
                <p className="text-gray-600">
                  Agree to formal working relationships with companies. Handshakes establish 
                  the scope and terms before any work begins.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#163BB5] flex items-center justify-center text-white font-semibold">
                4
              </div>
              <div>
                <h3 className="text-gray-900 mb-2">Respond to Nudges</h3>
                <p className="text-gray-600">
                  Receive clear, structured work requests with context. Accept or decline 
                  based on your bandwidth. Complete work and confirm completion—building 
                  your track record with every contribution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center">
          <h2 className="text-gray-900 mb-4">Ready to Simplify Your Advisory Work?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Stop drowning in scattered communication. Join EthIQ and get back to doing 
            what you do best—advising companies and building your impact.
          </p>
          <Button
            onClick={onGoToDashboard}
            className="bg-[#163BB5] text-white hover:bg-[#0D2A7A]"
          >
            Go to Advisor Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}