import { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { MultiSelectDropdown } from './ui/MultiSelectDropdown';
import { useToast } from './ui/Toast';
import { fixedInterests, specialDomainsOptions } from '../data/mockData';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { CheckCircle } from 'lucide-react';

export function JoinUs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [executiveType, setExecutiveType] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [specialDomains, setSpecialDomains] = useState<string[]>([]);
  const [bio, setBio] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { showToast, ToastComponent } = useToast();

  const executiveTypes = [
    'Current Executive - Public Company',
    'Former Executive - Public Company',
    'Current Executive - Private Company',
    'Former Executive - Private Company',
    'Founder or CEO',
    'Consultant',
    'Venture Capitalist',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !executiveType || !yearsExperience || interests.length === 0 || !bio) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0b8dc1d2/advisor-applications`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            role,
            executive_type: executiveType,
            years_experience: parseInt(yearsExperience),
            interests,
            special_domains: specialDomains,
            bio,
            linkedin_url: linkedinUrl,
            profile_visibility: profileVisibility,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setSubmitted(true);
      showToast('Application submitted successfully!');
    } catch (error) {
      console.error('Error submitting application:', error);
      showToast('Failed to submit application. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FC] to-[#EEF0F8] flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full text-center py-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-gray-900 mb-4">Application Submitted!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your interest in joining EthIQ as an advisor. Our team will review your
            application and get back to you within 3-5 business days.
          </p>
          <p className="text-gray-600">
            You'll receive an email at <span className="font-medium">{email}</span> once your
            application has been reviewed.
          </p>
        </Card>
        <ToastComponent />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FC] to-[#EEF0F8] py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-gray-900 mb-4">Join EthIQ as an Advisor</h1>
          <p className="text-gray-600 text-lg">
            Share your expertise and help companies grow. Fill out the application below to get
            started.
          </p>
        </div>

        {/* Application Form */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h2 className="text-gray-900 mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163BB5] focus:border-transparent"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163BB5] focus:border-transparent"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Current/Previous Role</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163BB5] focus:border-transparent"
                    placeholder="VP of Engineering at Stripe"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    LinkedIn URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163BB5] focus:border-transparent"
                    placeholder="https://linkedin.com/in/johndoe"
                  />
                </div>
              </div>
            </div>

            {/* Professional Background */}
            <div>
              <h2 className="text-gray-900 mb-4">Professional Background</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Executive Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={executiveType}
                    onChange={(e) => setExecutiveType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163BB5] focus:border-transparent"
                    required
                  >
                    <option value="">Select your executive type</option>
                    {executiveTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Years of Experience <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163BB5] focus:border-transparent"
                    placeholder="15"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Areas of Interest <span className="text-red-500">*</span>
                  </label>
                  <MultiSelectDropdown
                    label=""
                    options={fixedInterests}
                    selected={interests}
                    onChange={setInterests}
                    placeholder="Select interests"
                  />
                  {interests.length === 0 && (
                    <p className="text-gray-500 text-sm mt-1">
                      Please select at least one area of interest
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Special Domains</label>
                  <MultiSelectDropdown
                    label=""
                    options={specialDomainsOptions}
                    selected={specialDomains}
                    onChange={setSpecialDomains}
                    placeholder="Select domains (optional)"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Bio / Professional Summary <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163BB5] focus:border-transparent"
                    rows={5}
                    placeholder="Tell us about your professional background, expertise, and what you can bring to companies as an advisor..."
                    required
                  />
                  <p className="text-gray-500 text-sm mt-1">{bio.length} / 500 characters</p>
                </div>
              </div>
            </div>

            {/* Profile Visibility */}
            <div>
              <h2 className="text-gray-900 mb-4">Profile Visibility</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profileVisibility}
                    onChange={(e) => setProfileVisibility(e.target.checked)}
                    className="mt-1 w-5 h-5 text-[#163BB5] border-gray-300 rounded focus:ring-[#163BB5]"
                  />
                  <div>
                    <p className="text-gray-900">Make my profile visible in the directory</p>
                    <p className="text-gray-600 text-sm mt-1">
                      When enabled, your profile will appear in the company directory even before
                      your application is approved. Companies can contact you, but you won't be
                      able to accept handshakes or receive nudges until approved.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
      <ToastComponent />
    </div>
  );
}