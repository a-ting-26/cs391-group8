"use client";
import React from "react";
import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import PromoFast from "./components/PromoFast";
import FeatureCarousel from "./components/FeatureCarousel";
import ClosingReveal from "./components/ClosingReveal";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-[#8EDFA4]">
      <div className="fixed left-0 right-0 top-0 z-50 h-[1px] bg-emerald-900/30" />
      <NavBar />
      <Hero />
      <PromoFast />
      <FeatureCarousel />
    </div>
  );
}


