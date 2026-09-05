"use client";

import { useCallback, useRef, useState } from "react";
import {
  ZoomIn,
  ZoomOut,
  Volume1,
  Volume2,
  VolumeX,
  BookOpen,
  Layers,
  Pause,
  Play,
  Search,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import useUIStore from "@/lib/store/useUIStore";
import { useSurahPlayback } from "@/lib/context/SurahPlaybackProvider";
import ReciterDropdown from "@/components/ReciterDropdown";
import LanguageToggle from "@/components/LanguageToggle";

const FONT_SIZES = [
  "text-[10px]",
  "text-xs",
  "text-sm",
  "text-base",
  "text-lg",
  "text-xl",
  "text-2xl",
  "text-3xl",
  "text-4xl",
  "text-5xl",
  "text-6xl",
  "text-7xl",
  "text-8xl",
  "text-9xl",
];

export default function SurahReadingControls() {
  const {
    fontSize,
    setFontSize,
    volume,
    setVolume,
    translationLang,
    setTranslationLang,
    selectedReciter,
    setSelectedReciter,
    favoriteReciters,
    toggleFavoriteReciter,
    mushafMode,
    toggleMushafMode,
    autoScrollToNextAyah,
    toggleAutoScrollToNextAyah,
  } = useUIStore();

  // Shared playback state — same audio element used by Normal & Mushaf modes.
  const {
    audioPlaying,
    handlePlayButtonPress,
    handleFromNormalModeToMushafMode,
    handleFromMushafModeToNormalMode,
    verses,
    verseToPage,
    goToPage,
  } = useSurahPlayback();

  const [searchAyah, setSearchAyah] = useState("");
  const ayahInputRef = useRef(null);

  function handleSearchSubmit(e) {
    e.preventDefault();
    const ayahNum = parseInt(searchAyah, 10);
    if (isNaN(ayahNum) || !verses) return;

    const ayahExists = verses.some((v) => v.verse_number === ayahNum);
    if (!ayahExists) {
      setSearchAyah("");
      return;
    }

    if (mushafMode) {
      const pageNum = verseToPage.get(ayahNum);
      if (pageNum) {
        goToPage(pageNum);
      }
    } else {
      const ayahEl = document.getElementById(`ayah-${ayahNum}`);
      if (ayahEl) {
        ayahEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
    setSearchAyah("");
    ayahInputRef.current?.blur();
  }

  const currentIndex = FONT_SIZES.indexOf(fontSize);

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  const volumePct = volume * 100;

  const handleVolumeChange = useCallback(
    (newVolume) => {
      setVolume(newVolume);
    },
    [setVolume],
  );

  function handleToggleMushafModeClick() {
    toggleMushafMode();
    if (audioPlaying && !mushafMode) {
      handleFromNormalModeToMushafMode();
    } else if (audioPlaying && mushafMode) {
      handleFromMushafModeToNormalMode();
    }
  }

  return (
    // ── Controls Bar ──
    <div className="sticky top-16.75 sm:top-16.25 z-30 backdrop-blur-xl flex flex-wrap items-center justify-center glass rounded-2xl px-5 py-3 gap-x-6 gap-y-3 mb-6">
      {/* Font Size */}
      <div className="flex items-center gap-1">
        <span className="text-[9px] sm:text-xs text-text-secondary font-jakarta mr-2">
          Font Size
        </span>
        <button
          onClick={() =>
            currentIndex > 0 && setFontSize(FONT_SIZES[currentIndex - 1])
          }
          disabled={currentIndex === 0}
          aria-label="Decrease font size"
          className="size-6 sm:size-8 rounded-lg glass flex items-center justify-center text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <ZoomOut className="size-3 sm:size-4" />
        </button>
        <button
          onClick={() =>
            currentIndex < FONT_SIZES.length - 1 &&
            setFontSize(FONT_SIZES[currentIndex + 1])
          }
          disabled={currentIndex === FONT_SIZES.length - 1}
          aria-label="Increase font size"
          className="size-6 sm:size-8 rounded-lg glass flex items-center justify-center text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <ZoomIn className="size-3 sm:size-4" />
        </button>
      </div>

      {/* Ayah Search */}
      <form
        onSubmit={handleSearchSubmit}
        className="relative flex items-center"
      >
        <div className="absolute left-2.5 text-text-secondary">
          <Search size={14} />
        </div>
        <input
          ref={ayahInputRef}
          type="number"
          min={1}
          max={verses?.length || 286}
          value={searchAyah}
          onChange={(e) => setSearchAyah(e.target.value)}
          placeholder="Ayah..."
          className="w-26 pl-8 pr-3 py-1.5 glass rounded-xl text-xs focus:outline-none focus:border-accent/50! transition-colors duration-400 text-text-primary placeholder:text-text-secondary/50 font-jakarta"
        />
      </form>

      {/* Reciter Dropdown */}
      <ReciterDropdown
        selectedReciter={selectedReciter}
        favoriteReciters={favoriteReciters}
        onSelect={setSelectedReciter}
        onToggleFavorite={toggleFavoriteReciter}
        isPositionCentered
      />

      <AnimatePresence mode="popLayout">
        {!mushafMode && (
          // Auto Scroll Toggle
          <motion.div
            key="auto-scroll-toggle"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
            className="w-fit"
          >
            <label className="flex items-center gap-2 cursor-pointer group select-none">
              <button
                type="button"
                role="switch"
                aria-checked={autoScrollToNextAyah}
                aria-label="Toggle auto scroll to next ayah"
                onClick={() => toggleAutoScrollToNextAyah()}
                className={`relative flex items-center p-0.5 shrink-0 w-8 h-4.5 sm:w-9 sm:h-5 rounded-full border transition-colors duration-400 cursor-pointer ${
                  autoScrollToNextAyah
                    ? "bg-accent/25 border-accent/50 shadow-[0_0_10px_var(--accent-glow)]"
                    : "bg-text-secondary/5 border-text-secondary/15 group-hover:border-accent/30"
                }`}
              >
                <span
                  className={`size-3 sm:size-3.5 rounded-full transition-transform duration-300 ease-out ${
                    autoScrollToNextAyah
                      ? "translate-x-3.5 sm:translate-x-4 bg-accent shadow-[0_0_8px_var(--accent-glow)]"
                      : "translate-x-0 bg-text-secondary/70"
                  }`}
                />
              </button>
              <span
                className={`text-[10px] sm:text-xs font-jakarta font-medium whitespace-nowrap transition-colors duration-400 ${
                  autoScrollToNextAyah
                    ? "text-accent"
                    : "text-text-secondary group-hover:text-text-primary"
                }`}
              >
                Auto Scroll
              </span>
            </label>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {!mushafMode ? (
          // Language Toggle
          <motion.div
            key="language-toggle"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
            className="w-fit"
          >
            <LanguageToggle
              translationLang={translationLang}
              setTranslationLang={setTranslationLang}
            />
          </motion.div>
        ) : (
          // Play/Pause Button
          <motion.button
            key="play-pause"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayButtonPress}
            aria-label={audioPlaying ? "Pause recitation" : "Play recitation"}
            className="justify-self-center relative flex items-center justify-center size-10 rounded-full bg-accent text-white shadow-[0_0_24px_var(--accent-glow)] cursor-pointer"
          >
            {audioPlaying && (
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
              {audioPlaying ? (
                <motion.span
                  key="pause"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.15 }}
                  className="relative"
                >
                  <Pause size={15} fill="currentColor" />
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
                  <Play size={15} fill="currentColor" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </AnimatePresence>

      <div className="flex items-center">
        <button
          onClick={() => handleVolumeChange(volume > 0 ? 0 : 1)}
          aria-label="Toggle mute"
          className="flex items-center justify-center size-9 rounded-full text-text-secondary hover:text-accent transition-colors cursor-pointer"
        >
          <VolumeIcon size={16} />
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => handleVolumeChange(Number(e.target.value))}
          style={{ "--range-progress": `${volumePct}%` }}
          className="range-fill always-show-thumb w-20 h-0.75 rounded-full appearance-none cursor-pointer outline-none mr-3"
          aria-label="Adjust volume"
        />
      </div>

      {/* Mushaf Mode Toggle */}
      <button
        onClick={handleToggleMushafModeClick}
        aria-label={
          mushafMode ? "Switch to Normal Mode" : "Switch to Mushaf Mode"
        }
        aria-pressed={mushafMode}
        className={`
          flex items-center gap-1.5 px-3 py-1.5 rounded-xl w-fit text-[11px] sm:text-xs font-jakarta font-medium
          border transition-all duration-200 cursor-pointer
          ${
            mushafMode
              ? "bg-accent/15 border-accent/40 text-accent shadow-[0_0_12px_rgba(20,184,166,0.15)]"
              : "glass border-transparent text-text-secondary hover:text-accent hover:border-accent/30"
          }
        `}
      >
        {mushafMode ? (
          <Layers size={13} className="shrink-0" />
        ) : (
          <BookOpen size={13} className="shrink-0" />
        )}
        <span className="hidden sm:inline">
          {mushafMode ? "Mushaf" : "Mushaf"}
        </span>
      </button>
    </div>
  );
}
