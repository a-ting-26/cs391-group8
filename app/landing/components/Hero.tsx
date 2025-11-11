"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function Hero() {
  const router = useRouter();

  const handleStudentClick = async () => {
    const supabase = supabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();

    if (user && user.email?.toLowerCase().endsWith("@bu.edu")) {
      // already signed in → straight to feed
      router.push("/student");
      return;
    }

    // not signed in (or wrong domain) → send to student auth
    if (user && !user.email?.toLowerCase().endsWith("@bu.edu")) {
      await supabase.auth.signOut();
      router.replace("/public?authError=Please%20use%20a%20%40bu.edu%20account");
      return;
    }
    router.push("/auth/signup"); // your existing student flow
  };

  const handleOrganizerClick = async () => {
    const supabase = supabaseBrowser();

    // 1) Check session
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth/vendor");
      return;
    }

    // 2) BU domain guard
    if (!user.email?.toLowerCase().endsWith("@bu.edu")) {
      await supabase.auth.signOut();
      router.replace("/public?authError=Please%20use%20a%20%40bu.edu%20account");
      return;
    }

    // 3) See if they already have organizer role + approved application
    //    (RLS allows users to read their own rows)
    const [{ data: profile }, { data: app }] = await Promise.all([
      supabase
        .from("profiles")
        .select("roles")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("organizer_applications")
        .select("status")
        .eq("id", user.id)
        .maybeSingle(),
    ]);

    const roles: string[] = Array.isArray(profile?.roles) ? profile!.roles : [];
    const hasOrganizerRole = roles.includes("organizer");
    const status = app?.status as "pending" | "approved" | "rejected" | undefined;

    // 4) Route by state
    if (hasOrganizerRole && status === "approved") {
      router.push("/vendor/dashboard");
      return;
    }

    if (!status) {
      // no application yet → start onboarding
      router.push("/vendor/onboarding");
      return;
    }

    // has application but not approved yet
    router.push("/vendor/pending");
  };

  return (
    <section className="mx-auto flex h-screen max-w-7xl flex-col items-center justify-center px-6 text-center overflow-hidden">
      <h1
        className="mx-auto mb-10 max-w-7xl text-6xl font-extrabold leading-[0.95] tracking-tight text-emerald-900 sm:text-8xl md:text-9xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        YOUR CAMPUS GUIDE TO FREE FOOD, LESS WASTE, AND MORE CONNECTION.
      </h1>

      <div className="mt-2 flex flex-col items-center justify-center gap-8 sm:flex-row">
        <button
          onClick={handleStudentClick}
          className="rounded-full border-[3px] border-emerald-900 bg-[#FEF3C7] px-12 py-5 text-xl font-black uppercase tracking-widest text-emerald-900 shadow-[0_7px_0_0_rgba(16,78,61,0.6)] transition-all duration-200 ease-out hover:-translate-y-1 hover:scale-105 hover:shadow-[0_10px_0_0_rgba(16,78,61,0.7)] hover:bg-[#FDE68A] active:translate-y-0"
        >
          I am a Student
        </button>

        <button
          onClick={handleOrganizerClick}
          className="rounded-full border-[3px] border-emerald-900 bg-[#DBEAFE] px-12 py-5 text-xl font-black uppercase tracking-widest text-emerald-900 shadow-[0_7px_0_0_rgba(16,78,61,0.6)] transition-all duration-200 ease-out hover:-translate-y-1 hover:scale-105 hover:shadow-[0_10px_0_0_rgba(16,78,61,0.7)] hover:bg-[#BFDBFE] active:translate-y-0"
        >
          I am an Organizer
        </button>
      </div>
    </section>
  );
}
