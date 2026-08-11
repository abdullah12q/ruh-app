import { motion } from "framer-motion";
import { X, MessageSquare, Loader2, BookOpen } from "lucide-react";

export default function ReflectionHeader({
  surahNumber,
  surahName,
  ayahNumber,
  isFetching,
  isLoading,
  handleClose,
  dragControls,
}) {
  return (
    <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-(--surface-glass-border) shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        {/* Drag handle (mobile) */}
        <div
          className="w-10 h-3 sm:hidden absolute top-2 left-1/2 -translate-x-1/2 flex justify-center items-start pt-1 cursor-grab active:cursor-grabbing touch-none"
          onPointerDown={(e) => {
            // Start the drag when the handle is pressed
            if (dragControls) dragControls.start(e);
          }}
        >
          {/* Visual line */}
          <div className="w-full h-1 rounded-full bg-text-secondary/20 pointer-events-none" />
        </div>

        <div className="size-9 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center shrink-0">
          <MessageSquare size={16} className="text-violet-400" />
        </div>

        <div className="min-w-0">
          <h2 className="font-jakarta font-bold text-text-primary text-base leading-tight">
            Reflections
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <BookOpen size={10} className="text-accent shrink-0" />
            <p className="text-xs text-text-secondary font-inter truncate">
              {surahNumber}. {surahName} · Ayah{" "}
              <span className="text-accent font-semibold">{ayahNumber}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Live poll indicator */}
        {isFetching && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader2 size={13} className="text-accent/50 animate-spin" />
          </motion.div>
        )}

        <button
          onClick={handleClose}
          className="size-7 rounded-lg flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-text-secondary/10 transition-colors duration-400 cursor-pointer"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
