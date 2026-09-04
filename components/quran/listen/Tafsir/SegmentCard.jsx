import { motion } from "framer-motion";
import { Headphones, Play } from "lucide-react";

export default function SegmentCard({ seg, i, handlePlay, isActive }) {
  return (
    <motion.button
      key={seg.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        damping: 60,
        stiffness: 200,
        delay: Math.min(i * 0.025, 0.4),
      }}
      onClick={() => handlePlay(seg)}
      aria-pressed={isActive}
      className={`group relative w-full glass rounded-2xl px-5 py-4 flex items-center gap-4 text-left transition-all duration-300 cursor-pointer overflow-hidden ${
        isActive
          ? "border-accent/50 shadow-[0_0_20px_rgba(20,184,166,0.12)]!"
          : "hover:border-accent/25 hover:shadow-[0_0_12px_rgba(20,184,166,0.06)]!"
      }`}
    >
      {/* Active top bar */}
      {isActive && (
        <motion.div
          layoutId="tafsir-active-bar"
          className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-accent to-transparent"
          initial={false}
          transition={{ type: "spring", damping: 20 }}
        />
      )}

      {/* Hover sweep */}
      <span className="absolute bottom-0 left-0 h-px bg-linear-to-r from-transparent via-accent/40 to-transparent w-0 group-hover:w-full transition-all duration-700 ease-out" />

      {/* Play icon / headphones badge */}
      <div
        className={`shrink-0 size-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
          isActive
            ? "bg-accent text-white"
            : "bg-accent/10 text-accent group-hover:bg-accent/20"
        }`}
      >
        {isActive ? (
          <Headphones size={16} />
        ) : (
          <Play size={15} className="translate-x-0.5" />
        )}
      </div>

      {/* Segment name */}
      <div className="flex-1 min-w-0">
        <p className="font-quran" dir="rtl" lang="ar">
          {seg.name}
        </p>
      </div>

      {/* Segment index */}
      <span className="shrink-0 text-xs text-text-secondary/50 font-jakarta tabular-nums">
        {String(i + 1).padStart(2, "0")}
      </span>
    </motion.button>
  );
}
