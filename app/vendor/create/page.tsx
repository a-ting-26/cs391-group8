"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import VendorNavBar from "../components/VendorNavBar";
import { supabaseBrowser } from "@/lib/supabase/client";
import AddressAutocomplete from "../components/AddressAutocomplete"; // adjust path


const LOCATIONS = [
  { value: "central-campus", label: "Central Campus" },
  { value: "george-sherman-union", label: "George Sherman Union" },
  { value: "east-campus", label: "East Campus" },
  { value: "west-campus", label: "West Campus" },
  { value: "fenway-campus", label: "Fenway Campus" },
];

const CATEGORIES = ["Lunch", "Dinner", "Snacks"];

const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Halal",
  "Gluten-Free",
  "Dairy-Free",
  "Nut-Free",
];

type FoodItemForm = {
  id: string;
  name: string;
  totalPortions: number;
  perStudentLimit: number;
};

export default function CreateEventPage() {
  const router = useRouter();
  const supabase = supabaseBrowser();

  const [organizerName, setOrganizerName] = useState<string>("");
  const [loadingOrganizer, setLoadingOrganizer] = useState(true);

  const [formData, setFormData] = useState({
    eventName: "",
    location: "",
    address: "",
    category: "",
    dietaryTags: [] as string[],
    description: "",
    startTime: "",
    endTime: "",
    featuredPhoto: "",
    lat: null as number | null,
    lng: null as number | null,
  });


  const [foodItems, setFoodItems] = useState<FoodItemForm[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // ------------- Load organizer name from vendor_profiles -------------
  useEffect(() => {
    const loadOrganizer = async () => {
      setLoadingOrganizer(true);
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setOrganizerName("");
          return;
        }

        // vendor_profiles.id is linked to auth.users.id in your schema screenshot
        const { data: vendorProfile } = await supabase
          .from("vendor_profiles")
          .select("org_name")
          .eq("id", user.id)
          .maybeSingle();

        if (vendorProfile?.org_name) {
          setOrganizerName(vendorProfile.org_name);
        } else {
          // fallback: use email if no org_name
          setOrganizerName(user.email ?? "");
        }
      } catch {
        setOrganizerName("");
      } finally {
        setLoadingOrganizer(false);
      }
    };

    loadOrganizer();
  }, [supabase]);

  // ------------- Handlers -------------

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "address" ? { lat: null, lng: null } : {}),
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };



  const handleDietaryToggle = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      dietaryTags: prev.dietaryTags.includes(tag)
        ? prev.dietaryTags.filter((t) => t !== tag)
        : [...prev.dietaryTags, tag],
    }));
  };

  const addFoodItem = () => {
    setFoodItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        totalPortions: 0,
        perStudentLimit: 1,
      },
    ]);
    if (errors.foodItems) {
      setErrors((prev) => ({ ...prev, foodItems: "" }));
    }
  };

  const updateFoodItem = (
    id: string,
    field: keyof Omit<FoodItemForm, "id">,
    value: string
  ) => {
    setFoodItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "totalPortions" || field === "perStudentLimit"
                  ? Number(value)
                  : value,
            }
          : item
      )
    );
  };

  const removeFoodItem = (id: string) => {
    setFoodItems((prev) => prev.filter((item) => item.id !== id));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!organizerName.trim()) {
      newErrors.organizerName =
        "Organizer name could not be loaded. Please re-log in.";
      isValid = false;
    }

    if (!formData.eventName.trim()) {
      newErrors.eventName = "Event name is required";
      isValid = false;
    }
    if (!formData.location) {
      newErrors.location = "Location is required";
      isValid = false;
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
      isValid = false;
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
      isValid = false;
    }
    if (!formData.startTime) {
      newErrors.startTime = "Start time is required";
      isValid = false;
    }
    if (!formData.endTime) {
      newErrors.endTime = "End time is required";
      isValid = false;
    }
    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      if (end <= start) {
        newErrors.endTime = "End time must be after start time";
        isValid = false;
      }
    }

    // Food items validation
    if (foodItems.length === 0) {
      newErrors.foodItems = "Add at least one food item";
      isValid = false;
    } else {
      for (const item of foodItems) {
        if (!item.name.trim()) {
          newErrors.foodItems =
            "Each food item must have a name, portions, and per-student limit";
          isValid = false;
          break;
        }
        if (item.totalPortions <= 0 || item.perStudentLimit <= 0) {
          newErrors.foodItems =
            "Total portions and per-student limit must be greater than 0";
          isValid = false;
          break;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSuccess(false);

    try {
      const locationLabel =
        LOCATIONS.find((loc) => loc.value === formData.location)?.label || "";

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          organizerName,
          eventName: formData.eventName,
          location: formData.location,
          locationLabel,
          address: formData.address,
          category: formData.category,
          dietaryTags: formData.dietaryTags,
          description: formData.description,
          startTime: formData.startTime,
          endTime: formData.endTime,
          featuredPhoto: formData.featuredPhoto || null,

          // per-food reservation data
          foodItems: foodItems.map((f) => ({
            name: f.name,
            totalPortions: f.totalPortions,
            perStudentLimit: f.perStudentLimit,
          })),
          lat: formData.lat,
          lng: formData.lng,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create event");
      }

      setSuccess(true);

      setTimeout(() => {
        router.push("/vendor");
      }, 1500);
    } catch (error: any) {
      let errorMessage = error.message || "Failed to create event";

      if (
        errorMessage.includes("Unauthorized") ||
        errorMessage.includes("401")
      ) {
        errorMessage =
          "You must be logged in to create events. Please log in and try again.";
      }

      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ------------- JSX -------------

  return (
    <div className="min-h-screen w-full bg-[#f9f8f4]">
      <VendorNavBar />

      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8">
          <h1
            className="mb-2 text-4xl font-black uppercase tracking-wide text-emerald-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Create New Event
          </h1>
          <p className="text-emerald-800">
            Post your event and share leftover food with the BU community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-[30px] border-[3px] border-emerald-900 bg-white p-6 shadow-[0_5px_0_0_rgba(16,78,61,0.3)]">
            {/* Organizer (read-only, defaults from vendor signup) */}
            <div className="mb-6">
              <p className="mb-1 text-xs font-black uppercase tracking-wide text-emerald-900">
                Organizer
              </p>
              <div className="rounded-[20px] border-[2px] border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
                {loadingOrganizer
                  ? "Loading organizer..."
                  : organizerName || "Unknown organizer"}
              </div>
              {errors.organizerName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.organizerName}
                </p>
              )}
            </div>

            {/* Event Name */}
            <div className="mb-6">
              <label
                htmlFor="eventName"
                className="mb-2 block text-sm font-black uppercase tracking-wide text-emerald-900"
              >
                Event Name *
              </label>
              <input
                type="text"
                id="eventName"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                placeholder="e.g., Late Night GSU Snack Share"
                className={`w-full rounded-[20px] border-[2px] px-4 py-3 text-emerald-900 placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.eventName ? "border-red-500" : "border-emerald-300"
                }`}
              />
              {errors.eventName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.eventName}
                </p>
              )}
            </div>

            {/* Location */}
            <div className="mb-6">
              <label
                htmlFor="location"
                className="mb-2 block text-sm font-black uppercase tracking-wide text-emerald-900"
              >
                Location *
              </label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full rounded-[20px] border-[2px] px-4 py-3 text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.location ? "border-red-500" : "border-emerald-300"
                }`}
              >
                <option value="">Select a location</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc.value} value={loc.value}>
                    {loc.label}
                  </option>
                ))}
              </select>
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              )}
            </div>

            {/* Address */}
            <div className="mb-6">
              <label
                htmlFor="address"
                className="mb-2 block text-sm font-black uppercase tracking-wide text-emerald-900"
              >
                Exact Address / Room *
              </label>

              <AddressAutocomplete
                value={formData.address}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, address: val, lat: null, lng: null }))
                }
                onSelectAddress={(address, lat, lng) =>
                  setFormData((prev) => ({ ...prev, address, lat, lng }))
                }
              />

              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            {/* Category */}
            <div className="mb-6">
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-black uppercase tracking-wide text-emerald-900"
              >
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full rounded-[20px] border-[2px] px-4 py-3 text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.category ? "border-red-500" : "border-emerald-300"
                }`}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            {/* Dietary Tags */}
            <div className="mb-6">
              <label className="mb-3 block text-sm font-black uppercase tracking-wide text-emerald-900">
                Dietary Tags (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-3">
                {DIETARY_OPTIONS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleDietaryToggle(tag)}
                    className={`rounded-full border-[2px] px-4 py-2 text-sm font-bold uppercase tracking-wide transition-all ${
                      formData.dietaryTags.includes(tag)
                        ? "bg-[#BBF7D0] border-emerald-900 text-emerald-900 shadow-[0_3px_0_0_rgba(16,78,61,0.3)]"
                        : "bg-white border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-black uppercase tracking-wide text-emerald-900"
              >
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add more details about your event..."
                rows={4}
                className="w-full resize-none rounded-[20px] border-[2px] border-emerald-300 px-4 py-3 text-emerald-900 placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Start Time */}
            <div className="mb-6">
              <label
                htmlFor="startTime"
                className="mb-2 block text-sm font-black uppercase tracking-wide text-emerald-900"
              >
                Start Time *
              </label>
              <input
                type="datetime-local"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className={`w-full rounded-[20px] border-[2px] px-4 py-3 text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.startTime ? "border-red-500" : "border-emerald-300"
                }`}
              />
              {errors.startTime && (
                <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>
              )}
            </div>

            {/* End Time */}
            <div className="mb-6">
              <label
                htmlFor="endTime"
                className="mb-2 block text-sm font-black uppercase tracking-wide text-emerald-900"
              >
                End Time *
              </label>
              <input
                type="datetime-local"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className={`w-full rounded-[20px] border-[2px] px-4 py-3 text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.endTime ? "border-red-500" : "border-emerald-300"
                }`}
              />
              {errors.endTime && (
                <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>
              )}
            </div>

            {/* Food Items */}
            <div className="mt-8 border-t border-emerald-100 pt-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-black uppercase tracking-wide text-emerald-900">
                  Food Items & Reservations
                </h2>
                <button
                  type="button"
                  onClick={addFoodItem}
                  className="rounded-full border-[2px] border-emerald-900 bg-[#BBF7D0] px-4 py-2 text-xs font-black uppercase tracking-wide text-emerald-900 shadow-[0_3px_0_0_rgba(16,78,61,0.4)] hover:-translate-y-[1px] hover:shadow-[0_4px_0_0_rgba(16,78,61,0.5)] transition"
                >
                  + Add Food
                </button>
              </div>
              <p className="mb-3 text-xs text-emerald-700">
                Add each distinct food item and specify total portions and a
                per-student limit. Students will reserve specific items.
              </p>

              {foodItems.length === 0 && (
                <div className="rounded-[16px] border-[2px] border-dashed border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">
                  No food items added yet. Click &ldquo;Add Food&rdquo; to start.
                </div>
              )}

              <div className="space-y-4">
                {foodItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="rounded-[20px] border-[2px] border-emerald-200 bg-emerald-50/40 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-900">
                        Food #{index + 1}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeFoodItem(item.id)}
                        className="text-xs font-semibold text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="md:col-span-1">
                        <label className="mb-1 block text-[11px] font-black uppercase tracking-wide text-emerald-900">
                          Food Name
                        </label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) =>
                            updateFoodItem(item.id, "name", e.target.value)
                          }
                          placeholder="e.g., Cheese Pizza"
                          className="w-full rounded-[14px] border-[2px] border-emerald-300 px-3 py-2 text-sm text-emerald-900 placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-black uppercase tracking-wide text-emerald-900">
                          Total Portions
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={item.totalPortions}
                          onChange={(e) =>
                            updateFoodItem(
                              item.id,
                              "totalPortions",
                              e.target.value
                            )
                          }
                          className="w-full rounded-[14px] border-[2px] border-emerald-300 px-3 py-2 text-sm text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-black uppercase tracking-wide text-emerald-900">
                          Max per Student
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={item.perStudentLimit}
                          onChange={(e) =>
                            updateFoodItem(
                              item.id,
                              "perStudentLimit",
                              e.target.value
                            )
                          }
                          className="w-full rounded-[14px] border-[2px] border-emerald-300 px-3 py-2 text-sm text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {errors.foodItems && (
                <p className="mt-2 text-sm text-red-600">{errors.foodItems}</p>
              )}
            </div>
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="rounded-[20px] border-[2px] border-red-500 bg-red-50 p-4">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="rounded-[20px] border-[2px] border-emerald-500 bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-emerald-600">
                Event created successfully! Redirecting...
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 rounded-full border-[3px] border-emerald-900 px-8 py-4 text-lg font-black uppercase tracking-wider text-emerald-900 shadow-[0_5px_0_0_rgba(16,78,61,0.4)] transition-all hover:-translate-y-1 hover:shadow-[0_7px_0_0_rgba(16,78,61,0.5)] active:translate-y-0 ${
                isSubmitting
                  ? "cursor-not-allowed bg-gray-300 opacity-50"
                  : "bg-[#BBF7D0] hover:bg-[#86EFAC]"
              }`}
            >
              {isSubmitting ? "Creating Event..." : "Create Event"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/vendor")}
              className="rounded-full border-[3px] border-emerald-900 bg-white px-8 py-4 text-lg font-black uppercase tracking-wider text-emerald-900 shadow-[0_5px_0_0_rgba(16,78,61,0.4)] transition-all hover:-translate-y-1 hover:shadow-[0_7px_0_0_rgba(16,78,61,0.5)] active:translate-y-0"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
