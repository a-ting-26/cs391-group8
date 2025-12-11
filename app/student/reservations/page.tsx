"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import StudentNavBar from "../components/StudentNavBar";

interface ReservationItem {
  id: string;
  quantity: number;
  status: "in_progress" | "picked_up" | "cancelled" | "incomplete" | string;
  created_at: string;
  foodName: string;
  eventName: string;
  locationLabel: string;
  address: string;
  start_time: string | null;
  end_time: string | null;
}

function formatDateTime(value: string | null) {
  if (!value) return "";
  const d = new Date(value);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function statusLabel(status: string) {
  switch (status) {
    case "in_progress":
      return "In Progress";
    case "picked_up":
      return "Picked Up";
    case "cancelled":
      return "Cancelled";
    case "incomplete":
      return "Incomplete";
    default:
      return status;
  }
}

function statusClasses(status: string) {
  switch (status) {
    case "in_progress":
      return "bg-[#DBEAFE] text-emerald-900 border-blue-300";
    case "picked_up":
      return "bg-[#BBF7D0] text-emerald-900 border-emerald-400";
    case "cancelled":
      return "bg-red-50 text-red-700 border-red-300";
    case "incomplete":
      return "bg-yellow-50 text-yellow-800 border-yellow-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
}

export default function StudentReservationsPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/reservations", {
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load reservations");
      }

      setReservations(data.reservations || []);
    } catch (err: any) {
      setError(err.message || "Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const { currentReservations, pastReservations } = useMemo(() => {
    const now = new Date().getTime();

    const current: ReservationItem[] = [];
    const past: ReservationItem[] = [];

    reservations.forEach((r) => {
      const endTimeMs = r.end_time ? new Date(r.end_time).getTime() : null;
      const isFuture = endTimeMs === null || endTimeMs >= now;

      if (r.status === "in_progress" && isFuture) {
        current.push(r);
      } else {
        past.push(r);
      }
    });

    return { currentReservations: current, pastReservations: past };
  }, [reservations]);

  const handleCancel = async (id: string) => {
    try {
      setUpdatingId(id);
      setError(null);

      const res = await fetch(`/api/reservations/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to cancel reservation");
      }

      await fetchReservations();
    } catch (err: any) {
      setError(err.message || "Failed to cancel reservation");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f9f8f4]">
      <StudentNavBar />

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-emerald-900 hover:text-emerald-700 transition-colors"
          >
            <span className="text-lg">←</span> Back
          </button>
          <h1
            className="mb-2 text-3xl font-extrabold leading-[0.95] tracking-tight text-emerald-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            My Reservations
          </h1>
          <p className="text-sm text-emerald-800">
            Track your upcoming and past food reservations.
          </p>
        </div>

        {loading && (
          <div className="py-10 text-center">
            <p className="text-emerald-900 font-semibold">Loading...</p>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-[20px] border-[2px] border-red-500 bg-red-50 p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && reservations.length === 0 && (
          <div className="py-10 text-center">
            <div className="rounded-[30px] border-[3px] border-emerald-900 bg-white p-8 shadow-[0_5px_0_0_rgba(16,78,61,0.3)]">
              <p className="text-lg font-semibold text-emerald-900">
                You don’t have any reservations yet.
              </p>
            </div>
          </div>
        )}

        {!loading && !error && reservations.length > 0 && (
          <div className="space-y-8">
            {/* Current reservations */}
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2
                  className="text-lg font-black uppercase tracking-wide text-emerald-900"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Current Reservations
                </h2>
                <span className="text-xs font-semibold text-emerald-700">
                  {currentReservations.length} active
                </span>
              </div>

              {currentReservations.length === 0 ? (
                <p className="text-sm text-emerald-700">
                  You have no upcoming reservations.
                </p>
              ) : (
                <div className="space-y-4">
                  {currentReservations.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-[24px] border-[3px] border-emerald-900 bg-white p-5 shadow-[0_4px_0_0_rgba(16,78,61,0.3)]"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-sm font-black uppercase tracking-wide text-emerald-900">
                            {r.eventName}
                          </p>
                          <p className="text-base font-semibold text-emerald-800">
                            🍴 {r.foodName}
                          </p>
                          <p className="mt-1 text-xs text-emerald-700">
                            📍 {r.locationLabel || r.address}
                          </p>
                          <div className="mt-2 inline-flex items-center gap-2">
                            <span
                              className={
                                "rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wide " +
                                statusClasses(r.status)
                              }
                            >
                              {statusLabel(r.status)}
                            </span>
                            <span className="text-xs font-semibold text-emerald-900">
                              Reserved: {r.quantity}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          {r.end_time && (
                            <p className="mt-1 text-[11px] text-emerald-700">
                              Event ends: {formatDateTime(r.end_time)}
                            </p>
                          )}
                          <p className="mt-1 text-[11px] text-emerald-700">
                            Reserved at: {formatDateTime(r.created_at)}
                          </p>
                          <button
                            type="button"
                            onClick={() => handleCancel(r.id)}
                            disabled={updatingId === r.id}
                            className={`mt-3 rounded-full border-[2px] border-red-600 px-4 py-2 text-xs font-black uppercase tracking-wide text-red-700 shadow-[0_3px_0_0_rgba(220,38,38,0.4)] transition ${
                              updatingId === r.id
                                ? "bg-red-100 cursor-not-allowed"
                                : "bg-white hover:-translate-y-[1px] hover:bg-red-50"
                            }`}
                          >
                            {updatingId === r.id
                              ? "Cancelling..."
                              : "Cancel Reservation"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Past reservations */}
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2
                  className="text-lg font-black uppercase tracking-wide text-emerald-900"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Past Reservations
                </h2>
                <span className="text-xs font-semibold text-emerald-700">
                  {pastReservations.length} total
                </span>
              </div>

              {pastReservations.length === 0 ? (
                <p className="text-sm text-emerald-700">
                  You have no past reservations yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {pastReservations.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-[24px] border-[3px] border-emerald-900 bg-[#F9FAFB] p-5 shadow-[0_4px_0_0_rgba(156,163,175,0.6)]"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-sm font-black uppercase tracking-wide text-emerald-900">
                            {r.eventName}
                          </p>
                          <p className="text-base font-semibold text-emerald-800">
                            🍴 {r.foodName}
                          </p>
                          <p className="mt-1 text-xs text-emerald-700">
                            📍 {r.locationLabel || r.address}
                          </p>
                          <div className="mt-2 inline-flex items-center gap-2">
                            <span
                              className={
                                "rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wide " +
                                statusClasses(r.status)
                              }
                            >
                              {statusLabel(r.status)}
                            </span>
                            <span className="text-xs font-semibold text-emerald-900">
                              Reserved: {r.quantity}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          {r.end_time && (
                            <p className="mt-1 text-[11px] text-emerald-700">
                              Event ended: {formatDateTime(r.end_time)}
                            </p>
                          )}
                          <p className="mt-1 text-[11px] text-emerald-700">
                            Reserved at: {formatDateTime(r.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
