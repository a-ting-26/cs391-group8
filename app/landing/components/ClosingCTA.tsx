"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import ScrollingSparkBytesBanner from "./ScrollingSparkBytesBanner";

export default function ClosingCTA() {
  const router = useRouter();

  const handleStudentClick = async () => {
    const supabase = supabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();

    if (user && user.email?.toLowerCase().endsWith("@bu.edu")) {
      router.push("/student");
      return;
    }

    if (user && !user.email?.toLowerCase().endsWith("@bu.edu")) {
      await supabase.auth.signOut();
      router.replace("/landing?authError=Please%20use%20a%20%40bu.edu%20account");
      return;
    }
    router.push("/auth/signup");
  };

  const handleOrganizerClick = async () => {
    const supabase = supabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/vendor");
      return;
    }

    if (!user.email?.toLowerCase().endsWith("@bu.edu")) {
      await supabase.auth.signOut();
      router.replace("/landing?authError=Please%20use%20a%20%40bu.edu%20account");
      return;
    }

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

    if (hasOrganizerRole && status === "approved") {
      router.push("/vendor");
      return;
    }

    if (!status) {
      router.push("/vendor/onboarding");
      return;
    }

    router.push("/vendor/pending");
  };

  return (
    <section className="relative w-full bg-[#8EDFA4] pt-16 pb-[20vh] md:pt-16 md:pb-[40vh]" style={{ minHeight: "80vh" }}>
      {/* Full-width Animated SPARKBYTES banner */}
      <ScrollingSparkBytesBanner />

      {/* Content section - Top right text/buttons */}
      <div className="relative w-full" style={{ minHeight: "35vh" }}>
        {/* Top Right: Heading and buttons (30% width) */}
        <div className="absolute top-0 right-0 px-6" style={{ width: "30%", minWidth: "280px" }}>
          <div className="space-y-8">
            {/* Heading */}
            <h3
              className="text-3xl font-extrabold leading-tight text-emerald-900 sm:text-4xl md:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              READY TO GET STARTED?
            </h3>
            
            {/* Description */}
            <p className="text-base font-semibold leading-relaxed text-emerald-900/90 sm:text-lg" style={{ fontFamily: "var(--font-inter)" }}>
              Join thousands of BU students discovering free food events on campus. Connect with organizers, reduce waste, and never miss out on delicious opportunities.
            </p>
            
            {/* Buttons */}
            <div className="flex flex-col gap-4">
              <button
                onClick={handleStudentClick}
                className="rounded-full border-[3px] border-emerald-900 bg-[#FEF3C7] px-8 py-4 text-lg font-black uppercase tracking-widest text-emerald-900 shadow-[0_7px_0_0_rgba(16,78,61,0.6)] transition-all duration-200 ease-out hover:-translate-y-1 hover:scale-105 hover:shadow-[0_10px_0_0_rgba(16,78,61,0.7)] hover:bg-[#FDE68A] active:translate-y-0"
              >
                Join as Student
              </button>
              <button
                onClick={handleOrganizerClick}
                className="rounded-full border-[3px] border-emerald-900 bg-[#DBEAFE] px-8 py-4 text-lg font-black uppercase tracking-widest text-emerald-900 shadow-[0_7px_0_0_rgba(16,78,61,0.6)] transition-all duration-200 ease-out hover:-translate-y-1 hover:scale-105 hover:shadow-[0_10px_0_0_rgba(16,78,61,0.7)] hover:bg-[#BFDBFE] active:translate-y-0"
              >
                Become an Organizer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Left: BOSTON UNIVERSITY text - positioned at bottom of section */}
      <div className="absolute bottom-0 left-0 px-6 pb-6">
        <h2
          className="text-5xl font-extrabold leading-[0.85] tracking-tight text-emerald-900 sm:text-6xl md:text-7xl lg:text-8xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          BOSTON UNIVERSITY
        </h2>
      </div>
    </section>
  );
}

