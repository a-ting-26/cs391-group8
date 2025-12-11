"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase/client";
import FadeIn from "@/app/components/animations/FadeIn";
import ScaleIn from "@/app/components/animations/ScaleIn";

export default function OrganizerAuthPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async () => {
    setIsLoading(true);
    try {
      const supabase = supabaseBrowser();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/vendor/onboarding`,
          queryParams: { hd: "bu.edu", prompt: "select_account" },
        },
      });
      
      if (error) throw error;
      // the browser will redirect to Google; no further code runs here
    } catch (err: any) {
      setIsLoading(false);
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
              Use your BU Google account to continue
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
              Vendor Portal
            </h2>

            <p className="mb-8 text-base font-semibold text-emerald-700">
              Sign in to create and manage your food events for the BU community.
            </p>

            {/* Google Sign In Button */}
            <FadeIn delay={0.3}>
              <button
                onClick={signIn}
                disabled={isLoading}
                className={`w-full rounded-full border-[3px] border-emerald-900 px-8 py-4 text-lg font-black uppercase tracking-wider text-emerald-900 shadow-[0_5px_0_0_rgba(16,78,61,0.4)] transition-all hover:-translate-y-1 hover:shadow-[0_7px_0_0_rgba(16,78,61,0.5)] active:translate-y-0 ${
                  isLoading
                    ? 'cursor-not-allowed bg-gray-300 opacity-50'
                    : 'bg-[#DBEAFE] hover:bg-[#BFDBFE]'
                }`}
              >
                {isLoading ? 'Redirecting…' : 'Continue with BU Google'}
              </button>
            </FadeIn>

            {/* Footer note */}
            <FadeIn delay={0.4}>
              <p className="mt-8 text-center text-sm font-semibold text-emerald-700">
                Only BU faculty and staff can sign in as organizers.
              </p>
            </FadeIn>

            {/* Back to home link */}
            <FadeIn delay={0.5}>
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
