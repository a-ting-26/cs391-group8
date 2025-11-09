// app/api/events/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (key) => cookieStore.get(key)?.value,
          set: (key, value, options) => cookieStore.set({ name: key, value, ...options }),
          remove: (key, options) => cookieStore.set({ name: key, value: "", ...options }),
        },
      }
    );

    // Get authenticated user (optional - if not authenticated, return all events for Feed page)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // If user is authenticated, check if they're a vendor (for vendor page to show only their events)
    const url = new URL(request.url);
    const vendorOnly = url.searchParams.get("vendorOnly") === "true";

    let query = supabase.from("events").select("*");

    // If vendorOnly is true and user is authenticated, filter by organizer_id
    if (vendorOnly && user) {
      query = query.eq("organizer_id", user.id);
    }

    // Order by start_time (newest first)
    query = query.order("start_time", { ascending: false });

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ events: data || [] });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (key) => cookieStore.get(key)?.value,
          set: (key, value, options) => cookieStore.set({ name: key, value, ...options }),
          remove: (key, options) => cookieStore.set({ name: key, value: "", ...options }),
        },
      }
    );

    // Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("Auth error:", userError);
      return NextResponse.json({ error: `Authentication error: ${userError.message}` }, { status: 401 });
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Please log in to create events" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const {
      organizerName,
      location,
      locationLabel,
      availableFood,
      category,
      dietaryTags,
      description,
      startTime,
      endTime,
      featuredPhoto,
    } = body;

    // Validate required fields
    if (!organizerName || !location || !locationLabel || !availableFood || !category || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate availability status based on current time
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    let availability = "available-soon";
    
    if (now >= start && now <= end) {
      availability = "available-now";
    } else if (now > end) {
      availability = "ending-soon";
    }

    // Insert event into database
    const { data, error } = await supabase
      .from("events")
      .insert({
        organizer_name: organizerName,
        location: location,
        location_label: locationLabel,
        available_food: availableFood,
        category: category,
        dietary_tags: dietaryTags || [],
        description: description || null,
        featured_photo: featuredPhoto || null,
        start_time: startTime,
        end_time: endTime,
        organizer_id: user.id,
        availability: availability,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ event: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
