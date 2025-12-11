'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabaseBrowser } from '@/lib/supabase/client';
import FadeIn from '@/app/components/animations/FadeIn';
import ScaleIn from '@/app/components/animations/ScaleIn';

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
          redirectTo: `${window.location.origin}/student`,
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
    <div className="min-h-screen w-full bg-[#f9f8f4] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <FadeIn>
          {/* Header */}
          <div className="mb-8 text-center">
            <h1
              className="mb-4 text-5xl font-extrabold leading-[0.95] tracking-tight text-emerald-900 sm:text-6xl md:text-7xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Spark!Bytes
            </h1>
            <p className="text-lg font-semibold text-emerald-800">
              Sign in or create an account with Google
            </p>
          </div>
        </FadeIn>

        {/* Card */}
        <ScaleIn delay={0.2} scaleFrom={0.9}>
          <div className="rounded-[30px] border-[3px] border-emerald-900 bg-white p-8 shadow-[0_5px_0_0_rgba(16,78,61,0.3)]">
            <h2
              className="mb-6 text-2xl font-black uppercase tracking-wide text-emerald-900"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Welcome
            </h2>

            <div className="space-y-4">
              {/* Google Sign Up */}
              <FadeIn delay={0.3}>
                <button
                  onClick={() => startGoogleOAuth('signup')}
                  disabled={!!isLoading}
                  className={`w-full rounded-full border-[3px] border-emerald-900 px-8 py-4 text-lg font-black uppercase tracking-wider text-emerald-900 shadow-[0_5px_0_0_rgba(16,78,61,0.4)] transition-all hover:-translate-y-1 hover:shadow-[0_7px_0_0_rgba(16,78,61,0.5)] active:translate-y-0 ${
                    isLoading === 'signup'
                      ? 'cursor-not-allowed bg-gray-300 opacity-50'
                      : 'bg-[#FEF3C7] hover:bg-[#FDE68A]'
                  }`}
                >
                  {isLoading === 'signup' ? 'Redirecting…' : 'Sign up with Google (@bu.edu)'}
                </button>
              </FadeIn>

              {/* Divider */}
              <div className="flex items-center justify-center gap-3 py-2">
                <span className="h-px flex-1 bg-emerald-200" />
                <span className="text-sm font-semibold uppercase tracking-wide text-emerald-600">or</span>
                <span className="h-px flex-1 bg-emerald-200" />
              </div>

              {/* Google Login */}
              <FadeIn delay={0.4}>
                <button
                  onClick={() => startGoogleOAuth('login')}
                  disabled={!!isLoading}
                  className={`w-full rounded-full border-[3px] border-emerald-900 px-8 py-4 text-lg font-black uppercase tracking-wider text-emerald-900 shadow-[0_5px_0_0_rgba(16,78,61,0.4)] transition-all hover:-translate-y-1 hover:shadow-[0_7px_0_0_rgba(16,78,61,0.5)] active:translate-y-0 ${
                    isLoading === 'login'
                      ? 'cursor-not-allowed bg-gray-300 opacity-50'
                      : 'bg-white hover:bg-emerald-50'
                  }`}
                >
                  {isLoading === 'login' ? 'Redirecting…' : 'Log in with Google (@bu.edu)'}
                </button>
              </FadeIn>
            </div>

            {/* Footer note */}
            <FadeIn delay={0.5}>
              <p className="mt-8 text-center text-sm font-semibold text-emerald-700">
                Only BU students and faculty can sign in.
              </p>
            </FadeIn>

            {/* Back to home link */}
            <FadeIn delay={0.6}>
              <div className="mt-6 text-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wide text-emerald-900 hover:text-emerald-700 transition-colors"
                >
                  <span className="text-lg">←</span> Back to Home
                </Link>
              </div>
            </FadeIn>
          </div>
        </ScaleIn>
      </div>
    </div>
  );
}
