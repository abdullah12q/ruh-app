import { useState, useMemo, useCallback } from "react";
import SURAH_META from "@/data/surahMeta";
import useHalaqahStore from "@/lib/store/useHalaqahStore";
import { useBatchMarkAyahs, useUnmarkFullSurah } from "@/lib/queries/halaqah";
import ProgressHeader from "./ProgressHeader";
import SurahRow from "./SurahRow";
import SurahSelectBar from "./SurahSelectBar";

const INITIAL_RANGE = { activeSurahId: null, start: null, end: null };
const TOTAL_AYAHS = 6236;

export default function ProgressMap({
  halaqahId,
  progressMap,
  members,
  colorMap,
  currentUserId,
}) {
  const [search, setSearch] = useState("");
  const [expandedSurahs, setExpandedSurahs] = useState(new Set([]));
  const [rangeState, setRangeState] = useState(INITIAL_RANGE);
  const [surahSelectMode, setSurahSelectMode] = useState(false);
  const [selectedSurahIds, setSelectedSurahIds] = useState(new Set());

  const { openReflectionModal } = useHalaqahStore();

  const { mutate: batchMarkBulk, isPending: isBulkMarking } =
    useBatchMarkAyahs(halaqahId);
  const { mutate: unmarkSurahBulk, isPending: isBulkUnmarking } =
    useUnmarkFullSurah(halaqahId);

  const filteredSurahs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return SURAH_META;
    return SURAH_META.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.nameAr.includes(q) ||
        String(s.id).includes(q),
    );
  }, [search]);

  const readAyahs = progressMap.size; // Each key = one ayah read by at least one member
  const overallPct = Math.round((readAyahs / TOTAL_AYAHS) * 100);

  // Count how many unique ayahs in a surah have been read and count ayahs in a surah that this user has personally marked
  const surahStats = useMemo(() => {
    const stats = new Map();
    for (const [key, readers] of progressMap) {
      const surahId = Number(key.slice(0, key.indexOf(":")));
      const entry = stats.get(surahId) ?? { groupReadCount: 0, myReadCount: 0 };
      entry.groupReadCount++;
      if (readers.includes(currentUserId)) entry.myReadCount++;
      stats.set(surahId, entry);
    }
    return stats;
  }, [progressMap, currentUserId]);

  const toggleSurah = useCallback((id) => {
    setExpandedSurahs((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const enterSurahSelectMode = useCallback(() => {
    setSurahSelectMode(true);
    setSelectedSurahIds(new Set());
    // Exit any active range mode
    setRangeState(INITIAL_RANGE);
  }, []);

  const exitSurahSelectMode = useCallback(() => {
    setSurahSelectMode(false);
    setSelectedSurahIds(new Set());
  }, []);

  const toggleSurahSelect = useCallback((id) => {
    setSelectedSurahIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  function handleBulkMark() {
    const ids = Array.from(selectedSurahIds);
    let remaining = ids.length;
    ids.forEach((surahId) => {
      const surah = SURAH_META.find((s) => s.id === surahId);
      if (!surah) {
        remaining--;
        return;
      }
      const ayahNumbers = Array.from(
        { length: surah.ayahCount },
        (_, i) => i + 1,
      );
      batchMarkBulk(
        { userId: currentUserId, surahNumber: surahId, ayahNumbers },
        {
          onSuccess: () => {
            remaining--;
            if (remaining === 0) exitSurahSelectMode();
          },
        },
      );
    });
  }

  function handleBulkUnmark() {
    const ids = Array.from(selectedSurahIds);
    let remaining = ids.length;
    ids.forEach((surahId) => {
      const surah = SURAH_META.find((s) => s.id === surahId);
      if (!surah) {
        remaining--;
        return;
      }
      const ayahNumbers = Array.from(
        { length: surah.ayahCount },
        (_, i) => i + 1,
      );
      unmarkSurahBulk(
        { userId: currentUserId, surahNumber: surahId, ayahNumbers },
        {
          onSuccess: () => {
            remaining--;
            if (remaining === 0) exitSurahSelectMode();
          },
        },
      );
    });
  }

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <ProgressHeader
        totalAyahs={TOTAL_AYAHS}
        readAyahs={readAyahs}
        overallPct={overallPct}
        members={members}
        colorMap={colorMap}
        currentUserId={currentUserId}
        search={search}
        setSearch={setSearch}
        surahSelectMode={surahSelectMode}
        onToggleSurahSelectMode={() =>
          surahSelectMode ? exitSurahSelectMode() : enterSurahSelectMode()
        }
      />

      {/* Surah Select Bar */}
      <SurahSelectBar
        selectedCount={selectedSurahIds.size}
        onMarkAll={handleBulkMark}
        onUnmarkAll={handleBulkUnmark}
        onCancel={exitSurahSelectMode}
        isMarking={isBulkMarking}
        isUnmarking={isBulkUnmarking}
      />
      {/* Surah rows */}
      <div className="divide-y divide-(--surface-glass-border) max-h-160 overflow-y-auto">
        {filteredSurahs.length === 0 && (
          <div className="py-10 text-center text-text-secondary font-inter text-xs">
            No surahs match &ldquo;{search}&rdquo;
          </div>
        )}

        {filteredSurahs.map((surah) => {
          const isOpen = expandedSurahs.has(surah.id);
          const { groupReadCount = 0, myReadCount = 0 } =
            surahStats.get(surah.id) ?? {};
          const groupPct = Math.round((groupReadCount / surah.ayahCount) * 100);
          const iFullyReadByMe = myReadCount === surah.ayahCount;
          const isRangeModeThisSurah =
            !surahSelectMode && rangeState.activeSurahId === surah.id;
          const allAyahNums = Array.from(
            { length: surah.ayahCount },
            (_, i) => i + 1,
          );

          return (
            <SurahRow
              key={surah.id}
              surah={surah}
              toggleSurah={toggleSurah}
              isOpen={isOpen}
              groupReadCount={groupReadCount}
              groupPct={groupPct}
              iFullyReadByMe={iFullyReadByMe}
              isRangeModeThisSurah={isRangeModeThisSurah}
              INITIAL_RANGE={INITIAL_RANGE}
              rangeState={rangeState}
              setRangeState={setRangeState}
              allAyahNums={allAyahNums}
              halaqahId={halaqahId}
              progressMap={progressMap}
              colorMap={colorMap}
              currentUserId={currentUserId}
              openReflectionModal={openReflectionModal}
              setExpandedSurahs={setExpandedSurahs}
              surahSelectMode={surahSelectMode}
              isSelectedSurah={selectedSurahIds.has(surah.id)}
              onToggleSurahSelect={toggleSurahSelect}
            />
          );
        })}
      </div>
    </div>
  );
}
