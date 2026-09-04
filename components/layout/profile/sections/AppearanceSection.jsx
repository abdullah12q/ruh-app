import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Palette } from "lucide-react";

export default function AppearanceSection() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="px-5 py-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-accent/10 flex items-center justify-center">
            <Palette size={13} className="text-accent" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">
            Appearance
          </span>
        </div>
        <div className="h-14 skeleton rounded-xl" />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className="px-5 py-4 space-y-3">
      {/* Section Title */}
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-lg bg-accent/10 flex items-center justify-center">
          <Palette size={13} className="text-accent" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">
          Appearance
        </span>
      </div>

      {/* Theme toggle card */}
      <div
        className="glass rounded-xl p-1 flex gap-1"
        role="group"
        aria-label="Color theme"
      >
        {/* Light */}
        <button
          onClick={() => setTheme("light")}
          aria-pressed={!isDark}
          aria-label="Light mode"
          className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer overflow-hidden ${
            !isDark
              ? "text-amber-600"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          {!isDark && (
            <motion.span
              layoutId="theme-pill"
              className="absolute inset-0 bg-amber-500/15 border border-amber-500/30 rounded-lg"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <Sun size={15} className="relative z-10" />
          <span className="relative z-10">Light</span>
        </button>

        {/* Dark */}
        <button
          onClick={() => setTheme("dark")}
          aria-pressed={isDark}
          aria-label="Dark mode"
          className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer overflow-hidden ${
            isDark
              ? "text-indigo-300"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          {isDark && (
            <motion.span
              layoutId="theme-pill"
              className="absolute inset-0 bg-indigo-500/15 border border-indigo-500/30 rounded-lg"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <Moon size={15} className="relative z-10" />
          <span className="relative z-10">Dark</span>
        </button>
      </div>
    </div>
  );
}
