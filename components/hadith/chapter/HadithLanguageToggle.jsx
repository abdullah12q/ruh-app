import { Languages } from "lucide-react";
import { motion } from "framer-motion";

const LANG_MODES = [
  { id: "both", label: "Both" },
  { id: "arabic", label: "Arabic" },
  { id: "english", label: "English" },
];

export default function HadithLanguageToggle({ langMode, setLangMode }) {
  return (
    <div className="sticky top-17.5 z-30 glass rounded-2xl px-3 py-2 backdrop-blur-xl flex items-center justify-between mb-6">
      <div className="flex items-center gap-2 text-text-secondary text-sm font-inter">
        <Languages size={14} />
        <span>Display</span>
      </div>
      <div className="inline-flex rounded-full gap-0.5">
        {LANG_MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setLangMode(m.id)}
            className={`relative px-4 py-1.5 rounded-full text-[9px] sm:text-xs font-semibold transition-colors cursor-pointer ${
              langMode === m.id
                ? "text-accent"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {langMode === m.id && (
              <motion.div
                layoutId="lang-active"
                className="absolute inset-0 bg-accent/10 border border-accent/20 rounded-full"
                initial={false}
                transition={{ type: "spring", damping: 22 }}
              />
            )}
            <span className="relative">{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
