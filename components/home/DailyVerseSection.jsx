"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  DAILY_VERSE_KEY,
  useAyahTranslation,
  quranKeys,
  fetchSpecificVerse,
  useRandomOrNextVerse,
  useSurah,
} from "@/lib/queries/quran";
import useUIStore from "@/lib/store/useUIStore";

import DailyVerseHeader from "./DailyVerseHeader";
import DailyVerseContent from "./DailyVerseContent";
import DailyVerseControls from "./DailyVerseControls";
import { useMediaQuery } from "@custom-react-hooks/use-media-query";
import { formatAudioFileName } from "@/data/audioData";
import { calculateNextVerse } from "@/data/verseData";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

export default function DailyVerseSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [targetVerse, setTargetVerse] = useState({ surah: null, ayah: null });

  const queryClient = useQueryClient();

  const isMobile = useMediaQuery("(max-width: 768px)");

  const {
    translationLang,
    setTranslationLang,
    selectedReciter,
    setSelectedReciter,
    favoriteReciters,
    toggleFavoriteReciter,
  } = useUIStore();

  const {
    data: verse,
    isLoading: verseLoading,
    isFetching: isFetchingVerse,
  } = useRandomOrNextVerse(targetVerse.surah, targetVerse.ayah);

  const activeSurahNum = verse?.surah || targetVerse.surah;
  const activeAyahNum = verse?.sequence?.surah || targetVerse.ayah;

  const { data: surah } = useSurah(activeSurahNum);
  const {
    text: translationText,
    footnotes,
    isLoading: translationLoading,
    isError: translationError,
    lang,
  } = useAyahTranslation(activeSurahNum, activeAyahNum);

  const audioUrl = useMemo(() => {
    if (!activeSurahNum || !activeAyahNum || !selectedReciter?.path) return "";

    const fileName = formatAudioFileName(activeSurahNum, activeAyahNum);

    return `https://everyayah.com/data/${selectedReciter.path}/${fileName}`;
  }, [activeSurahNum, activeAyahNum, selectedReciter]);

  const {
    currentTime,
    duration,
    audioRef,
    volume,
    handleSeek,
    handleVolumeChange,
    onTimeUpdate,
    onLoadedMetadata,
  } = useAudioPlayer({
    audioUrl,
    isPlaying,
  });

  // PREFETCHING EFFECT
  // This calculates the next verse and downloads the JSON and MP3 in the background silently.
  useEffect(() => {
    if (!activeSurahNum || !activeAyahNum || !surah || !selectedReciter?.path)
      return;

    const { surah: nextSurah, ayah: nextAyah } = calculateNextVerse(
      activeSurahNum,
      activeAyahNum,
      surah.verses_count,
    );

    // Prefetch API
    queryClient.prefetchQuery({
      queryKey: quranKeys.specificVerse(nextSurah, nextAyah),
      queryFn: () => fetchSpecificVerse(nextSurah, nextAyah),
    });

    // Prefetch Audio File
    const nextFileName = formatAudioFileName(nextSurah, nextAyah);
    if (nextFileName) {
      const preloader = new Audio(
        `https://everyayah.com/data/${selectedReciter.path}/${nextFileName}`,
      );
      preloader.preload = "auto"; // This forces the browser to download and cache the MP3
    }
  }, [activeSurahNum, activeAyahNum, surah, selectedReciter, queryClient]);

  // Clears the localStorage cache and fetches a brand-new random verse
  async function handleGetNewVerse() {
    try {
      localStorage.removeItem(DAILY_VERSE_KEY);
    } catch {}

    // Reset back to random mode before refetching
    setTargetVerse({ surah: null, ayah: null });

    // Refetch the random-verse query directly via the key, instead of the
    // stale `refetchVerse` closure (which may still point at the old
    // specific-verse query at the moment this runs)
    await queryClient.refetchQueries({
      queryKey: quranKeys.randomVerse(),
      exact: true,
    });
  }

  function handleNextVerse() {
    if (!surah) return;
    const { surah: nextSurah, ayah: nextAyah } = calculateNextVerse(
      activeSurahNum,
      activeAyahNum,
      surah.verses_count,
    );
    // Updating this state triggers the hook to fetch the new verse.
    // When the new verse arrives, el existing useEffect automatically updates the audioUrl.
    setTargetVerse({ surah: nextSurah, ayah: nextAyah });
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
                    footnotes={footnotes}
                    translationLoading={translationLoading}
                    translationError={translationError}
                    lang={lang}
                  />

                  {/* Hidden audio player */}
                  <audio
                    ref={audioRef}
                    src={audioUrl || undefined}
                    autoPlay={isPlaying}
                    onEnded={handleNextVerse}
                    onPlay={() => setIsPlaying(true)}
                    onTimeUpdate={onTimeUpdate}
                    onLoadedMetadata={onLoadedMetadata}
                  />

                  <DailyVerseControls
                    isPlaying={isPlaying}
                    onPlayPauseToggle={() => setIsPlaying((p) => !p)}
                    isFetchingVerse={isFetchingVerse}
                    onGetNewVerse={handleGetNewVerse}
                    currentTime={currentTime}
                    duration={duration}
                    onSeek={handleSeek}
                    volume={volume}
                    onVolumeChange={handleVolumeChange}
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
