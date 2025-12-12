"use client";
import React from "react";

interface Organizer {
  id: number;
  name: string;
  location: string;
  locationLabel?: string;
  availableFood: string;
  timeLeft: string;
  category: string;
  dietaryTags: string[];
  description: string;
}

interface OrganizerInfoProps {
  organizer: Organizer;
}

export default function OrganizerInfo({ organizer }: OrganizerInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <h4
          className="mb-3 text-3xl font-black uppercase tracking-wide text-emerald-900"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {organizer.name}
        </h4>
        <p className="mb-4 text-lg font-semibold text-emerald-800">
          📍 {organizer.locationLabel}
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <h5 className="mb-2 text-sm font-black uppercase tracking-wider text-emerald-700">
            Available Food
          </h5>
          <p className="text-base text-emerald-900">{organizer.availableFood}</p>
        </div>

        <div>
          <h5 className="mb-2 text-sm font-black uppercase tracking-wider text-emerald-700">
            Description
          </h5>
          <p className="text-base text-emerald-900">{organizer.description}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="rounded-full bg-[#DBEAFE] px-5 py-2">
            <span className="text-sm font-bold uppercase tracking-wide text-emerald-900">
              ⏱️ {organizer.timeLeft} left
            </span>
          </div>
          <div className="rounded-full bg-[#FDE68A] px-5 py-2">
            <span className="text-sm font-bold uppercase tracking-wide text-emerald-900">
              {organizer.category}
            </span>
          </div>
        </div>

        <div>
          <h5 className="mb-2 text-sm font-black uppercase tracking-wider text-emerald-700">
            Dietary Tags
          </h5>
          <div className="flex flex-wrap gap-2">
            {organizer.dietaryTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#BBF7D0] px-4 py-1 text-xs font-bold uppercase tracking-wide text-emerald-900"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <button className="mt-4 w-full rounded-full border-[3px] border-emerald-900 bg-[#FDE68A] px-8 py-4 text-lg font-black uppercase tracking-widest text-emerald-900 shadow-[0_5px_0_0_rgba(16,78,61,0.5)] transition-all hover:-translate-y-1 hover:shadow-[0_7px_0_0_rgba(16,78,61,0.6)] active:translate-y-0">
          Reserve Portion
        </button>
      </div>
    </div>
  );
}

