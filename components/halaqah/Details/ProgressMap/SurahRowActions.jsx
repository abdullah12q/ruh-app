import { CheckSquare, Crosshair, Loader2, XSquare } from "lucide-react";

export default function SurahRowActions({
  surah,
  isRangeModeThisSurah,
  iFullyReadByMe,
  isBatchMarking,
  isUnmarkingSurah,
  enterRangeMode,
  handleMarkFullSurah,
  handleUnmarkFullSurah,
}) {
  const baseCSS =
    "flex items-center gap-1 px-2 py-1 rounded-md md:rounded-lg text-[10px] font-jakarta font-semibold border duration-300 cursor-pointer";

  return (
    <div className="flex items-center gap-1 shrink-0 ml-1">
      <button
        onClick={() => enterRangeMode(surah.id)}
        className={`${baseCSS} ${
          isRangeModeThisSurah
            ? "bg-violet-500/20 border-violet-500/50 text-violet-400"
            : "bg-white/5 border-(--surface-glass-border) text-text-secondary hover:text-violet-400 hover:border-violet-500/30"
        }`}
      >
        <Crosshair size={10} />
        <span className="hidden md:block">Range</span>
      </button>

      {iFullyReadByMe ? (
        <button
          onClick={() => handleUnmarkFullSurah(surah.id, surah.ayahCount)}
          disabled={isUnmarkingSurah}
          className={`${baseCSS} bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isUnmarkingSurah ? (
            <Loader2 size={9} className="animate-spin" />
          ) : (
            <XSquare size={10} />
          )}
          <span className="hidden md:block">Unmark All</span>
        </button>
      ) : (
        <button
          onClick={() => handleMarkFullSurah(surah.id, surah.ayahCount)}
          disabled={isBatchMarking}
          className={`${baseCSS} bg-accent/10 border-accent/30 text-accent hover:bg-accent/20 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isBatchMarking ? (
            <Loader2 size={9} className="animate-spin" />
          ) : (
            <CheckSquare size={10} />
          )}
          <span className="hidden md:block">Mark All</span>
        </button>
      )}
    </div>
  );
}
