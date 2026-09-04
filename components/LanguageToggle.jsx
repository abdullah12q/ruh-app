import { AnimatePresence, motion } from "framer-motion";

export default function LanguageToggle({
  translationLang,
  setTranslationLang,
}) {
  return (
    <div
      className="flex items-center gap-0.5 glass rounded-xl"
      role="group"
      aria-label="Translation language"
    >
      {["en", "ar", "hide"].map((l) => (
        <button
          key={l}
          onClick={() => setTranslationLang(l)}
          aria-pressed={translationLang === l}
          aria-label={
            l === "en"
              ? "English translation"
              : l === "ar"
                ? "Arabic translation"
                : "Hide translation"
          }
          className={`relative px-3 py-1.5 rounded-lg text-[8px] sm:text-xs font-semibold uppercase tracking-wide transition-colors duration-300 cursor-pointer ${
            translationLang === l
              ? "text-white"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <AnimatePresence>
            {translationLang === l && (
              <motion.div
                key="active-bg"
                className="absolute inset-0 bg-accent rounded-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", damping: 25 }}
              />
            )}
          </AnimatePresence>

          <span className="relative z-10">{l}</span>
        </button>
      ))}
    </div>
  );
}
