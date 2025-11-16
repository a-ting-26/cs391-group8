"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ACTIVE_BUTTON_COLOR = "#FEF3C7"; // cream/yellow for active buttons
const PAGE_COLORS = {
  "/landing": "#8EDFA4", // green
  "/about": "#FFD6E7", // pink
  "/contact": "#E6D5FF", // purple
  "/frq": "#A5F3FC", // blue
};

export default function NavBar() {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path || (path === "/landing" && pathname === "/");
    const getButtonColor = (path: string) => isActive(path) ? ACTIVE_BUTTON_COLOR : PAGE_COLORS[path as keyof typeof PAGE_COLORS];

    return (
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
                <Link
                    href="/frq"
                    className="rounded-full border-[3px] border-emerald-900 px-8 py-3 text-[0.95rem] font-black uppercase tracking-widest text-emerald-900 shadow-[0_5px_0_0_rgba(16,78,61,0.5)] transition-transform hover:translate-y-[1px] active:translate-y-[3px]"
                    style={{ backgroundColor: getButtonColor("/frq") }}
                >
                    FAQs
                </Link>
            </div>
        </nav>
    );
}


