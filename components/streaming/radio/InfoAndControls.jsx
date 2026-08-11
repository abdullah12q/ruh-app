import {
  WifiOff,
  Pause,
  Play,
  RefreshCw,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RefreshButton from "../RefreshButton";

export default function InfoAndControls({
  station,
  togglePlayPause,
  isLoading,
  isPlaying,
  hasError,
  handleRefresh,
  radioVolume,
  setRadioVolume,
  handleVolumeChange,
}) {
  const genres = Array.isArray(station.genre) ? station.genre.slice(0, 2) : [];

  const VolumeIcon =
    radioVolume === 0 ? VolumeX : radioVolume < 0.5 ? Volume1 : Volume2;
  const volumePct = radioVolume * 100;

  return (
    <div className="flex-1 min-w-0 w-full">
      <div className="mb-1 flex flex-wrap gap-1.5">
        {genres.map((g) => (
          <span
            key={g}
            className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-accent/10 text-accent border border-accent/20 tracking-wide"
          >
            {g}
          </span>
        ))}
        {station.country && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 text-text-secondary border border-white/8 tracking-wide">
            {station.country}
          </span>
        )}
      </div>

      <h2 className="font-jakarta font-bold text-text-primary text-sm sm:text-lg leading-tight mb-0.5">
        {station.name}
      </h2>
      {station.nameAr && (
        <p
          className="font-quran text-accent text-sm sm:text-2xl mb-3 sm:-my-3"
          dir="rtl"
          lang="ar"
        >
          {station.nameAr}
        </p>
      )}
      {station.description && (
        <p className="font-inter text-text-secondary text-xs sm:text-sm mt-1.5 mb-1">
          {station.description}
        </p>
      )}

      {/* Controls Row */}
      <div className="flex items-center gap-4 mt-3">
        {/* Play / Pause */}
        <button
          onClick={togglePlayPause}
          disabled={hasError}
          className={`shrink-0 size-11 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
            hasError
              ? "bg-white/5 text-text-secondary cursor-not-allowed"
              : "bg-accent text-white shadow-[0_0_20px_var(--accent-glow)] hover:scale-110 active:scale-95"
          }`}
        >
          {isLoading ? (
            <div className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : isPlaying ? (
            <Pause size={18} className="fill-white" />
          ) : (
            <Play size={18} className="fill-white ml-0.5" />
          )}
        </button>

        {/* Refresh */}
        <RefreshButton onClick={handleRefresh} isLoading={isLoading} />

        {/* Volume */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRadioVolume(radioVolume > 0 ? 0 : 1)}
            className="p-2 rounded-lg hover:bg-white/10 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            <VolumeIcon size={16} />
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={radioVolume}
            onChange={handleVolumeChange}
            style={{ "--range-progress": `${volumePct}%` }}
            className="range-fill always-show-thumb flex-1 w-25 sm:w-full h-1 rounded-full appearance-none cursor-pointer accent-accent"
          />
        </div>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {hasError && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="mt-3 flex items-start sm:items-center gap-2 text-red-400 text-xs font-inter leading-relaxed"
          >
            <WifiOff size={14} className="shrink-0 mt-0.5 sm:mt-0" />
            <span>
              Stream unavailable. This station may be offline.{" "}
              <span className="text-accent">
                Try{" "}
                <button
                  onClick={handleRefresh}
                  className="font-bold hover:underline cursor-pointer"
                >
                  refreshing
                </button>{" "}
                or switching to another station.
              </span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
