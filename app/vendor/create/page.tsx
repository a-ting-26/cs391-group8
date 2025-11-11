"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import VendorNavBar from "../components/VendorNavBar";

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

export default function CreateEventPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    organizerName: "",
    location: "",
    availableFood: "",
    category: "",
    dietaryTags: [] as string[],
    description: "",
    startTime: "",
    endTime: "",
    featuredPhoto: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleDietaryToggle = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      dietaryTags: prev.dietaryTags.includes(tag)
        ? prev.dietaryTags.filter((t) => t !== tag)
        : [...prev.dietaryTags, tag],
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!formData.organizerName.trim()) {
      newErrors.organizerName = "Organizer name is required";
      isValid = false;
    }
    if (!formData.location) {
      newErrors.location = "Location is required";
      isValid = false;
    }
    if (!formData.availableFood.trim()) {
      newErrors.availableFood = "Available food is required";
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

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSuccess(false);

    try {
      const locationLabel = LOCATIONS.find((loc) => loc.value === formData.location)?.label || "";

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
        body: JSON.stringify({
          organizerName: formData.organizerName,
          location: formData.location,
          locationLabel: locationLabel,
          availableFood: formData.availableFood,
          category: formData.category,
          dietaryTags: formData.dietaryTags,
          description: formData.description,
          startTime: formData.startTime,
          endTime: formData.endTime,
          featuredPhoto: formData.featuredPhoto || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create event");
      }

      setSuccess(true);

      // Redirect to vendor page after 1.5 seconds
      setTimeout(() => {
        router.push("/vendor");
      }, 1500);
    } catch (error: any) {
      let errorMessage = error.message || "Failed to create event";
      
      // Provide more helpful error messages
      if (errorMessage.includes("Unauthorized") || errorMessage.includes("401")) {
        errorMessage = "You must be logged in to create events. Please log in and try again.";
      }
      
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f9f8f4]">
      <VendorNavBar />
      
      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8">
          <h1
            className="text-4xl font-black uppercase tracking-wide text-emerald-900 mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Create New Event
          </h1>
          <p className="text-emerald-800">Post your event and share leftover food with the BU community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-[30px] border-[3px] border-emerald-900 bg-white p-6 shadow-[0_5px_0_0_rgba(16,78,61,0.3)]">
            {/* Organizer Name */}
            <div className="mb-6">
              <label htmlFor="organizerName" className="block text-sm font-black uppercase tracking-wide text-emerald-900 mb-2">
                Organizer Name *
              </label>
              <input
                type="text"
                id="organizerName"
                name="organizerName"
                value={formData.organizerName}
                onChange={handleChange}
                placeholder="e.g., BU Dining Services"
                className={`w-full px-4 py-3 border-[2px] rounded-[20px] text-emerald-900 placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.organizerName ? "border-red-500" : "border-emerald-300"
                }`}
              />
              {errors.organizerName && (
                <p className="mt-1 text-sm text-red-600">{errors.organizerName}</p>
              )}
            </div>

            {/* Location */}
            <div className="mb-6">
              <label htmlFor="location" className="block text-sm font-black uppercase tracking-wide text-emerald-900 mb-2">
                Location *
              </label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-[2px] rounded-[20px] text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
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

            {/* Available Food */}
            <div className="mb-6">
              <label htmlFor="availableFood" className="block text-sm font-black uppercase tracking-wide text-emerald-900 mb-2">
                Available Food *
              </label>
              <textarea
                id="availableFood"
                name="availableFood"
                value={formData.availableFood}
                onChange={handleChange}
                placeholder="e.g., Pizza, Sandwiches, Salads"
                rows={3}
                className={`w-full px-4 py-3 border-[2px] rounded-[20px] text-emerald-900 placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none ${
                  errors.availableFood ? "border-red-500" : "border-emerald-300"
                }`}
              />
              {errors.availableFood && (
                <p className="mt-1 text-sm text-red-600">{errors.availableFood}</p>
              )}
            </div>

            {/* Category */}
            <div className="mb-6">
              <label htmlFor="category" className="block text-sm font-black uppercase tracking-wide text-emerald-900 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-[2px] rounded-[20px] text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
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
              <label className="block text-sm font-black uppercase tracking-wide text-emerald-900 mb-3">
                Dietary Tags (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-3">
                {DIETARY_OPTIONS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleDietaryToggle(tag)}
                    className={`px-4 py-2 rounded-full border-[2px] text-sm font-bold uppercase tracking-wide transition-all ${
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
              <label htmlFor="description" className="block text-sm font-black uppercase tracking-wide text-emerald-900 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add more details about your event..."
                rows={4}
                className="w-full px-4 py-3 border-[2px] border-emerald-300 rounded-[20px] text-emerald-900 placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>

            {/* Start Time */}
            <div className="mb-6">
              <label htmlFor="startTime" className="block text-sm font-black uppercase tracking-wide text-emerald-900 mb-2">
                Start Time *
              </label>
              <input
                type="datetime-local"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-[2px] rounded-[20px] text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.startTime ? "border-red-500" : "border-emerald-300"
                }`}
              />
              {errors.startTime && (
                <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>
              )}
            </div>

            {/* End Time */}
            <div className="mb-6">
              <label htmlFor="endTime" className="block text-sm font-black uppercase tracking-wide text-emerald-900 mb-2">
                End Time *
              </label>
              <input
                type="datetime-local"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-[2px] rounded-[20px] text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.endTime ? "border-red-500" : "border-emerald-300"
                }`}
              />
              {errors.endTime && (
                <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>
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
              <p className="text-sm text-emerald-600 font-semibold">
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
                  ? "bg-gray-300 cursor-not-allowed opacity-50"
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

