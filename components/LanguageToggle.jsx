import { motion } from "framer-motion";

export default function LanguageToggle({
  translationLang,
  setTranslationLang,
}) {
  return (
    <div
      className="flex items-center gap-0.5 glass rounded-xl p-0.5"
      role="group"
      aria-label="Translation language"
    >
      {["en", "ar"].map((l) => (
        <button
          key={l}
          onClick={() => setTranslationLang(l)}
          aria-pressed={translationLang === l}
          aria-label={l === "en" ? "English translation" : "Arabic translation"}
          className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200 ${
            translationLang === l
              ? "text-white"
              : "text-text-secondary hover:text-text-primary"
          } cursor-pointer`}
        >
          {translationLang === l && (
            <motion.span
              layoutId="lang-pill"
              className="absolute inset-0 bg-accent rounded-lg"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10 uppercase tracking-wide">{l}</span>
        </button>
      ))}
    </div>
  );
}
