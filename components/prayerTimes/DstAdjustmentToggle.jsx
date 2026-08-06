import { motion, AnimatePresence } from "framer-motion";
import useUIStore from "@/lib/store/useUIStore";

const OPTIONS = [
  { value: -1, label: "-1h", title: "Subtract 1 hour (DST back)" },
  { value: 0, label: "Standard", title: "No DST adjustment" },
  { value: 1, label: "+1h", title: "Add 1 hour (DST forward)" },
];

export default function DstAdjustmentToggle() {
  const { dstAdjustment, setDstAdjustment } = useUIStore();

  return (
    <div className="flex flex-col items-center">
      {/* Label */}
      <span className="text-[9px] text-center mb-1.5 font-inter uppercase text-text-secondary/80 select-none">
        {/* DST Offset */}
        Daylight Saving Time (DST) Adjustment
      </span>

      {/* Segmented pill control */}
      <div
        className="relative flex items-center gap-0.5 p-0.5 glass rounded-full shadow-inner"
        role="group"
        aria-label="Daylight Saving Time adjustment"
      >
        {OPTIONS.map((opt) => {
          const isActive = dstAdjustment === opt.value;
          return (
            <button
              key={opt.value}
              id={`dst-option-${opt.value}`}
              title={opt.title}
              aria-pressed={isActive}
              onClick={() => setDstAdjustment(opt.value)}
              className="relative z-10 cursor-pointer select-none"
            >
              {/* Active pill background */}
              {isActive && (
                <motion.span
                  layoutId="dst-active-pill"
                  className="absolute inset-0 rounded-full bg-accent/20 border border-accent/40 shadow-sm"
                  transition={{ type: "spring", damping: 20 }}
                />
              )}

              <span
                className={`relative z-10 flex items-center justify-center px-3.5 py-1 text-xs font-inter font-semibold rounded-full transition-colors duration-150 ${
                  isActive
                    ? "text-accent"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active hint */}
      <AnimatePresence>
        {dstAdjustment !== 0 && (
          <motion.div
            key={dstAdjustment}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <p className="text-[10px] font-inter text-accent/70 mt-1.5">
              {dstAdjustment > 0 ? "+" : ""}
              {dstAdjustment}h applied to all prayer times
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
