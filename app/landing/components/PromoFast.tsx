"use client";
import React from "react";

export default function PromoFast() {
  return (
    <section className="relative w-full" aria-label="Find Free Food Fast">
      <div
        className="mx-4 md:mx-10 flex items-center justify-center rounded-[40px] bg-[#FDE68A] px-4 md:px-8"
        style={{ height: "85vh" }}
      >
        <h2 className="-rotate-2 text-center font-extrabold leading-[0.9] text-emerald-900" style={{ fontFamily: "var(--font-display)" }}>
          <span className="block text-[12vw] md:text-[8vw]">FIND FREE FOOD FAST</span>
          <span className="block text-[12vw] md:text-[8vw]">FIND FREE FOOD FAST</span>
          <span className="block text-[12vw] md:text-[8vw]">FIND FREE FOOD FAST</span>
        </h2>
      </div>
      <div className="h-8" />
    </section>
  );
}


