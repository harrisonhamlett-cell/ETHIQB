import { useState } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Shield, CheckCircle } from 'lucide-react';
import { Logo } from './ui/Logo';
import { UserStore } from '../utils/userStoreProduction';

interface FirstTimeSetupProps {
  onComplete: () => void;
}

export function FirstTimeSetup({ onComplete }: FirstTimeSetupProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    // Validation
    if (!email || !name || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setIsProcessing(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      setIsProcessing(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setIsProcessing(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsProcessing(false);
      return;
    }

    // Create first admin user
    const result = await UserStore.addUser({
      email,
      name,
      type: 'admin',
      password,
      inviteStatus: 'accepted',
    });

    if (!result.success) {
      setError(`Failed to create admin account: ${result.error}`);
      setIsProcessing(false);
      return;
    }

    setSuccess(true);
    console.log('🎉 First admin account created successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('⚠️  IMPORTANT: Save these credentials securely!');

    // Redirect to login after 2 seconds
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div className="max-w-md w-full px-6">
          <Card>
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-gray-900 mb-2">Setup Complete!</h2>
              <p className="text-gray-600 mb-4">
                Your admin account has been created successfully.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to login...
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center">
            <Logo className="h-10 w-auto" />
          </div>
        </div>
      </header>

      {/* Setup Form */}
      <div className="max-w-md mx-auto px-6 py-20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#FF5722] to-[#FF9800] rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-gray-900 mb-2">Welcome to EthIQ</h1>
          <p className="text-gray-600">
            Let's create your first admin account to get started
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163BB5] focus:border-transparent"
                placeholder="John Doe"
                required
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163BB5] focus:border-transparent"
                placeholder="admin@company.com"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163BB5] focus:border-transparent"
                placeholder="At least 8 characters"
                required
              />
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163BB5] focus:border-transparent"
                placeholder="Re-enter password"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Info Message */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Admin Account:</span> This account will have full access 
                to the EthIQ platform, including user management and system settings.
              </p>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isProcessing}>
              {isProcessing ? 'Creating Account...' : 'Create Admin Account'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}