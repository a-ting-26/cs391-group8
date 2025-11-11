// app/organizer/pending/page.tsx (Server Component)
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";

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
    <main className="min-h-screen w-full bg-[#9FE3B1] flex items-center justify-center px-6">
      <div className="max-w-md w-full rounded-2xl border-[3px] border-emerald-900 bg-white px-8 py-12 text-center shadow-[0_10px_0_0_rgba(16,78,61,0.55)]">
        <h1
          className="text-4xl font-extrabold tracking-tight text-emerald-900 mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          APPLICATION UNDER REVIEW
        </h1>

        <p className="text-gray-700 mb-8 text-sm sm:text-base">
          Thank you for submitting your organization application.
          <br />
          We’ll email you once it’s approved by the SparkBytes! team.
        </p>

        <div className="flex flex-col items-center gap-4">
          <Link
            href="/landing"
            className="rounded-full border-[3px] border-emerald-900 bg-[#FEF3C7] px-10 py-3 text-sm font-black uppercase tracking-wide text-emerald-900 shadow-[0_6px_0_0_rgba(16,78,61,0.5)] transition-all hover:-translate-y-0.5 hover:scale-105 hover:shadow-[0_8px_0_0_rgba(16,78,61,0.6)] hover:bg-[#FDE68A] active:translate-y-0"
          >
            Back to Home
          </Link>

          <p className="text-xs text-gray-500">
            Need help?{" "}
            <a
              href="mailto:support@sparkbytes.app"
              className="text-emerald-800 underline hover:text-emerald-900"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
