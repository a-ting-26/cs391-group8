// app/vendor/components/VendorEventCard.tsx
"use client";

import React, { useEffect, useState } from "react";

export interface VendorEvent {
  id: string;
  organizer_name: string;
  location: string;
  location_label: string;
  available_food?: string | null;
  category: string;
  dietary_tags: string[];
  description?: string | null;
  featured_photo?: string | null;
  start_time: string;
  end_time: string;
  availability: string;
  created_at: string;
  name: string;
}

interface FoodReservation {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  quantity: number;
  status: string;
  created_at: string;
}

interface EventFoodWithReservations {
  id: string;
  name: string;
  totalPortions: number;
  perStudentLimit: number;
  totalReserved: number;
  reservations: FoodReservation[];
}

interface VendorEventCardProps {
  event: VendorEvent;
  isExpanded: boolean;
  onToggle: () => void;
  onClosed?: () => void; // 👈 new callback for parent to refresh
}

function calculateTimeLeft(endTime: string): string {
  const now = new Date();
  const end = new Date(endTime);
  const diffMs = end.getTime() - now.getTime();

  if (diffMs <= 0) return "Ended";

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""}`;
  }
  return `${diffMins} minute${diffMins > 1 ? "s" : ""}`;
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
      return "No-show";
    default:
      return status;
  }
}

function statusClasses(status: string) {
  switch (status) {
    case "in_progress":
      return "bg-blue-50 text-blue-800 border-blue-300";
    case "picked_up":
      return "bg-emerald-50 text-emerald-800 border-emerald-300";
    case "cancelled":
      return "bg-red-50 text-red-700 border-red-300";
    case "incomplete":
      return "bg-yellow-50 text-yellow-800 border-yellow-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
}

const VendorEventCard: React.FC<VendorEventCardProps> = ({
  event,
  isExpanded,
  onToggle,
  onClosed,
}) => {
  const [foods, setFoods] = useState<EventFoodWithReservations[]>([]);
  const [loadingFoods, setLoadingFoods] = useState(false);
  const [foodsError, setFoodsError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);
  const [closeError, setCloseError] = useState<string | null>(null);

  const hasEnded =
    new Date(event.end_time).getTime() <= new Date().getTime();

  useEffect(() => {
    if (!isExpanded) return;

    const fetchData = async () => {
      try {
        setLoadingFoods(true);
        setFoodsError(null);

        const res = await fetch(
          `/api/vendor/events/${event.id}/reservations`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load reservations");
        }

        setFoods(data.foods || []);
      } catch (err: any) {
        setFoodsError(err.message || "Failed to load reservations");
      } finally {
        setLoadingFoods(false);
      }
    };

    fetchData();
  }, [isExpanded, event.id]);

  const refresh = async () => {
    if (!isExpanded) return;
    try {
      const res = await fetch(
        `/api/vendor/events/${event.id}/reservations`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setFoods(data.foods || []);
      }
    } catch {
      // ignore
    }
  };

  const updateReservationStatus = async (
    reservationId: string,
    status: "picked_up" | "incomplete"
  ) => {
    try {
      setUpdatingId(reservationId);
      const res = await fetch(`/api/reservations/${reservationId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update reservation");
      }

      await refresh();
    } catch (err) {
      console.error("updateReservationStatus error", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCloseEvent = async () => {
    try {
      setClosing(true);
      setCloseError(null);
      const res = await fetch(
        `/api/vendor/events/${event.id}/close`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to close event");
      }
      // Ask parent to refresh event lists
      if (onClosed) {
        await onClosed();
      }
    } catch (err: any) {
      setCloseError(err.message || "Failed to close event");
    } finally {
      setClosing(false);
    }
  };

  return (
    <div className="w-full rounded-[30px] border-[3px] border-emerald-900 bg-white shadow-[0_5px_0_0_rgba(16,78,61,0.3)] overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start p-4">
        <button onClick={onToggle} className="flex-1 text-left">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3
                className="text-xl font-black uppercase tracking-wide text-emerald-900 truncate mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {event.name || "My Event"}
              </h3>
              <p className="text-sm font-semibold text-emerald-800">
                📍 {event.location_label}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                {event.category}
              </span>
              <div className="rounded-full bg-[#DBEAFE] border-[2px] border-blue-300 px-3 py-1 inline-flex items-center gap-2">
                <span className="text-xs">⏱️</span>
                <span className="text-[11px] font-bold uppercase tracking-wide text-emerald-900">
                  {calculateTimeLeft(event.end_time)}
                </span>
              </div>
              <svg
                className={`h-4 w-4 text-emerald-900 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </button>

        {/* Close event button */}
        <div className="ml-3 flex flex-col items-end gap-1">
          {!hasEnded && (
            <button
              type="button"
              onClick={handleCloseEvent}
              disabled={closing}
              className={`rounded-full border-[2px] border-red-700 px-4 py-2 text-[10px] font-black uppercase tracking-wide shadow-[0_3px_0_0_rgba(185,28,28,0.5)] transition ${
                closing
                  ? "bg-red-100 cursor-not-allowed text-red-700"
                  : "bg-white text-red-700 hover:-translate-y-[1px] hover:bg-red-50"
              }`}
            >
              {closing ? "Closing…" : "Close Event Now"}
            </button>
          )}
          {closeError && (
            <p className="mt-1 text-[10px] text-red-600">{closeError}</p>
          )}
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-6 pt-4">
          <div className="space-y-5">
            <div>
              <h5
                className="mb-2 text-sm font-black uppercase tracking-wider text-emerald-900"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Available Food & Reservations
              </h5>

              {loadingFoods ? (
                <p className="text-sm text-emerald-700">
                  Loading reservations…
                </p>
              ) : foodsError ? (
                <p className="text-sm text-red-600">{foodsError}</p>
              ) : foods.length === 0 ? (
                <p className="text-sm text-emerald-700">
                  No items added yet for this event.
                </p>
              ) : (
                <div className="space-y-4">
                  {foods.map((food) => (
                    <div
                      key={food.id}
                      className="rounded-[20px] border-[2px] border-emerald-300 bg-white px-4 py-4"
                    >
                      {/* Food Item Header */}
                      <div className="mb-4 pb-3 border-b border-emerald-200">
                        <p className="text-base font-bold text-emerald-900 mb-1">
                          {food.name}
                        </p>
                        <p className="text-xs text-emerald-700 mb-1">
                          {food.totalPortions - food.totalReserved} left • Max{" "}
                          {food.perStudentLimit} per student
                        </p>
                        <p className="text-[11px] text-emerald-600">
                          Total: {food.totalPortions} • Reserved (active):{" "}
                          {food.totalReserved}
                        </p>
                      </div>

                      {/* Reservations list */}
                      {food.reservations.length === 0 ? (
                        <div className="text-center py-4">
                          <p className="text-xs text-emerald-600">
                            No reservations yet.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {food.reservations.map((r) => (
                            <div
                              key={r.id}
                              className="flex flex-col gap-3 rounded-[16px] border-[2px] border-emerald-300 bg-emerald-50/50 px-4 py-3 md:flex-row md:items-center md:justify-between"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-emerald-900 mb-0.5">
                                  {r.studentName}
                                </p>
                                {r.studentEmail && (
                                  <p className="text-xs text-emerald-700 mb-1.5">
                                    {r.studentEmail}
                                  </p>
                                )}
                                <p className="text-xs text-emerald-600">
                                  Reserved: {r.quantity} •{" "}
                                  {new Date(
                                    r.created_at
                                  ).toLocaleString(undefined, {
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                              <div className="flex flex-col items-end gap-2 md:flex-shrink-0">
                                <span
                                  className={
                                    "rounded-full border-[2px] px-3 py-1.5 text-xs font-bold uppercase tracking-wide whitespace-nowrap " +
                                    statusClasses(r.status)
                                  }
                                >
                                  {statusLabel(r.status)}
                                </span>

                                {!hasEnded &&
                                  r.status === "in_progress" && (
                                    <div className="flex gap-2 w-full md:w-auto">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          updateReservationStatus(
                                            r.id,
                                            "picked_up"
                                          )
                                        }
                                        disabled={updatingId === r.id}
                                        className={`flex-1 md:flex-none rounded-full border-[2px] border-emerald-900 px-4 py-1.5 text-xs font-black uppercase tracking-wide shadow-[0_2px_0_0_rgba(16,78,61,0.4)] transition ${
                                          updatingId === r.id
                                            ? "bg-emerald-100 cursor-not-allowed"
                                            : "bg-[#BBF7D0] text-emerald-900 hover:-translate-y-[1px] hover:shadow-[0_3px_0_0_rgba(16,78,61,0.5)] active:translate-y-0"
                                        }`}
                                      >
                                        {updatingId === r.id
                                          ? "Saving..."
                                          : "Picked Up"}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          updateReservationStatus(
                                            r.id,
                                            "incomplete"
                                          )
                                        }
                                        disabled={updatingId === r.id}
                                        className={`flex-1 md:flex-none rounded-full border-[2px] border-yellow-600 px-4 py-1.5 text-xs font-black uppercase tracking-wide shadow-[0_2px_0_0_rgba(202,138,4,0.4)] transition ${
                                          updatingId === r.id
                                            ? "bg-yellow-100 cursor-not-allowed"
                                            : "bg-white text-yellow-800 hover:-translate-y-[1px] hover:shadow-[0_3px_0_0_rgba(202,138,4,0.5)] active:translate-y-0"
                                        }`}
                                      >
                                        {updatingId === r.id
                                          ? "Saving..."
                                          : "No-show"}
                                      </button>
                                    </div>
                                  )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {event.description && (
              <div>
                <h5
                  className="mb-2 text-sm font-black uppercase tracking-wider text-emerald-900"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Description
                </h5>
                <p className="text-sm font-semibold text-emerald-800">
                  {event.description}
                </p>
              </div>
            )}

            {event.dietary_tags?.length > 0 && (
              <div>
                <h5
                  className="mb-2 text-sm font-black uppercase tracking-wider text-emerald-900"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Dietary Tags
                </h5>
                <div className="flex flex-wrap gap-2">
                  {event.dietary_tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#BBF7D0] border-[2px] border-emerald-300 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-emerald-900"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorEventCard;
