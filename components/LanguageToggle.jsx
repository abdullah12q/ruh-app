import { motion } from "framer-motion";

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
          className={`px-3 py-1.5 rounded-lg text-[8px] sm:text-xs font-semibold uppercase tracking-wide transition-colors duration-300 ${
            translationLang === l
              ? "text-white bg-accent"
              : "text-text-secondary hover:text-text-primary"
          } cursor-pointer`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
