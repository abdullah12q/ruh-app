"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Headphones, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function SheikhCard({
  reciter,
  isSelected,
  selectedMoshaf,
  onSelect,
  onSelectMoshaf,
  getMoshafStyle,
  index,
}) {
  const [showMoshafs, setShowMoshafs] = useState(false);

  // Primary moshaf for display (prefer Murattal)
  const primaryMoshaf =
    reciter.moshaf.find((m) => String(m.moshafType) === "11") ||
    reciter.moshaf[0];
  const primaryStyle = getMoshafStyle(primaryMoshaf?.moshafType);
  const hasMultiple = reciter.moshaf.length > 1;

  function handleClick() {
    onSelect(reciter);
  }

  function handleMoshafClick(e, moshaf) {
    e.stopPropagation();
    onSelectMoshaf(moshaf);
    onSelect(reciter, moshaf);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{
        type: "spring",
        damping: 60,
        stiffness: 200,
        delay: Math.min(index * 0.025, 0.4),
      }}
      className="flex flex-col"
    >
      <div
        onClick={handleClick}
        className={`group relative overflow-hidden glass rounded-2xl p-4 text-left transition-all duration-300 cursor-pointer ${
          isSelected
            ? "border-accent/50 shadow-[0_0_24px_rgba(20,184,166,0.15)]"
            : "hover:border-accent/25 hover:shadow-[0_0_16px_rgba(20,184,166,0.08)]"
        }`}
        aria-pressed={isSelected}
      >
        {/* Selected top glow bar */}
        {isSelected && (
          <motion.div
            layoutId="selected-sheikh-bar"
            className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-accent to-transparent"
            initial={false}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}

        {/* Hover sweep */}
        <span className="absolute bottom-0 left-0 h-px bg-linear-to-r from-transparent via-accent/50 to-transparent w-0 group-hover:w-full transition-all duration-700 ease-out" />

        {/* Card header: initials avatar + name */}
        <div className="flex items-start gap-3">
          {/* Avatar — first letter of Arabic name */}
          <div
            className={`shrink-0 size-10 rounded-xl flex items-center justify-center text-lg font-bold font-arabic-ui transition-all duration-300 ${
              isSelected
                ? "bg-accent text-white"
                : "bg-accent/10 text-accent group-hover:bg-accent/20"
            }`}
            dir="rtl"
            lang="ar"
            aria-hidden
          >
            {reciter.letter}/{reciter.letterEn}
          </div>

          <div className="flex-1 min-w-0">
            {/* English name */}
            <p className="font-jakarta font-semibold text-sm text-text-primary leading-tight max-w-37.5 sm:max-w-max truncate">
              {reciter.nameEn}
            </p>
            {/* Arabic name */}
            <p
              className="font-quran text-sm text-left! text-text-secondary mt-0.5 truncate"
              dir="rtl"
              lang="ar"
            >
              {reciter.nameAr}
            </p>
          </div>

          {/* Selected headphones icon */}
          {isSelected && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="shrink-0 text-accent"
            >
              <Headphones size={16} />
            </motion.div>
          )}
        </div>

        {/* Primary moshaf badge */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full border font-medium ${primaryStyle.color}`}
          >
            {primaryStyle.label}
          </span>

          {/* Multiple moshafs toggle */}
          {hasMultiple && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMoshafs((v) => !v);
              }}
              className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-accent transition-colors cursor-pointer"
              aria-label="Toggle recitation styles"
            >
              {reciter.moshaf.length} styles
              {showMoshafs ? (
                <ChevronUp size={11} />
              ) : (
                <ChevronDown size={11} />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Moshaf picker (expands below the card) */}
      <AnimatePresence>
        {hasMultiple && showMoshafs && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="mt-1.5 glass rounded-2xl p-2 space-y-1">
              {reciter.moshaf.map((moshaf) => {
                const style = getMoshafStyle(moshaf.moshafType);
                const isActiveMoshaf =
                  isSelected && selectedMoshaf?.id === moshaf.id;

                return (
                  <button
                    key={moshaf.id}
                    onClick={(e) => handleMoshafClick(e, moshaf)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all duration-200 cursor-pointer ${
                      isActiveMoshaf
                        ? "bg-accent/15 border border-accent/30"
                        : "hover:bg-accent/5"
                    }`}
                  >
                    <span
                      className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${style.color}`}
                    >
                      <span className="mx-1">{style.label}</span>
                      <span className="font-arabic-ui">{style.labelAr}</span>
                    </span>
                    <span
                      className="font-quran text-xs text-left! text-text-secondary truncate flex-1"
                      dir="rtl"
                      lang="ar"
                    >
                      {moshaf.nameAr}
                    </span>
                    {isActiveMoshaf && (
                      <Headphones size={12} className="text-accent shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
