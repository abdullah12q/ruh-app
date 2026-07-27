import { useState } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search surahs, ayahs, or number...",
  isLoading = false,
  hint,
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-8 group">
      {/* focus glow */}
      <div
        className={`absolute inset-0 rounded-full bg-accent/25 blur-2xl transition-opacity duration-500 pointer-events-none ${
          isFocused ? "opacity-70" : "opacity-0 group-hover:opacity-40"
        }`}
      />

      <div
        className={`relative flex items-center glass rounded-full overflow-hidden border transition-all duration-300 bg-background/50 ${
          isFocused
            ? "border-accent/50 shadow-[0_0_0_1px_var(--accent-glow),0_8px_32px_-4px_var(--accent-glow)]"
            : "border-white/10 dark:border-white/5"
        }`}
      >
        <div
          className={`pl-5 transition-colors duration-300 ${
            isFocused ? "text-accent/65" : "text-text-secondary/60"
          }`}
        >
          <Search size={20} />
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none outline-none py-4 px-4 text-text-primary placeholder:text-text-secondary/50 font-inter text-lg"
        />

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="pr-5 pl-2 text-accent"
            >
              <Loader2 size={18} className="animate-spin" />
            </motion.div>
          ) : (
            value && (
              <motion.button
                key="clear"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => onChange("")}
                className="pr-5 pl-2 text-text-secondary/60 hover:text-text-primary transition-colors focus:outline-none cursor-pointer"
                aria-label="Clear search"
              >
                <div className="bg-text-secondary/10 hover:bg-text-secondary/20 p-1 rounded-full transition-colors">
                  <X size={16} />
                </div>
              </motion.button>
            )
          )}
        </AnimatePresence>
      </div>

      {/* Dynamic hint / shortcut caption */}
      <div className="absolute -bottom-6 left-0 right-0 flex justify-center md:justify-end md:right-4 px-2">
        <AnimatePresence mode="wait">
          {hint ? (
            <motion.span
              key={hint}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-[11px] text-text-secondary/50 font-inter"
            >
              {hint}
            </motion.span>
          ) : (
            <span className="text-[10px] text-text-secondary/40 font-inter uppercase tracking-widest opacity-0 md:group-hover:opacity-100 transition-opacity duration-500">
              Type to search
            </span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
