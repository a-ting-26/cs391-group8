"use client";
import React, { useState } from "react";
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

interface FAQItemProps {
    question: string;
    answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="rounded-3xl border-[3px] border-emerald-900 bg-white p-6 shadow-[0_5px_0_0_rgba(16,78,61,0.5)]">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between text-left"
            >
                <h3 className="text-2xl font-bold text-emerald-900 sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>{question}</h3>
                <span className="ml-4 text-3xl font-bold text-emerald-900 sm:text-4xl">
          {isOpen ? "−" : "+"}
        </span>
            </button>
            {isOpen && (
                <p className="mt-4 text-lg leading-relaxed text-emerald-900 font-semibold" style={{ fontFamily: "var(--font-inter)" }}>
                    {answer}
                </p>
            )}
        </div>
    );
}

export default function FRQPage() {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path || (path === "/landing" && pathname === "/");
    const getButtonColor = (path: string) => isActive(path) ? ACTIVE_BUTTON_COLOR : PAGE_COLORS[path as keyof typeof PAGE_COLORS];
    
    const faqs = [
        {
            question: "How do I find free food on campus?",
            answer:
                "Simply sign up with your @bu.edu email and browse the student feed. You'll see real-time listings of free food events happening across campus, complete with location, time, and food type information.",
        },
        {
            question: "Is this really free?",
            answer:
                "Yes! All food listings on BU Food Finder are completely free for BU students. Organizations post their events and leftover food to share with the campus community.",
        },
        {
            question: "How do I become an organizer?",
            answer:
                "Click 'I am an Organizer' on the home page and complete the application process. Once approved by our admin team, you'll be able to post food events and manage your listings.",
        },
        {
            question: "What kind of food is available?",
            answer:
                "Everything from pizza and sandwiches to leftover catering from events, baked goods, and more. Organizations post a variety of foods, and you can filter by your preferences.",
        },
        {
            question: "How do I know when food is posted?",
            answer:
                "Students can enable notifications to get alerted when new food is posted near their location. You can also check the feed anytime to see what's currently available.",
        },
        {
            question: "Can I post food as a student?",
            answer:
                "Currently, only approved organizers (student organizations, departments, etc.) can post food listings. This helps ensure quality and accuracy of posts.",
        },
        {
            question: "Is there a time limit for claiming food?",
            answer:
                "Each post shows when the food was listed and until when it's available. Make sure to check the post details before heading over.",
        },
        {
            question: "What if I have dietary restrictions?",
            answer:
                "Food posts include information about ingredients and dietary considerations when provided by the organizer. You can filter listings to match your dietary needs.",
        },
    ];

    return (
        <div className="min-h-screen w-full" style={{ backgroundColor: "#A5F3FC" }}>
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
                    <Link
                        href="/about"
                        className="rounded-full border-[3px] border-emerald-900 px-8 py-3 text-[0.95rem] font-black uppercase tracking-widest text-emerald-900 shadow-[0_5px_0_0_rgba(16,78,61,0.5)] transition-transform hover:translate-y-[1px] active:translate-y-[3px]"
                        style={{ backgroundColor: getButtonColor("/about") }}
                    >
                        About
                    </Link>
                </div>
                <div className="flex items-center gap-6">
                    <Link
                        href="/contact"
                        className="rounded-full border-[3px] border-emerald-900 px-8 py-3 text-[0.95rem] font-black uppercase tracking-widest text-emerald-900 shadow-[0_5px_0_0_rgba(16,78,61,0.5)] transition-transform hover:translate-y-[1px] active:translate-y-[3px]"
                        style={{ backgroundColor: getButtonColor("/contact") }}
                    >
                        Contact
                    </Link>
                    <a 
                        className="rounded-full border-[3px] border-emerald-900 px-8 py-3 text-[0.95rem] font-black uppercase tracking-widest text-emerald-900 shadow-[0_5px_0_0_rgba(16,78,61,0.5)] transition-transform hover:translate-y-[1px] active:translate-y-[3px]"
                        style={{ backgroundColor: getButtonColor("/frq") }}
                    >
                        FAQs
                    </a>
                </div>
            </nav>

            {/* Content Section */}
            <div className="mx-auto max-w-4xl px-6 py-16">
                <FadeIn delay={0}>
                    <h1
                        className="mb-12 text-center text-6xl font-extrabold leading-tight tracking-tight text-emerald-900 sm:text-7xl md:text-8xl"
                        style={{ fontFamily: "var(--font-display)" }}
                    >
                        OUR FAQs
                    </h1>
                </FadeIn>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <SlideIn key={index} direction="up" delay={0 + index * 0.02} duration={0.4}>
                            <FAQItem
                                question={faq.question}
                                answer={faq.answer}
                            />
                        </SlideIn>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <FadeIn delay={0.2} duration={0.4}>
                        <p className="mb-6 text-lg text-emerald-900 font-semibold" style={{ fontFamily: "var(--font-inter)" }}>
                            Still have questions?
                        </p>
                    </FadeIn>
                    <ScaleIn delay={0.25} scaleFrom={0.8} duration={0.4}>
                        <Link
                            href="/contact"
                            className="inline-block rounded-full border-[3px] border-emerald-900 bg-[#FEF3C7] px-12 py-5 text-xl font-black uppercase tracking-widest text-emerald-900 shadow-[0_7px_0_0_rgba(16,78,61,0.6)] transition-all duration-200 ease-out hover:-translate-y-1 hover:scale-105 hover:bg-[#FDE68A] hover:shadow-[0_10px_0_0_rgba(16,78,61,0.7)] active:translate-y-0"
                        >
                            Get In Touch
                        </Link>
                    </ScaleIn>
                </div>
            </div>
        </div>
    );
}