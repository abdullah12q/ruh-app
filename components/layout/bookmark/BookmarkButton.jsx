import useUIStore from "@/lib/store/useUIStore";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark } from "lucide-react";

export default function BookmarkButton({ onClick }) {
  const { bookmarkedAyahs } = useUIStore();
  const bookmarkedCount = bookmarkedAyahs.length;

  return (
    <button
      onClick={onClick}
      aria-label="Open bookmarks"
      className="relative size-9 flex items-center justify-center rounded-xl text-text-secondary hover:text-accent hover:bg-white/5 transition-all duration-200 cursor-pointer"
    >
      <Bookmark size={17} strokeWidth={1.75} />
      <AnimatePresence mode="popLayout">
        {bookmarkedCount > 0 && (
          <motion.span
            key={bookmarkedCount}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring" }}
            className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-accent text-white text-[9px] font-bold font-jakarta flex items-center justify-center leading-none"
          >
            {bookmarkedCount > 99 ? "99+" : bookmarkedCount}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
