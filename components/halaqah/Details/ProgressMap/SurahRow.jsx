import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Square, CheckSquare2 } from "lucide-react";
import AyahCell from "./AyahCell";
import { useBatchMarkAyahs, useUnmarkFullSurah } from "@/lib/queries/halaqah";
import SurahRowActions from "./SurahRowActions";
import RangeInstructionBar from "./RangeInstructionBar";

export default function SurahRow({
  surah,
  toggleSurah,
  isOpen,
  groupReadCount,
  groupPct,
  iFullyReadByMe,
  isRangeModeThisSurah,
  INITIAL_RANGE,
  rangeState,
  setRangeState,
  allAyahNums,
  halaqahId,
  progressMap,
  colorMap,
  currentUserId,
  openReflectionModal,
  setExpandedSurahs,
  surahSelectMode = false,
  isSelectedSurah = false,
  onToggleSurahSelect,
}) {
  const { mutate: batchMark, isPending: isBatchMarking } =
    useBatchMarkAyahs(halaqahId);
  const { mutate: unmarkSurah, isPending: isUnmarkingSurah } =
    useUnmarkFullSurah(halaqahId);

  function enterRangeMode(surahId) {
    // Toggling range mode on the same surah exits it
    if (rangeState.activeSurahId === surahId) {
      setRangeState(INITIAL_RANGE);
    } else {
      setRangeState({ activeSurahId: surahId, start: null, end: null });
      // Expand the surah automatically when range mode is entered
      setExpandedSurahs((prev) => new Set(prev).add(surahId));
    }
  }

  function exitRangeMode() {
    setRangeState(INITIAL_RANGE);
  }

  function handleRangeClick(ayahNumber) {
    setRangeState((prev) => {
      if (prev.start === null) {
        // First click -> set start
        return { ...prev, start: ayahNumber };
      }
      if (prev.end === null) {
        // Second click -> set end (normalise so start < end always)
        const [lo, hi] = [prev.start, ayahNumber].sort((a, b) => a - b);
        return { ...prev, start: lo, end: hi };
      }
      // Third click -> reset, treat as new start
      return { ...prev, start: ayahNumber, end: null };
    });
  }

  function getRangeAyahNumbers() {
    if (rangeState.start === null || rangeState.end === null) return [];
    const nums = [];
    for (let i = rangeState.start; i <= rangeState.end; i++) nums.push(i);
    return nums;
  }

  function confirmRange() {
    const ayahNumbers = getRangeAyahNumbers();
    if (!ayahNumbers.length) return;
    batchMark(
      {
        userId: currentUserId,
        surahNumber: rangeState.activeSurahId,
        ayahNumbers,
      },
      { onSuccess: exitRangeMode },
    );
  }

  function handleMarkFullSurah(surahId, ayahCount) {
    const allAyahs = Array.from({ length: ayahCount }, (_, i) => i + 1);
    batchMark({
      userId: currentUserId,
      surahNumber: surahId,
      ayahNumbers: allAyahs,
    });
  }

  function handleUnmarkFullSurah(surahId, ayahCount) {
    const allAyahs = Array.from({ length: ayahCount }, (_, i) => i + 1);
    unmarkSurah({
      userId: currentUserId,
      surahNumber: surahId,
      ayahNumbers: allAyahs,
    });
  }

  function isInRangePreview(ayahNum) {
    if (!isRangeModeThisSurah) return false;
    const { start, end } = rangeState;
    if (start === null) return false;
    const lo = start;
    const hi = end ?? start;
    return ayahNum >= lo && ayahNum <= hi;
  }

  return (
    <>
      {/* Row header */}
      <div
        className={`flex items-center gap-2 px-4 py-3 transition-colors ${
          surahSelectMode
            ? isSelectedSurah
              ? "bg-amber-500/10 hover:bg-amber-500/15"
              : "hover:bg-white/3"
            : "hover:bg-white/1.5"
        }`}
      >
        <button
          onClick={() =>
            surahSelectMode
              ? onToggleSurahSelect(surah.id)
              : toggleSurah(surah.id)
          }
          className="flex items-center gap-2 flex-1 min-w-0 text-left group cursor-pointer"
        >
          {/* Checkbox indicator in select mode */}
          <AnimatePresence>
            {surahSelectMode && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <AnimatePresence mode="popLayout">
                  {isSelectedSurah ? (
                    <motion.div
                      key="checked"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <CheckSquare2
                        size={13}
                        className="text-amber-400 shrink-0"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="unchecked"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <Square
                        size={13}
                        className="text-text-secondary/50 shrink-0"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          <span className="text-xs font-mono text-text-secondary w-6 shrink-0 text-right">
            {surah.id}
          </span>
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <span className="text-xs font-jakarta font-semibold text-text-primary truncate">
              {surah.name}
            </span>
            <span className="font-arabic-ui text-xs text-text-secondary shrink-0">
              {surah.nameAr}
            </span>
          </div>

          {/* Progress Indicators */}
          <div className="flex items-center gap-2 shrink-0">
            {groupReadCount > 0 ? (
              <>
                <div className="hidden sm:block w-16 h-1 rounded-full bg-(--surface-glass-border) overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent/70"
                    style={{ width: `${groupPct}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-accent w-7 text-right">
                  {groupPct}%
                </span>
              </>
            ) : (
              <span className="text-[10px] text-text-secondary font-inter w-20 text-right">
                {surah.ayahCount} ayahs
              </span>
            )}
            <ChevronDown
              size={13}
              className={`text-text-secondary transition-transform duration-600 ${isOpen ? "rotate-180" : ""}`}
            />
          </div>
        </button>

        {/* Action Buttons */}
        <AnimatePresence>
          {!surahSelectMode && (
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <SurahRowActions
                surah={surah}
                isRangeModeThisSurah={isRangeModeThisSurah}
                iFullyReadByMe={iFullyReadByMe}
                isBatchMarking={isBatchMarking}
                isUnmarkingSurah={isUnmarkingSurah}
                enterRangeMode={enterRangeMode}
                handleMarkFullSurah={handleMarkFullSurah}
                handleUnmarkFullSurah={handleUnmarkFullSurah}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Range Instruction Bar */}
      <AnimatePresence>
        {isRangeModeThisSurah && (
          <RangeInstructionBar
            rangeState={rangeState}
            exitRangeMode={exitRangeMode}
            confirmRange={confirmRange}
            isBatchMarking={isBatchMarking}
          />
        )}
      </AnimatePresence>

      {/* Ayah cells grid — collapsible */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key={`surah-cells-${surah.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
          >
            <div className="pl-3 pr-1 py-4">
              <div className="flex flex-wrap gap-1">
                {allAyahNums.map((ayahNum) => (
                  <AyahCell
                    key={`${surah.id}:${ayahNum}`}
                    surahNumber={surah.id}
                    ayahNumber={ayahNum}
                    halaqahId={halaqahId}
                    readers={progressMap.get(`${surah.id}:${ayahNum}`) ?? []}
                    colorMap={colorMap}
                    currentUserId={currentUserId}
                    onClickReflect={() =>
                      openReflectionModal(surah.id, ayahNum)
                    }
                    rangeModeActive={isRangeModeThisSurah}
                    isRangeStart={
                      isRangeModeThisSurah && rangeState.start === ayahNum
                    }
                    isRangeEnd={
                      isRangeModeThisSurah && rangeState.end === ayahNum
                    }
                    isInRange={isInRangePreview(ayahNum)}
                    onRangeClick={(n) => handleRangeClick(n)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
