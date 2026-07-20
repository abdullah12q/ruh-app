import { AnimatePresence } from "framer-motion";
import { useSurah } from "@/lib/queries/quran";
import BookmarkItem from "./BookmarkItem";

export default function SurahGroup({ surahNum, ayahs, onClose }) {
  const { data: surah, isLoading } = useSurah(surahNum);

  return (
    <div className="mb-5">
      {/* Group Header */}
      <div className="flex items-center gap-3 mb-3 px-1">
        <div className="size-6 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-[10px] font-bold text-accent font-jakarta shrink-0">
          {surahNum}
        </div>
        {isLoading ? (
          <div className="flex gap-2 items-center flex-1">
            <div className="h-3 skeleton rounded-full w-24" />
            <div className="h-3 skeleton rounded-full w-12" />
          </div>
        ) : (
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-semibold text-text-primary font-jakarta truncate">
              {surah?.name_simple}
            </span>
            <span
              className="font-arabic-ui text-base text-accent/70 leading-none shrink-0"
              dir="rtl"
              lang="ar"
            >
              {surah?.name_arabic}
            </span>
          </div>
        )}
        <div className="flex-1 h-px bg-(--surface-glass-border)" />
        <span className="text-[10px] text-text-secondary/50 font-jakarta shrink-0">
          {ayahs.length} {ayahs.length === 1 ? "ayah" : "ayahs"}
        </span>
      </div>

      {/* Bookmark Items */}
      <div className="space-y-2.5">
        <AnimatePresence mode="popLayout">
          {ayahs.map((ayahNum, i) => (
            <BookmarkItem
              key={`${surahNum}-${ayahNum}`}
              surahNum={surahNum}
              ayahNum={ayahNum}
              index={i}
              onClose={onClose}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
