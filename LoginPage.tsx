import { useState } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { ArrowLeft, Shield } from 'lucide-react';
import { Logo } from './ui/Logo';
import { UserStore, User } from '../utils/userStoreProduction';

interface LoginPageProps {
  onBack: () => void;
  onLogin: (user: User) => void;
}

export function LoginPage({ onBack, onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [loginType, setLoginType] = useState<'company' | 'advisor' | 'admin'>('company');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    // Authenticate against stored users
    const result = await UserStore.authenticate(email, password);
    
    if (!result.success || !result.user) {
      setError(result.error || 'Invalid email or password');
      return;
    }

    // Validate that the user type matches the selected login type
    if (loginType !== 'admin' && result.user.type !== loginType) {
      setError(`This account is not registered as a ${loginType}. Please select the correct login type.`);
      return;
    }

    if (loginType === 'admin' && result.user.type !== 'admin') {
      setError('This account does not have admin privileges.');
      return;
    }

    // Login successful
    onLogin(result.user);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetSuccess('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    // Check if user exists
    const user = await UserStore.getUserByEmail(email);
    if (!user) {
      setError('No account found with this email address');
      return;
    }

    if (!newPassword) {
      setError('Please enter a new password');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      return;
    }

    // Update password
    const result = await UserStore.updatePassword(email, newPassword);
    if (result.success) {
      setResetSuccess('Password reset successful! You can now log in with your new password.');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => {
        setShowResetPassword(false);
        setResetSuccess('');
      }, 2000);
    } else {
      setError(result.error || 'Failed to reset password. Please try again.');
    }
  };

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
            <span>Back</span>
          </button>
        </div>
      </header>

      {/* Login Form */}
      <div className="max-w-md mx-auto px-6 py-20">
        <div className="text-center mb-8">
          <h1 className="text-gray-900 mb-2">
            {showResetPassword ? 'Reset Password' : 'Welcome Back'}
          </h1>
          <p className="text-gray-600">
            {showResetPassword ? 'Enter your email and new password' : 'Log in to your Ethiq account'}
          </p>
        </div>

        <Card>
          {!showResetPassword ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Toggle - Company/Advisor */}
              {loginType !== 'admin' && (
                <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setLoginType('company')}
                    className={`flex-1 px-4 py-2.5 rounded-md transition-all ${
                      loginType === 'company'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Company
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginType('advisor')}
                    className={`flex-1 px-4 py-2.5 rounded-md transition-all ${
                      loginType === 'advisor'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Advisor
                  </button>
                </div>
              )}

              {/* Admin Login Header */}
              {loginType === 'admin' && (
                <div className="flex items-center justify-center gap-2 pb-4 border-b border-gray-200">
                  <Shield className="w-5 h-5 text-[#163BB5]" />
                  <h3 className="text-gray-900">Admin Login</h3>
                </div>
              )}

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
                  placeholder="you@company.com"
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
                  placeholder="Enter your password"
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
                  <span className="font-semibold">Note:</span> Ethiq accounts are invitation-only. 
                  If you don't have an account, please contact the Ethiq team.
                </p>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full">
                Log In
              </Button>

              {/* Forgot Password Link */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowResetPassword(true);
                    setError('');
                  }}
                  className="text-sm text-[#163BB5] hover:text-[#0D2A7A] transition-colors"
                >
                  Forgot your password?
                </button>
              </div>

              {/* Admin Login Button */}
              {loginType !== 'admin' && (
                <div className="pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginType('admin');
                      setError('');
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">Admin Login</span>
                  </button>
                </div>
              )}

              {/* Back to User Login */}
              {loginType === 'admin' && (
                <div className="pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginType('company');
                      setError('');
                    }}
                    className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Back to user login
                  </button>
                </div>
              )}
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="reset-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163BB5] focus:border-transparent"
                  placeholder="you@company.com"
                />
              </div>

              {/* New Password Input */}
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163BB5] focus:border-transparent"
                  placeholder="Enter new password (min 8 characters)"
                />
              </div>

              {/* Confirm New Password Input */}
              <div>
                <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirm-new-password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163BB5] focus:border-transparent"
                  placeholder="Confirm new password"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {resetSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">{resetSuccess}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button type="submit" className="w-full">
                Reset Password
              </Button>

              {/* Back to Login Link */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowResetPassword(false);
                    setError('');
                    setNewPassword('');
                    setConfirmNewPassword('');
                  }}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Back to login
                </button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}