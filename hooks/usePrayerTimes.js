import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useUIStore from "@/lib/store/useUIStore";
import {
  cleanTime,
  formatCountdown,
  formatPrayerTime,
  getNextPrayer,
  PRAYER_NAMES,
} from "@/data/datas/prayerTimesData";
import {
  fetchLocation,
  fetchPrayerTimes,
} from "@/lib/queries/prayerTimes&Calendar";

export function usePrayerTimes() {
  const {
    prayerCalcMethod,
    dstAdjustment,
    savedCoords,
    setSavedCoords,
    savedLocation,
    setSavedLocation,
  } = useUIStore();

  const [mounted, setMounted] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [nextPrayerKey, setNextPrayerKey] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    // If we already have coords from the store, skip geolocation entirely.
    if (!mounted) return;

    if (!navigator.geolocation) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPermissionDenied(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        const newCoords = { lat, lon };

        setSavedCoords(newCoords); // persist to store
        setPermissionDenied(false);

        fetchLocation(lat, lon).then((loc) => {
          setSavedLocation(loc); // persist to store
        });
      },
      (err) => {
        if (savedCoords?.latitude && savedCoords?.longitude) return;

        if (err.code === err.PERMISSION_DENIED) setPermissionDenied(true);
      },
      { timeout: 10_000, maximumAge: 5 * 60 * 1000 },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    data,
    isLoading: queryLoading,
    isError,
  } = useQuery({
    queryKey: [
      "prayer-times",
      savedCoords?.lat,
      savedCoords?.lon,
      prayerCalcMethod,
    ],
    queryFn: () =>
      fetchPrayerTimes({
        lat: savedCoords.lat,
        lon: savedCoords.lon,
        method: prayerCalcMethod,
      }),
    enabled: !!savedCoords,
    staleTime: 6 * 60 * 60 * 1000, // Cache for 6 hours
    gcTime: 12 * 60 * 60 * 1000,
    retry: 1,
  });

  const applyDst = useCallback(
    (timeStr) => {
      if (!timeStr || !dstAdjustment) return timeStr;
      const parts = timeStr.split(" ");
      const time = parts[0];
      const suffix = parts.length > 1 ? " " + parts.slice(1).join(" ") : "";
      let [h, m] = time.split(":").map(Number);
      h = (h + dstAdjustment + 24) % 24;
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}${suffix}`;
    },
    [dstAdjustment],
  );

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const adjustedTimings = useMemo(() => {
    if (!data?.timings) return null;
    const newTimings = {};
    for (const [key, val] of Object.entries(data.timings)) {
      newTimings[key] = applyDst(val);
    }
    return newTimings;
  }, [data?.timings, applyDst]);

  // Countdown Timer
  const updateCountdown = useCallback(() => {
    if (!adjustedTimings) return;
    const { key, minutesUntil } = getNextPrayer(adjustedTimings);
    setNextPrayerKey(key);
    setCountdown(formatCountdown(minutesUntil));
  }, [adjustedTimings]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    updateCountdown();
    const interval = setInterval(updateCountdown, 60_000); // update every minute
    return () => clearInterval(interval);
  }, [updateCountdown]);

  // n7sn data el prayers ely rag3a
  const prayers = PRAYER_NAMES.map(({ key, label, labelAr, icon }) => {
    const rawTime = adjustedTimings?.[key];
    const cleanedTime = cleanTime(rawTime);
    return {
      key,
      label,
      labelAr,
      icon,
      rawTime: cleanedTime,
      formattedTime: formatPrayerTime(cleanedTime),
      isNext: key === nextPrayerKey,
    };
  });

  // hijri w gregorian Date Data
  const hijri = data?.date?.hijri;
  const gregorian = data?.date?.gregorian;

  const hijriDate = hijri
    ? `${hijri.day} ${hijri.month.en} ${hijri.year}`
    : null;

  const hijriDateAr = hijri
    ? `${hijri.day} ${hijri.month.ar} ${hijri.year}`
    : null;

  const hijriWeekday = hijri?.weekday ?? null; // { en: "Al Arba'a", ar: "الاربعاء" }
  const hijriHolidays = hijri?.holidays ?? []; // string[]
  const hijriYear = hijri?.year ?? null;
  const hijriMonth = hijri?.month?.number ?? null;
  const gregorianDate = gregorian?.date ?? null; // "27-07-2026"
  const gregorianWeekday = gregorian?.weekday.en ?? null; // "Monday"

  return {
    // Geolocation
    coords: savedCoords,
    location: savedLocation,
    permissionDenied,
    // Prayer times
    prayers,
    nextPrayerKey,
    countdown,
    // Date info
    hijriDate,
    hijriDateAr,
    hijriWeekday,
    hijriHolidays,
    hijriYear,
    hijriMonth,
    gregorianDate,
    gregorianWeekday,
    // Query state
    isLoading:
      !savedCoords && !permissionDenied ? true : queryLoading && !!savedCoords,
    isError,
    refetch: () => {
      setSavedCoords(null);
      setSavedLocation(null);
      setPermissionDenied(false);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude: lat, longitude: lon } = pos.coords;
            const newCoords = { lat, lon };

            setSavedCoords(newCoords);

            fetchLocation(lat, lon).then((loc) => {
              setSavedLocation(loc);
            });
          },
          () => setPermissionDenied(true),
          { timeout: 10_000 }, // Timeout after 10 seconds
        );
      }
    },
  };
}
