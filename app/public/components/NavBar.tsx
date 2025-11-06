"use client";
import React from "react";

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-50 mx-auto flex w-full items-center justify-between bg-transparent px-6 py-5 backdrop-blur-0">
      <div className="flex items-center gap-6">
        <a className="rounded-full border-[3px] border-emerald-900 bg-[#FFD6E7] px-8 py-3 text-[0.95rem] font-black uppercase tracking-widest text-emerald-900 shadow-[0_5px_0_0_rgba(16,78,61,0.5)] transition-transform hover:translate-y-[1px] active:translate-y-[3px]">
          Home
        </a>
        <a className="rounded-full border-[3px] border-emerald-900 bg-[#FDE68A] px-8 py-3 text-[0.95rem] font-black uppercase tracking-widest text-emerald-900 shadow-[0_5px_0_0_rgba(16,78,61,0.5)] transition-transform hover:translate-y-[1px] active:translate-y-[3px]">
          About
        </a>
      </div>
      <div className="flex items-center gap-6">
        <a className="rounded-full border-[3px] border-emerald-900 bg-[#BBF7D0] px-8 py-3 text-[0.95rem] font-black uppercase tracking-widest text-emerald-900 shadow-[0_5px_0_0_rgba(16,78,61,0.5)] transition-transform hover:translate-y-[1px] active:translate-y-[3px]">
          Contact
        </a>
        <a className="rounded-full border-[3px] border-emerald-900 bg-[#A5F3FC] px-8 py-3 text-[0.95rem] font-black uppercase tracking-widest text-emerald-900 shadow-[0_5px_0_0_rgba(16,78,61,0.5)] transition-transform hover:translate-y-[1px] active:translate-y-[3px]">
          FAQs
        </a>
      </div>
    </nav>
  );
}


