"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  const handleStudentClick = () => {
    router.push("/auth/signup");
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
        {/* Student Button */}
        <button
          onClick={handleStudentClick}
          className="rounded-full border-[3px] border-emerald-900 bg-[#FEF3C7] px-12 py-5 text-xl font-black uppercase tracking-widest text-emerald-900 shadow-[0_7px_0_0_rgba(16,78,61,0.6)] transition-all duration-200 ease-out hover:-translate-y-1 hover:scale-105 hover:shadow-[0_10px_0_0_rgba(16,78,61,0.7)] hover:bg-[#FDE68A] active:translate-y-0"
        >
          I am a Student
        </button>

        {/* Organizer Button */}
        <button
          onClick={() => router.push("/auth/signup?role=vendor")}
          className="rounded-full border-[3px] border-emerald-900 bg-[#DBEAFE] px-12 py-5 text-xl font-black uppercase tracking-widest text-emerald-900 shadow-[0_7px_0_0_rgba(16,78,61,0.6)] transition-all duration-200 ease-out hover:-translate-y-1 hover:scale-105 hover:shadow-[0_10px_0_0_rgba(16,78,61,0.7)] hover:bg-[#BFDBFE] active:translate-y-0"
        >
          I am an Organizer
        </button>
      </div>
    </section>
  );
}
