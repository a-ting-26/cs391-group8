"use client";

import React, { useState } from "react";
import FeedNavBar from "./FeedNavBar";
import SearchBar from "./SearchBar";
import OrganizerCard from "./OrganizerCard";

const mockOrganizers = [
  {
    id: 1,
    name: "BU Dining Services",
    location: "central-campus",
    locationLabel: "Central Campus",
    availableFood: "Pizza, Sandwiches, Salads",
    timeLeft: "2 hours",
    availability: "available-now",
    category: "Lunch",
    dietaryTags: ["Vegetarian", "Gluten-free"],
    featuredPhoto: "/images/food1.jpg",
    description: "Leftover catering from orientation event",
  },
  {
    id: 2,
    name: "Campus Events Committee",
    location: "george-sherman-union",
    locationLabel: "George Sherman Union",
    availableFood: "Pasta, Bread, Desserts",
    timeLeft: "4 hours",
    availability: "available-soon",
    category: "Dinner",
    dietaryTags: ["Vegetarian", "Vegan"],
    featuredPhoto: "/images/food2.jpg",
    description: "Post-conference refreshments available",
  },
  {
    id: 3,
    name: "Student Activities",
    location: "east-campus",
    locationLabel: "East Campus",
    availableFood: "Wraps, Fruit, Beverages",
    timeLeft: "1 hour",
    availability: "ending-soon",
    category: "Snacks",
    dietaryTags: ["Vegan", "Gluten-free"],
    featuredPhoto: "/images/food3.jpg",
    description: "End of semester celebration leftovers",
  },
  {
    id: 4,
    name: "BU Sustainability",
    location: "west-campus",
    locationLabel: "West Campus",
    availableFood: "Veggie Bowls, Smoothies",
    timeLeft: "3 hours",
    availability: "available-now",
    category: "Lunch",
    dietaryTags: ["Vegan", "Vegetarian", "Halal"],
    featuredPhoto: "/images/food4.jpg",
    description: "Sustainable food event leftovers",
  },
  {
    id: 5,
    name: "Fenway Events",
    location: "fenway-campus",
    locationLabel: "Fenway Campus",
    availableFood: "Catered Buffet",
    timeLeft: "5 hours",
    availability: "available-soon",
    category: "Dinner",
    dietaryTags: ["Vegetarian", "Dairy-free"],
    featuredPhoto: "/images/food5.jpg",
    description: "Conference closing reception",
  },
];

export default function FeedContent({ email }: { email: string | null }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [availability, setAvailability] = useState("");
  const [dietary, setDietary] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [sorting, setSorting] = useState("");
  const [expandedOrganizerId, setExpandedOrganizerId] = useState<number | null>(
    null
  );

  const handleSearchChange = (query: string) => setSearchQuery(query);
  const handleCardClick = (organizerId: number) =>
    setExpandedOrganizerId(
      expandedOrganizerId === organizerId ? null : organizerId
    );

  // Filter organizers
  let filteredOrganizers = mockOrganizers.filter((organizer) => {
    const matchesSearch =
      !searchQuery ||
      organizer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      organizer.availableFood.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDietary =
      dietary.length === 0 ||
      dietary.some((diet) =>
        organizer.dietaryTags.some((tag) =>
          tag.toLowerCase().replace(/\s+/g, "-").includes(diet.toLowerCase())
        )
      );

    const matchesAvailability =
      !availability || organizer.availability === availability;
    const matchesLocation = !location || organizer.location === location;

    return (
      matchesSearch && matchesDietary && matchesAvailability && matchesLocation
    );
  });

  // Sort
  if (sorting) {
    filteredOrganizers = [...filteredOrganizers].sort((a, b) => 0);
  }

  return (
    <div className="min-h-screen w-full bg-[#f9f8f4]">
      <FeedNavBar />

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Top Section - Search and Filters */}
        <div className="mb-8">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            availability={availability}
            onAvailabilityChange={setAvailability}
            dietary={dietary}
            onDietaryChange={setDietary}
            location={location}
            onLocationChange={setLocation}
            sorting={sorting}
            onSortingChange={setSorting}
          />
        </div>

        {/* Main Section - Organizer Cards List */}
        <div className="space-y-4">
          {filteredOrganizers.map((organizer) => (
            <OrganizerCard
              key={organizer.id}
              organizer={organizer}
              isExpanded={expandedOrganizerId === organizer.id}
              onClick={() => handleCardClick(organizer.id)}
            />
          ))}
        </div>

        {filteredOrganizers.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-xl font-semibold text-emerald-900">
              No organizers found matching your search.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
