// app/vendor/dashboard/page.tsx
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function OrganizerDashboardPage() {
  // ⬅️ Await the async helper
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/landing");

  // BU guard (defense-in-depth)
  if (!user.email?.toLowerCase().endsWith("@bu.edu")) {
    redirect("/landing?authError=Please%20use%20your%20%40bu.edu%20account");
  }

  // Ensure organizer is approved before showing dashboard
  const { data: app, error: appErr } = await supabase
    .from("organizer_applications")
    .select("status, org_name")
    .eq("id", user.id)
    .maybeSingle();

  if (appErr || !app) redirect("/organizer/onboarding");
  if (app.status !== "approved") redirect("/organizer/pending");

  // (Optional) load vendor profile
  const { data: vendor } = await supabase
    .from("vendor_profiles")
    .select("org_name, description, website, contact_email, is_active")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-4 text-3xl font-bold text-emerald-900">
        Organizer Dashboard — {vendor?.org_name ?? app.org_name}
      </h1>
      <p className="text-gray-700">
        Welcome! Your organizer account is approved.
      </p>
      {/* TODO: dashboard content */}
    </div>
  );
}
