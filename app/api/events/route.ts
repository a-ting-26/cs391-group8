// app/api/events/route.ts
import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    // match your working cookies pattern
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: "", ...options });
          },
        },
      }
    );

    // optional: read session (ok if unauthenticated)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // vendorOnly filter (if authenticated)
    const url = new URL(request.url);
    const vendorOnly = url.searchParams.get("vendorOnly") === "true";

    let query = supabase.from("events").select("*");

    if (vendorOnly && user) {
      query = query.eq("organizer_id", user.id);
    }

    // newest first
    query = query.order("start_time", { ascending: false });

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // derive availability client-side each request
    const now = new Date();
    const eventsWithUpdatedAvailability = (data ?? []).map((event: any) => {
      const start = new Date(event.start_time);
      const end = new Date(event.end_time);

      let availability: "available-soon" | "available-now" | "ending-soon" = "available-soon";
      if (now >= start && now <= end) availability = "available-now";
      else if (now > end) availability = "ending-soon";

      return { ...event, availability };
    });

    return NextResponse.json({ events: eventsWithUpdatedAvailability });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? "Internal server error" },
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
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: "", ...options });
          },
        },
      }
    );

    // must be authenticated to create events
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      return NextResponse.json(
        { error: `Authentication error: ${userError.message}` },
        { status: 401 }
      );
    }
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: Please log in to create events" },
        { status: 401 }
      );
    }

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

    // required fields
    if (
      !organizerName ||
      !location ||
      !locationLabel ||
      !availableFood ||
      !category ||
      !startTime ||
      !endTime
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // compute availability at insert time
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    let availability: "available-soon" | "available-now" | "ending-soon" = "available-soon";
    if (now >= start && now <= end) availability = "available-now";
    else if (now > end) availability = "ending-soon";

    const { data, error } = await supabase
      .from("events")
      .insert({
        organizer_name: organizerName,
        location,
        location_label: locationLabel,
        available_food: availableFood,
        category,
        dietary_tags: dietaryTags || [], // expects a text[] column
        description: description || null,
        featured_photo: featuredPhoto || null,
        start_time: startTime,
        end_time: endTime,
        organizer_id: user.id,
        availability,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ event: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
