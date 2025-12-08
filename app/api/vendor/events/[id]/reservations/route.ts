// app/api/vendor/events/[id]/reservations/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const supabase = await createSupabaseServerClient();
  const { id: eventId } = await context.params;

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1) Check that this event exists and belongs to the current vendor
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id, organizer_id")
    .eq("id", eventId)
    .single();

  if (eventError || !event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  if (event.organizer_id !== user.id) {
    return NextResponse.json(
      { error: "You are not the organizer for this event" },
      { status: 403 }
    );
  }

  // 2) Fetch foods for this event
  const { data: foods, error: foodsError } = await supabase
    .from("event_foods")
    .select("id, name, total_portions, per_student_limit")
    .eq("event_id", eventId);

  if (foodsError) {
    console.error("vendor event foods error", foodsError);
    return NextResponse.json(
      { error: "Failed to load food items" },
      { status: 500 }
    );
  }

  if (!foods || foods.length === 0) {
    return NextResponse.json({ foods: [] }, { status: 200 });
  }

  const foodIds = foods.map((f) => f.id);

  // 3) Fetch reservations for these foods (all statuses)
  const { data: reservations, error: resError } = await supabase
    .from("reservations")
    .select("id, event_food_id, student_id, quantity, status, created_at")
    .in("event_food_id", foodIds);

  if (resError) {
    console.error("vendor reservations error", resError);
    return NextResponse.json(
      { error: "Failed to load reservations" },
      { status: 500 }
    );
  }

  // 4) Fetch student profiles for display
  const studentIds = Array.from(
    new Set((reservations || []).map((r) => r.student_id))
  );

  let profileMap = new Map<string, { display_name?: string | null; email?: string | null }>();

  if (studentIds.length > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, display_name, email")
      .in("id", studentIds);

    if (profilesError) {
      console.error("vendor profiles error", profilesError);
    } else if (profiles) {
      profileMap = new Map(
        profiles.map((p) => [
          p.id,
          { display_name: p.display_name, email: p.email },
        ])
      );
    }
  }

  // 5) Aggregate per-food reservations
  const reservationsByFood = new Map<
    string,
    {
      id: string;
      studentId: string;
      studentName: string;
      studentEmail: string;
      quantity: number;
      status: string;
      created_at: string;
    }[]
  >();

  const totalsByFood = new Map<string, number>();

  (reservations || []).forEach((r) => {
    const list = reservationsByFood.get(r.event_food_id) ?? [];
    const profile = profileMap.get(r.student_id);

    const name =
      (profile?.display_name ?? "").trim() ||
      (profile?.email ?? "") ||
      r.student_id.slice(0, 8);

    list.push({
      id: r.id,
      studentId: r.student_id,
      studentName: name,
      studentEmail: profile?.email ?? "",
      quantity: r.quantity,
      status: r.status,
      created_at: r.created_at,
    });

    reservationsByFood.set(r.event_food_id, list);

    // For totals, count in_progress + picked_up
    if (r.status === "in_progress" || r.status === "picked_up") {
      const current = totalsByFood.get(r.event_food_id) ?? 0;
      totalsByFood.set(r.event_food_id, current + r.quantity);
    }
  });

  const result = foods.map((f) => ({
    id: f.id,
    name: f.name,
    totalPortions: f.total_portions,
    perStudentLimit: f.per_student_limit,
    totalReserved: totalsByFood.get(f.id) ?? 0,
    reservations: reservationsByFood.get(f.id) ?? [],
  }));

  return NextResponse.json({ foods: result }, { status: 200 });
}
