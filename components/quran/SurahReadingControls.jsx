"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Focus, ZoomIn, ZoomOut, X } from "lucide-react";
import useUIStore from "@/lib/store/useUIStore";
import imamList from "@/data/imam.json";
import ReciterDropdown from "./ReciterDropdown";
import LanguageToggle from "./LanguageToggle";

const FONT_SIZES = ["text-xl", "text-2xl", "text-3xl", "text-4xl"];

export default function SurahReadingControls({ surahId }) {
  const {
    focusMode,
    toggleFocusMode,
    fontSize,
    setFontSize,
    setCurrentSurahId,
    translationLang,
    setTranslationLang,
    selectedReciter,
    setSelectedReciter,
    favoriteReciters,
    toggleFavoriteReciter,
  } = useUIStore();

  const currentIndex = FONT_SIZES.indexOf(fontSize);

  useEffect(() => {
    setCurrentSurahId(surahId);
    return () => setCurrentSurahId(null);
  }, [surahId, setCurrentSurahId]);

  return (
    <>
      {/* ── Controls Bar ── */}
      <div className="flex items-center justify-between glass rounded-2xl px-5 py-3 mb-6 gap-3 flex-wrap">
        {/* Font Size */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-text-secondary font-jakarta mr-2">
            Font Size
          </span>
          <button
            onClick={() =>
              currentIndex > 0 && setFontSize(FONT_SIZES[currentIndex - 1])
            }
            disabled={currentIndex === 0}
            aria-label="Decrease font size"
            className="size-8 rounded-lg glass flex items-center justify-center text-text-secondary hover:text-text-primary disabled:opacity-30 transition-all cursor-pointer"
          >
            <ZoomOut size={14} />
          </button>
          <button
            onClick={() =>
              currentIndex < FONT_SIZES.length - 1 &&
              setFontSize(FONT_SIZES[currentIndex + 1])
            }
            disabled={currentIndex === FONT_SIZES.length - 1}
            aria-label="Increase font size"
            className="size-8 rounded-lg glass flex items-center justify-center text-text-secondary hover:text-text-primary disabled:opacity-30 transition-all cursor-pointer"
          >
            <ZoomIn size={14} />
          </button>
        </div>

        {/* Reciter Dropdown */}
        <ReciterDropdown
          reciters={imamList}
          selectedReciter={selectedReciter}
          favoriteReciters={favoriteReciters}
          onSelect={setSelectedReciter}
          onToggleFavorite={toggleFavoriteReciter}
        />

        {/* Language Toggle */}
        <LanguageToggle
          translationLang={translationLang}
          setTranslationLang={setTranslationLang}
        />

        {/* Focus Mode Toggle */}
        <button
          onClick={toggleFocusMode}
          aria-pressed={focusMode}
          aria-label={focusMode ? "Exit focus mode" : "Enter focus mode"}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
            focusMode
              ? "bg-accent text-white shadow-[0_0_16px_rgba(20,184,166,0.4)]"
              : "glass text-text-secondary hover:text-accent"
          } cursor-pointer`}
        >
          {focusMode ? <X size={13} /> : <Focus size={13} />}
          {focusMode ? "Exit Focus" : "Focus Mode"}
        </button>
      </div>

      {/* Focus Mode Overlay */}
      <AnimatePresence>
        {focusMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm pointer-events-none"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  );
}
