import { motion, AnimatePresence } from "framer-motion";
import { CheckSquare, Loader2, X, XSquare } from "lucide-react";

export default function SurahSelectBar({
  selectedCount,
  onMarkAll,
  onUnmarkAll,
  onCancel,
  isMarking,
  isUnmarking,
}) {
  const isBusy = isMarking || isUnmarking;

  const baseCSS =
    "flex items-center gap-1.5 px-2 py-1 md:px-3 md:py-1.5 rounded-md md:rounded-lg text-[11px] font-jakarta font-bold transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer";

  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          key="surah-select-bar"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className=" flex items-center justify-between gap-3 mx-4 my-3 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-400/40"
          >
            {/* Label */}
            <div>
              <p className="text-[11px] font-jakarta font-semibold text-amber-400">
                <span className="font-bold">{selectedCount}</span>{" "}
                {selectedCount === 1 ? "surah" : "surahs"} selected
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onMarkAll}
                disabled={isBusy}
                className={`${baseCSS} bg-accent text-white hover:bg-accent/80`}
              >
                {isMarking ? (
                  <Loader2 size={10} className="animate-spin" />
                ) : (
                  <CheckSquare size={12} />
                )}
                <span className="hidden md:block">Mark All</span>
              </button>

              <button
                onClick={onUnmarkAll}
                disabled={isBusy}
                className={`${baseCSS} bg-rose-500/15 border border-rose-500/30 text-rose-400 hover:bg-rose-500/25`}
              >
                {isUnmarking ? (
                  <Loader2 size={10} className="animate-spin" />
                ) : (
                  <XSquare size={11} />
                )}
                <span className="hidden md:block">Unmark All</span>
              </button>

              <button
                onClick={onCancel}
                className="flex items-center gap-1 px-2 py-1 md:px-3 md:py-1.5 rounded-md md:rounded-lg glass text-text-secondary text-[11px] font-jakarta hover:text-text-primary transition-colors duration-300 cursor-pointer"
              >
                <X size={11} />
                <span className="hidden md:block">Cancel</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
