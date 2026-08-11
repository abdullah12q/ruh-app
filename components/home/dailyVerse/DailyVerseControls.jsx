import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Play,
  Pause,
  RefreshCw,
  Volume2,
  Volume1,
  VolumeX,
} from "lucide-react";
import { formatTime } from "@/data/datas/audioData";
import { useMediaQuery } from "@custom-react-hooks/use-media-query";

export default function DailyVerseControls({
  isPlaying,
  onPlayPauseToggle,
  isFetchingVerse,
  onGetNewVerse,
  currentTime,
  duration,
  onSeek,
  volume,
  onVolumeChange,
}) {
  const [volumeOpen, setVolumeOpen] = useState(false);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  const timelinePct = duration ? (currentTime / duration) * 100 : 0;
  const volumePct = volume * 100;

  return (
    <div className="flex flex-col gap-6 w-full mt-8 px-1">
      {/* TIMELINE */}
      <div className="flex items-center gap-3 font-jakarta w-full">
        <span className="w-9 text-right text-[11px] tabular-nums text-text-secondary">
          {formatTime(currentTime)}
        </span>

        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={(e) => onSeek(Number(e.target.value))}
          style={{ "--range-progress": `${timelinePct}%` }}
          className="range-fill flex-1 h-0.75 rounded-full appearance-none cursor-pointer outline-none"
          aria-label="Audio timeline progress"
        />

        <span className="w-9 text-[11px] tabular-nums text-text-secondary">
          {formatTime(duration)}
        </span>
      </div>

      {/* CONTROLS ROW */}
      <div className="grid grid-cols-3 items-center">
        {/* Left: secondary action */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          onClick={onGetNewVerse}
          disabled={isFetchingVerse}
          aria-label="Get another random verse"
          className="justify-self-start flex items-center gap-2 px-4 py-2 rounded-full text-text-secondary hover:text-accent transition-colors duration-200 text-xs font-jakarta font-medium cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <RefreshCw
            size={13}
            className={isFetchingVerse ? "animate-spin" : ""}
          />
          <span className="hidden sm:inline">New Verse</span>
        </motion.button>

        {/* Center: primary play/pause, the visual anchor of the row */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPlayPauseToggle}
          aria-label={isPlaying ? "Pause recitation" : "Play recitation"}
          className="justify-self-center relative flex items-center justify-center size-14 rounded-full bg-accent text-white shadow-[0_0_24px_var(--accent-glow)] cursor-pointer"
        >
          {isPlaying && (
            <motion.span
              className="absolute inset-0 rounded-full bg-accent"
              animate={{ opacity: [0.5, 0, 0.5], scale: [1, 1.35, 1] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
          <AnimatePresence mode="wait" initial={false}>
            {isPlaying ? (
              <motion.span
                key="pause"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.15 }}
                className="relative"
              >
                <Pause size={20} fill="currentColor" />
              </motion.span>
            ) : (
              <motion.span
                key="play"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.15 }}
                className="relative pl-0.5"
              >
                <Play size={20} fill="currentColor" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Right: volume, msh bayna until hovered/focused */}
        {!isMobile ? (
          <div
            className="justify-self-end flex items-center justify-end"
            onMouseEnter={() => setVolumeOpen(true)}
            onMouseLeave={() => setVolumeOpen(false)}
          >
            <motion.div
              animate={{
                width: volumeOpen ? 88 : 0,
                opacity: volumeOpen ? 1 : 0,
              }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => onVolumeChange(Number(e.target.value))}
                style={{ "--range-progress": `${volumePct}%` }}
                className="range-fill always-show-thumb w-20 h-0.75 rounded-full appearance-none cursor-pointer outline-none mr-3"
                aria-label="Adjust volume"
              />
            </motion.div>

            <button
              onClick={() => onVolumeChange(volume > 0 ? 0 : 1)}
              onFocus={() => setVolumeOpen(true)}
              aria-label="Toggle mute"
              className="flex items-center justify-center size-9 rounded-full text-text-secondary hover:text-accent transition-colors cursor-pointer"
            >
              <VolumeIcon size={16} />
            </button>
          </div>
        ) : (
          <div className="justify-self-end flex items-center">
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              style={{ "--range-progress": `${volumePct}%` }}
              className="range-fill always-show-thumb w-15 h-0.75 rounded-full appearance-none cursor-pointer outline-none"
              aria-label="Adjust volume"
            />
          </div>
        )}
      </div>
    </div>
  );
}
