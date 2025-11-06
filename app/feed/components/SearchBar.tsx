"use client";
import React from "react";
import Dropdown from "./Dropdown";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  availability: string;
  onAvailabilityChange: (value: string) => void;
  dietary: string[];
  onDietaryChange: (value: string[]) => void;
  location: string;
  onLocationChange: (value: string) => void;
  sorting: string;
  onSortingChange: (value: string) => void;
}

const availabilityOptions = [
  { value: "available-now", label: "Available Now" },
  { value: "available-soon", label: "Available Soon" },
  { value: "ending-soon", label: "Ending Soon" },
];

const dietaryOptions = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "halal", label: "Halal" },
  { value: "gluten-free", label: "Gluten-Free" },
  { value: "dairy-free", label: "Dairy-Free" },
  { value: "nut-free", label: "Nut-Free" },
];

const locationOptions = [
  { value: "central-campus", label: "Central Campus" },
  { value: "george-sherman-union", label: "George Sherman Union" },
  { value: "east-campus", label: "East Campus" },
  { value: "west-campus", label: "West Campus" },
  { value: "fenway-campus", label: "Fenway Campus" },
];

const sortingOptions = [
  { value: "newest", label: "Newest" },
  { value: "ending-soon", label: "Ending Soon" },
  { value: "available-soon", label: "Available Soon" },
];

export default function SearchBar({
  searchQuery,
  onSearchChange,
  availability,
  onAvailabilityChange,
  dietary,
  onDietaryChange,
  location,
  onLocationChange,
  sorting,
  onSortingChange,
}: SearchBarProps) {
  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <svg
            className="h-5 w-5 text-emerald-900"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search for food or organizers..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-full border-[3px] border-emerald-900 bg-white py-4 pl-12 pr-6 text-lg font-semibold text-emerald-900 placeholder-emerald-700/50 shadow-[0_5px_0_0_rgba(16,78,61,0.3)] outline-none transition-all focus:shadow-[0_7px_0_0_rgba(16,78,61,0.4)] focus:ring-0"
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Dropdown
          label="Availability"
          options={availabilityOptions}
          value={availability}
          onChange={onAvailabilityChange}
          placeholder="All Availability"
          color="bg-[#FDE68A]"
        />
        <Dropdown
          label="Dietary"
          options={dietaryOptions}
          value={dietary}
          onChange={onDietaryChange}
          placeholder="All Dietary"
          multiSelect={true}
          color="bg-[#DBEAFE]"
        />
        <Dropdown
          label="Location"
          options={locationOptions}
          value={location}
          onChange={onLocationChange}
          placeholder="All Locations"
          color="bg-[#BBF7D0]"
        />
        <Dropdown
          label="Sorting"
          options={sortingOptions}
          value={sorting}
          onChange={onSortingChange}
          placeholder="Default"
          color="bg-[#FFD6E7]"
        />
      </div>
    </div>
  );
}

