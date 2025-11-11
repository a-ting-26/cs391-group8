import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-only
);

export async function POST(req: Request) {
  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ ok: false, error: "Missing userId" }, { status: 400 });

  // Mark as rejected + deactivate vendor (helper function from your SQL)
  const { error } = await supabaseAdmin.rpc("revoke_organizer", { p_user_id: userId });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
