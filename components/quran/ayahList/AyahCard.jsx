import { AnimatePresence, motion } from "framer-motion";
import useUIStore from "@/lib/store/useUIStore";
import { useAyahTranslation } from "@/lib/queries/quran";
import { useSurahPlayback } from "@/lib/context/SurahPlaybackProvider";
import { Bookmark, Play, Pause } from "lucide-react";
import { FootnoteFormatter } from "@/components/FootnoteFormatter";
import { formatTime } from "@/data/datas/audioData";

export default function AyahCard({ ayah, surahId }) {
  const { fontSize, translationLang, bookmarkedAyahs, toggleBookmarkedAyahs } =
    useUIStore();

  // Shared playback state — the single global <audio> element lives in SurahPlaybackProvider, msh hena.
  const {
    activeAyahNum,
    audioPlaying,
    currentTime,
    duration,
    handleSeek,
    playAyah,
    togglePlayPause,
  } = useSurahPlayback();

  const isBookmarked = bookmarkedAyahs.find(
    (verse) =>
      verse.surahNum === surahId && verse.ayahNum === ayah.verse_number,
  );

  const isActive = activeAyahNum === ayah.verse_number;

  const {
    text: translationText,
    footnotes,
    isLoading: translationLoading,
    isError: translationError,
    lang,
  } = useAyahTranslation(surahId, ayah.verse_number);

  function handleAyahClick() {
    if (!isActive) {
      playAyah(ayah.verse_number);
    } else {
      togglePlayPause();
    }
  }

  const timelinePct = isActive && duration ? (currentTime / duration) * 100 : 0;

  return (
    <motion.article
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      className={`group relative glass rounded-2xl p-6 sm:p-8 transition-all duration-300 ${
        isActive && "shadow-[0_0_24px_rgba(20,184,166,0.12)]!"
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
            className="range-fill flex-1 w-24 sm:w-48 h-0.75 rounded-full appearance-none cursor-pointer outline-none"
            aria-label="Audio timeline progress"
          />

          <span className="text-[11px] tabular-nums text-text-secondary">
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
            onClick={() => toggleBookmarkedAyahs(surahId, ayah.verse_number)}
            aria-label={
              isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"
            }
            className={`size-8 rounded-lg glass flex items-center justify-center transition-colors duration-200 cursor-pointer ${
              isBookmarked
                ? "text-accent hover:opacity-80"
                : "text-text-secondary hover:text-accent"
            }`}
          >
            <Bookmark size={14} fill={isBookmarked ? "currentColor" : "none"} />
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

      {/* Divider */}
      <div className="w-full h-px bg-(--surface-glass-border) mb-5" />

      {/* Translation */}
      {translationLang !== "hide" && (
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
            <AnimatePresence mode="popLayout">
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
      )}

      {/* Verse Key */}
      <p className="mt-4 text-xs text-text-secondary/40 font-jakarta">
        {ayah.verse_key}
      </p>
    </motion.article>
  );
}
