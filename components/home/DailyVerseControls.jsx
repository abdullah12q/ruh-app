import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RefreshCw } from "lucide-react";

export default function DailyVerseControls({
  isPlaying,
  onPlayPauseToggle,
  onGetNewVerse,
}) {
  return (
    <div className="flex items-center justify-center gap-3">
      {/* Play / Pause */}
      <motion.button
        id="daily-verse-play-pause"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 1 }}
        onClick={onPlayPauseToggle}
        aria-label={isPlaying ? "Pause recitation" : "Play recitation"}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-(--surface-glass-border) hover:border-accent/40 text-text-secondary hover:text-accent transition-colors duration-200 text-sm font-jakarta font-medium cursor-pointer"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isPlaying ? (
            <motion.span
              key="pause"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2"
            >
              <Pause size={14} />
              Pause
            </motion.span>
          ) : (
            <motion.span
              key="play"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2"
            >
              <Play size={14} />
              Play
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Get another verse */}
      <motion.button
        id="daily-verse-refresh"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 1 }}
        onClick={onGetNewVerse}
        aria-label="Get another random verse"
        className="flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-(--surface-glass-border) hover:border-accent/40 text-text-secondary hover:text-accent transition-colors duration-200 text-sm font-jakarta font-medium cursor-pointer"
      >
        <RefreshCw size={14} />
        New Verse
      </motion.button>
    </div>
  );
}
