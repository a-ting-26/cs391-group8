"use client";
import Image from "next/image";
import React, { useMemo, useState } from "react";

export default function FeatureCarousel() {
  const slides = useMemo(
    () => [
      { 
        title: "FIND FREE FOOD NEAR YOU", 
        description: "Browse events happening near you and discover free food opportunities on campus.",
        bg: "#F9CFE1", 
        img: "/next.svg" 
      },
      { 
        title: "FILTER BY PREFERENCES", 
        description: "Set your dietary preferences and find events that match your needs.",
        bg: "#F7C77E", 
        img: "/next.svg" 
      },
      { 
        title: "CLAIM AND PICK UP", 
        description: "Reserve your spot at events and pick up free food when it's ready.",
        bg: "#FEF59E", 
        img: "/next.svg" 
      },
      { 
        title: "REDUCE WASTE TOGETHER", 
        description: "Help reduce food waste by connecting with events and sharing surplus food.",
        bg: "#E6D5FF", 
        img: "/next.svg" 
      },
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
      {/* Wavy divider with Spark! */}
      <div className="relative w-full bg-[#8EDFA4] pb-4">
        <svg
          className="w-full h-16"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,60 Q150,20 300,60 T600,60 T900,60 T1200,60 L1200,120 L0,120 Z"
            fill="#8EDFA4"
            stroke="none"
          />
          <path
            d="M0,60 Q150,20 300,60 T600,60 T900,60 T1200,60"
            stroke="#065F46"
            strokeWidth="8"
            strokeOpacity="0.8"
            fill="none"
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <h2
            className="text-xl font-extrabold text-emerald-900 sm:text-2xl md:text-3xl whitespace-nowrap bg-[#8EDFA4] px-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Spark!Bytes
          </h2>
        </div>
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
              <div key={idx} className="flex flex-none items-center justify-center px-8 py-16 md:py-20" style={{ width: `${100 / slides.length}%` }}>
                <div className="flex max-w-6xl flex-col items-center text-center gap-8">
                  {/* Title above image */}
                  <h2 className="text-4xl font-extrabold leading-tight text-emerald-900 sm:text-5xl md:text-6xl" style={{ fontFamily: "var(--font-display)" }}>
                    {s.title}
                  </h2>
                  
                  {/* Image */}
                  <div className="flex h-[360px] w-[640px] items-center justify-center rounded-2xl bg-white/80 shadow-2xl md:h-[400px] md:w-[820px]">
                    <Image src={s.img} alt="mock" width={160} height={40} className="opacity-80" />
                  </div>
                  
                  {/* Description below image */}
                  <p className="text-lg leading-relaxed text-emerald-900/90 sm:text-xl max-w-2xl px-4">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="h-8" />
    </section>
  );
}


