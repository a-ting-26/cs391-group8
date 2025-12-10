"use client";
import React from "react";
import OrganizerInfo from "./OrganizerInfo";

interface Organizer {
  id: number;
  name: string;
  location: string;
  availableFood: string;
  timeLeft: string;
  category: string;
  dietaryTags: string[];
  featuredPhoto: string;
  description: string;
}

interface ExpandedDetailViewProps {
  organizer: Organizer;
}

export default function ExpandedDetailView({
  organizer,
}: ExpandedDetailViewProps) {
  return (
    <div className="mt-4 rounded-[30px] border-[3px] border-emerald-900 bg-white p-8 shadow-[0_5px_0_0_rgba(16,78,61,0.3)]">
      <OrganizerInfo organizer={organizer} />
    </div>
  );
}

