// app/api/event-foods/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const supabase = await createSupabaseServerClient();
  const url = new URL(req.url);
  const eventId = url.searchParams.get("eventId");

  if (!eventId || eventId === "undefined") {
  return NextResponse.json({ foods: [] }, { status: 200 });
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1) Food items for this event
  const { data: foods, error: foodsError } = await supabase
    .from("event_foods")
    .select("id, name, total_portions, per_student_limit")
    .eq("event_id", eventId);

  if (foodsError) {
    console.error("event_foods error", foodsError);
    return NextResponse.json(
      { error: "Failed to load food items" },
      { status: 500 }
    );
  }

  if (!foods || foods.length === 0) {
    return NextResponse.json({ foods: [] }, { status: 200 });
  }

  const foodIds = foods.map((f) => f.id);

  // 2) Reservations that count toward capacity
  const { data: reservations, error: resError } = await supabase
    .from("reservations")
    .select("event_food_id, quantity, status, student_id")
    .in("event_food_id", foodIds)
    .in("status", ["in_progress", "picked_up"]);

  if (resError) {
    console.error("reservations error", resError);
    return NextResponse.json(
      { error: "Failed to load reservations" },
      { status: 500 }
    );
  }

  const totalByFood = new Map<string, number>();
  const userByFood = new Map<string, number>();

  (reservations || []).forEach((r) => {
    const key = r.event_food_id;
    const currentTotal = totalByFood.get(key) ?? 0;
    totalByFood.set(key, currentTotal + r.quantity);

    if (r.student_id === user.id) {
      const currentUser = userByFood.get(key) ?? 0;
      userByFood.set(key, currentUser + r.quantity);
    }
  });

  const result = foods.map((f) => ({
    id: f.id,
    name: f.name,
    totalPortions: f.total_portions,
    perStudentLimit: f.per_student_limit,
    totalReserved: totalByFood.get(f.id) ?? 0,
    userQuantity: userByFood.get(f.id) ?? 0,
  }));

  return NextResponse.json({ foods: result }, { status: 200 });
}
