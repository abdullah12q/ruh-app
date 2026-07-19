import { motion } from "framer-motion";
import { Pause, Volume2, Volume1, VolumeX } from "lucide-react";
import { useState } from "react";
import useUIStore from "@/lib/store/useUIStore";
import { useMediaQuery } from "@custom-react-hooks/use-media-query";

export default function AudioNowPlayingBar({ reciterName, onStop }) {
  const { volume, setVolume } = useUIStore();
  const [volumeOpen, setVolumeOpen] = useState(false);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  const volumePct = volume * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-3 glass rounded-2xl px-4 py-3 mb-4 border border-accent/30"
    >
      <div className="flex items-end gap-0.5 h-4 shrink-0">
        {[1, 2, 3, 4].map((i) => (
          <motion.span
            key={i}
            className="w-0.5 bg-accent rounded-full"
            animate={{
              height: ["4px", "14px", "6px", "12px", "4px"],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-accent font-jakarta font-semibold uppercase tracking-wider">
          Now Playing · Al-Fatiha
        </p>
        <p className="text-sm text-text-primary font-jakarta">{reciterName}</p>
      </div>

      {/* Inline volume control */}
      {!isMobile ? (
        <div
          className="flex items-center gap-1"
          onMouseEnter={() => setVolumeOpen(true)}
          onMouseLeave={() => setVolumeOpen(false)}
        >
          <motion.div
            animate={{
              width: volumeOpen ? 72 : 0,
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
              onChange={(e) => setVolume(Number(e.target.value))}
              style={{ "--range-progress": `${volumePct}%` }}
              className="range-fill always-show-thumb w-16 h-0.75 rounded-full appearance-none cursor-pointer outline-none"
              aria-label="Adjust volume"
            />
          </motion.div>
          <button
            onClick={() => setVolume(volume > 0 ? 0 : 1)}
            onFocus={() => setVolumeOpen(true)}
            aria-label="Toggle mute"
            className="shrink-0 size-8 rounded-full glass flex items-center justify-center hover:border-accent/40! text-text-secondary hover:text-accent transition-colors cursor-pointer"
          >
            <VolumeIcon size={13} />
          </button>
        </div>
      ) : (
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          style={{ "--range-progress": `${volumePct}%` }}
          className="range-fill always-show-thumb w-11 h-0.75 rounded-full appearance-none cursor-pointer outline-none"
          aria-label="Adjust volume"
        />
      )}

      <button
        onClick={onStop}
        aria-label="Stop"
        className="shrink-0 size-8 rounded-full glass flex items-center justify-center hover:border-accent/40! transition-colors cursor-pointer"
      >
        <Pause size={13} className="text-accent" />
      </button>
    </motion.div>
  );
}
