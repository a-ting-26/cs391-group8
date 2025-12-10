"use client";
import React, { useEffect, useState } from "react";

interface Organizer {
  id: number | string;
  name: string;
  location: string;
  locationLabel: string;
  availableFood: string;
  timeLeft: string;
  category: string;
  dietaryTags: string[];
  featuredPhoto?: string;
  description?: string;
}

interface EventFood {
  id: string;
  name: string;
  totalPortions: number;
  perStudentLimit: number;
  totalReserved: number;
  userQuantity: number;
}

interface OrganizerCardProps {
  organizer: Organizer;
  isExpanded: boolean;
  onClick: () => void;
  eventId?: string;         // 👈 new
  endTime?: string;        // 👈 new (for “Ended” logic)
}

export default function OrganizerCard({
  organizer,
  isExpanded,
  onClick,
  eventId,
  endTime,
}: OrganizerCardProps) {
  const [foods, setFoods] = useState<EventFood[]>([]);
  const [loadingFoods, setLoadingFoods] = useState(false);
  const [foodsError, setFoodsError] = useState<string | null>(null);
  const [reserveLoadingId, setReserveLoadingId] = useState<string | null>(null);
  const [reserveError, setReserveError] = useState<string | null>(null);

  const hasEnded =
    !!endTime && new Date(endTime).getTime() <= new Date().getTime();

  // Fetch event foods + user reservation info when expanded
  useEffect(() => {
    if (!isExpanded || !eventId) return;
    const fetchFoods = async () => {
      try {
        setLoadingFoods(true);
        setFoodsError(null);
        const res = await fetch(`/api/event-foods?eventId=${eventId}`, {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load food items");
        }

        setFoods(data.foods || []);
      } catch (err: any) {
        setFoodsError(err.message || "Failed to load food items");
      } finally {
        setLoadingFoods(false);
      }
    };

    fetchFoods();
  }, [isExpanded, eventId]);

  const handleReserve = async (foodId: string) => {
    if (!eventId) return;
    try {
      setReserveError(null);
      setReserveLoadingId(foodId);

      const res = await fetch("/api/reservations", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventFoodId: foodId,
          quantity: 1, // reserve 1 portion at a time
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reserve");
      }

      // Refresh foods to update remaining counts + userQuantity
      const foodsRes = await fetch(`/api/event-foods?eventId=${eventId}`, {
        credentials: "include",
      });
      const foodsData = await foodsRes.json();
      if (foodsRes.ok) {
        setFoods(foodsData.foods || []);
      }
    } catch (err: any) {
      setReserveError(err.message || "Failed to reserve");
    } finally {
      setReserveLoadingId(null);
    }
  };

  return (
    <div
      className={`w-full rounded-[30px] border-[3px] border-emerald-900 bg-white shadow-[0_5px_0_0_rgba(16,78,61,0.3)] transition-all overflow-hidden ${
        isExpanded
          ? "shadow-[0_7px_0_0_rgba(16,78,61,0.5)]"
          : "hover:shadow-[0_7px_0_0_rgba(16,78,61,0.4)]"
      }`}
    >
      {/* Collapsed Header */}
      <button onClick={onClick} className="w-full p-4 text-left">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="mb-2">
              <h3
                className="text-xl font-black uppercase tracking-wide text-emerald-900 truncate"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {organizer.name}
              </h3>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-semibold text-emerald-800">
                📍 {organizer.locationLabel}
              </span>
              {!isExpanded && (
                <>
                  <span className="text-sm font-semibold text-emerald-800">
                    ⏱️ {organizer.timeLeft}
                  </span>
                  {organizer.dietaryTags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#BBF7D0] px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-emerald-900"
                    >
                      {tag}
                    </span>
                  ))}
                  {organizer.dietaryTags.length > 2 && (
                    <span className="text-xs text-emerald-600">
                      +{organizer.dietaryTags.length - 2} more
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="flex-shrink-0">
            <svg
              className={`h-5 w-5 text-emerald-900 transition-transform ${
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

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-6 pt-4">
          <div>
            {/* Left Side - Info + Food Items */}
            <div className="space-y-5">
              {/* Food Items */}
              <div>
                <h5
                  className="mb-2 text-sm font-black uppercase tracking-wider text-emerald-900"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  AVAILABLE FOOD
                </h5>

                {loadingFoods ? (
                  <p className="text-sm text-emerald-700">Loading food items…</p>
                ) : foodsError ? (
                  <p className="text-sm text-red-600">{foodsError}</p>
                ) : foods.length === 0 ? (
                  <p className="text-sm text-emerald-700">
                    Menu coming soon. Check back later!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {foods.map((food) => {
                      const remaining =
                        food.totalPortions - food.totalReserved;
                      const remainingForUser =
                        food.perStudentLimit - food.userQuantity;
                      const canReserve =
                        !hasEnded &&
                        remaining > 0 &&
                        remainingForUser > 0 &&
                        reserveLoadingId !== food.id;

                      return (
                        <div
                          key={food.id}
                          className="rounded-[20px] border-[2px] border-emerald-200 bg-white px-4 py-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <p className="text-base font-bold text-emerald-900 mb-1">
                                {food.name}
                              </p>
                              <p className="text-xs text-emerald-700 mb-1">
                                {remaining} left • Max {food.perStudentLimit} per student
                              </p>
                              <p className="text-[11px] text-emerald-600">
                                Total: {food.totalPortions} • Reserved: {food.totalReserved}
                              </p>
                              {food.userQuantity > 0 && (
                                <p className="mt-2 text-xs font-semibold text-emerald-800">
                                  You reserved {food.userQuantity}
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              disabled={!canReserve}
                              onClick={() => handleReserve(food.id)}
                              className={`flex-shrink-0 rounded-full border-[2px] border-emerald-900 px-5 py-2.5 text-xs font-black uppercase tracking-wide shadow-[0_3px_0_0_rgba(16,78,61,0.4)] transition-all whitespace-nowrap ${
                                canReserve
                                  ? "bg-[#BBF7D0] text-emerald-900 hover:-translate-y-[1px] hover:shadow-[0_4px_0_0_rgba(16,78,61,0.5)] active:translate-y-0"
                                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
                              }`}
                            >
                              {hasEnded
                                ? "Ended"
                                : remaining <= 0
                                ? "Out"
                                : remainingForUser <= 0
                                ? "Limit Reached"
                                : reserveLoadingId === food.id
                                ? "Reserving..."
                                : "Reserve"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {reserveError && (
                  <p className="mt-2 text-xs text-red-600">{reserveError}</p>
                )}
              </div>

              {/* Description */}
              {organizer.description && (
                <div>
                  <h5
                    className="mb-2 text-sm font-black uppercase tracking-wider text-emerald-900"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    DESCRIPTION
                  </h5>
                  <p className="text-base font-semibold text-emerald-800">
                    {organizer.description}
                  </p>
                </div>
              )}

              {/* Time left */}
              <div>
                <h5
                  className="mb-2 text-sm font-black uppercase tracking-wider text-emerald-900"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  TIME LEFT
                </h5>
                <div className="rounded-full bg-[#DBEAFE] border-[2px] border-blue-300 px-4 py-2 inline-flex items-center gap-2">
                  <span className="text-sm">⏱️</span>
                  <span className="text-sm font-bold uppercase tracking-wide text-emerald-900">
                    {organizer.timeLeft}
                  </span>
                </div>
              </div>

              {/* Dietary tags */}
              {organizer.dietaryTags.length > 0 && (
                <div>
                  <h5
                    className="mb-2 text-sm font-black uppercase tracking-wider text-emerald-900"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    DIETARY TAGS
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {organizer.dietaryTags.map((tag) => (
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
        </div>
      )}
    </div>
  );
}
