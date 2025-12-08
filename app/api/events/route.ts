// app/api/events/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * GET /api/events
 * Returns the current user's events (as organizer).
 */
export async function GET(req: Request) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "Unauthorized", events: [] },
      { status: 401 }
    );
  }

  // Adjust columns to whatever your dashboard uses
  const { data: events, error } = await supabase
    .from("events")
    .select(
      `
      id,
      name,
      organizer_name,
      location,
      location_label,
      address,
      category,
      start_time,
      end_time,
      created_at,
      updated_at
    `
    )
    .eq("organizer_id", user.id)
    .order("start_time", { ascending: true });

  if (error) {
    console.error("GET /api/events error", error);
    return NextResponse.json(
      { error: "Failed to load events", events: [] },
      { status: 500 }
    );
  }

  // If your dashboard expects a plain array instead of {events: [...]},
  // change the line below to: return NextResponse.json(events ?? []);
  return NextResponse.json({ events: events ?? [] });
}

/**
 * POST /api/events
 * Creates a new event + its food items.
 */
export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();
  const body = await req.json();

  console.log("EVENT BODY", body); // temporary debug

  const {
    eventName,
    location,
    locationLabel,
    address,
    category,
    dietaryTags,
    description,
    startTime,
    endTime,
    featuredPhoto,
    foodItems,
    lat,
    lng,
  } = body;

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("authError", authError);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Look up organizer name from vendor_profiles (fallback to email)
  let organizerName: string | null = null;

  const { data: vendorProfile, error: vendorError } = await supabase
    .from("vendor_profiles")
    .select("org_name")
    .eq("id", user.id)
    .maybeSingle();

  if (vendorError) {
    console.warn("vendorError", vendorError);
  }

  if (vendorProfile?.org_name) {
    organizerName = vendorProfile.org_name;
  } else {
    organizerName = user.email ?? null;
  }

  // Validate required fields against the *new* payload
  const missing: string[] = [];

  if (!organizerName) missing.push("organizerName (vendor profile)");
  if (!eventName) missing.push("eventName");
  if (!location) missing.push("location");
  if (!address) missing.push("address");
  if (!category) missing.push("category");
  if (!startTime) missing.push("startTime");
  if (!endTime) missing.push("endTime");

  if (!Array.isArray(foodItems) || foodItems.length === 0) {
    missing.push("foodItems");
  } else {
    for (const [i, f] of (foodItems as any[]).entries()) {
      if (!f.name || f.totalPortions == null || f.perStudentLimit == null) {
        missing.push(`foodItems[${i}]`);
        break;
      }
    }
  }

  if (missing.length > 0) {
    console.warn("Missing fields:", missing);
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  // Insert event
  const { data: event, error: insertEventError } = await supabase
    .from("events")
    .insert({
      name: eventName,
      organizer_name: organizerName,
      organizer_id: user.id,

      location,
      location_label: locationLabel,
      address,
      category,
      availability: "open",          // 👈 NEW: satisfy NOT NULL
      dietary_tags: dietaryTags ?? [],
      description,
      start_time: startTime,
      end_time: endTime,
      featured_photo: featuredPhoto,

      lat,
      lng,
    })
    .select("id")
    .single();


  if (insertEventError || !event) {
    console.error("insertEventError", insertEventError);
    return NextResponse.json(
      { error: "Failed to create event record" },
      { status: 500 }
    );
  }

  // Insert food items
  const rows = (foodItems as any[]).map((f) => ({
    event_id: event.id,
    name: f.name,
    total_portions: f.totalPortions,
    per_student_limit: f.perStudentLimit,
  }));

  const { error: foodsError } = await supabase
    .from("event_foods")
    .insert(rows);

  if (foodsError) {
    console.error("foodsError", foodsError);
    return NextResponse.json(
      { error: "Event created, but failed to save food items" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, eventId: event.id }, { status: 201 });
}
