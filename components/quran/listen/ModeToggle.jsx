import { Headphones, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const MODES = [
  { key: "recitation", label: "Recitation", icon: Headphones },
  { key: "tafsir", label: "Tafsir", icon: BookOpen },
];

export default function ModeToggle({ activeMode, setActiveMode }) {
  return (
    <div className="flex justify-center">
      <div className="relative flex items-center glass rounded-2xl p-1 gap-1">
        {/* Sliding pill indicator */}
        {MODES.map((mode) => (
          <button
            key={mode.key}
            id={`mode-toggle-${mode.key}`}
            onClick={() => setActiveMode(mode.key)}
            className={`relative z-10 flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold font-jakarta transition-all duration-300 cursor-pointer ${
              activeMode === mode.key
                ? "text-white"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {activeMode === mode.key && (
              <motion.div
                layoutId="mode-pill"
                className="absolute inset-0 bg-accent rounded-xl shadow-[0_0_16px_rgba(20,184,166,0.4)]"
                transition={{ type: "spring", damping: 20 }}
              />
            )}
            <mode.icon size={14} className="relative z-10" />
            <span className="relative z-10">{mode.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
