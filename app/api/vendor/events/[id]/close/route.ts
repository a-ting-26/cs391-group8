// app/api/vendor/events/[id]/close/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function PATCH(
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

  // Make sure this event exists and belongs to this vendor
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id, organizer_id, end_time")
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

  // If it's already ended, nothing to do
  const now = new Date();
  const end = event.end_time ? new Date(event.end_time) : null;
  if (end && end.getTime() <= now.getTime()) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  // Close event early by setting end_time to now
  const { error: updateError } = await supabase
    .from("events")
    .update({ end_time: now.toISOString() })
    .eq("id", eventId);

  if (updateError) {
    console.error("close event error", updateError);
    return NextResponse.json(
      { error: "Failed to close event" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
