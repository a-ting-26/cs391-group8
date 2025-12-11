"use client";

import React, { useEffect, useState } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSelectAddress: (address: string, lat: number, lng: number) => void;
};

type Suggestion = {
  id: string;
  label: string;
  address: string;
  lat: number;
  lng: number;
};

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function AddressAutocomplete({
  value,
  onChange,
  onSelectAddress,
}: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!value || value.length < 3) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const handler = setTimeout(async () => {
      try {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          value
        )}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=5&country=US&proximity=-71.106,42.349`; // Boston-ish

        const res = await fetch(url);
        if (!res.ok) return;

        const data = await res.json();
        if (cancelled) return;

        const feats = (data.features || []) as any[];
        const mapped: Suggestion[] = feats.map((f) => ({
          id: f.id,
          label: f.place_name,
          address: f.place_name,
          lng: f.center[0],
          lat: f.center[1],
        }));
        setSuggestions(mapped);
        setIsOpen(mapped.length > 0);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300); // debounce

    return () => {
      cancelled = true;
      clearTimeout(handler);
    };
  }, [value]);

  const handleSelect = (s: Suggestion) => {
    onSelectAddress(s.address, s.lat, s.lng);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        placeholder="e.g., 775 Commonwealth Ave, Boston"
        className="w-full rounded-[20px] border-[2px] border-emerald-900 px-4 py-3 text-emerald-900 placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      {loading && (
        <span className="absolute right-4 top-3 text-xs text-emerald-500">
          searching...
        </span>
      )}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-[16px] border-[2px] border-emerald-900 bg-white shadow-lg">
          {suggestions.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => handleSelect(s)}
              className="block w-full px-3 py-2 text-left text-sm text-emerald-900 hover:bg-emerald-50"
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
