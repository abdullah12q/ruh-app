export default function BookmarksFooter({ totalCount, surahNums }) {
  return (
    totalCount > 0 && (
      <div className="shrink-0 border-t border-(--surface-glass-border) px-4 py-3">
        <p className="text-center text-[11px] text-text-secondary/40 font-jakarta">
          {totalCount} {totalCount === 1 ? "ayah" : "ayahs"} saved across{" "}
          {surahNums.length} {surahNums.length === 1 ? "surah" : "surahs"}
        </p>
      </div>
    )
  );
}
