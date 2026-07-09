import { motion, AnimatePresence } from "framer-motion";
import { FileText, Layers } from "lucide-react";
import { FootnoteFormatter } from "../quran/FootnoteFormatter";

export default function DailyVerseContent({
  verse,
  surah,
  translationText,
  footnotes,
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
          className="font-quran text-3xl text-text-primary mb-6 leading-loose text-center!"
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
            <motion.div
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

      {/* Reference */}
      <div className="flex flex-col items-center gap-3 mb-6">
        <div className="flex items-center justify-center gap-4 w-full">
          <div className="w-12 h-px bg-linear-to-r from-transparent to-(--accent)/40" />
          {surah?.name_arabic && (
            <h3
              className="font-arabic-ui text-xl text-text-primary/90 font-medium"
              dir="rtl"
              lang="ar"
            >
              {surah.name_arabic}
            </h3>
          )}
          <div className="w-12 h-px bg-linear-to-l from-transparent to-(--accent)/40" />
        </div>

        <div className="flex items-center gap-2.5 font-jakarta">
          {surah?.name_simple && (
            <p className="text-sm text-text-secondary/90 tracking-wide">
              {surah.name_simple}
            </p>
          )}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-accent/10 text-accent border border-accent/20">
            <p>Surah {verse?.surah}</p>
            <p className="opacity-50">•</p>
            <p>Ayah {verse?.sequence?.surah}</p>
          </div>
        </div>
      </div>

      {/* Metadata Badges: Juz & Page */}
      {(verse?.juz || verse?.page) && (
        <div className="flex items-center justify-center gap-3 mb-8">
          {verse?.juz && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass text-xs text-text-secondary/70 font-jakarta">
              <Layers size={11} className="text-accent/70" />
              Juz {verse.juz}
            </span>
          )}
          {verse?.page && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass text-xs text-text-secondary/70 font-jakarta">
              <FileText size={11} className="text-accent/70" />
              Page {verse.page}
            </span>
          )}
        </div>
      )}
    </>
  );
}
