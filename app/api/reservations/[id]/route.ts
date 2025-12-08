import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const supabase = await createSupabaseServerClient();

  // 👇 unwrap the params Promise
  const { id } = await context.params;
  const reservationId = id;

  const body = await req.json();
  const { status } = body as { status?: string };

  if (
    !status ||
    !["in_progress", "picked_up", "cancelled", "incomplete"].includes(status)
  ) {
    return NextResponse.json(
      { error: "Invalid or missing status" },
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

  // Load reservation
  const { data: reservation, error: resError } = await supabase
    .from("reservations")
    .select("id, event_id, student_id, status")
    .eq("id", reservationId)
    .single();

  if (resError || !reservation) {
    return NextResponse.json(
      { error: "Reservation not found" },
      { status: 404 }
    );
  }

  const isStudent = reservation.student_id === user.id;

  // --- Student cancel flow ---
  if (status === "cancelled") {
    if (!isStudent) {
      return NextResponse.json(
        { error: "Only the student can cancel this reservation" },
        { status: 403 }
      );
    }
    if (reservation.status !== "in_progress") {
      return NextResponse.json(
        { error: "Only in-progress reservations can be cancelled" },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabase
      .from("reservations")
      .update({ status: "cancelled" })
      .eq("id", reservationId);

    if (updateError) {
      console.error("reservation cancel error", updateError);
      return NextResponse.json(
        { error: "Failed to cancel reservation" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  }

  // --- Organizer-only transitions ---
  if (!reservation.event_id) {
    return NextResponse.json(
      { error: "Event not found" },
      { status: 404 }
    );
  }

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id, organizer_id, end_time")
    .eq("id", reservation.event_id)
    .single();

  if (eventError || !event) {
    return NextResponse.json(
      { error: "Event not found" },
      { status: 404 }
    );
  }

  const isOrganizer = event.organizer_id === user.id;

  if (status === "picked_up" || status === "incomplete") {
    if (!isOrganizer) {
      return NextResponse.json(
        { error: "Only the event organizer can update this status" },
        { status: 403 }
      );
    }
    if (reservation.status !== "in_progress") {
      return NextResponse.json(
        { error: "Only in-progress reservations can be updated" },
        { status: 400 }
      );
    }
  } else if (status === "in_progress") {
    return NextResponse.json(
      { error: "Cannot reset status to in_progress" },
      { status: 400 }
    );
  }

  const { error: updateError } = await supabase
    .from("reservations")
    .update({ status })
    .eq("id", reservationId);

  if (updateError) {
    console.error("reservation status update error", updateError);
    return NextResponse.json(
      { error: "Failed to update reservation status" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
