"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import FeedContent from "./components/FeedContent";
import { upsertStudentProfile } from "@/lib/actions/upsertStudentProfile";

export default function FeedPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const supabase = supabaseBrowser();

      // Ensure Auth metadata has roles: ['student'] (or includes 'student')
      const ensureStudentRole = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const currentRoles: string[] = Array.isArray(user.user_metadata?.roles)
          ? (user.user_metadata.roles as string[])
          : [];

        if (!currentRoles.includes("student")) {
          await supabase.auth.updateUser({ data: { roles: [...currentRoles, "student"] } }).catch(() => {});
        }
      };

      // 1) If a session already exists, skip PKCE exchange
      const firstCheck = await supabase.auth.getUser();
      const existingUser = firstCheck.data.user;

      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state");

      if (existingUser) {
        // Clean stale OAuth params (avoid re-runs on refresh)
        if (code || state) {
          url.searchParams.delete("code");
          url.searchParams.delete("state");
          window.history.replaceState({}, "", url.toString());
        }

        // BU domain guard
        if (!existingUser.email?.toLowerCase().endsWith("@bu.edu")) {
          await supabase.auth.signOut();
          router.replace("/public?authError=Please%20use%20a%20%40bu.edu%20account");
          return;
        }

        // Ensure role + student_profiles row
        await ensureStudentRole();
        try { await upsertStudentProfile(); } catch (e) { console.warn("student upsert failed:", e); }

        setEmail(existingUser.email ?? null);
        setReady(true);
        return;
      }

      // 2) No session yet → only attempt PKCE exchange if `code` is present
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          // Try reading the user anyway (Supabase hosted callback might have set cookies)
          const retry = await supabase.auth.getUser();
          if (!retry.data.user) {
            router.replace(`/public?authError=${encodeURIComponent(error.message)}`);
            return;
          }
        }
        // Clean URL after exchange so refreshes don’t re-run it
        url.searchParams.delete("code");
        url.searchParams.delete("state");
        window.history.replaceState({}, "", url.toString());
      }

      // 3) Final session check
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/public");
        return;
      }
      if (!user.email?.toLowerCase().endsWith("@bu.edu")) {
        await supabase.auth.signOut();
        router.replace("/public?authError=Please%20use%20a%20%40bu.edu%20account");
        return;
      }

      // Ensure role + student_profiles row
      await ensureStudentRole();
      try { await upsertStudentProfile(); } catch (e) { console.warn("student upsert failed:", e); }

      setEmail(user.email ?? null);
      setReady(true);
    })();
  }, [router]);

  if (!ready) {
    return (
      <div className="min-h-screen w-full grid place-items-center bg-[#f9f8f4]">
        <p className="text-emerald-900 text-lg">Loading your feed…</p>
      </div>
    );
  }

  return <FeedContent email={email} />;
}
