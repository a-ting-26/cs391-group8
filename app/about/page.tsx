"use client";
import React from "react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="min-h-screen w-full bg-[#FFD6E7]">
            {/* Navigation Bar */}
            <nav className="sticky top-0 z-50 mx-auto flex w-full items-center justify-between bg-transparent px-6 py-5 backdrop-blur-0">
                <div className="flex items-center gap-6">
                    <Link
                        href="/landing"
                        className="rounded-full border-[3px] border-emerald-900 bg-[#8EDFA4] px-8 py-3 text-[0.95rem] font-black uppercase tracking-widest text-emerald-900 shadow-[0_5px_0_0_rgba(16,78,61,0.5)] transition-transform hover:translate-y-[1px] active:translate-y-[3px]"
                    >
                        Home
                    </Link>
                    <a className="rounded-full border-[3px] border-emerald-900 bg-[#FDE68A] px-8 py-3 text-[0.95rem] font-black uppercase tracking-widest text-emerald-900 shadow-[0_5px_0_0_rgba(16,78,61,0.5)] transition-transform hover:translate-y-[1px] active:translate-y-[3px]">
                        About
                    </a>
                </div>
                <div className="flex items-center gap-6">
                    <Link
                        href="/contact"
                        className="rounded-full border-[3px] border-emerald-900 bg-[#BBF7D0] px-8 py-3 text-[0.95rem] font-black uppercase tracking-widest text-emerald-900 shadow-[0_5px_0_0_rgba(16,78,61,0.5)] transition-transform hover:translate-y-[1px] active:translate-y-[3px]"
                    >
                        Contact
                    </Link>
                    <Link
                        href="/frq"
                        className="rounded-full border-[3px] border-emerald-900 bg-[#A5F3FC] px-8 py-3 text-[0.95rem] font-black uppercase tracking-widest text-emerald-900 shadow-[0_5px_0_0_rgba(16,78,61,0.5)] transition-transform hover:translate-y-[1px] active:translate-y-[3px]"
                    >
                        FAQs
                    </Link>
                </div>
            </nav>

            {/* Content Section */}
            <div className="mx-auto max-w-5xl px-6 py-16">
                <h1
                    className="mb-12 text-center text-6xl font-extrabold leading-tight tracking-tight text-emerald-900 sm:text-7xl md:text-8xl"
                    style={{ fontFamily: "var(--font-display)" }}
                >
                    ABOUT US
                </h1>

                <div className="space-y-8 text-lg leading-relaxed text-emerald-900" style={{ fontFamily: "var(--font-inter)" }}>
                    <div className="rounded-3xl border-[3px] border-emerald-900 bg-white p-8 shadow-[0_5px_0_0_rgba(16,78,61,0.5)]">
                        <h2 className="mb-4 text-3xl font-bold text-emerald-900" style={{ fontFamily: "var(--font-display)" }}>Our Mission</h2>
                        <p className="font-semibold">
                            BU Food Finder connects Boston University students with free food
                            events across campus while helping reduce food waste. We believe
                            no student should go hungry, and no good food should go to waste.
                        </p>
                    </div>

                    <div className="rounded-3xl border-[3px] border-emerald-900 bg-white p-8 shadow-[0_5px_0_0_rgba(16,78,61,0.5)]">
                        <h2 className="mb-4 text-3xl font-bold text-emerald-900" style={{ fontFamily: "var(--font-display)" }}>How It Works</h2>
                        <p className="mb-4 font-semibold">
                            <strong>For Students:</strong> Browse real-time listings of free
                            food events happening on campus. Get notified when food is
                            available near you.
                        </p>
                        <p className="font-semibold">
                            <strong>For Organizers:</strong> Post your events and leftover
                            food to reach students who need it most. Track engagement and make
                            a real impact.
                        </p>
                    </div>

                    <div className="rounded-3xl border-[3px] border-emerald-900 bg-white p-8 shadow-[0_5px_0_0_rgba(16,78,61,0.5)]">
                        <h2 className="mb-4 text-3xl font-bold text-emerald-900" style={{ fontFamily: "var(--font-display)" }}>Our Impact</h2>
                        <p className="font-semibold">
                            Since launching, we have helped connect thousands of students with
                            free meals, reducing food waste and building community across
                            campus. Join us in creating a more sustainable and connected BU!
                        </p>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <Link
                        href="/landing"
                        className="inline-block rounded-full border-[3px] border-emerald-900 bg-[#FEF3C7] px-12 py-5 text-xl font-black uppercase tracking-widest text-emerald-900 shadow-[0_7px_0_0_rgba(16,78,61,0.6)] transition-all duration-200 ease-out hover:-translate-y-1 hover:scale-105 hover:bg-[#FDE68A] hover:shadow-[0_10px_0_0_rgba(16,78,61,0.7)] active:translate-y-0"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </div>
    );
}