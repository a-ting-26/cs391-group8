import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import AdminPendingList from "./AdminPendingList";
import AdminApprovedList from "./AdminApprovedList";

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

  const { data: pendingRaw } = await supabase
    .from("organizer_applications")
    .select("id, org_name, contact_email, website, description, status, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  const pending = pendingRaw ?? [];

  const { data: approvedRaw } = await supabase
    .from("vendor_profiles")
    .select("id, org_name, contact_email, website, is_active, updated_at")
    .eq("is_active", true)
    .order("updated_at", { ascending: false });
  const approved = approvedRaw ?? [];

  return (
    <main className="min-h-screen w-full bg-[#9FE3B1]">
      <div className="mx-auto max-w-5xl px-6 py-14">
        {/* App title */}
        <h1
          className="mb-8 text-center text-5xl font-extrabold tracking-widest text-emerald-900"
          style={{ fontFamily: "var(--font-display)" }}
        >
          SPARKBYTES! <span className="block text-2xl font-black tracking-normal">ADMIN</span>
        </h1>

        {/* Outer card */}
        <div className="rounded-2xl border-[3px] border-emerald-900 bg-white p-6 shadow-[0_10px_0_0_rgba(16,78,61,0.55)]">
          {/* Pending section */}
          <section className="mb-10">
            <h2 className="mb-3 text-2xl font-bold text-emerald-900">Pending Organizers</h2>
            {pending.length === 0 ? (
              <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
                No pending organizer applications.
              </p>
            ) : (
              <AdminPendingList initialItems={pending} />
            )}
          </section>

          {/* Approved section */}
          <section>
            <h2 className="mb-3 text-2xl font-bold text-emerald-900">Approved Organizers</h2>
            <AdminApprovedList initialItems={approved} />
          </section>
        </div>
      </div>
    </main>
  );
}
