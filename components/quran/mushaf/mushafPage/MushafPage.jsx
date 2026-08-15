import { useCallback, useMemo, useState } from "react";
import useUIStore from "@/lib/store/useUIStore";
import { useSurahPlayback } from "@/lib/context/SurahPlaybackProvider";
import { groupWordsByLine, toArabicNumbers } from "@/data/datas/mushafData";
import MushafLine from "./MushafLine";

export default function MushafPage({ versesInPage, pageNumber }) {
  const { fontSize } = useUIStore();
  const { surahId, activeAyahNum, playAyah } = useSurahPlayback();

  const activeVerseKey = activeAyahNum ? `${surahId}:${activeAyahNum}` : null;

  const [hoveredVerseKey, setHoveredVerseKey] = useState(null);
  const handleHoverVerse = useCallback((key) => setHoveredVerseKey(key), []);
  const handleLeaveVerse = useCallback(() => setHoveredVerseKey(null), []);

  // Group all words on this page by their line_number (1–15)
  const lines = useMemo(
    () => groupWordsByLine(versesInPage ?? []),
    [versesInPage],
  );

  function handleWordClick(verseNumber) {
    playAyah(verseNumber);
  }

  return (
    <div>
      <div className="space-y-0 mb-6">
        {[...lines.entries()].map(([lineNum, lineWords], index) => (
          <MushafLine
            key={lineNum}
            index={index}
            lineWords={lineWords}
            fontSize={fontSize}
            activeVerseKey={activeVerseKey}
            hoveredVerseKey={hoveredVerseKey}
            onWordClick={handleWordClick}
            onHoverVerse={handleHoverVerse}
            onLeaveVerse={handleLeaveVerse}
          />
        ))}
      </div>

      {/* Page number medallion footer */}
      <div className="flex items-center justify-center gap-2 pt-3 border-t border-(--surface-glass-border)">
        <span className="size-1 rounded-full bg-accent/70" />
        <span className="text-lg text-text-secondary font-arabic-ui">
          {toArabicNumbers(pageNumber)}
        </span>
        <span className="size-1 rounded-full bg-accent/70" />
      </div>
    </div>
  );
}
