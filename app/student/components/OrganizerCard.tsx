"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

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
        <div className="px-4 pb-6 pt-4 border-t border-emerald-200">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
                          className="flex flex-col gap-2 rounded-[18px] border-[2px] border-emerald-200 bg-[#F0FDF4] px-3 py-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <p className="text-sm font-bold text-emerald-900">
                                {food.name}
                              </p>
                              <p className="text-xs text-emerald-700">
                                {remaining} left • Max {food.perStudentLimit} per
                                student
                              </p>
                              {food.userQuantity > 0 && (
                                <p className="mt-1 text-xs font-semibold text-emerald-800">
                                  You reserved {food.userQuantity}
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              disabled={!canReserve}
                              onClick={() => handleReserve(food.id)}
                              className={`rounded-full border-[2px] border-emerald-900 px-4 py-2 text-xs font-black uppercase tracking-wide shadow-[0_3px_0_0_rgba(16,78,61,0.4)] transition-all ${
                                canReserve
                                  ? "bg-[#BBF7D0] text-emerald-900 hover:-translate-y-[1px] hover:shadow-[0_4px_0_0_rgba(16,78,61,0.5)]"
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
                          <div className="flex items-center justify-between text-[11px] text-emerald-700">
                            <span>
                              Total: {food.totalPortions} • Reserved:{" "}
                              {food.totalReserved}
                            </span>
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
                <div className="rounded-full bg-[#DBEAFE] px-4 py-2 inline-block">
                  <span className="text-sm font-bold uppercase tracking-wide text-emerald-900">
                    ⏱️ {organizer.timeLeft}
                  </span>
                </div>
              </div>

              {/* Dietary tags */}
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
                      className="rounded-full bg-[#BBF7D0] px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-900"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Featured Photo */}
            <div className="flex flex-col">
              <div className="relative h-full min-h-[300px] w-full overflow-hidden rounded-[25px] border-[3px] border-emerald-900 bg-emerald-100 shadow-[0_5px_0_0_rgba(16,78,61,0.3)]">
                {organizer.featuredPhoto &&
                organizer.featuredPhoto.startsWith("/") ? (
                  <Image
                    src={organizer.featuredPhoto}
                    alt="Featured food"
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-emerald-700">
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        className="mb-4 h-20 w-20"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-base font-semibold">Food Photo</p>
                      <p className="text-sm">Coming soon</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
