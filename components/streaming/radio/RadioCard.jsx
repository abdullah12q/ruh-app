import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";

export default function RadioCard({
  station,
  isActive,
  isPlaying,
  onClick,
  index,
}) {
  const primaryGenre = Array.isArray(station.genre)
    ? station.genre[0]
    : station.genre;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: "easeOut" }}
      onClick={onClick}
      id={`radio-card-${station.id}`}
      className={`relative group w-full text-left rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${
        isActive ? "ring-2 ring-accent" : "hover:scale-[1.02] hover:shadow-lg"
      }`}
      style={
        isActive
          ? {
              boxShadow:
                "0 0 40px rgba(13,148,136,0.25), 0 8px 32px rgba(0,0,0,0.3)",
            }
          : {}
      }
    >
      {/* Background gradient */}
      <div className="absolute inset-0 glass" />
      <div className="absolute inset-0 bg-linear-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {isActive && (
        <div
          className="absolute inset-0 rounded-2xl border-2 border-accent/50"
          style={{ boxShadow: "inset 0 0 20px rgba(13,148,136,0.15)" }}
        />
      )}

      <div className="relative p-4 flex items-center gap-4">
        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Genre badge */}
          {primaryGenre && (
            <span className="inline-block mb-1 text-[10px] font-semibold text-accent/80 tracking-wider uppercase">
              {primaryGenre}
            </span>
          )}
          <p
            title={station.name}
            className="font-jakarta text-text-primary font-semibold text-sm leading-tight truncate"
          >
            {station.name}
          </p>
          {station.nameAr && (
            <p
              className="font-arabic-ui text-text-secondary text-xs truncate mt-0.5"
              dir="rtl"
              lang="ar"
            >
              {station.nameAr}
            </p>
          )}
          {station.country && (
            <p className="font-inter text-text-secondary/60 text-[10px] mt-1 truncate">
              {station.country}
              {station.frequency && ` · ${station.frequency}`}
            </p>
          )}
        </div>

        {/* Play button w now playing indicator */}
        <AnimatePresence mode="popLayout">
          <div
            className={`relative shrink-0 size-9 rounded-full flex items-center justify-center transition-all duration-300 ${
              isActive
                ? "bg-accent text-white shadow-[0_0_16px_var(--accent-glow)]"
                : "bg-white/10 text-text-secondary group-hover:bg-accent/20 group-hover:text-accent"
            }`}
          >
            {isActive && isPlaying ? (
              // equalizer animation
              <motion.div
                key="eq"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-end gap-0.5"
              >
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-0.5 rounded-full bg-white"
                    style={{
                      height: `${6 + i * 3}px`,
                      animation: `equalizer ${0.5 + i * 0.1}s ease-in-out infinite alternate`,
                    }}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="play"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Play
                  size={14}
                  className={`${isActive ? "fill-white" : ""} ml-0.5`}
                />
              </motion.div>
            )}
          </div>
        </AnimatePresence>
      </div>

      {/* Active bottom bar */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: -1 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.4 }}
            className="absolute left-0 bottom-0 w-full h-[1.25px] bg-linear-to-r from-accent via-surface to-accent bg-size-[200%_100%] animate-[shimmer_7s_linear_infinite]"
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}
