// app/admin/page.tsx
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import AdminPendingList from "./AdminPendingList";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/public");

  const { data: profile } = await supabase
    .from("profiles")
    .select("roles")
    .eq("id", user.id)
    .maybeSingle();

  const isAdmin = Array.isArray(profile?.roles) && profile!.roles.includes("admin");
  if (!isAdmin) redirect("/public?authError=Admins%20only");

  const { data: pending, error: appErr } = await supabase
    .from("organizer_applications")
    .select("id, org_name, contact_email, website, description, status, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  const items = (pending ?? []) as {
    id: string;
    org_name: string;
    contact_email: string;
    website: string | null;
    description: string;
    status: "pending" | "approved" | "rejected";
    created_at: string;
  }[];

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-bold text-emerald-900">Admin — Pending Organizers</h1>
      <AdminPendingList initialItems={items} />
    </div>
  );
}
