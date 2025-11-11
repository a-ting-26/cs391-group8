"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import VendorNavBar from "./components/VendorNavBar";
import OrganizerCard from "../student/components/OrganizerCard";

interface Event {
  id: string;
  organizer_name: string;
  location: string;
  location_label: string;
  available_food: string;
  category: string;
  dietary_tags: string[];
  description?: string;
  featured_photo?: string;
  start_time: string;
  end_time: string;
  availability: string;
  created_at: string;
}

interface Organizer {
  id: number | string;
  name: string;
  location: string;
  locationLabel: string;
  availableFood: string;
  timeLeft: string;
  category: string;
  dietaryTags: string[];
  featuredPhoto?: string;
  description?: string;
}

// Calculate time left from end_time
const calculateTimeLeft = (endTime: string): string => {
  const now = new Date();
  const end = new Date(endTime);
  const diffMs = end.getTime() - now.getTime();
  
  if (diffMs < 0) {
    return "Ended";
  }
  
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
  } else {
    return `${diffMins} minute${diffMins > 1 ? 's' : ''}`;
  }
};

// Convert API event to Organizer format
const eventToOrganizer = (event: Event): Organizer => {
  return {
    id: event.id,
    name: event.organizer_name,
    location: event.location,
    locationLabel: event.location_label,
    availableFood: event.available_food,
    timeLeft: calculateTimeLeft(event.end_time),
    category: event.category,
    dietaryTags: event.dietary_tags || [],
    featuredPhoto: event.featured_photo || undefined,
    description: event.description || undefined,
  };
};

export default function VendorPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedEventId, setExpandedEventId] = useState<string | number | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      // Fetch only events for the current vendor
      const response = await fetch("/api/events?vendorOnly=true", {
        credentials: "include", // Include cookies for authentication
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch events");
      }
      
      setEvents(data.events || []);
    } catch (err: any) {
      setError(err.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // Refresh events every 30 seconds to update time left
    const interval = setInterval(() => {
      fetchEvents();
    }, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCardClick = (eventId: string | number) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
  };

  // Filter events: current (end_time in future) and past (end_time in past)
  const now = new Date();
  const currentEvents = events.filter((event) => new Date(event.end_time) >= now);
  const pastEvents = events.filter((event) => new Date(event.end_time) < now);

  // Convert to Organizer format
  const currentOrganizers = currentEvents.map(eventToOrganizer);
  const pastOrganizers = pastEvents.map(eventToOrganizer);

  return (
    <div className="min-h-screen w-full bg-[#f9f8f4]">
      <VendorNavBar />
      
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Header with Add Event Button */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1
              className="text-4xl font-black uppercase tracking-wide text-emerald-900 mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              My Events
            </h1>
            <p className="text-emerald-800">Manage your events and view past postings</p>
          </div>
          <Link
            href="/vendor/create"
            className="rounded-full border-[3px] border-emerald-900 bg-[#BBF7D0] px-8 py-4 text-lg font-black uppercase tracking-wider text-emerald-900 shadow-[0_5px_0_0_rgba(16,78,61,0.4)] transition-all hover:-translate-y-1 hover:shadow-[0_7px_0_0_rgba(16,78,61,0.5)] hover:bg-[#86EFAC] active:translate-y-0"
          >
            + Add Event
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-16 text-center">
            <p className="text-xl font-semibold text-emerald-900">Loading events...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-[20px] border-[2px] border-red-500 bg-red-50 p-4 mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Current Events Section */}
        {!loading && (
          <>
            <div className="mb-12">
              <h2
                className="text-2xl font-black uppercase tracking-wide text-emerald-900 mb-6"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Current Events
              </h2>
              {currentOrganizers.length > 0 ? (
                <div className="space-y-4">
                  {currentOrganizers.map((organizer) => (
                    <OrganizerCard
                      key={organizer.id}
                      organizer={organizer}
                      isExpanded={expandedEventId === organizer.id}
                      onClick={() => handleCardClick(organizer.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-[30px] border-[3px] border-emerald-900 bg-white p-8 shadow-[0_5px_0_0_rgba(16,78,61,0.3)] text-center">
                  <p className="text-lg font-semibold text-emerald-800">
                    No current events. Create your first event!
                  </p>
                </div>
              )}
            </div>

            {/* Past Events Section */}
            <div className="mb-12">
              <h2
                className="text-2xl font-black uppercase tracking-wide text-emerald-900 mb-6"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Past Events
              </h2>
              {pastOrganizers.length > 0 ? (
                <div className="space-y-4">
                  {pastOrganizers.map((organizer) => (
                    <OrganizerCard
                      key={organizer.id}
                      organizer={organizer}
                      isExpanded={expandedEventId === organizer.id}
                      onClick={() => handleCardClick(organizer.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-[30px] border-[3px] border-emerald-900 bg-white p-8 shadow-[0_5px_0_0_rgba(16,78,61,0.3)] text-center">
                  <p className="text-lg font-semibold text-emerald-800">
                    No past events yet.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
