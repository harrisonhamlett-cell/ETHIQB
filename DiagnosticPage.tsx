import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function DiagnosticPage() {
  const [results, setResults] = useState<{
    healthCheck?: { status: string; error?: string };
    usersCheck?: { status: string; error?: string; count?: number };
    envVars: { projectId: boolean; anonKey: boolean };
  }>({
    envVars: {
      projectId: !!projectId,
      anonKey: !!publicAnonKey,
    },
  });

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-0b8dc1d2`;

    // Test 1: Health check
    try {
      console.log('[DIAGNOSTIC] Testing health endpoint:', `${API_BASE}/health`);
      const healthResponse = await fetch(`${API_BASE}/health`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      console.log('[DIAGNOSTIC] Health response status:', healthResponse.status);

      if (healthResponse.ok) {
        const data = await healthResponse.json();
        setResults((prev) => ({
          ...prev,
          healthCheck: { status: 'success', error: undefined },
        }));
      } else {
        const errorText = await healthResponse.text();
        setResults((prev) => ({
          ...prev,
          healthCheck: { status: 'failed', error: `HTTP ${healthResponse.status}: ${errorText}` },
        }));
      }
    } catch (error) {
      console.error('[DIAGNOSTIC] Health check failed:', error);
      setResults((prev) => ({
        ...prev,
        healthCheck: {
          status: 'error',
          error: error instanceof Error ? error.message : 'Network error',
        },
      }));
    }

    // Test 2: Users endpoint
    try {
      console.log('[DIAGNOSTIC] Testing users endpoint:', `${API_BASE}/users`);
      const usersResponse = await fetch(`${API_BASE}/users`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      console.log('[DIAGNOSTIC] Users response status:', usersResponse.status);

      if (usersResponse.ok) {
        const data = await usersResponse.json();
        setResults((prev) => ({
          ...prev,
          usersCheck: {
            status: 'success',
            error: undefined,
            count: data.users?.length || 0,
          },
        }));
      } else {
        const errorText = await usersResponse.text();
        setResults((prev) => ({
          ...prev,
          usersCheck: {
            status: 'failed',
            error: `HTTP ${usersResponse.status}: ${errorText}`,
          },
        }));
      }
    } catch (error) {
      console.error('[DIAGNOSTIC] Users check failed:', error);
      setResults((prev) => ({
        ...prev,
        usersCheck: {
          status: 'error',
          error: error instanceof Error ? error.message : 'Network error',
        },
      }));
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'failed':
        return '❌';
      case 'error':
        return '⚠️';
      default:
        return '⏳';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            System Diagnostics
          </h1>
          <p className="text-gray-600 mb-8">
            Checking connection to Supabase backend...
          </p>

          {/* Environment Variables */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Environment Variables
            </h2>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {results.envVars.projectId ? '✅' : '❌'}
                </span>
                <div>
                  <p className="font-medium text-gray-900">Project ID</p>
                  <p className="text-sm text-gray-600 font-mono">{projectId || 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {results.envVars.anonKey ? '✅' : '❌'}
                </span>
                <div>
                  <p className="font-medium text-gray-900">Anon Key</p>
                  <p className="text-sm text-gray-600 font-mono">
                    {publicAnonKey ? `${publicAnonKey.substring(0, 20)}...` : 'Not set'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* API Endpoints */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              API Endpoints
            </h2>
            <div className="space-y-4">
              {/* Health Check */}
              <div className="p-4 bg-white rounded border border-gray-200">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">
                    {getStatusIcon(results.healthCheck?.status)}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Health Check</p>
                    <p className="text-sm text-gray-600 font-mono mb-2">
                      GET /health
                    </p>
                    {results.healthCheck?.error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded">
                        <p className="text-sm text-red-700">{results.healthCheck.error}</p>
                      </div>
                    )}
                    {results.healthCheck?.status === 'success' && (
                      <p className="text-sm text-green-600">Server is responding</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Users Endpoint */}
              <div className="p-4 bg-white rounded border border-gray-200">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">
                    {getStatusIcon(results.usersCheck?.status)}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Users Endpoint</p>
                    <p className="text-sm text-gray-600 font-mono mb-2">
                      GET /users
                    </p>
                    {results.usersCheck?.error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded">
                        <p className="text-sm text-red-700">{results.usersCheck.error}</p>
                      </div>
                    )}
                    {results.usersCheck?.status === 'success' && (
                      <p className="text-sm text-green-600">
                        Found {results.usersCheck.count} user(s) in database
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={runDiagnostics}
              className="px-6 py-3 bg-[#163BB5] text-white rounded-lg hover:bg-[#0F2A8A] transition-colors"
            >
              Retry Diagnostics
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back to App
            </button>
          </div>

          {/* Debug Info */}
          <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">🔍 Debug Information</h3>
            <p className="text-sm text-yellow-800 mb-2">
              If you see errors above, here are common issues:
            </p>
            <ul className="text-sm text-yellow-800 space-y-2 list-disc ml-6">
              <li>
                <strong>404 errors:</strong> The Supabase Edge Function isn't deployed yet. 
                Figma Make should auto-deploy it.
              </li>
              <li>
                <strong>CORS errors:</strong> The function is deployed but CORS headers aren't configured properly.
              </li>
              <li>
                <strong>Network errors:</strong> Check your internet connection or Supabase project status.
              </li>
              <li>
                <strong>500 errors:</strong> There's an error in the server code. Check the Supabase logs.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
