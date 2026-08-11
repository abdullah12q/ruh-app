import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Send } from "lucide-react";

export default function ReflectionSubmit({
  handleSubmit,
  isOverLimit,
  content,
  setContent,
  textareaRef,
  MAX_CHARS,
  charsLeft,
  isSubmitting,
  submitError,
}) {
  function handleKeyDown(e) {
    // Ctrl+Enter or Cmd+Enter submits
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="shrink-0 border-t border-(--surface-glass-border) px-5 py-4 bg-surface/50">
      <form onSubmit={handleSubmit} className="space-y-2">
        <div
          className={`relative rounded-xl border transition-colors duration-500 ${
            isOverLimit
              ? "border-red-400/50 bg-red-400/5"
              : content.length > 0
                ? "border-accent/40 bg-accent/5"
                : "border-(--surface-glass-border) bg-white/5"
          }`}
        >
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share a thought on this Ayah... (Ctrl+Enter to submit)"
            rows={3}
            maxLength={MAX_CHARS + 50} // allow typing slightly over to see the counter turn red
            className="w-full bg-transparent px-4 pt-3 pb-10 text-sm font-inter text-text-primary placeholder-text-secondary/60 resize-none focus:outline-none"
            aria-label="Reflection text"
          />

          {/* Char counter + submit */}
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-2">
            <span
              className={`text-[10px] font-mono tabular-nums ${
                isOverLimit
                  ? "text-red-400"
                  : charsLeft < 100
                    ? "text-amber-400"
                    : "text-text-secondary"
              }`}
            >
              {charsLeft}
            </span>

            <motion.button
              type="submit"
              disabled={!content.trim() || isSubmitting || isOverLimit}
              whileTap={{ scale: 0.9 }}
              className="size-7 rounded-lg flex items-center justify-center bg-violet-500 hover:bg-violet-400 text-white transition-colors duration-300 shadow-[0_0_12px_rgba(139,92,246,0.4)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Submit reflection"
            >
              {isSubmitting ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Send size={12} />
              )}
            </motion.button>
          </div>
        </div>

        {/* Inline error */}
        <AnimatePresence>
          {submitError && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-red-400 text-xs font-inter bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2"
            >
              {submitError}
            </motion.p>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
