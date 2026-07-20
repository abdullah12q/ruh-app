import { AnimatePresence, motion } from "framer-motion";
import useUIStore from "@/lib/store/useUIStore";
import { drawerVariants } from "@/data/animationVariants";
import SurahGroup from "./SurahGroup";
import BookmarksEmptyState from "./BookmarksEmptyState";
import BookmarksHeader from "./BookmarksHeader";
import BookmarksFooter from "./BookmarksFooter";

export default function BookmarksDrawer({ isOpen, onClose }) {
  const { bookmarkedAyahs } = useUIStore();
  const totalCount = bookmarkedAyahs.length;

  // Group bookmarks by surahNum, preserving insertion order per surah
  const groupedBySurah = bookmarkedAyahs.reduce(
    (acc, { surahNum, ayahNum }) => {
      if (!acc[surahNum]) acc[surahNum] = [];
      acc[surahNum].push(ayahNum);
      return acc;
    },
    {},
  );

  const surahNums = Object.keys(groupedBySurah)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="bookmarks-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.aside
            key="bookmarks-drawer"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm glass flex flex-col"
            aria-label="Bookmarked Ayahs"
            role="complementary"
          >
            {/* ── Header ── */}
            <BookmarksHeader totalCount={totalCount} onClose={onClose} />

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
              {totalCount === 0 ? (
                <BookmarksEmptyState onClose={onClose} />
              ) : (
                <AnimatePresence>
                  {surahNums.map((surahNum) => (
                    <SurahGroup
                      key={surahNum}
                      surahNum={surahNum}
                      ayahs={groupedBySurah[surahNum]}
                      onClose={onClose}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            <BookmarksFooter totalCount={totalCount} surahNums={surahNums} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
