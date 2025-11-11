"use client";

import { useState } from "react";

export type PendingRow = {
  id: string;
  org_name: string;
  contact_email: string | null;
  website: string | null;
  description: string | null;
  status: "pending";
  created_at: string;
};

export default function AdminPendingList({ initialItems }: { initialItems: PendingRow[] }) {
  const [items, setItems] = useState<PendingRow[]>(initialItems);
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const doAction = async (url: string, userId: string) => {
    setBusy(userId);
    setErr(null);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Request failed");
      // remove from pending list
      setItems((prev) => prev.filter((r) => r.id !== userId));
    } catch (e: any) {
      setErr(e.message || "Action failed");
    } finally {
      setBusy(null);
    }
  };

  if (items.length === 0) {
    return (
      <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
        No pending organizer applications.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {err && <p className="text-sm text-red-600">{err}</p>}

      {items.map((row) => (
        <div
          key={row.id}
          className="rounded-xl border-[3px] border-emerald-900 bg-white p-5 shadow-[0_6px_0_0_rgba(16,78,61,0.45)]"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-emerald-900">{row.org_name}</h3>
              {row.contact_email && <p className="text-sm text-gray-700">{row.contact_email}</p>}
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
              {row.description && (
                <p className="mt-2 max-w-prose text-sm text-gray-600">{row.description}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Submitted: {new Date(row.created_at).toLocaleString()}
              </p>
            </div>

            <div className="flex shrink-0 gap-3">
              <button
                onClick={() => doAction("/api/admin/reject-organizer", row.id)}
                disabled={busy === row.id}
                className="rounded-full border-[3px] border-red-700 bg-white px-5 py-2 text-sm font-black uppercase tracking-wide text-red-700 shadow-[0_5px_0_0_rgba(185,28,28,0.45)] transition-all hover:-translate-y-0.5 hover:bg-red-50 disabled:opacity-60"
              >
                {busy === row.id ? "…" : "Reject"}
              </button>
              <button
                onClick={() => doAction("/api/admin/approve-organizer", row.id)}
                disabled={busy === row.id}
                className="rounded-full border-[3px] border-emerald-900 bg-[#C7F7D4] px-5 py-2 text-sm font-black uppercase tracking-wide text-emerald-900 shadow-[0_5px_0_0_rgba(16,78,61,0.45)] transition-all hover:-translate-y-0.5 hover:bg-[#B6F2C7] disabled:opacity-60"
              >
                {busy === row.id ? "…" : "Approve"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
