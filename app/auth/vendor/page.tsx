// app/auth/organizer/page.tsx
"use client";

import { supabaseBrowser } from "@/lib/supabase/client";

export default function OrganizerAuthPage() {
  const signIn = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/vendor/onboarding`,
        queryParams: { hd: "bu.edu", prompt: "select_account" },
      },
    });
  };

  return (
    <div className="min-h-screen grid place-items-center bg-emerald-50 px-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow p-8 text-center">
        <h1 className="text-2xl font-bold text-emerald-900 mb-2">Organizer Sign in</h1>
        <p className="text-sm text-gray-600 mb-6">
          Use your BU Google account to continue.
        </p>
        <button
          onClick={signIn}
          className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3"
        >
          Continue with BU Google
        </button>
      </div>
    </div>
  );
}
