// app/admin/AdminPendingList.tsx
"use client";

import { useState } from "react";

type AppRow = {
  id: string;
  org_name: string;
  contact_email: string;
  website: string | null;
  description: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export default function AdminPendingList({ initialItems }: { initialItems: AppRow[] }) {
  const [items, setItems] = useState<AppRow[]>(initialItems);
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const approve = async (userId: string) => {
    setBusy(userId);
    setErr(null);
    try {
      const res = await fetch("/api/admin/approve-organizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Approve failed");
      setItems((prev) => prev.filter((r) => r.id !== userId));
    } catch (e: any) {
      setErr(e.message || "Approve failed");
    } finally {
      setBusy(null);
    }
  };

  const reject = async (userId: string) => {
    setBusy(userId);
    setErr(null);
    try {
      const res = await fetch("/api/admin/reject-organizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Reject failed");
      setItems((prev) => prev.filter((r) => r.id !== userId));
    } catch (e: any) {
      setErr(e.message || "Reject failed");
    } finally {
      setBusy(null);
    }
  };

  if (!items.length) {
    return <p className="text-gray-700">No pending organizer applications.</p>;
  }

  return (
    <div className="space-y-4">
      {err && <p className="text-sm text-red-600">{err}</p>}
      {items.map((row) => (
        <div key={row.id} className="rounded-lg border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-emerald-900">{row.org_name}</h2>
              <p className="text-sm text-gray-600">{row.contact_email}</p>
              {row.website && (
                <a
                  href={row.website}
                  target="_blank"
                  className="text-sm text-emerald-700 underline"
                  rel="noreferrer"
                >
                  {row.website}
                </a>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => approve(row.id)}
                disabled={busy === row.id}
                className="rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {busy === row.id ? "Approving…" : "Approve"}
              </button>
              <button
                onClick={() => reject(row.id)}
                disabled={busy === row.id}
                className="rounded-md border border-red-700 px-4 py-2 text-red-700 hover:bg-red-50 disabled:opacity-60"
              >
                {busy === row.id ? "Rejecting…" : "Reject"}
              </button>
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-800">{row.description}</p>
          <p className="mt-1 text-xs text-gray-500">
            Submitted: {new Date(row.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
