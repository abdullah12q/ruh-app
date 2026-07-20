import { AnimatePresence, motion } from "framer-motion";
import { X, Bookmark } from "lucide-react";

export default function BookmarksHeader({ totalCount, onClose }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-(--surface-glass-border) shrink-0">
      <div className="flex items-center gap-3">
        <div className="size-8 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
          <Bookmark size={15} className="text-accent" fill="currentColor" />
        </div>
        <div>
          <h2 className="font-jakarta font-bold text-sm text-text-primary leading-none mb-0.5">
            My Bookmarks
          </h2>
          <p
            className="font-arabic-ui text-xs text-accent/70 leading-none"
            dir="rtl"
            lang="ar"
          >
            علاماتي المرجعية
          </p>
        </div>
        {/* Live count badge */}
        <AnimatePresence mode="wait">
          {totalCount > 0 && (
            <motion.span
              key={totalCount}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 20,
              }}
              className="inline-flex items-center justify-center min-w-5.5 h-5 px-1.5 rounded-full bg-accent text-white text-[10px] font-bold font-jakarta"
            >
              {totalCount}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        className="size-8 rounded-xl flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all duration-200 cursor-pointer"
        aria-label="Close bookmarks panel"
      >
        <X size={16} />
      </button>
    </div>
  );
}
