"use client";
import { supabaseBrowser } from "@/lib/supabase/client";

/**
 * Ensures a row exists in public.student_profiles for this user.
 */
export async function upsertStudentProfile() {
  const supabase = supabaseBrowser();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) throw new Error("Not signed in");

  const { error } = await supabase
    .from("student_profiles")
    .upsert({ id: user.id }, { onConflict: "id" });

  if (error) throw error;
}
