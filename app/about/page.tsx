"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import FadeIn from "../components/animations/FadeIn";
import SlideIn from "../components/animations/SlideIn";
import ScaleIn from "../components/animations/ScaleIn";

const ACTIVE_BUTTON_COLOR = "#FEF3C7"; // cream/yellow for active buttons
const PAGE_COLORS = {
  "/landing": "#8EDFA4", // green
  "/about": "#FFD6E7", // pink
  "/contact": "#E6D5FF", // purple
  "/frq": "#A5F3FC", // blue
};

export default function AboutPage() {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path || (path === "/landing" && pathname === "/");
    const getButtonColor = (path: string) => isActive(path) ? ACTIVE_BUTTON_COLOR : PAGE_COLORS[path as keyof typeof PAGE_COLORS];

    return (
        <div className="min-h-screen w-full" style={{ backgroundColor: "#FFD6E7" }}>
            {/* Navigation Bar */}
            <nav className="sticky top-0 z-50 mx-auto flex w-full items-center justify-between bg-transparent px-6 py-5 backdrop-blur-0">
                <div className="flex items-center gap-6">
                    <Link
                        href="/landing"
                        className="rounded-full border-[3px] border-emerald-900 px-8 py-3 text-[0.95rem] font-black uppercase tracking-widest text-emerald-900 shadow-[0_5px_0_0_rgba(16,78,61,0.5)] transition-transform hover:translate-y-[1px] active:translate-y-[3px]"
                        style={{ backgroundColor: getButtonColor("/landing") }}
                    >
                        Home
                    </Link>
                    <a 
                        className="rounded-full border-[3px] border-emerald-900 px-8 py-3 text-[0.95rem] font-black uppercase tracking-widest text-emerald-900 shadow-[0_5px_0_0_rgba(16,78,61,0.5)] transition-transform hover:translate-y-[1px] active:translate-y-[3px]"
                        style={{ backgroundColor: getButtonColor("/about") }}
                    >
                        About
                    </a>
                </div>
                <div className="flex items-center gap-6">
                    <Link
                        href="/contact"
                        className="rounded-full border-[3px] border-emerald-900 px-8 py-3 text-[0.95rem] font-black uppercase tracking-widest text-emerald-900 shadow-[0_5px_0_0_rgba(16,78,61,0.5)] transition-transform hover:translate-y-[1px] active:translate-y-[3px]"
                        style={{ backgroundColor: getButtonColor("/contact") }}
                    >
                        Contact
                    </Link>
                    <Link
                        href="/frq"
                        className="rounded-full border-[3px] border-emerald-900 px-8 py-3 text-[0.95rem] font-black uppercase tracking-widest text-emerald-900 shadow-[0_5px_0_0_rgba(16,78,61,0.5)] transition-transform hover:translate-y-[1px] active:translate-y-[3px]"
                        style={{ backgroundColor: getButtonColor("/frq") }}
                    >
                        FAQs
                    </Link>
                </div>
            </nav>

            {/* Content Section */}
            <div className="mx-auto max-w-5xl px-6 py-16">
                <FadeIn delay={0}>
                    <h1
                        className="mb-12 text-center text-6xl font-extrabold leading-tight tracking-tight text-emerald-900 sm:text-7xl md:text-8xl"
                        style={{ fontFamily: "var(--font-display)" }}
                    >
                        ABOUT US
                    </h1>
                </FadeIn>

                <div className="space-y-8 text-lg leading-relaxed text-emerald-900" style={{ fontFamily: "var(--font-inter)" }}>
                    <SlideIn direction="right" delay={0.1}>
                        <div className="rounded-3xl border-[3px] border-emerald-900 bg-white p-8 shadow-[0_5px_0_0_rgba(16,78,61,0.5)]">
                            <h2 className="mb-4 text-3xl font-bold text-emerald-900" style={{ fontFamily: "var(--font-display)" }}>Our Mission</h2>
                            <p className="font-semibold">
                                BU Food Finder connects Boston University students with free food
                                events across campus while helping reduce food waste. We believe
                                no student should go hungry, and no good food should go to waste.
                            </p>
                        </div>
                    </SlideIn>

                    <SlideIn direction="left" delay={0.2}>
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
                    </SlideIn>

                    <SlideIn direction="right" delay={0.3}>
                        <div className="rounded-3xl border-[3px] border-emerald-900 bg-white p-8 shadow-[0_5px_0_0_rgba(16,78,61,0.5)]">
                            <h2 className="mb-4 text-3xl font-bold text-emerald-900" style={{ fontFamily: "var(--font-display)" }}>Our Impact</h2>
                            <p className="font-semibold">
                                Since launching, we have helped connect thousands of students with
                                free meals, reducing food waste and building community across
                                campus. Join us in creating a more sustainable and connected BU!
                            </p>
                        </div>
                    </SlideIn>
                </div>

                <div className="mt-16 text-center">
                    <ScaleIn delay={0.4} scaleFrom={0.8}>
                        <Link
                            href="/landing"
                            className="inline-block rounded-full border-[3px] border-emerald-900 bg-[#FEF3C7] px-12 py-5 text-xl font-black uppercase tracking-widest text-emerald-900 shadow-[0_7px_0_0_rgba(16,78,61,0.6)] transition-all duration-200 ease-out hover:-translate-y-1 hover:scale-105 hover:bg-[#FDE68A] hover:shadow-[0_10px_0_0_rgba(16,78,61,0.7)] active:translate-y-0"
                        >
                            Get Started
                        </Link>
                    </ScaleIn>
                </div>
            </div>
        </div>
    );
}