import { AnimatePresence, motion } from "framer-motion";
import { Trash2, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import useUIStore from "@/lib/store/useUIStore";
import { useBookmarkVerse, useAyahTranslation } from "@/lib/queries/quran";
import { FootnoteFormatter } from "../../FootnoteFormatter";
import { itemVariants } from "@/data/animationVariants";

export default function BookmarkItem({ surahNum, ayahNum, index, onClose }) {
  const { toggleBookmarkedAyahs } = useUIStore();
  const { data: verse, isLoading: verseLoading } = useBookmarkVerse(
    surahNum,
    ayahNum,
  );

  const {
    text: translationText,
    footnotes,
    isLoading: translationLoading,
    isError: translationError,
    lang,
  } = useAyahTranslation(surahNum, ayahNum);

  const arabicText = verse?.text;
  const verseKey = `${surahNum}:${ayahNum}`;

  return (
    <motion.div
      layout
      custom={index}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="group relative"
    >
      <div className="relative glass rounded-2xl p-4 border border-white/5 hover:border-accent/20 transition-colors duration-300 overflow-hidden">
        {/* Top hairline sweep on hover */}
        <span className="absolute top-0 left-0 h-px bg-linear-to-r from-transparent via-accent to-transparent w-0 group-hover:w-full transition-all duration-700 ease-out" />

        {/* Header row: verse key + action buttons */}
        <div className="flex items-center justify-between mb-3">
          {/* Verse key badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/20 text-accent text-xs font-bold font-jakarta">
              {verseKey}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
            {/* Navigate to ayah */}
            <Link
              href={`/quran/${surahNum}#ayah-${ayahNum}`}
              onClick={onClose}
              className="size-7 rounded-lg flex items-center justify-center text-text-secondary hover:text-accent hover:bg-accent/10 transition-all duration-200"
              aria-label={`Go to ${verseKey}`}
            >
              <ArrowUpRight size={13} />
            </Link>
            {/* Remove bookmark */}
            <button
              onClick={() => toggleBookmarkedAyahs(surahNum, ayahNum)}
              className="size-7 rounded-lg flex items-center justify-center text-text-secondary hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 cursor-pointer"
              aria-label={`Remove bookmark ${verseKey}`}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Arabic text */}
        {verseLoading ? (
          <div className="space-y-1.5 mb-3">
            <div className="h-4 skeleton rounded-full w-full" />
            <div className="h-4 skeleton rounded-full w-3/4 ml-auto" />
          </div>
        ) : arabicText ? (
          <p
            className="font-quran text-lg text-text-primary text-right leading-loose mb-3"
            dir="rtl"
            lang="ar"
          >
            {arabicText}
          </p>
        ) : null}

        {/* Divider */}
        <div className="w-full h-px bg-(--surface-glass-border) mb-3" />

        {/* Translation */}
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
    </motion.div>
  );
}
