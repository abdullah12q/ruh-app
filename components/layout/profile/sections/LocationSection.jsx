import { MapPin, RefreshCcw, Loader2 } from "lucide-react";
import { useState } from "react";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import PrayerCalcMethodSelector from "@/components/prayerTimes/PrayerCalcMethodSelector";
import DstAdjustmentToggle from "@/components/prayerTimes/DstAdjustmentToggle";

export default function LocationSection() {
  const [refreshing, setRefreshing] = useState(false);
  const { location, refetch, permissionDenied } = usePrayerTimes();

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Failed to fetch location:", error);
    } finally {
      setRefreshing(false);
    }
  }

  const locEn = location?.en;
  const cityLine = locEn
    ? [locEn.city, locEn.state, locEn.country].filter(Boolean).join(", ")
    : null;

  let locationStatusText = "Location not detected";
  if (refreshing) {
    locationStatusText = "Detecting location...";
  } else if (permissionDenied) {
    locationStatusText = "Location access denied";
  } else if (cityLine) {
    locationStatusText = cityLine;
  }

  return (
    <div className="px-5 py-4 space-y-4">
      {/* Section Title */}
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-lg bg-accent/10 flex items-center justify-center">
          <MapPin size={13} className="text-accent" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">
          Location & Prayer Times
        </span>
      </div>

      {/* Current location */}
      <div className="glass rounded-xl px-4 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <MapPin size={13} className="text-accent shrink-0" />
          <p className="text-sm text-text-primary font-medium truncate">
            {locationStatusText}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent/80 disabled:opacity-50 transition-all cursor-pointer"
          aria-live="polite"
        >
          {refreshing ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <RefreshCcw size={13} />
          )}
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {/* Calculation Method */}
      <div className="space-y-1.5">
        <p className="text-xs text-text-secondary px-1">Calculation Method</p>
        <div className="glass rounded-xl px-4 py-3">
          <PrayerCalcMethodSelector />
        </div>
      </div>

      {/* DST Adjustment */}
      <div className="space-y-1.5">
        <div className="glass rounded-xl px-4 py-3 flex items-center justify-center">
          <DstAdjustmentToggle />
        </div>
      </div>
    </div>
  );
}
