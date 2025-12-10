// lib/geocoding.ts
export type Coordinates = {
  lat: number;
  lng: number;
};

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// simple in-memory cache so we don't re-hit Mapbox for the same address
const cache = new Map<string, Coordinates | null>();

/**
 * Geocode a free-form address or place string using Mapbox.
 * Returns { lat, lng } or null if no result.
 */
export async function geocodeLocation(
  query: string
): Promise<Coordinates | null> {
  const trimmed = query?.trim();
  if (!trimmed) return null;

  // return cached result if we have one
  const cached = cache.get(trimmed);
  if (cached !== undefined) {
    return cached;
  }

  if (!MAPBOX_TOKEN) {
    console.warn(
      "geocodeLocation: NEXT_PUBLIC_MAPBOX_TOKEN is not set – cannot geocode"
    );
    cache.set(trimmed, null);
    return null;
  }

  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      trimmed
    )}.json?access_token=${MAPBOX_TOKEN}&limit=1`;

    const res = await fetch(url);
    if (!res.ok) {
      console.error(
        "geocodeLocation: Mapbox response not OK",
        res.status,
        res.statusText
      );
      cache.set(trimmed, null);
      return null;
    }

    const data = await res.json();

    if (!data.features || data.features.length === 0) {
      console.warn("geocodeLocation: no features for query", trimmed);
      cache.set(trimmed, null);
      return null;
    }

    const [lng, lat] = data.features[0].center as [number, number];
    const coords = { lat, lng };

    cache.set(trimmed, coords);
    return coords;
  } catch (err) {
    console.error("geocodeLocation: error while geocoding", err);
    cache.set(trimmed, null);
    return null;
  }
}
