"use client";
import React, { useState } from "react";
import Link from "next/link";

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
                "Each post shows when the food was listed and when it's available until. First come, first served! Make sure to check the post details before heading over.",
        },
        {
            question: "What if I have dietary restrictions?",
            answer:
                "Food posts include information about ingredients and dietary considerations when provided by the organizer. You can filter listings to match your dietary needs.",
        },
    ];

    return (
        <div className="min-h-screen w-full bg-[#A5F3FC]">
            {/* Navigation Bar */}
            <nav className="sticky top-0 z-50 mx-auto flex w-full items-center justify-between bg-transparent px-6 py-5 backdrop-blur-0">
                <div className="flex items-center gap-6">
                    <Link
                        href="/landing"
                        className="rounded-full border-[3px] border-emerald-900 bg-[#8EDFA4] px-8 py-3 text-[0.95rem] font-black uppercase tracking-widest text-emerald-900 shadow-[0_5px_0_0_rgba(16,78,61,0.5)] transition-transform hover:translate-y-[1px] active:translate-y-[3px]"
                    >
                        Home
                    </Link>
                    <Link
                        href="/about"
                        className="rounded-full border-[3px] border-emerald-900 bg-[#FDE68A] px-8 py-3 text-[0.95rem] font-black uppercase tracking-widest text-emerald-900 shadow-[0_5px_0_0_rgba(16,78,61,0.5)] transition-transform hover:translate-y-[1px] active:translate-y-[3px]"
                    >
                        About
                    </Link>
                </div>
                <div className="flex items-center gap-6">
                    <Link
                        href="/contact"
                        className="rounded-full border-[3px] border-emerald-900 bg-[#BBF7D0] px-8 py-3 text-[0.95rem] font-black uppercase tracking-widest text-emerald-900 shadow-[0_5px_0_0_rgba(16,78,61,0.5)] transition-transform hover:translate-y-[1px] active:translate-y-[3px]"
                    >
                        Contact
                    </Link>
                    <a className="rounded-full border-[3px] border-emerald-900 bg-[#FFD6E7] px-8 py-3 text-[0.95rem] font-black uppercase tracking-widest text-emerald-900 shadow-[0_5px_0_0_rgba(16,78,61,0.5)] transition-transform hover:translate-y-[1px] active:translate-y-[3px]">
                        FAQs
                    </a>
                </div>
            </nav>

            {/* Content Section */}
            <div className="mx-auto max-w-4xl px-6 py-16">
                <h1
                    className="mb-12 text-center text-6xl font-extrabold leading-tight tracking-tight text-emerald-900 sm:text-7xl md:text-8xl"
                    style={{ fontFamily: "var(--font-display)" }}
                >
                    OUR FAQs
                </h1>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                        />
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="mb-6 text-lg text-emerald-900 font-semibold" style={{ fontFamily: "var(--font-inter)" }}>
                        Still have questions? Email us!
                    </p>
                    <Link
                        href="/landing"
                        className="inline-block rounded-full border-[3px] border-emerald-900 bg-[#FEF3C7] px-12 py-5 text-xl font-black uppercase tracking-widest text-emerald-900 shadow-[0_7px_0_0_rgba(16,78,61,0.6)] transition-all duration-200 ease-out hover:-translate-y-1 hover:scale-105 hover:bg-[#FDE68A] hover:shadow-[0_10px_0_0_rgba(16,78,61,0.7)] active:translate-y-0"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}