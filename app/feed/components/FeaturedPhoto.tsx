"use client";
import React from "react";
import Image from "next/image";

interface FeaturedPhotoProps {
  photoUrl: string;
}

export default function FeaturedPhoto({ photoUrl }: FeaturedPhotoProps) {
  return (
    <div className="relative h-full min-h-[400px] w-full overflow-hidden rounded-[25px] border-[3px] border-emerald-900 bg-white shadow-[0_5px_0_0_rgba(16,78,61,0.3)]">
      {/* Placeholder for when image doesn't load or doesn't exist */}
      <div className="flex h-full w-full items-center justify-center">
        {photoUrl && photoUrl.startsWith("/") ? (
          <Image
            src={photoUrl}
            alt="Featured food"
            fill
            className="object-cover"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-emerald-700">
            <svg
              className="mb-4 h-24 w-24"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-lg font-semibold">Food Photo</p>
            <p className="text-sm">Coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}

