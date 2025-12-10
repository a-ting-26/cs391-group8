"use client";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

import React, { useState, useEffect, useRef } from "react";
import StudentNavBar from "./components/StudentNavBar";
import SearchBar from "./components/SearchBar";
import OrganizerCard from "./components/OrganizerCard";
import { upsertStudentProfile } from "@/lib/actions/upsertStudentProfile";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import { geocodeLocation } from "@/lib/mapbox/geocoding";

import FilterChips from "./components/FilterChips";

interface Event {
  id: string;
  organizer_name: string;
  location: string;
  location_label: string;
  available_food?: string | null; // 👈 was string
  category: string;
  dietary_tags: string[];
  description?: string;
  featured_photo?: string;
  start_time: string;
  end_time: string;
  availability: string;
  created_at: string;
  address?: string | null;
  lat?: number | null;
  lng?: number | null;
  name: string;
}

interface Organizer {
  id: string | number;
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
    return `${diffHours} hour${diffHours === 1 ? "" : "s"}`;
  } else if (diffMins > 0) {
    return `${diffMins} min${diffMins === 1 ? "" : "s"}`;
  } else {
    return "Less than 1 min";
  }
};

// Convert Event API response to OrganizerCardProps format
const eventToOrganizer = (event: Event): Organizer => {
  return {
    id: event.id,
    name: event.name,
    location: event.location,
    locationLabel: event.location_label,
    availableFood:
      event.available_food || "See available items in the event details",
    timeLeft: calculateTimeLeft(event.end_time),
    category: event.category,
    dietaryTags: event.dietary_tags || [],
    featuredPhoto: event.featured_photo,
    description: event.description,
  };
};

export default function StudentPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [availability, setAvailability] = useState("");
  const [dietary, setDietary] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [sorting, setSorting] = useState("");
  const [expandedOrganizerId, setExpandedOrganizerId] = useState<string | number | null>(null);
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const supabase = supabaseBrowser();

      // Ensure Auth metadata has roles: ['student'] (or includes 'student')
      const ensureStudentRole = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const currentRoles: string[] = Array.isArray(user.user_metadata?.roles)
          ? (user.user_metadata.roles as string[])
          : [];

        if (!currentRoles.includes("student")) {
          await supabase.auth.updateUser({ data: { roles: [...currentRoles, "student"] } }).catch(() => {});
        }
      };

      // 1) If a session already exists, skip PKCE exchange
      const firstCheck = await supabase.auth.getUser();
      const existingUser = firstCheck.data.user;

      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state");

      if (existingUser) {
        // Clean stale OAuth params (avoid re-runs on refresh)
        if (code || state) {
          url.searchParams.delete("code");
          url.searchParams.delete("state");
          window.history.replaceState({}, "", url.toString());
        }

        // BU domain guard
        if (!existingUser.email?.toLowerCase().endsWith("@bu.edu")) {
          await supabase.auth.signOut();
          router.replace("/landing?authError=Please%20use%20a%20%40bu.edu%20account");
          return;
        }

        // Ensure role + student_profiles row
        await ensureStudentRole();
        try { await upsertStudentProfile(); } catch (e) { console.warn("student upsert failed:", e); }

        setEmail(existingUser.email ?? null);
        setReady(true);
        return;
      }

      // 2) No session yet → only attempt PKCE exchange if `code` is present
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          // Try reading the user anyway (Supabase hosted callback might have set cookies)
          const retry = await supabase.auth.getUser();
          if (!retry.data.user) {
            router.replace(`/landing?authError=${encodeURIComponent(error.message)}`);
            return;
          }
        }
        // Clean URL after exchange so refreshes don’t re-run it
        url.searchParams.delete("code");
        url.searchParams.delete("state");
        window.history.replaceState({}, "", url.toString());
      }

      // 3) Final session check
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/landing");
        return;
      }
      if (!user.email?.toLowerCase().endsWith("@bu.edu")) {
        await supabase.auth.signOut();
        router.replace("/landing?authError=Please%20use%20a%20%40bu.edu%20account");
        return;
      }

      // Ensure role + student_profiles row
      await ensureStudentRole();
      try { await upsertStudentProfile(); } catch (e) { console.warn("student upsert failed:", e); }

      setEmail(user.email ?? null);
      setReady(true);
    })();
  }, [router]);

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/events", {
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch events");
      }

      const rawEvents: Event[] = data.events || [];

      // Only geocode when lat/lng are missing
      const enrichedEvents: Event[] = await Promise.all(
        rawEvents.map(async (event) => {
          // If API already gave us coordinates, use them directly
          if (event.lat != null && event.lng != null) {
            return event;
          }

          // Prefer address, then location_label, then location
          const query =
            event.address ||
            event.location_label ||
            event.location;

          if (!query) {
            return { ...event, lat: null, lng: null };
          }

          try {
            const coords = await geocodeLocation(query);
            return {
              ...event,
              lat: coords?.lat ?? null,
              lng: coords?.lng ?? null,
            };
          } catch (geoErr) {
            console.warn("Geocoding failed for", query, geoErr);
            return { ...event, lat: null, lng: null };
          }
        })
      );

      setEvents((prev) => {
        const prevStr = JSON.stringify(prev);
        const nextStr = JSON.stringify(enrichedEvents);
        return prevStr === nextStr ? prev : enrichedEvents;
      });
    } catch (err: any) {
      setError(err.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(); // initial load

    const onFocus = () => {
      fetchEvents();
    };

    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);


  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleCardClick = (organizerId: string | number) => {
    setExpandedOrganizerId(expandedOrganizerId === organizerId ? null : organizerId);
  };

  // Filter events: only show current events (end_time in future)
  const now = new Date();
  const currentEvents = events.filter((event) => new Date(event.end_time) >= now);

  // Convert to Organizer format
  const organizers = currentEvents.map(eventToOrganizer);

  // Filter organizers based on search and filters
  let filteredOrganizers = organizers.filter((organizer) => {
    const matchesSearch =
      searchQuery === "" ||
      organizer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      organizer.availableFood.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDietary =
      dietary.length === 0 ||
      dietary.some((diet) =>
        organizer.dietaryTags.some((tag) => {
          // Normalize both filter and tag for comparison
          const normalizedFilter = diet.toLowerCase().replace(/\s+/g, "-");
          const normalizedTag = tag.toLowerCase().replace(/\s+/g, "-");
          return normalizedTag === normalizedFilter || normalizedTag.includes(normalizedFilter);
        })
      );
    // After you compute filteredOrganizers, also compute filteredEvents
  const filteredEvents = currentEvents.filter((event) => {
  const matchesSearch =
  searchQuery === "" ||
  event.organizer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  (event.available_food ?? "")
    .toLowerCase()
    .includes(searchQuery.toLowerCase());

  const matchesDietary =
    dietary.length === 0 ||
    dietary.some((diet) =>
      (event.dietary_tags || []).some((tag) => {
        const normalizedFilter = diet.toLowerCase().replace(/\s+/g, "-");
        const normalizedTag = tag.toLowerCase().replace(/\s+/g, "-");
        return normalizedTag === normalizedFilter || normalizedTag.includes(normalizedFilter);
      })
    );

  const matchesAvailability =
    availability === "" || event.availability === availability;

  const matchesLocation =
    location === "" || event.location === location;

  return matchesSearch && matchesDietary && matchesAvailability && matchesLocation;
});

    // Map availability filter to event availability
    const event = currentEvents.find((e) => e.id === organizer.id);
    const matchesAvailability = 
      availability === "" || 
      (event && event.availability === availability);

    const matchesLocation = location === "" || organizer.location === location;

    return matchesSearch && matchesDietary && matchesAvailability && matchesLocation;
  });

  // Sort organizers
  if (sorting !== "") {
    filteredOrganizers = [...filteredOrganizers].sort((a, b) => {
      const eventA = currentEvents.find((e) => e.id === a.id);
      const eventB = currentEvents.find((e) => e.id === b.id);
      
      if (!eventA || !eventB) return 0;

      switch (sorting) {
        case "newest":
          // Sort by created_at (newest first)
          return new Date(eventB.created_at).getTime() - new Date(eventA.created_at).getTime();
        case "ending-soon":
          // Sort by end_time (ending soon first)
          return new Date(eventA.end_time).getTime() - new Date(eventB.end_time).getTime();
        case "available-soon":
          // Sort by start_time (available soon first)
          return new Date(eventA.start_time).getTime() - new Date(eventB.start_time).getTime();
        default:
          return 0;
      }
    });
  }

// ✅ Add this block here
const filteredEvents = currentEvents.filter((event) => {
  const matchesSearch =
    searchQuery === "" ||
    event.organizer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (event.available_food ?? "")
    .toLowerCase()
    .includes(searchQuery.toLowerCase());

  const matchesDietary =
    dietary.length === 0 ||
    dietary.some((diet) =>
      (event.dietary_tags || []).some((tag) => {
        const normalizedFilter = diet.toLowerCase().replace(/\s+/g, "-");
        const normalizedTag = tag.toLowerCase().replace(/\s+/g, "-");
        return normalizedTag === normalizedFilter || normalizedTag.includes(normalizedFilter);
      })
    );

  const matchesAvailability =
    availability === "" || event.availability === availability;

  const matchesLocation =
    location === "" || event.location === location;

  return matchesSearch && matchesDietary && matchesAvailability && matchesLocation;
});

  return (
    <div className="min-h-screen w-full bg-[#f9f8f4]">
      <StudentNavBar />
      
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

        {/* Main Section - Organizer Cards List */}
        {!loading && (
          <>
            {filteredOrganizers.length > 0 ? (
              <div className="space-y-4">
                {filteredOrganizers.map((organizer) => {
                  const eventForOrganizer = currentEvents.find(
                    (e) => e.id === organizer.id
                  );

                  return (
                    <OrganizerCard
                      key={organizer.id}
                      organizer={organizer}
                      isExpanded={expandedOrganizerId === organizer.id}
                      onClick={() => handleCardClick(organizer.id)}
                      eventId={String(organizer.id)}
                      endTime={eventForOrganizer?.end_time}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center">
                <div className="rounded-[30px] border-[3px] border-emerald-900 bg-white p-8 shadow-[0_5px_0_0_rgba(16,78,61,0.3)]">
                  <p className="text-xl font-semibold text-emerald-900">
                    {events.length === 0
                      ? "No events available. Check back later!"
                      : "No events found matching your search."}
                  </p>
                </div>
              </div>
            )}

            {/* Map Section */}
            <div className="mt-12">
            <StudentMap events={filteredEvents} />

            </div>

          </>
        )}
      </main>
    </div>
  );
}

export function StudentMap({ events }: { events: Event[] }) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // initialize map once
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      console.error("Mapbox token not found");
      return;
    }

    mapboxgl.accessToken = token;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/standard", // Mapbox Standard - 3D with dynamic lighting
        center: [-71.1054, 42.3505], // BU campus default
        zoom: 16, // Slightly more zoomed in to show 3D buildings clearly
        pitch: 45, // Higher pitch for more dramatic 3D effect (0-60 degrees)
        bearing: 0, // Rotate map to the right (negative = clockwise/right)
        antialias: true, // Better rendering quality
      });

      // Mapbox Standard includes 3D buildings and dynamic lighting
      map.current.on("load", () => {
        if (!map.current) return;
        
        setMapLoaded(true);
        map.current.resize();

        try {
          // Ensure we're at a zoom level where 3D buildings are visible
          // Mapbox Standard shows 3D buildings at zoom 15+, so ensure we're there
          if (map.current.getZoom() < 15) {
            map.current.zoomTo(15, { duration: 0 }); // Instant zoom to ensure 3D visibility
          }

          // Mapbox Standard style has 3D buildings built-in
          // Now enable dynamic lighting with different presets
          
          // Set dynamic lighting preset (options: 'dawn', 'day', 'dusk', 'night')
          // You can change this based on time of day or user preference
          const hour = new Date().getHours();
          let lightPreset: "dawn" | "day" | "dusk" | "night" = "day";
          
          if (hour >= 5 && hour < 8) {
            lightPreset = "dawn";
          } else if (hour >= 8 && hour < 18) {
            lightPreset = "day";
          } else if (hour >= 18 && hour < 21) {
            lightPreset = "dusk";
          } else {
            lightPreset = "night";
          }
          
          // Apply dynamic lighting preset
          map.current.setConfigProperty("basemap", "lightPreset", lightPreset);
          
          // Enable shadows for 3D buildings
          try {
            map.current.setConfigProperty("basemap", "showShadows", true);
          } catch (e) {
            console.log("Could not enable shadows:", e);
          }
          
          // Disable landmarks to reduce clutter
          try {
            map.current.setConfigProperty("basemap", "showPlaceLabels", false);
            map.current.setConfigProperty("basemap", "showPointOfInterestLabels", false);
            map.current.setConfigProperty("basemap", "showTransitLabels", false);
          } catch (e) {
            console.log("Could not disable landmarks:", e);
          }
          
          // Also try to hide landmark layers directly
          try {
            const layers = map.current.getStyle().layers;
            for (const layer of layers) {
              // Hide layers that might contain landmarks or POI labels
              if (layer.type === "symbol" && 
                  (layer.id.includes("poi") || 
                   layer.id.includes("landmark") || 
                   layer.id.includes("place") ||
                   (layer.layout && layer.layout["text-field"] && 
                    (layer.id.includes("label") || layer.id.includes("name"))))) {
                try {
                  map.current.setLayoutProperty(layer.id, "visibility", "none");
                } catch (e) {
                  // Some layers might not support visibility property
                }
              }
            }
          } catch (e) {
            console.log("Could not hide landmark layers:", e);
          }
          
          // Optional: Add 3D terrain for enhanced elevation (if available)
          if (map.current.getSource("mapbox-dem")) {
            map.current.setTerrain({ source: "mapbox-dem", exaggeration: 1.2 });
          }
          
          console.log(`Map loaded with ${lightPreset} lighting preset at zoom ${map.current.getZoom()}`);
        } catch (e) {
          console.log("Dynamic lighting setup:", e);
        }
      });

      map.current.on("error", (e) => {
        console.error("Mapbox error:", e);
      });
    } catch (err) {
      console.error("Failed to initialize map:", err);
    }
  }, []);

  // add markers + recenter whenever events change AND map is loaded
  useEffect(() => {
    if (!map.current || !mapLoaded) {
      console.log("Map not ready:", { hasMap: !!map.current, mapLoaded });
      return;
    }

    // Remove any existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    const now = new Date();
    const activeEvents = events.filter(
      (e) => new Date(e.end_time) > now && e.lat != null && e.lng != null
    );

    console.log("Adding markers:", {
      totalEvents: events.length,
      activeEvents: activeEvents.length,
      eventsWithCoords: events.filter(e => e.lat != null && e.lng != null).length,
    });

    if (activeEvents.length === 0) {
      console.log("No active events with coordinates to display");
      return;
    }

    const bounds = new mapboxgl.LngLatBounds();

    activeEvents.forEach((event) => {
      if (event.lat == null || event.lng == null) return;

      try {
        // Create custom green marker to match app theme
        const el = document.createElement("div");
        el.style.width = "32px";
        el.style.height = "32px";
        el.style.borderRadius = "50%";
        el.style.backgroundColor = "#8EDFA4"; // App's green color
        el.style.border = "3px solid #065F46"; // emerald-900 border
        el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
        el.style.cursor = "pointer";
        el.style.position = "relative";
        
        // Add inner white dot
        const innerDot = document.createElement("div");
        innerDot.style.width = "10px";
        innerDot.style.height = "10px";
        innerDot.style.borderRadius = "50%";
        innerDot.style.backgroundColor = "#FFFFFF";
        innerDot.style.position = "absolute";
        innerDot.style.top = "50%";
        innerDot.style.left = "50%";
        innerDot.style.transform = "translate(-50%, -50%)";
        el.appendChild(innerDot);

        const popup = new mapboxgl.Popup({ 
          offset: 25,
          className: "custom-popup",
          maxWidth: "300px",
          closeButton: true,
          closeOnClick: false
        }).setHTML(`
          <div style="
            padding: 12px; 
            font-family: system-ui, -apple-system, sans-serif;
          ">
            <strong style="
              font-size: 18px; 
              color: #065F46; 
              display: block; 
              margin-bottom: 8px; 
              line-height: 1.3;
              font-weight: 900;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            ">
              ${event.name}
            </strong>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <span style="
                color: #065F46; 
                font-size: 14px; 
                display: flex; 
                align-items: center; 
                gap: 6px;
                font-weight: 600;
              ">
                <span style="font-size: 16px;">📍</span>
                <span>${event.location_label || event.location}</span>
              </span>
              <span style="
                color: #065F46; 
                font-size: 14px; 
                display: flex; 
                align-items: center; 
                gap: 6px;
                font-weight: 600;
              ">
                <span style="font-size: 16px;">⏰</span>
                <span>${calculateTimeLeft(event.end_time)}</span>
              </span>
            </div>
          </div>
        `);

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([event.lng, event.lat])
          .setPopup(popup)
          .addTo(map.current!);

        // Style the popup after it's added to the map
        popup.on('open', () => {
          const popupElement = popup.getElement();
          if (popupElement) {
            popupElement.style.padding = '0';
            
            // Remove default Mapbox popup tip/arrow if it exists
            const tip = popupElement.querySelector('.mapboxgl-popup-tip');
            if (tip) {
              (tip as HTMLElement).style.display = 'none';
            }
          }
        });

        markers.current.push(marker);
        bounds.extend([event.lng, event.lat]);
        console.log("Added marker for:", event.name, "at", [event.lng, event.lat]);
      } catch (err) {
        console.error("Failed to add marker for event:", event.id, err);
      }
    });

    // Single event: center on it but maintain zoom for 3D
    if (activeEvents.length === 1) {
      const e = activeEvents[0];
      if (e.lat != null && e.lng != null) {
        map.current.setCenter([e.lng, e.lat]);
        // Keep zoom at 15 to maintain 3D building visibility (not too zoomed in)
        if (map.current.getZoom() < 15) {
          map.current.setZoom(15);
        }
      }
      return;
    }

    // Multiple events: fit all pins but ensure minimum zoom for 3D
    if (activeEvents.length > 1) {
      map.current.fitBounds(bounds, {
        padding: 50,
        minZoom: 15, // Minimum zoom to ensure 3D buildings are visible
        maxZoom: 18, // Don't zoom in too much
        duration: 0, // no animation, just jump
      });
    }
  }, [events, mapLoaded]);

  return (
    <div className="w-full rounded-[30px] border-[3px] border-emerald-900 bg-white shadow-[0_5px_0_0_rgba(16,78,61,0.3)] overflow-hidden">
      <div
        ref={mapContainer}
        className="relative w-full"
        style={{ height: "500px" }}
      />
    </div>
  );
}


