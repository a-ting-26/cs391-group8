// app/admin/page.tsx
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import AdminPendingList from "./AdminPendingList";
import AdminApprovedList from "./AdminApprovedList";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/landing");

  const { data: profile } = await supabase
    .from("profiles")
    .select("roles")
    .eq("id", user.id)
    .maybeSingle();

  const isAdmin = Array.isArray(profile?.roles) && profile!.roles.includes("admin");
  if (!isAdmin) redirect("/landing?authError=Admins%20only");

  // Pending applications
  const { data: pendingRaw } = await supabase
    .from("organizer_applications")
    .select("id, org_name, contact_email, website, description, status, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  const pending = pendingRaw ?? [];

  // Approved vendors (active)
  const { data: approvedRaw } = await supabase
    .from("vendor_profiles")
    .select("id, org_name, contact_email, website, is_active, updated_at")
    .eq("is_active", true)
    .order("updated_at", { ascending: false });
  const approved = approvedRaw ?? [];

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 space-y-10">
      <section>
        <h1 className="mb-6 text-3xl font-bold text-emerald-900">Admin — Pending Organizers</h1>
        <AdminPendingList initialItems={pending} />
      </section>

      <section>
        <h2 className="mt-10 mb-4 text-2xl font-bold text-emerald-900">Approved Organizers</h2>
        <AdminApprovedList initialItems={approved} />
      </section>
    </div>
  );
}
