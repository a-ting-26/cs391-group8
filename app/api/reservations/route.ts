// app/api/reservations/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();
  const body = await req.json();

  const { eventFoodId, quantity = 1 } = body;

  if (!eventFoodId || quantity <= 0) {
    return NextResponse.json(
      { error: "eventFoodId and positive quantity are required" },
      { status: 400 }
    );
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Load food metadata, including event_id
  const { data: food, error: foodError } = await supabase
    .from("event_foods")
    .select("id, event_id, total_portions, per_student_limit")
    .eq("id", eventFoodId)
    .single();

  if (foodError || !food) {
    return NextResponse.json(
      { error: "Food item not found" },
      { status: 404 }
    );
  }

      // After fetching `food` from event_foods
    const { data: ev, error: evError } = await supabase
      .from("events")
      .select("id, end_time")
      .eq("id", food.event_id)
      .single();

    if (evError || !ev) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    const now = new Date();
    if (ev.end_time && new Date(ev.end_time).getTime() <= now.getTime()) {
      return NextResponse.json(
        { error: "This event has already ended" },
        { status: 400 }
      );
    }


  // Total reserved for this food (only in-progress or picked_up consume capacity)
  const { data: existingReservations, error: existingError } =
    await supabase
      .from("reservations")
      .select("id, student_id, quantity, status")
      .eq("event_food_id", eventFoodId)
      .in("status", ["in_progress", "picked_up"]);

  if (existingError) {
    console.error("reservations lookup error", existingError);
    return NextResponse.json(
      { error: "Failed to check availability" },
      { status: 500 }
    );
  }

  let totalReserved = 0;
  let userReservation = existingReservations?.find(
    (r) => r.student_id === user.id && r.status === "in_progress"
  );

  (existingReservations || []).forEach((r) => {
    if (r.status !== "in_progress" && r.status !== "picked_up") return;
    totalReserved += r.quantity;
  });

  // Capacity check
  if (totalReserved + quantity > food.total_portions) {
    return NextResponse.json(
      { error: "Not enough portions left for this item" },
      { status: 400 }
    );
  }

  // Per-student limit: count both in_progress + picked_up
  const userTotalForItem = (existingReservations || [])
    .filter(
      (r) => r.student_id === user.id &&
        (r.status === "in_progress" || r.status === "picked_up")
    )
    .reduce((acc, r) => acc + r.quantity, 0);

  if (userTotalForItem + quantity > food.per_student_limit) {
    return NextResponse.json(
      {
        error: `You can only reserve up to ${food.per_student_limit} portion(s) of this item`,
      },
      { status: 400 }
    );
  }

  if (userReservation) {
    const { error: updateError } = await supabase
      .from("reservations")
      .update({ quantity: userReservation.quantity + quantity })
      .eq("id", userReservation.id);

    if (updateError) {
      console.error("reservation update error", updateError);
      return NextResponse.json(
        { error: "Failed to update reservation" },
        { status: 500 }
      );
    }
  } else {
    const { error: insertError } = await supabase.from("reservations").insert({
      event_id: food.event_id,
      event_food_id: eventFoodId,
      student_id: user.id,
      quantity,
      status: "in_progress",
    });

    if (insertError) {
      console.error("reservation insert error", insertError);
      return NextResponse.json(
        { error: "Failed to create reservation" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ success: true }, { status: 201 });
}

// GET: list *all* reservations for current user (current + past)
export async function GET(req: Request) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: reservations, error: resError } = await supabase
    .from("reservations")
    .select("id, event_id, event_food_id, quantity, status, created_at")
    .eq("student_id", user.id)
    .order("created_at", { ascending: false });

  if (resError) {
    console.error("reservations GET error", resError);
    return NextResponse.json(
      { error: "Failed to load reservations" },
      { status: 500 }
    );
  }

  if (!reservations || reservations.length === 0) {
    return NextResponse.json({ reservations: [] }, { status: 200 });
  }

  const foodIds = [...new Set(reservations.map((r) => r.event_food_id))];

  const { data: foods } = await supabase
    .from("event_foods")
    .select("id, name, event_id")
    .in("id", foodIds);

  const eventIds = [...new Set((foods || []).map((f) => f.event_id))];

  const { data: events } = await supabase
    .from("events")
    .select(
      "id, name, location_label, address, start_time, end_time"
    )
    .in("id", eventIds);

  const foodMap = new Map(
    (foods || []).map((f) => [f.id, f])
  );
  const eventMap = new Map(
    (events || []).map((e) => [e.id, e])
  );

  const result = reservations.map((r) => {
    const food = foodMap.get(r.event_food_id);
    const ev = food ? eventMap.get(food.event_id) : null;

    return {
      id: r.id,
      quantity: r.quantity,
      status: r.status,
      created_at: r.created_at,
      foodName: food?.name ?? "Unknown item",
      eventName: ev?.name ?? "Unknown event",
      locationLabel: ev?.location_label ?? "",
      address: ev?.address ?? "",
      start_time: ev?.start_time ?? null,
      end_time: ev?.end_time ?? null,
    };
  });

  return NextResponse.json({ reservations: result }, { status: 200 });
}
