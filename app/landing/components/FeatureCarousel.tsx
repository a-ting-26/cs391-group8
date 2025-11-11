"use client";
import Image from "next/image";
import React, { useMemo, useState } from "react";

export default function FeatureCarousel() {
  const slides = useMemo(
    () => [
      { title: "FIND FREE FOOD NEAR YOU", bg: "#F9CFE1", img: "/next.svg" },
      { title: "FILTER BY PREFERENCES", bg: "#F7C77E", img: "/next.svg" },
      { title: "CLAIM AND PICK UP", bg: "#FEF59E", img: "/next.svg" },
      { title: "REDUCE WASTE TOGETHER", bg: "#E6D5FF", img: "/next.svg" },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);
  const prevColor = slides[(index - 1 + slides.length) % slides.length].bg;
  const nextColor = slides[(index + 1) % slides.length].bg;

  return (
    <section className="relative w-full">
      <div className="mx-auto mb-16 max-w-7xl px-6 pt-10">
        <h2 className="text-left text-6xl font-extrabold leading-[0.95] text-emerald-900 sm:text-8xl md:text-8xl" style={{ fontFamily: "var(--font-display)" }}>
          WITH SPARKBYTES<br />YOU CAN:
        </h2>
      </div>
      <div className="relative mx-auto mb-4 w-full max-w-[1250px]" style={{ minHeight: "85vh" }}>
        <button
          onClick={prev}
          aria-label="Previous"
          className="pointer-events-auto absolute top-1/2 z-[999] -translate-y-1/2 flex h-24 w-24 cursor-pointer items-center justify-center rounded-full"
          style={{ left: "-140px" }}
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-emerald-900 text-emerald-900 shadow-[0_8px_0_rgba(16,78,61,0.3)] md:h-20 md:w-20" style={{ backgroundColor: prevColor }}>
            <span className="select-none text-3xl font-black leading-none md:text-4xl">‹</span>
          </span>
        </button>
        <button
          onClick={next}
          aria-label="Next"
          className="pointer-events-auto absolute top-1/2 z-[999] -translate-y-1/2 flex h-24 w-24 cursor-pointer items-center justify-center rounded-full"
          style={{ right: "-140px" }}
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-emerald-900 text-emerald-900 shadow-[0_8px_0_rgba(16,78,61,0.3)] md:h-20 md:w-20" style={{ backgroundColor: nextColor }}>
            <span className="select-none text-3xl font-black leading-none md:text-4xl">›</span>
          </span>
        </button>
        <div className="relative z-20 w-full overflow-hidden rounded-[40px] py-8 md:py-10 md:rounded-[56px]" style={{ height: "85vh", backgroundColor: slides[index].bg }}>
          <div className="flex w-full" style={{ width: `${slides.length * 100}%`, transform: `translateX(-${index * (100 / slides.length)}%)`, transition: "transform 500ms ease" }}>
            {slides.map((s, idx) => (
              <div key={idx} className="flex flex-none items-center justify-center px-8 py-24 md:py-32" style={{ width: `${100 / slides.length}%` }}>
                <div className="flex max-w-6xl flex-col items-center text-center">
                  <div className="mb-12 flex h-[360px] w-[640px] items-center justify-center rounded-2xl bg-white/80 shadow-2xl md:h-[400px] md:w-[820px]">
                    <Image src={s.img} alt="mock" width={160} height={40} className="opacity-80" />
                  </div>
                  <h2 className="text-5xl font-extrabold leading-tight text-emerald-900 sm:text-6xl md:text-6xl" style={{ fontFamily: "var(--font-display)" }}>{s.title}</h2>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="h-16" />
    </section>
  );
}


