import { useState, useEffect } from 'react';
import { CompanyApp } from './components/CompanyApp';
import { AdvisorApp } from './components/AdvisorApp';
import { AdminApp } from './components/AdminApp';
import { Landing } from './components/Landing';
import { LoginPage } from './components/LoginPage';
import { AdminPanel } from './components/AdminPanel';
import { LearnMore } from './components/LearnMore';
import { LearnMoreAdvisor } from './components/LearnMoreAdvisor';
import { JoinUs } from './components/JoinUs';
import { FirstTimeSetup } from './components/FirstTimeSetup';
import { DiagnosticPage } from './components/DiagnosticPage';
import { UserStore, User } from './utils/userStoreProduction';

type View = 'landing' | 'login' | 'admin' | 'company' | 'advisor' | 'learn-more' | 'learn-more-advisor' | 'join-us' | 'first-time-setup' | 'diagnostics';

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [isCheckingSetup, setIsCheckingSetup] = useState(true);
  const [serverError, setServerError] = useState<string>('');

  // Check if this is first time setup (no users exist)
  useEffect(() => {
    const checkSetup = async () => {
      try {
        console.log('[App] Checking initial setup...');
        const users = await UserStore.getUsers();
        console.log('[App] Users loaded:', users.length);
        if (users.length === 0) {
          setView('first-time-setup');
        }
        setIsCheckingSetup(false);
      } catch (error) {
        console.error('[App] Error checking setup:', error);
        setServerError(error instanceof Error ? error.message : 'Failed to connect to server');
        setIsCheckingSetup(false);
        // We'll show landing page even if there's an error
        // This way users can still try to access the app
      }
    };
    checkSetup();
  }, []);

  const handleLogin = (user: User) => {
    setLoggedInUser(user);
    setView(user.type);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setView('landing');
  };

  // Show loading while checking setup
  if (isCheckingSetup) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#163BB5] border-r-transparent"></div>
          </div>
          <p className="text-gray-600">Connecting to server...</p>
        </div>
      </div>
    );
  }

  // Show error state if server connection failed
  if (serverError && view === 'landing') {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h1>
            <p className="text-gray-600">Unable to connect to the Ethiq server</p>
          </div>
          
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
            <p className="text-sm text-red-700">{serverError}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-[#163BB5] text-white rounded-lg hover:bg-[#0F2A8A] transition-colors"
            >
              Retry Connection
            </button>
            <button
              onClick={() => setView('diagnostics')}
              className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Run Diagnostics
            </button>
            <button
              onClick={() => {
                setServerError('');
                setView('landing');
              }}
              className="w-full px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Continue Anyway
            </button>
          </div>
        </div>
      </div>
    );
  }

  // First time setup
  if (view === 'first-time-setup') {
    return <FirstTimeSetup onComplete={() => setView('landing')} />;
  }

  // Diagnostics page
  if (view === 'diagnostics') {
    return <DiagnosticPage />;
  }

  // Landing page
  if (view === 'landing') {
    return (
      <Landing
        onSelectRole={(role) => setView(role)}
        onLogin={() => setView('login')}
        onLearnMore={() => setView('learn-more')}
        onLearnMoreAdvisor={() => setView('learn-more-advisor')}
        onJoinUs={() => setView('join-us')}
      />
    );
  }

  // Join Us page
  if (view === 'join-us') {
    return <JoinUs />;
  }

  // Learn More page
  if (view === 'learn-more') {
    return (
      <LearnMore
        onBack={() => setView('landing')}
        onGoToDashboard={() => setView('company')}
      />
    );
  }

  // Learn More Advisor page
  if (view === 'learn-more-advisor') {
    return (
      <LearnMoreAdvisor
        onBack={() => setView('landing')}
        onGoToDashboard={() => setView('advisor')}
        onJoinUs={() => setView('join-us')}
      />
    );
  }

  // Login page
  if (view === 'login') {
    return (
      <LoginPage
        onBack={() => setView('landing')}
        onLogin={handleLogin}
      />
    );
  }

  // Admin panel
  if (view === 'admin' && loggedInUser) {
    return <AdminApp currentUser={loggedInUser} />;
  }

  // Dashboard views with role switcher for demo purposes
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Role switcher for demo purposes */}
      <div className="fixed top-4 right-4 z-50 flex gap-2 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
        <button
          onClick={() => setView('company')}
          className={`px-4 py-2 rounded-md transition-colors ${
            view === 'company'
              ? 'bg-gray-900 text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Company View
        </button>
        <button
          onClick={() => setView('advisor')}
          className={`px-4 py-2 rounded-md transition-colors ${
            view === 'advisor'
              ? 'bg-gray-900 text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Advisor View
        </button>
        {loggedInUser?.type === 'admin' && (
          <button
            onClick={() => setView('admin')}
            className={`px-4 py-2 rounded-md transition-colors ${
              view === 'admin'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Admin View
          </button>
        )}
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-md text-gray-600 hover:text-gray-900 border-l border-gray-200"
        >
          ← Back to Home
        </button>
      </div>

      {view === 'company' && loggedInUser ? (
        <CompanyApp currentUser={loggedInUser} />
      ) : loggedInUser ? (
        <AdvisorApp currentUser={loggedInUser} />
      ) : null}
    </div>
  );
}