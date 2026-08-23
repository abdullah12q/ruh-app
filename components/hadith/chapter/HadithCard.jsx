import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CopyButton from "./CopyButton";
import GradesSection from "./GradesSection";

const LANG_MODE = {
  BOTH: "both",
  ARABIC: "arabic",
  ENGLISH: "english",
};

export default function HadithCard({
  hadith,
  index,
  langMode = LANG_MODE.BOTH,
}) {
  const [copiedEn, setCopiedEn] = useState(false);
  const [copiedAr, setCopiedAr] = useState(false);
  const [gradesOpen, setGradesOpen] = useState(false);

  const handleCopyEnglish = useCallback(async () => {
    const narrator = hadith.english?.narrator ?? "";
    const text = hadith.english?.text ?? "";
    const full = narrator ? `${narrator}\n\n${text}` : text;
    try {
      await navigator.clipboard.writeText(full);
      setCopiedEn(true);
      setTimeout(() => setCopiedEn(false), 2000);
    } catch {}
  }, [hadith]);

  const handleCopyArabic = useCallback(async () => {
    const text = hadith.arabic ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAr(true);
      setTimeout(() => setCopiedAr(false), 2000);
    } catch {}
  }, [hadith]);

  const showArabic =
    langMode === LANG_MODE.BOTH || langMode === LANG_MODE.ARABIC;
  const showEnglish =
    langMode === LANG_MODE.BOTH || langMode === LANG_MODE.ENGLISH;

  const grades =
    Array.isArray(hadith.grades) && hadith.grades.length > 0
      ? hadith.grades
      : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.5) }}
      className="glass rounded-2xl overflow-hidden group"
    >
      {/* Top bar: hadith number + actions */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-(--surface-glass-border)">
        <div className="flex items-center gap-2.5">
          <span className="px-2 py-1 rounded-lg bg-accent/10 text-accent text-xs font-jakarta font-bold flex items-center justify-center shrink-0">
            {hadith.idInBook}
          </span>
          <span className="text-xs text-text-secondary font-inter">
            Hadith #{hadith.idInBook}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {showArabic && hadith.arabic && (
            <CopyButton
              onClick={handleCopyArabic}
              copied={copiedAr}
              label="Copy Arabic text"
              title="Copy Arabic"
            />
          )}
          {showEnglish && hadith.english?.text && (
            <CopyButton
              onClick={handleCopyEnglish}
              copied={copiedEn}
              label="Copy English text"
              title="Copy English"
            />
          )}
        </div>
      </div>

      {/* Arabic text */}
      <AnimatePresence mode="popLayout">
        {showArabic && hadith.arabic && (
          <motion.div
            key="arabic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="px-5 pt-4 pb-3"
          >
            <p
              className="font-arabic-ui text-right text-text-primary leading-[2.1] text-base sm:text-lg"
              dir="rtl"
              lang="ar"
            >
              {hadith.arabic}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Divider (only when both are shown) */}
      {showArabic && showEnglish && hadith.arabic && (
        <div className="mx-5 border-t border-(--surface-glass-border) my-1" />
      )}

      {/* English text */}
      <AnimatePresence mode="popLayout">
        {showEnglish && (
          <motion.div
            key="english"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="px-5 pt-3 pb-5"
          >
            {hadith.english?.narrator && (
              <p className="font-inter text-sm text-accent italic mb-2 leading-relaxed">
                {hadith.english.narrator}
              </p>
            )}
            {hadith.english?.text && (
              <p className="font-inter text-text-primary text-sm leading-[1.85] whitespace-pre-line">
                {hadith.english.text}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grades section */}
      <GradesSection
        grades={hadith.grades}
        gradesOpen={gradesOpen}
        setGradesOpen={setGradesOpen}
      />
    </motion.article>
  );
}
