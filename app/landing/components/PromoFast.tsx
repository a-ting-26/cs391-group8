"use client";
import React from "react";
import SlideIn from "../../components/animations/SlideIn";

export default function PromoFast() {
  return (
    <section className="relative w-full" aria-label="Find Free Food Fast">
      <div
        className="mx-4 md:mx-10 flex items-center justify-center rounded-[40px] bg-[#FDE68A] px-4 md:px-8"
        style={{ height: "85vh" }}
      >
        <div className="-rotate-2 text-center">
          <SlideIn direction="left" delay={0}>
            <h2 className="font-extrabold leading-[0.9] text-emerald-900" style={{ fontFamily: "var(--font-display)" }}>
              <span className="block text-[12vw] md:text-[8vw]">FIND FREE FOOD FAST</span>
            </h2>
          </SlideIn>
          <SlideIn direction="left" delay={0.1}>
            <h2 className="font-extrabold leading-[0.9] text-emerald-900" style={{ fontFamily: "var(--font-display)" }}>
              <span className="block text-[12vw] md:text-[8vw]">FIND FREE FOOD FAST</span>
            </h2>
          </SlideIn>
          <SlideIn direction="left" delay={0.2}>
            <h2 className="font-extrabold leading-[0.9] text-emerald-900" style={{ fontFamily: "var(--font-display)" }}>
              <span className="block text-[12vw] md:text-[8vw]">FIND FREE FOOD FAST</span>
            </h2>
          </SlideIn>
        </div>
      </div>
      <div className="h-8" />
    </section>
  );
}


