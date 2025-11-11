// app/organizer/pending/page.tsx (Server Component)
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function PendingPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/landing");

  const { data: app } = await supabase
    .from("organizer_applications")
    .select("status")
    .eq("id", user.id)
    .maybeSingle();

  if (!app) redirect("/vendor/onboarding");            // no app yet
  if (app.status === "approved") redirect("/vendor/dashboard");
  if (app.status === "rejected") redirect("/vendor/onboarding?resubmit=1");

  // still pending
  return (
    <div className="mx-auto max-w-xl px-6 py-12">
      <h1 className="text-2xl font-bold text-emerald-900">Application under review</h1>
      <p className="mt-2 text-gray-700">We’ll email you once it’s approved.</p>
    </div>
  );
}
