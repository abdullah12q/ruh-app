"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import {
  DAILY_VERSE_KEY,
  useAyahTranslation,
  useRandomVerse,
  useSurah,
} from "@/lib/queries/quran";
import useUIStore from "@/lib/store/useUIStore";

import DailyVerseHeader from "./DailyVerseHeader";
import DailyVerseContent from "./DailyVerseContent";
import DailyVerseControls from "./DailyVerseControls";
import { useMediaQuery } from "@custom-react-hooks/use-media-query";

export default function DailyVerseSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const {
    data: verse,
    isLoading: verseLoading,
    refetch: refetchVerse,
  } = useRandomVerse();
  const { data: surah } = useSurah(verse?.surah);

  const {
    translationLang,
    setTranslationLang,
    selectedReciter,
    setSelectedReciter,
    favoriteReciters,
    toggleFavoriteReciter,
  } = useUIStore();

  const {
    text: translationText,
    isLoading: translationLoading,
    isError: translationError,
    lang,
  } = useAyahTranslation(verse?.surah, verse?.sequence.surah);

  // Clears the localStorage cache and fetches a brand-new random verse
  async function handleGetNewVerse() {
    try {
      localStorage.removeItem(DAILY_VERSE_KEY);
    } catch {}

    await refetchVerse();
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: isMobile ? 0.3 : 0.6 }}
          transition={{ type: "spring", duration: 1.4 }}
        >
          {/* Section Label */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-accent text-xs font-semibold font-jakarta tracking-wider uppercase mb-8">
            <Sparkles size={12} />
            Verse of the Day
          </div>

          {/* Glass Card */}
          <div className="glass rounded-3xl px-8 pb-8 pt-4 sm:px-12 sm:pb-12 sm:pt-6 relative">
            {verseLoading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-3 bg-(--surface-glass-border) rounded-full w-full" />
                <div className="h-3 bg-(--surface-glass-border) rounded-full w-4/5" />
                <div className="h-3 bg-(--surface-glass-border) rounded-full w-full" />
                <div className="h-3 bg-(--surface-glass-border) rounded-full w-4/5" />
              </div>
            ) : (
              <>
                {/* Top bar: Reciter + Language */}
                <DailyVerseHeader
                  selectedReciter={selectedReciter}
                  favoriteReciters={favoriteReciters}
                  onSelectReciter={setSelectedReciter}
                  onToggleFavoriteReciter={toggleFavoriteReciter}
                  translationLang={translationLang}
                  onSetTranslationLang={setTranslationLang}
                />

                {/* Decorative glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-64 bg-accent opacity-[0.07] rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                  <DailyVerseContent
                    verse={verse}
                    surah={surah}
                    translationText={translationText}
                    translationLoading={translationLoading}
                    translationError={translationError}
                    lang={lang}
                  />

                  <DailyVerseControls
                    isPlaying={isPlaying}
                    onPlayPauseToggle={() => setIsPlaying((p) => !p)}
                    onGetNewVerse={handleGetNewVerse}
                  />
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
