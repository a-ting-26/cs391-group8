"use client";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import SlideIn from "../../components/animations/SlideIn";
import ScaleIn from "../../components/animations/ScaleIn";

export default function FeatureCarousel() {
  const slides = useMemo(
    () => [
      { 
        title: "FIND FREE FOOD NEAR YOU", 
        description: "Browse events happening near you and discover free food opportunities on campus.",
        bg: "#F9CFE1", 
        img: "/images/carousel/slide-1.png" 
      },
      { 
        title: "FILTER BY PREFERENCES", 
        description: "Set your dietary preferences and find events that match your needs.",
        bg: "#A5F3FC", 
        img: "/images/carousel/slide-2.png" 
      },
      { 
        title: "CLAIM AND PICK UP", 
        description: "Reserve your spot at events and pick up free food when it's ready.",
        bg: "#FEF59E", 
        img: "/images/carousel/slide-3.png" 
      },
      { 
        title: "REDUCE WASTE TOGETHER", 
        description: "Help reduce food waste by connecting with events and sharing surplus food.",
        bg: "#E6D5FF", 
        img: "/images/carousel/slide-4.png" 
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
      {/* Divider with Spark! */}
      <div className="relative w-full bg-[#8EDFA4] flex items-center justify-center px-6 py-4">
        <div className="flex items-center gap-6 w-full max-w-4xl mx-auto">
          {/* Left line */}
          <div className="flex-1 h-[4px] bg-emerald-900/60" />
          
          {/* Text */}
          <h2
            className="text-xl font-extrabold text-emerald-900 sm:text-2xl md:text-3xl whitespace-nowrap bg-[#8EDFA4] px-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Spark!Bytes
        </h2>
          
          {/* Right line */}
          <div className="flex-1 h-[4px] bg-emerald-900/60" />
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
                  <SlideIn direction="up" delay={0}>
                    <h2 className="text-4xl font-extrabold leading-tight text-emerald-900 sm:text-5xl md:text-6xl" style={{ fontFamily: "var(--font-display)" }}>
                      {s.title}
                    </h2>
                  </SlideIn>
                  
                  {/* Image */}
                  <ScaleIn delay={0.15} scaleFrom={0.85}>
                    <div className="flex h-[360px] w-[640px] items-center justify-center rounded-2xl bg-white/80 shadow-2xl overflow-hidden border-[3px] border-emerald-900 md:h-[400px] md:w-[820px]">
                      <Image 
                        src={s.img} 
                        alt={s.title} 
                        width={820} 
                        height={400} 
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                    </div>
                  </ScaleIn>
                  
                  {/* Description below image */}
                  <SlideIn direction="up" delay={0.3}>
                    <p className="text-lg font-semibold leading-relaxed text-emerald-900/90 sm:text-xl max-w-2xl px-4" style={{ fontFamily: "var(--font-inter)" }}>
                      {s.description}
                    </p>
                  </SlideIn>
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


