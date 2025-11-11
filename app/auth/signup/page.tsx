'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function AuthGoogleOnly() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<'signup' | 'login' | null>(null);

  // start Google OAuth; `mode` just helps us know which button started it
  const startGoogleOAuth = async (mode: 'signup' | 'login') => {
    setIsLoading(mode);
    try {
      const supabase = supabaseBrowser();
      // `hd=bu.edu` hints to Google to show BU accounts; we'll hard-enforce in the callback.
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/feed`,
          queryParams: { hd: 'bu.edu', prompt: 'select_account' },
        },
      });
      
      if (error) throw error;
      // the browser will redirect to Google; no further code runs here
    } catch (err: any) {
      setIsLoading(null);
      alert(err?.message || 'Failed to start Google sign-in');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-600 to-red-800 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">BU Spark!Bytes</h1>
          <p className="text-red-100">Sign in or create an account with Google</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Welcome</h2>

          <div className="space-y-4">
            {/* Google Sign Up */}
            <button
              onClick={() => startGoogleOAuth('signup')}
              disabled={!!isLoading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
                isLoading === 'signup'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 active:bg-red-800'
              }`}
            >
              {isLoading === 'signup' ? 'Redirecting…' : 'Sign up with Google (@bu.edu)'}
            </button>

            {/* Divider */}
            <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
              <span className="h-px w-16 bg-gray-200" />
              or
              <span className="h-px w-16 bg-gray-200" />
            </div>

            {/* Google Login */}
            <button
              onClick={() => startGoogleOAuth('login')}
              disabled={!!isLoading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-red-700 border border-red-200 bg-red-50 transition-colors ${
                isLoading === 'login'
                  ? 'opacity-60 cursor-not-allowed'
                  : 'hover:bg-red-100'
              }`}
            >
              {isLoading === 'login' ? 'Redirecting…' : 'Log in with Google (@bu.edu)'}
            </button>
          </div>

          {/* Footer note */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Only BU students and faculty can sign in.
          </p>
        </div>
      </div>
    </div>
  );
}
