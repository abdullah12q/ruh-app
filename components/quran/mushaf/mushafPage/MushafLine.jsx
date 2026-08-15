import { motion } from "framer-motion";
import MushafWord from "./MushafWord";

export default function MushafLine({
  lineWords,
  fontSize,
  activeVerseKey,
  hoveredVerseKey,
  onWordClick,
  onHoverVerse,
  onLeaveVerse,
  index,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.02, 0.3) }}
      className="flex items-center justify-between whitespace-nowrap w-full"
      dir="rtl"
    >
      {lineWords.map((word, idx) => (
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
      ))}
    </motion.div>
  );
}
