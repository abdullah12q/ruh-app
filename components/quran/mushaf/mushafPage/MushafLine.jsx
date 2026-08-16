import MushafWord from "./MushafWord";

export default function MushafLine({
  lineWords,
  fontSize,
  activeVerseKey,
  hoveredVerseKey,
  onWordClick,
  onHoverVerse,
  onLeaveVerse,
}) {
  return lineWords.map((word, idx) => (
    <MushafWord
      key={`${word.verse_key}-${word.position}-${idx}`}
      word={word}
      fontSize={fontSize}
      isVerseActive={word.verse_key === activeVerseKey}
      isVerseHovered={word.verse_key === hoveredVerseKey}
      onWordClick={onWordClick}
      onHoverVerse={onHoverVerse}
      onLeaveVerse={onLeaveVerse}
    />
  ));
}
