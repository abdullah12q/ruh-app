import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, CheckCircle2 } from "lucide-react";

export function ThikrCard({ decrementThikr, resetThikr, item }) {
  const isDone = item.remaining === 0;

  const handleTap = useCallback(() => {
    if (!isDone) decrementThikr(item.key);
  }, [isDone, item.key, decrementThikr]);

  const handleReset = useCallback(
    (e) => {
      e.stopPropagation();
      resetThikr(item.key);
    },
    [item.key, resetThikr],
  );

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isDone ? 0.65 : 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileTap={!isDone ? { scale: 0.96 } : {}}
      transition={{ type: "spring", damping: 20 }}
      onClick={handleTap}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleTap()}
      aria-label={`ذكر: ${item.content.slice(0, 40)}...`}
      className={`
        relative rounded-2xl border p-5 cursor-pointer select-none
        transition-colors duration-500
        ${
          isDone
            ? "border-accent/25 bg-accent/20"
            : "border-(--surface-glass-border) bg-(--surface-glass) hover:border-accent/30"
        }
        backdrop-blur-md
      `}
    >
      {/* Completion overlay checkmark */}
      <AnimatePresence>
        {isDone && (
          <motion.div
            key="checkmark"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute top-4 left-4"
          >
            <CheckCircle2 className="size-5 text-accent" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Arabic content */}
      <p
        className="font-arabic-ui text-text-primary text-lg leading-loose mb-3 text-right"
        dir="rtl"
        lang="ar"
      >
        {item.content}
      </p>

      {/* Description (TRANSLATED_TEXT) */}
      {item.description ? (
        <p
          className="font-arabic-ui text-text-secondary text-sm leading-relaxed mb-4 text-right border-r-2 border-accent/40 pr-3"
          dir="rtl"
          lang="ar"
        >
          {item.description}
        </p>
      ) : null}

      {/* Footer: count badge + reset */}
      <div className="flex items-center justify-between mt-2" dir="rtl">
        {/* Count badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-arabic-ui text-text-secondary">
            {isDone ? "مكتمل" : "المتبقي"}
          </span>
          <motion.span
            key={item.remaining}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring" }}
            className={`
              inline-flex items-center justify-center min-w-8 h-8 px-3
              rounded-full text-sm font-bold font-jakarta
              ${
                isDone
                  ? "bg-accent text-white"
                  : "bg-accent/15 text-accent border border-accent/30"
              }
            `}
          >
            {isDone ? "✓" : item.remaining}
          </motion.span>
          {!isDone && (
            <span className="text-xs text-text-secondary font-jakarta opacity-60">
              / {item.total}
            </span>
          )}
        </div>

        {/* Reset button */}
        <motion.button
          whileHover={{ rotate: -180 }}
          transition={{ duration: 0.4 }}
          onClick={handleReset}
          aria-label="إعادة تعيين"
          className="p-1.5 rounded-full text-text-secondary hover:text-accent hover:bg-accent/10 transition-colors cursor-pointer"
        >
          <RotateCcw className="size-4" />
        </motion.button>
      </div>
    </motion.article>
  );
}
