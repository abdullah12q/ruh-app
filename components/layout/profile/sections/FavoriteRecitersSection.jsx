import { Mic, Star } from "lucide-react";
import useUIStore from "@/lib/store/useUIStore";
import ReciterDropdown from "@/components/ReciterDropdown";

export default function FavoriteRecitersSection() {
  const {
    selectedReciter,
    setSelectedReciter,
    favoriteReciters,
    toggleFavoriteReciter,
  } = useUIStore();

  const favCount = favoriteReciters.length;

  return (
    <div className="px-5 py-4 space-y-3">
      {/* Section Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-accent/10 flex items-center justify-center">
            <Mic size={13} className="text-accent" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">
            Reciters
          </span>
        </div>
        {favCount > 0 && (
          <span className="flex items-center gap-1 text-[10px] text-amber-400 font-semibold">
            <Star size={10} fill="currentColor" />
            {favCount} favorite{favCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Current Reciter + Dropdown */}
      <div className="glass rounded-xl px-4 py-3 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-text-secondary">Active Reciter</p>
          <p className="text-xs font-semibold text-text-primary truncate max-w-45 text-right">
            {selectedReciter?.name ?? "—"}
          </p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-text-secondary">Change</p>
          <ReciterDropdown
            selectedReciter={selectedReciter}
            favoriteReciters={favoriteReciters}
            onSelect={setSelectedReciter}
            onToggleFavorite={toggleFavoriteReciter}
          />
        </div>
      </div>
    </div>
  );
}
