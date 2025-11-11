// app/organizer/onboarding/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

type FormState = {
  org_name: string;
  description: string;
  website: string;
  contact_email: string;
};

export default function OrganizerOnboardingPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    org_name: "",
    description: "",
    website: "",
    contact_email: "",
  });

  useEffect(() => {
    (async () => {
      const supabase = supabaseBrowser();

      // If already signed-in, skip PKCE; else only exchange when `?code=` exists
      const firstCheck = await supabase.auth.getUser();
      let user = firstCheck.data.user;

      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state");

      if (!user && code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          router.replace(`/public?authError=${encodeURIComponent(error.message)}`);
          return;
        }
        // Clean URL so refreshes don’t re-run the exchange
        url.searchParams.delete("code");
        url.searchParams.delete("state");
        window.history.replaceState({}, "", url.toString());
        const afterExchange = await supabase.auth.getUser();
        user = afterExchange.data.user;
      }

      // No session → back to landing
      if (!user) {
        router.replace("/public");
        return;
      }

      // BU domain guard
      if (!user.email?.toLowerCase().endsWith("@bu.edu")) {
        await supabase.auth.signOut();
        router.replace("/public?authError=Please%20use%20your%20%40bu.edu%20account");
        return;
      }

      // Ensure roles array in user metadata contains "organizer"
      const currentRoles: string[] = Array.isArray(user.user_metadata?.roles)
        ? (user.user_metadata.roles as string[])
        : [];
      if (!currentRoles.includes("organizer")) {
        await supabase.auth
          .updateUser({ data: { roles: [...currentRoles, "organizer"] } })
          .catch(() => {});
      }

      setEmail(user.email ?? null);
      setForm((f) => ({ ...f, contact_email: user?.email ?? "" }));

      // If an application already exists, route accordingly or prefill
      const { data: existing, error: qErr } = await supabase
        .from("organizer_applications")
        .select("status, org_name, description, website, contact_email")
        .eq("id", user.id)
        .maybeSingle();

      if (!qErr && existing) {
        if (existing.status === "approved") {
          router.replace("/vendor/dashboard");
          return;
        }
        if (existing.status === "pending") {
          router.replace("/vendor/pending");
          return;
        }
        // status could be 'rejected' or you may allow editing → prefill fields
        setForm({
          org_name: existing.org_name ?? "",
          description: existing.description ?? "",
          website: existing.website ?? "",
          contact_email: existing.contact_email ?? user.email ?? "",
        });
      }

      // Clean any leftover OAuth params if user exists
      if (user && (code || state)) {
        url.searchParams.delete("code");
        url.searchParams.delete("state");
        window.history.replaceState({}, "", url.toString());
      }

      setReady(true);
    })();
  }, [router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr(null);

    try {
      const supabase = supabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/public");
        return;
      }

      // Simple client validation
      if (!form.org_name.trim() || !form.description.trim() || !form.contact_email.trim()) {
        setErr("Please fill out all required fields.");
        setSaving(false);
        return;
      }

      // Upsert organizer application → set to pending
      const { error } = await supabase
        .from("organizer_applications")
        .upsert(
          {
            id: user.id,
            org_name: form.org_name.trim(),
            description: form.description.trim(),
            website: form.website.trim(),
            contact_email: form.contact_email.trim() || user.email,
            status: "pending",
          },
          { onConflict: "id" }
        );

      if (error) throw error;

      router.replace("/vendor/pending");
    } catch (e: any) {
      setErr(e?.message || "Could not submit application");
    } finally {
      setSaving(false);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen grid place-items-center bg-emerald-50">
        <p className="text-emerald-900">Preparing organizer onboarding…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid place-items-center bg-emerald-50 px-6 py-10">
      <form onSubmit={onSubmit} className="w-full max-w-2xl bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold text-emerald-900 mb-1">Organizer Onboarding</h1>
        <p className="text-sm text-gray-600 mb-6">
          Signed in as <span className="font-medium">{email}</span>. Submit your organization details for admin approval.
        </p>

        <div className="grid grid-cols-1 gap-5">
          {/* Organization Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization Name *
            </label>
            <input
              value={form.org_name}
              onChange={(e) => setForm({ ...form, org_name: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="BU Sustainability, Campus Events Committee, etc."
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              rows={5}
              placeholder="Tell students who you are, what events you run, and the kinds of food you'll post."
              required
            />
          </div>

          {/* Website (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website (optional)
            </label>
            <input
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="https://example.org"
            />
          </div>

          {/* Contact Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email *
            </label>
            <input
              type="email"
              value={form.contact_email}
              onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="organizer@bu.edu"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              We’ll use this for admin communication about your organizer account.
            </p>
          </div>
        </div>

        {err && <p className="mt-4 text-sm text-red-600">{err}</p>}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.replace("/public")}
            className="rounded-lg border border-emerald-900 px-4 py-2 font-semibold text-emerald-900 hover:bg-emerald-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-emerald-600 px-5 py-2 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {saving ? "Submitting…" : "Submit for Approval"}
          </button>
        </div>
      </form>
    </div>
  );
}
