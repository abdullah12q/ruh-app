import { motion } from "framer-motion";
import { Heart, Play, Pause } from "lucide-react";
import { cardVariant } from "@/data/animationVariants";

export default function ReciterCard({
  reciter,
  isPlaying,
  isLoading,
  isFav,
  onPlay,
  onFavToggle,
}) {
  return (
    <motion.div
      variants={cardVariant}
      className={`relative group glass rounded-2xl p-4 transition-all duration-300 ${
        isPlaying
          ? "border-accent/50 shadow-[0_0_20px_rgba(20,184,166,0.15)]"
          : "hover:border-accent/30"
      }`}
    >
      {/* Favourite button */}
      <button
        onClick={() => onFavToggle(reciter.id)}
        className="absolute top-3 right-3 z-10"
        aria-label={isFav ? "Remove from favourites" : "Add to favourites"}
      >
        <Heart
          size={14}
          className={`transition-all duration-200 ${
            isFav
              ? "fill-rose-400 text-rose-400 scale-110"
              : "text-text-secondary/40 group-hover:text-rose-400/60"
          } cursor-pointer`}
        />
      </button>

      {/* Play/Pause Button */}
      <button
        onClick={() => onPlay(reciter)}
        disabled={isLoading}
        className={`size-9 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
          isPlaying
            ? "bg-accent text-white shadow-[0_0_14px_rgba(20,184,166,0.5)]"
            : "bg-accent/10 text-accent group-hover:bg-accent/20"
        } cursor-pointer`}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isLoading ? (
          <motion.span
            className="size-3.5 border-2 border-accent border-t-transparent rounded-full block"
            animate={{ rotate: 360 }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ) : isPlaying ? (
          <Pause size={14} />
        ) : (
          <Play size={14} />
        )}
      </button>

      {/* Name Details */}
      <p className="text-xs font-jakarta font-semibold text-text-primary leading-snug line-clamp-2 mb-0.5">
        {reciter.name}
      </p>
      <p
        className="text-xs font-arabic-ui text-text-secondary/70 leading-snug line-clamp-1"
        dir="rtl"
        lang="ar"
      >
        {reciter.nameArabic}
      </p>
    </motion.div>
  );
}
