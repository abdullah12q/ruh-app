import { motion } from "framer-motion";
import { Check, Loader2, X } from "lucide-react";
import PromptShell from "./PromptShell";

export default function RangeInstructionBar({
  rangeState,
  exitRangeMode,
  confirmRange,
  isBatchMarking,
}) {
  const { start, end } = rangeState;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="overflow-hidden"
    >
      {/* No selection yet */}
      {start === null && (
        <PromptShell onDismiss={exitRangeMode}>
          <p className="text-[11px] font-inter text-violet-500">
            Click the <span className="font-semibold">first</span> ayah of your
            range.
          </p>
        </PromptShell>
      )}

      {/* Start selected, waiting for end */}
      {start !== null && end === null && (
        <PromptShell onDismiss={exitRangeMode}>
          <p className="text-[11px] font-inter text-violet-500">
            Start: <span className="font-semibold">Ayah {start}</span> — now
            click the <span className="font-semibold">last</span> ayah.
          </p>
        </PromptShell>
      )}

      {/* Full range selected */}
      {start !== null && end !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="flex items-center gap-3 mx-4 my-3 px-4 py-2.5 rounded-xl bg-violet-500/15 border border-violet-400/40"
        >
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-jakarta font-semibold text-violet-500">
              Mark ayahs:{" "}
              <span className="font-bold">
                {start}-{end} ({end - start + 1} ayahs)
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={confirmRange}
              disabled={isBatchMarking}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500 text-white text-[11px] font-jakarta font-bold hover:bg-violet-600 transition-colors duration-400 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isBatchMarking ? (
                <Loader2 size={10} className="animate-spin" />
              ) : (
                <Check size={11} strokeWidth={3} />
              )}
              Confirm
            </button>
            <button
              onClick={exitRangeMode}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg glass text-text-secondary text-[11px] font-jakarta hover:text-text-primary transition-colors duration-400 cursor-pointer"
            >
              <X size={10} />
              Cancel
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
