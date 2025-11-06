"use client";
import React from "react";
import OrganizerInfo from "./OrganizerInfo";
import FeaturedPhoto from "./FeaturedPhoto";

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
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Side - Organizer Info */}
        <div className="flex flex-col">
          <OrganizerInfo organizer={organizer} />
        </div>

        {/* Right Side - Featured Photo */}
        <div className="flex flex-col">
          <FeaturedPhoto photoUrl={organizer.featuredPhoto} />
        </div>
      </div>
    </div>
  );
}

