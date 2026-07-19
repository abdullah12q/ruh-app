"use client";

import { AnimatePresence, motion } from "framer-motion";
import useUIStore from "@/lib/store/useUIStore";
import { useAyahTranslation } from "@/lib/queries/quran";
import { Bookmark, Play, Pause } from "lucide-react";
import { FootnoteFormatter } from "@/components/FootnoteFormatter";
import { useEffect, useMemo } from "react";
import { formatAudioFileName, formatTime } from "@/data/datas/audioData";
import { calculateNextVerse } from "@/data/datas/verseData";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

export default function AyahCard({ totalVerses, ayah, surahId }) {
  const {
    fontSize,
    activeAyah,
    setActiveAyah,
    audioPlaying,
    setAudioPlaying,
    selectedReciter,
  } = useUIStore();
  const isActive =
    surahId !== activeAyah?.surahNum
      ? false
      : activeAyah?.ayahNum === ayah.verse_number;

  const {
    text: translationText,
    footnotes,
    isLoading: translationLoading,
    isError: translationError,
    lang,
  } = useAyahTranslation(surahId, ayah.verse_number);

  const audioUrl = useMemo(() => {
    if (!surahId || !ayah.verse_number || !selectedReciter?.path) return "";

    const fileName = formatAudioFileName(surahId, ayah.verse_number);
    return `https://everyayah.com/data/${selectedReciter.path}/${fileName}`;
  }, [surahId, ayah.verse_number, selectedReciter]);

  const {
    currentTime,
    setCurrentTime,
    duration,
    audioRef,
    handleSeek,
    onTimeUpdate,
    onLoadedMetadata,
  } = useAudioPlayer({
    audioUrl,
    isPlaying: isActive && audioPlaying,
  });

  // PREFETCHING EFFECT
  // This calculates the next verse and downloads the JSON and MP3 in the background silently.
  useEffect(() => {
    if (!isActive) return;
    if (!surahId || !activeAyah?.ayahNum || !selectedReciter?.path) return;

    const { surah: nextSurah, ayah: nextAyah } = calculateNextVerse(
      surahId,
      activeAyah?.ayahNum,
      totalVerses,
    );

    // Stop prefetching if we are in the last ayah in the Surah
    if (nextSurah > surahId) return;

    // Prefetch Audio File
    const nextFileName = formatAudioFileName(nextSurah, nextAyah);
    if (nextFileName) {
      const preloader = new Audio(
        `https://everyayah.com/data/${selectedReciter.path}/${nextFileName}`,
      );
      preloader.preload = "auto"; // This forces the browser to download and cache the MP3
    }
  }, [isActive, surahId, activeAyah?.ayahNum, selectedReciter, totalVerses]);

  function handleAyahClick() {
    if (!isActive) {
      setActiveAyah(surahId, ayah.verse_number);
      setCurrentTime(0);
      setAudioPlaying(true);
    } else {
      setAudioPlaying(!audioPlaying);
    }
  }

  function handleNextVerse() {
    if (!surahId || !activeAyah?.ayahNum) return;
    setCurrentTime(0);
    const { surah: nextSurah, ayah: nextAyah } = calculateNextVerse(
      surahId,
      activeAyah?.ayahNum,
      totalVerses,
    );

    // Stop if we are in the last ayah in the Surah
    if (nextSurah > surahId) {
      setActiveAyah(surahId, activeAyah?.ayahNum);
      if (audioPlaying) {
        setAudioPlaying(false);
      }
      return;
    }

    // Updating this state triggers the hook to fetch the new verse.
    setActiveAyah(surahId, nextAyah);
  }

  const timelinePct = duration ? (currentTime / duration) * 100 : 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ type: "spring", damping: 100, stiffness: 300 }}
      className={`group relative glass rounded-2xl p-6 sm:p-8 transition-all duration-300 ${
        isActive
          ? "border-(--accent)/40 shadow-[0_0_24px_rgba(20,184,166,0.12)]"
          : "hover:border-(--surface-glass-border) hover:shadow-md"
      }`}
      id={`ayah-${ayah.verse_number}`}
    >
      {/* Active indicator bar */}
      {isActive && (
        <motion.div
          layoutId="active-ayah-bar"
          className="absolute left-0 top-6 bottom-6 w-0.5 bg-accent rounded-full"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      {/* Ayah Number Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div
          className={`shrink-0 size-9 rounded-xl flex items-center justify-center text-xs font-bold border transition-colors duration-200 ${
            isActive
              ? "bg-accent text-white border-transparent"
              : "bg-accent/10 text-accent border-accent/20"
          }`}
        >
          {ayah.verse_number}
        </div>

        {/* TIMELINE */}
        <div className="flex items-center gap-3 font-jakarta">
          <span className="w-9 text-right text-[11px] tabular-nums text-text-secondary">
            {formatTime(isActive ? currentTime : 0)}
          </span>

          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={isActive ? currentTime : 0}
            onChange={(e) => {
              if (isActive) handleSeek(Number(e.target.value));
            }}
            style={{ "--range-progress": `${isActive ? timelinePct : 0}%` }}
            className="range-fill flex-1 h-0.75 rounded-full appearance-none cursor-pointer outline-none"
            aria-label="Audio timeline progress"
          />

          <span className="w-9 text-[11px] tabular-nums text-text-secondary">
            {formatTime(isActive ? duration : 0)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleAyahClick}
            aria-label={
              isActive && audioPlaying ? "Pause recitation" : "Play recitation"
            }
            className="size-8 rounded-lg glass flex items-center justify-center text-text-secondary hover:text-accent transition-colors duration-200 cursor-pointer"
          >
            {isActive && audioPlaying ? (
              <Pause size={14} />
            ) : (
              <Play size={14} />
            )}
          </button>
          <button
            aria-label="Bookmark this Ayah"
            className="size-8 rounded-lg glass flex items-center justify-center text-text-secondary hover:text-accent transition-colors duration-200 cursor-pointer"
          >
            <Bookmark size={14} />
          </button>
        </div>
      </div>

      {/* Arabic Text (qpc-hafs Script) */}
      <p
        className={`font-quran ${fontSize} text-text-primary text-right leading-loose mb-6`}
        dir="rtl"
        lang="ar"
      >
        {ayah.text_qpc_hafs}
      </p>

      {/* Hidden audio player */}
      {isActive && (
        <audio
          ref={audioRef}
          src={audioUrl || undefined}
          autoPlay={audioPlaying}
          onEnded={handleNextVerse}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
        />
      )}

      {/* Divider */}
      <div className="w-full h-px bg-(--surface-glass-border) mb-5" />

      {/* Translation */}
      <div className="min-h-8">
        {translationLoading ? (
          // Skeleton shimmer while translation loads
          <div className="space-y-2 animate-pulse">
            <div className="h-3 bg-(--surface-glass-border) rounded-full w-full" />
            <div className="h-3 bg-(--surface-glass-border) rounded-full w-4/5" />
          </div>
        ) : translationError ? (
          <p className="font-inter text-xs text-red-400/60 italic">
            Translation unavailable.
          </p>
        ) : translationText ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={translationText}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`text-sm sm:text-base text-text-secondary leading-relaxed ${
                lang === "ar" ? "font-arabic-ui text-right" : "font-inter"
              }`}
              dir={lang === "ar" ? "rtl" : "ltr"}
              lang={lang === "ar" ? "ar" : "en"}
            >
              {translationText}
              {footnotes && lang === "en" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-2 p-3 bg-(--surface-glass-border) rounded-lg"
                >
                  <FootnoteFormatter text={footnotes} />
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        ) : null}
      </div>

      {/* Verse Key */}
      <p className="mt-4 text-xs text-text-secondary/40 font-jakarta">
        {ayah.verse_key}
      </p>
    </motion.article>
  );
}
