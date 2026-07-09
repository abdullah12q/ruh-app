"use client";

import { AnimatePresence, motion } from "framer-motion";
import useUIStore from "@/lib/store/useUIStore";
import { useAyahTranslation } from "@/lib/queries/quran";
import { Bookmark, Play, Pause } from "lucide-react";
import { FootnoteFormatter } from "./FootnoteFormatter";

export default function AyahCard({ ayah, surahId }) {
  const { activeAyah, setActiveAyah, audioPlaying, toggleAudio, fontSize } =
    useUIStore();
  const isActive = activeAyah === ayah.verse_key;

  const {
    text: translationText,
    footnotes,
    isLoading: translationLoading,
    isError: translationError,
    lang,
  } = useAyahTranslation(surahId, ayah.verse_number);

  function handleAyahClick() {
    if (isActive) {
      toggleAudio();
    } else {
      setActiveAyah(ayah.verse_key);
    }
  }

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
      <div className="flex items-start justify-between gap-4 mb-6">
        <div
          className={`shrink-0 size-9 rounded-xl flex items-center justify-center text-xs font-bold border transition-colors duration-200 ${
            isActive
              ? "bg-accent text-white border-transparent"
              : "bg-accent/10 text-accent border-accent/20"
          }`}
        >
          {ayah.verse_number}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleAyahClick}
            aria-label={
              isActive && audioPlaying ? "Pause recitation" : "Play recitation"
            }
            className="size-8 rounded-lg glass flex items-center justify-center text-text-secondary hover:text-accent transition-colors duration-200"
          >
            {isActive && audioPlaying ? (
              <Pause size={14} />
            ) : (
              <Play size={14} />
            )}
          </button>
          <button
            aria-label="Bookmark this Ayah"
            className="size-8 rounded-lg glass flex items-center justify-center text-text-secondary hover:text-accent transition-colors duration-200"
          >
            <Bookmark size={14} />
          </button>
        </div>
      </div>

      {/* Arabic Text (Uthmanic Script) */}
      <p
        className={`font-quran ${fontSize} text-text-primary text-right leading-loose mb-6`}
        dir="rtl"
        lang="ar"
      >
        {ayah.text_uthmani}
      </p>

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
      <p className="mt-4 text-xs text-(--text-secondary)/40 font-jakarta">
        {ayah.verse_key}
      </p>
    </motion.article>
  );
}
