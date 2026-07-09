import { motion, AnimatePresence } from "framer-motion";

export default function DailyVerseContent({
  verse,
  surah,
  translationText,
  translationLoading,
  translationError,
  lang,
}) {
  return (
    <>
      {/* Arabic Ayah */}
      <AnimatePresence mode="wait">
        <motion.p
          key={verse?.surah + "-" + verse?.sequence?.surah}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className="font-quran text-3xl text-text-primary mb-8 leading-loose text-center!"
          dir="rtl"
          lang="ar"
        >
          {verse?.text}
        </motion.p>
      </AnimatePresence>

      {/* Divider */}
      <div className="w-16 h-px bg-(--accent)/40 mx-auto mb-6" />

      {/* Translation */}
      <div className="mb-6">
        {translationLoading ? (
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
            <motion.p
              key={translationText}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`text-sm sm:text-base text-text-secondary leading-relaxed ${
                lang === "ar" ? "font-arabic-ui" : "font-inter"
              }`}
              dir={lang === "ar" ? "rtl" : "ltr"}
              lang={lang === "ar" ? "ar" : "en"}
            >
              &ldquo; {translationText} {""} &rdquo;
            </motion.p>
          </AnimatePresence>
        ) : null}
      </div>

      {/* Reference */}
      <p className="text-sm text-accent font-medium font-jakarta mb-8">
        Surah {surah?.name_simple}, {verse?.surah}:{verse?.sequence?.surah}
      </p>
    </>
  );
}
