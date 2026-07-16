"use client";

import { useCallback, useEffect } from "react";
import { ZoomIn, ZoomOut, Volume1, Volume2, VolumeX } from "lucide-react";
import useUIStore from "@/lib/store/useUIStore";
import imamList from "@/data/imam.json";
import ReciterDropdown from "./ReciterDropdown";
import LanguageToggle from "./LanguageToggle";

const FONT_SIZES = ["text-xl", "text-2xl", "text-3xl", "text-4xl"];

export default function SurahReadingControls({ surahId }) {
  const {
    fontSize,
    setFontSize,
    activeAyah,
    volume,
    setVolume,
    translationLang,
    setTranslationLang,
    selectedReciter,
    setSelectedReciter,
    favoriteReciters,
    toggleFavoriteReciter,
    setLastRead,
  } = useUIStore();

  const currentIndex = FONT_SIZES.indexOf(fontSize);

  useEffect(() => {
    setLastRead(surahId, activeAyah);
  }, [surahId, setLastRead, activeAyah]);

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  const volumePct = volume * 100;

  const handleVolumeChange = useCallback(
    (newVolume) => {
      setVolume(newVolume);
    },
    [setVolume],
  );

  return (
    // ── Controls Bar ──
    <div className="sticky top-16.75 sm:top-16.25 z-30 backdrop-blur-xl flex flex-wrap items-center justify-between glass rounded-2xl px-5 py-3 gap-3 mb-6">
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
    </div>
  );
}
