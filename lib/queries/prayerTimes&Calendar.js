import { useQuery } from "@tanstack/react-query";

/** Fetches today's prayer times from Aladhan. */
export async function fetchPrayerTimes({ lat, lon, method }) {
  const timestamp = Math.floor(Date.now() / 1000);
  const url = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${lon}&method=${method}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Aladhan API error: ${res.status}`);
  const json = await res.json();
  if (json.code !== 200) throw new Error("Aladhan returned non-200 code");
  return json.data;
}

/**
 * Fetches all available calculation methods from Aladhan.
 * Returns a sorted array of { id, name, params } objects.
 */
export async function fetchCalcMethods() {
  const res = await fetch("https://api.aladhan.com/v1/methods");
  if (!res.ok) throw new Error(`Methods API error: ${res.status}`);
  const json = await res.json();
  if (json.code !== 200) throw new Error("Methods API non-200");

  // json.data is an object keyed by method acronym — flatten to array, exclude CUSTOM (id 99)
  return Object.values(json.data).filter((m) => m.id !== 99 && m.name);
}

/** Fetches monthly prayer times calendar from Aladhan. */
async function fetchMonthlyCalendar({ lat, lon, method, year, month }) {
  const url = `https://api.aladhan.com/v1/hijriCalendar/${year}/${month}?latitude=${lat}&longitude=${lon}&method=${method}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Monthly calendar API error: ${res.status}`);
  const json = await res.json();
  if (json.code !== 200) throw new Error("Monthly calendar non-200");
  return json.data; // Array of day objects
}

/** Fetches annual prayer times calendar from Aladhan. */
async function fetchAnnualCalendar({ lat, lon, method, year }) {
  const url = `https://api.aladhan.com/v1/hijriCalendar/${year}?latitude=${lat}&longitude=${lon}&method=${method}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Annual calendar API error: ${res.status}`);
  const json = await res.json();
  if (json.code !== 200) throw new Error("Annual calendar non-200");
  return json.data; // Object keyed by month number, each being an array of days
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Keep track of the last fetched coordinates to prevent React Strict Mode double-fetching
let cachedLocation = null;
let lastCoords = "";

// Reverse Geocode ar,en location
export async function fetchLocation(lat, lon) {
  const currentCoords = `${lat},${lon}`;

  // saves API calls
  if (cachedLocation && lastCoords === currentCoords) {
    return cachedLocation;
  }

  try {
    const arRes = await fetch(
      `/osm-api/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=ar`,
    );
    if (!arRes.ok) return null;
    const arData = await arRes.json();

    // Wait 1.1 seconds to respect Nominatim's strict rate limit
    await delay(1100);

    const enRes = await fetch(
      `/osm-api/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`,
    );
    if (!enRes.ok) return null;
    const enData = await enRes.json();

    const result = {
      ar: arData?.address,
      en: enData?.address,
    };

    cachedLocation = result;
    lastCoords = currentCoords;

    return result;
  } catch (error) {
    console.error("Location fetch failed:", error);
    return null;
  }
}

/**
 * useCalcMethods — Fetches all available calculation methods from Aladhan.
 * The result is cached for 24 hours (methods rarely change).
 */
export function useCalcMethods() {
  return useQuery({
    queryKey: ["aladhan-calc-methods"],
    queryFn: fetchCalcMethods,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 48 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

/**
 * useMonthlyCalendar — Fetches a month's prayer times.
 *
 * @param {{ lat, lon }} coords
 * @param {number} method - Aladhan method ID
 * @param {number} year   - Hijri year
 * @param {number} month  - Hijri month (1–12)
 */
export function useMonthlyCalendar({ coords, method, year, month }) {
  return useQuery({
    queryKey: [
      "prayer-calendar-monthly",
      coords?.lat,
      coords?.lon,
      method,
      year,
      month,
    ],
    queryFn: () =>
      fetchMonthlyCalendar({
        lat: coords.lat,
        lon: coords.lon,
        method,
        year,
        month,
      }),
    enabled: !!coords && !!year && !!month,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 12 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

/**
 * useAnnualCalendar — Fetches a full year's prayer times.
 *
 * @param {{ lat, lon }} coords
 * @param {number} method - Aladhan method ID
 * @param {number} year   - Hijri year
 */
export function useAnnualCalendar({ coords, method, year }) {
  return useQuery({
    queryKey: [
      "prayer-calendar-annual",
      coords?.lat,
      coords?.lon,
      method,
      year,
    ],
    queryFn: () =>
      fetchAnnualCalendar({ lat: coords.lat, lon: coords.lon, method, year }),
    enabled: !!coords && !!year,
    staleTime: 6 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
