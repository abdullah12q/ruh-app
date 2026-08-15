import AyahEndMarker from "./AyahEndMarker";

export default function MushafWord({
  word,
  fontSize,
  isVerseActive,
  isVerseHovered,
  onWordClick,
  onHoverVerse,
  onLeaveVerse,
}) {
  const isEnd = word.char_type === "end";

  const hoverHandlers = {
    onMouseEnter: () => onHoverVerse(word.verse_key),
    onMouseLeave: onLeaveVerse,
  };

  if (isEnd) {
    return (
      <button
        onClick={() => onWordClick(word.verse_number)}
        className="cursor-pointer"
        aria-label={`End of verse ${word.verse_key}`}
        {...hoverHandlers}
      >
        <AyahEndMarker text={word.text} isActive={isVerseActive} />
      </button>
    );
  }

  return (
    <button
      onClick={() => onWordClick(word.verse_number)}
      className={`
        font-quran ${fontSize} leading-[3.2rem] px-0.5 rounded-lg cursor-pointer select-none
        transition-[color,background-color,transform] duration-400
        hover:scale-[1.04]
        ${
          isVerseActive
            ? "text-accent bg-accent/10 shadow-[0_0_16px_var(--accent-glow)]"
            : isVerseHovered
              ? "text-accent"
              : "text-text-primary"
        }
      `}
      dir="rtl"
      lang="ar"
      aria-label={`Word from verse ${word.verse_key}`}
      {...hoverHandlers}
    >
      {word.text}
    </button>
  );
}
