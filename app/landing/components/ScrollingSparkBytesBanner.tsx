"use client";

import React from "react";

export default function ScrollingSparkBytesBanner() {
  return (
    <>
      {/* Full-width Animated SPARKBYTES banner */}
      <div className="w-full mb-12">
        {/* Top horizontal line */}
        <div className="h-[2px] bg-emerald-900/60 mb-4" />
        
        {/* Scrolling text container */}
        <div 
          className="overflow-hidden"
          onMouseEnter={(e) => {
            const scrollingDiv = e.currentTarget.querySelector('.scrolling-text') as HTMLElement;
            if (scrollingDiv) scrollingDiv.style.animationPlayState = 'paused';
          }}
          onMouseLeave={(e) => {
            const scrollingDiv = e.currentTarget.querySelector('.scrolling-text') as HTMLElement;
            if (scrollingDiv) scrollingDiv.style.animationPlayState = 'running';
          }}
        >
          <div className="relative w-full">
            <div 
              className="scrolling-text flex whitespace-nowrap"
              style={{
                animation: 'scroll-right-to-left 20s linear infinite',
                animationPlayState: 'running',
              }}
            >
              {/* Duplicate content for seamless loop */}
              <span
                className="inline-block text-[6rem] font-extrabold leading-[0.9] tracking-tight text-emerald-900 sm:text-[8rem] md:text-[10rem] lg:text-[12rem] xl:text-[14rem] px-8"
                style={{ fontFamily: "var(--font-display)" }}
              >
                SPARKBYTES ! SPARKBYTES ! SPARKBYTES ! SPARKBYTES ! SPARKBYTES ! SPARKBYTES ! SPARKBYTES ! SPARKBYTES !
              </span>
              <span
                className="inline-block text-[6rem] font-extrabold leading-[0.9] tracking-tight text-emerald-900 sm:text-[8rem] md:text-[10rem] lg:text-[12rem] xl:text-[14rem] px-8"
                style={{ fontFamily: "var(--font-display)" }}
              >
                SPARKBYTES ! SPARKBYTES ! SPARKBYTES ! SPARKBYTES ! SPARKBYTES ! SPARKBYTES ! SPARKBYTES ! SPARKBYTES !
              </span>
            </div>
          </div>
        </div>
        
        {/* Bottom horizontal line */}
        <div className="h-[2px] bg-emerald-900/60 mt-4" />
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes scroll-right-to-left {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `
      }} />
    </>
  );
}

