import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Check, Loader2, X } from "lucide-react";
import { useMarkAyahRead, useUnmarkAyahRead } from "@/lib/queries/halaqah";

export default function AyahCell({
  surahNumber,
  ayahNumber,
  halaqahId,
  readers,
  colorMap,
  currentUserId,
  onClickReflect,
  rangeModeActive = false,
  isRangeStart = false,
  isRangeEnd = false,
  isInRange = false,
  onRangeClick,
}) {
  const [hovered, setHovered] = useState(false);
  const [tooltipPos, setTooltipPos] = useState("center");
  const cellRef = useRef(null);

  const { mutate: markRead, isPending: isMarking } = useMarkAyahRead(halaqahId);
  const { mutate: unmarkRead, isPending: isUnmarking } =
    useUnmarkAyahRead(halaqahId);

  const isPending = isMarking || isUnmarking;
  const iReadThis = readers.includes(currentUserId);
  const othersWhoRead = readers.filter((uid) => uid !== currentUserId);
  const isRead = readers.length > 0;

  function handlePointerEnter() {
    setHovered(true);

    // Dynamically position the tooltip based on screen/container real estate
    if (cellRef.current) {
      const rect = cellRef.current.getBoundingClientRect();
      const container = cellRef.current.closest(".overflow-y-auto");
      const safeThreshold = 100; // Pixels needed for the tooltip

      if (container) {
        const containerRect = container.getBoundingClientRect();
        if (rect.right > containerRect.right - safeThreshold) {
          setTooltipPos("right");
        } else if (rect.left < containerRect.left + safeThreshold) {
          setTooltipPos("left");
        } else {
          setTooltipPos("center");
        }
      } else {
        // Fallback to window width
        if (rect.right > window.innerWidth - safeThreshold) {
          setTooltipPos("right");
        } else if (rect.left < safeThreshold) {
          setTooltipPos("left");
        } else {
          setTooltipPos("center");
        }
      }
    }
  }

  function handleClick() {
    if (isPending) return;

    if (rangeModeActive) {
      // In range mode: don't mark/unmark — just select
      onRangeClick?.(ayahNumber);
      return;
    }

    if (iReadThis) {
      // unmark
      unmarkRead({ userId: currentUserId, surahNumber, ayahNumber });
    } else {
      // mark as read
      markRead({ userId: currentUserId, surahNumber, ayahNumber });
    }
  }

  let cellClass = "";
  let cursor = "cursor-pointer";

  if (rangeModeActive) {
    if (isRangeStart || isRangeEnd) {
      cellClass =
        "bg-violet-500 border-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.7)]";
    } else if (isInRange) {
      cellClass = "bg-violet-500/40 border-violet-400/60";
    } else {
      cellClass =
        "bg-white/[0.04] border-violet-500/30 hover:border-violet-400/60 hover:bg-violet-500/10";
    }
  } else if (iReadThis) {
    cellClass =
      "bg-accent/90 border-transparent shadow-[0_0_8px_rgba(20,184,166,0.5)]";
  } else if (isRead) {
    cellClass = "bg-accent/15 border-accent/30";
  } else {
    cellClass =
      "bg-text-secondary/20 border-text-secondary/50 hover:border-accent/30 hover:bg-accent/5";
  }

  if (isPending) cursor = "cursor-wait";

  return (
    <div
      ref={cellRef}
      className="relative"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={() => setHovered(false)}
      onPointerCancel={() => setHovered(false)}
    >
      <motion.button
        onClick={handleClick}
        whileHover={!isPending ? { scale: 1.18 } : {}}
        whileTap={!isPending ? { scale: 0.88 } : {}}
        title={`Ayah ${ayahNumber}`}
        aria-label={`Surah ${surahNumber}, Ayah ${ayahNumber}${iReadThis ? " — read by you" : ""}`}
        className={`size-6 rounded-md flex items-center justify-center text-[9px] font-mono relative overflow-hidden transition-colors duration-100 border ${cellClass} ${cursor}`}
      >
        {isPending ? (
          <Loader2 size={8} className="animate-spin" />
        ) : iReadThis ? (
          hovered && !rangeModeActive ? (
            <X size={9} strokeWidth={3} className="text-white" />
          ) : (
            <Check size={10} strokeWidth={3} />
          )
        ) : (
          <span className={rangeModeActive && isInRange ? "text-white" : ""}>
            {ayahNumber}
          </span>
        )}

        {/* Reader dots (others only) — shown in bottom-right corner */}
        {othersWhoRead.length > 0 && !iReadThis && !rangeModeActive && (
          <div className="absolute bottom-0.5 right-0.5 flex gap-px">
            {othersWhoRead.slice(0, 3).map((uid) => (
              <span
                key={uid}
                className="size-1.5 rounded-full"
                style={{ backgroundColor: colorMap[uid] ?? "#6b7280" }}
              />
            ))}
          </div>
        )}
      </motion.button>

      {/* Tooltip (normal mode only) */}
      <AnimatePresence>
        {hovered && !rangeModeActive && (
          <motion.div
            key={`tooltip-${surahNumber}-${ayahNumber}`}
            initial={{ opacity: 0, y: 6, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.88 }}
            transition={{ duration: 0.1 }}
            className={`absolute bottom-full backdrop-blur-3xl rounded-lg mb-2 z-10 pointer-events-none ${
              tooltipPos === "right"
                ? "right-0"
                : tooltipPos === "left"
                  ? "left-0"
                  : "left-1/2 -translate-x-1/2"
            }`}
          >
            <div className="glass rounded-lg px-2.5 py-1.5 text-[10px] font-inter whitespace-nowrap">
              <span className="font-semibold text-accent">
                {surahNumber}:{ayahNumber}
              </span>
              {iReadThis ? (
                <span className="text-text-secondary ml-1.5">
                  ✓ You · click to unmark
                </span>
              ) : null}
              {othersWhoRead.length > 0 && (
                <span className="text-text-secondary ml-1.5">
                  +{othersWhoRead.length} member
                  {othersWhoRead.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reflection button */}
      <AnimatePresence>
        {!rangeModeActive && (
          <motion.button
            key={`reflect-btn-${surahNumber}-${ayahNumber}`}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.12 }}
            onClick={(e) => {
              e.stopPropagation();
              onClickReflect();
            }}
            title="Add/view reflection"
            className={`${hovered ? "" : "sm:hidden"} flex items-center justify-center absolute z-20 -top-1 -right-1 sm:-top-2 sm:-right-2 size-3 sm:size-4 rounded-full bg-violet-500 border border-violet-400/50 hover:bg-violet-400 shadow-lg transition-colors cursor-pointer`}
          >
            <MessageSquare size={8} className="text-white" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
