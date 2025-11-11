// app/admin/AdminApprovedList.tsx
"use client";

import { useState } from "react";

type ApprovedRow = {
  id: string;
  org_name: string;
  contact_email: string | null;
  website: string | null;
  is_active: boolean;
  updated_at: string | null;
};

export default function AdminApprovedList({ initialItems }: { initialItems: ApprovedRow[] }) {
  const [items, setItems] = useState<ApprovedRow[]>(initialItems);
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const removeOrg = async (userId: string) => {
    if (!confirm("Remove this organization? This will deactivate their vendor account and revoke their organizer role.")) {
      return;
    }
    setBusy(userId);
    setErr(null);
    try {
      const res = await fetch("/api/admin/revoke-organizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Remove failed");
      // remove from list
      setItems((prev) => prev.filter((r) => r.id !== userId));
    } catch (e: any) {
      setErr(e.message || "Remove failed");
    } finally {
      setBusy(null);
    }
  };

  if (!items.length) {
    return <p className="text-gray-700">No approved organizers.</p>;
  }

  return (
    <div className="space-y-4">
      {err && <p className="text-sm text-red-600">{err}</p>}
      {items.map((row) => (
        <div key={row.id} className="rounded-lg border bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-emerald-900">{row.org_name}</h3>
              {row.contact_email && <p className="text-sm text-gray-600">{row.contact_email}</p>}
              {row.website && (
                <a
                  href={row.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-emerald-700 underline"
                >
                  {row.website}
                </a>
              )}
              {row.updated_at && (
                <p className="mt-1 text-xs text-gray-500">Updated: {new Date(row.updated_at).toLocaleString()}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => removeOrg(row.id)}
                disabled={busy === row.id}
                className="rounded-md border border-red-700 px-4 py-2 text-red-700 hover:bg-red-50 disabled:opacity-60"
              >
                {busy === row.id ? "Removing…" : "Remove"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
