"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function StudentNavBar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <nav className="sticky top-0 z-50 mx-auto flex w-full items-center justify-between border-b-[3px] border-emerald-900 bg-[#f9f8f4] px-6 py-5 backdrop-blur-0">
      <Link
        href="/landing"
        className="text-3xl font-extrabold leading-[0.95] tracking-tight text-emerald-900 transition-transform hover:scale-105"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Spark!Bytes
      </Link>
      
      <div className="relative">
        {/* Hamburger/Sandwich Icon Button */}
        <button
          ref={buttonRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-emerald-900 bg-white shadow-[0_5px_0_0_rgba(16,78,61,0.4)] transition-all hover:-translate-y-1 hover:shadow-[0_7px_0_0_rgba(16,78,61,0.5)] active:translate-y-0"
          aria-label="Menu"
        >
          <svg
            className="h-6 w-6 text-emerald-900"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={3}
            strokeLinecap="round"
          >
            <line x1="6" y1="10" x2="18" y2="10" />
            <line x1="6" y1="14" x2="18" y2="14" />
          </svg>
        </button>

        {/* Bubble Menu */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 top-14 z-50 flex flex-col gap-3"
          >
            <Link
              href="/student/profile"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-full border-[3px] border-emerald-900 bg-white px-6 py-3 text-center text-sm font-black uppercase tracking-wider text-emerald-900 shadow-[0_5px_0_0_rgba(16,78,61,0.4)] transition-all hover:-translate-y-1 hover:shadow-[0_7px_0_0_rgba(16,78,61,0.5)] active:translate-y-0"
            >
              PROFILE
            </Link>
            <Link
              href="/student/reservations"
              className="rounded-full border-[3px] border-emerald-900 bg-white px-6 py-3 text-sm font-black uppercase tracking-wide text-emerald-900 shadow-[0_3px_0_0_rgba(16,78,61,0.4)] hover:-translate-y-[1px] hover:shadow-[0_4px_0_0_rgba(16,78,61,0.5)] transition"
            >
              RESERVATIONS
            </Link>
            <button
              onClick={async () => {
                setIsMenuOpen(false);
                const supabase = supabaseBrowser();
                await supabase.auth.signOut();
                router.push("/landing");
              }}
              className="rounded-full border-[3px] border-emerald-900 bg-white px-6 py-3 text-center text-sm font-black uppercase tracking-wider text-emerald-900 shadow-[0_5px_0_0_rgba(16,78,61,0.4)] transition-all hover:-translate-y-1 hover:bg-red-50 hover:text-red-700 hover:shadow-[0_7px_0_0_rgba(16,78,61,0.5)] active:translate-y-0"
            >
              LOGOUT
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

