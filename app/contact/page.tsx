"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ScrollingSparkBytesBanner from "../landing/components/ScrollingSparkBytesBanner";
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

export default function ContactPage() {
  const pathname = usePathname();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  
  const isActive = (path: string) => pathname === path || (path === "/landing" && pathname === "/");
  const getButtonColor = (path: string) => isActive(path) ? ACTIVE_BUTTON_COLOR : PAGE_COLORS[path as keyof typeof PAGE_COLORS];

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("sparkbytes@bu.edu");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log({ name, email, message });
    // You can add your form submission logic here
    alert("Thank you for your message! We'll get back to you soon.");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#E6D5FF" }}>
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
          <a 
            className="rounded-full border-[3px] border-emerald-900 px-8 py-3 text-[0.95rem] font-black uppercase tracking-widest text-emerald-900 shadow-[0_5px_0_0_rgba(16,78,61,0.5)] transition-transform hover:translate-y-[1px] active:translate-y-[3px]"
            style={{ backgroundColor: getButtonColor("/contact") }}
          >
            Contact
          </a>
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
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-4xl items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl rounded-[40px] border-[3px] border-emerald-900 bg-white p-8 shadow-[0_8px_0_0_rgba(16,78,61,0.5)] md:p-12">
          {/* Main Title */}
          <FadeIn delay={0}>
            <h1
              className="mb-12 text-center text-5xl font-extrabold leading-tight tracking-tight text-emerald-900 sm:text-6xl md:text-7xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              GET IN TOUCH!
            </h1>
          </FadeIn>

          {/* Via Email Section */}
          <SlideIn direction="right" delay={0.1}>
            <div className="mb-8">
              <h2
                className="mb-4 text-xl font-bold uppercase tracking-wide text-emerald-900 sm:text-2xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                VIA EMAIL
              </h2>
              <button
                onClick={handleCopyEmail}
                className="flex w-full items-center justify-between rounded-full border-[3px] border-emerald-900 bg-[#8EDFA4] px-6 py-4 text-left font-semibold text-emerald-900 transition-all hover:bg-[#7EDFA4] hover:shadow-[0_5px_0_0_rgba(16,78,61,0.5)] active:translate-y-[2px] active:shadow-[0_3px_0_0_rgba(16,78,61,0.5)]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <span>SPARKBYTES@BU.EDU</span>
                <svg
                  className={`h-5 w-5 ${copied ? "text-emerald-700" : "text-emerald-900"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {copied ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  )}
                </svg>
              </button>
              {copied && (
                <p className="mt-2 text-sm font-semibold text-emerald-700" style={{ fontFamily: "var(--font-inter)" }}>
                  Email copied to clipboard!
                </p>
              )}
            </div>
          </SlideIn>

          {/* Divider */}
          <div className="mb-8 h-[2px] bg-emerald-900/20" />

          {/* Or Enquiry Section */}
          <SlideIn direction="left" delay={0.2}>
            <div className="mb-8">
              <h2
                className="mb-2 text-xl font-bold uppercase tracking-wide text-emerald-900 sm:text-2xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                OR ENQUIRY
              </h2>
              <p className="mb-6 font-semibold text-emerald-900/80" style={{ fontFamily: "var(--font-inter)" }}>
                We'll get back to you as soon as possible.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <FadeIn delay={0.3}>
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-base font-semibold text-emerald-900"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      What's your name?
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full rounded-xl border-[2px] border-emerald-900 bg-white px-4 py-3 text-lg font-semibold text-emerald-900 placeholder-emerald-900/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-700"
                      style={{ fontFamily: "var(--font-inter)" }}
                      placeholder="Enter your name"
                    />
                  </div>
                </FadeIn>

                {/* Email Field */}
                <FadeIn delay={0.4}>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-base font-semibold text-emerald-900"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      Your email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-xl border-[2px] border-emerald-900 bg-white px-4 py-3 text-lg font-semibold text-emerald-900 placeholder-emerald-900/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-700"
                      style={{ fontFamily: "var(--font-inter)" }}
                      placeholder="Enter your email"
                    />
                  </div>
                </FadeIn>

                {/* Message Field */}
                <FadeIn delay={0.5}>
                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-base font-semibold text-emerald-900"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      Send us a message (Optional)
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={6}
                      className="w-full resize-none rounded-xl border-[2px] border-emerald-900 bg-white px-4 py-3 text-lg font-semibold text-emerald-900 placeholder-emerald-900/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-700"
                      style={{ fontFamily: "var(--font-inter)" }}
                      placeholder="Enter your message"
                    />
                  </div>
                </FadeIn>

                {/* Submit Button */}
                <ScaleIn delay={0.6} scaleFrom={0.8}>
                  <button
                    type="submit"
                    className="w-full rounded-full border-[3px] border-emerald-900 bg-[#8EDFA4] px-8 py-4 text-xl font-black uppercase tracking-widest text-emerald-900 shadow-[0_7px_0_0_rgba(16,78,61,0.6)] transition-all duration-200 ease-out hover:-translate-y-1 hover:bg-[#7EDFA4] hover:shadow-[0_10px_0_0_rgba(16,78,61,0.7)] active:translate-y-0"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    SUBMIT
                  </button>
                </ScaleIn>
              </form>
            </div>
          </SlideIn>
        </div>
      </div>
    </div>
  );
}

