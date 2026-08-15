import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSurahPlayback } from "@/lib/context/SurahPlaybackProvider";
import { toArabicNumbers } from "@/data/datas/mushafData";
import PageLoader from "./PageLoader";

export default function MushafView() {
  const {
    currentPage,
    firstPage,
    lastPage,
    direction,
    goToNextPage,
    goToPrevPage,
    goToPage,
  } = useSurahPlayback();

  const totalPages = lastPage - firstPage + 1;
  const currentOffset = currentPage - firstPage;
  const canGoPrev = currentPage > firstPage;
  const canGoNext = currentPage < lastPage;

  // Simple, smoothed slide — no page-flip, just a softer spring + a hint of scale.
  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir === 1 ? -16 : 16, scale: 0.99 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir) => ({ opacity: 0, x: dir === 1 ? 16 : -16, scale: 0.99 }),
  };

  return (
    <div className="space-y-5">
      {/* Navigation Header */}
      <div className="flex items-center justify-between px-1 font-jakarta">
        <button
          onClick={goToNextPage}
          disabled={!canGoNext}
          aria-label="Next Mushaf page"
          className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-sm text-text-secondary hover:text-accent disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
        >
          <ChevronLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Next
        </button>

        {/* Page medallion */}
        <div className="flex items-center gap-2 px-4 py-1.5 glass border-accent/20! rounded-full font-inter">
          <motion.span
            key={currentPage}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="text-xs text-accent font-semibold"
          >
            {currentPage}
          </motion.span>
          {totalPages > 1 && (
            <span className="text-[10px] text-text-secondary">
              {firstPage}-{lastPage}
            </span>
          )}
        </div>

        {/* Previous Button is physically on the RIGHT side of the screen */}
        <button
          onClick={goToPrevPage}
          disabled={!canGoPrev}
          aria-label="Previous Mushaf page"
          className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-sm text-text-secondary hover:text-accent disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
        >
          Previous
          <ChevronRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Page area with animated transition */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentPage}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              type: "spring",
              damping: 32,
              stiffness: 260,
              mass: 0.9,
            }}
          >
            <PageLoader pageNumber={currentPage} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Tasbih-style dot pagination */}
      {totalPages > 1 && (
        <div className="relative flex flex-row-reverse flex-wrap items-center justify-center gap-1 sm:gap-2.5 pt-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <div key={i}>
              <button
                onClick={() => goToPage(firstPage + i)}
                aria-label={`Go to page ${firstPage + i}`}
                className={`rounded-full transition-all duration-400 ${
                  i === currentOffset
                    ? "size-2.5 bg-accent shadow-[0_0_10px_var(--accent-glow)]"
                    : "size-1.5 bg-text-secondary/30 hover:bg-text-secondary/60"
                } cursor-pointer`}
              />
              <p className="text-text-secondary font-arabic-ui">
                {toArabicNumbers(firstPage + i)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
