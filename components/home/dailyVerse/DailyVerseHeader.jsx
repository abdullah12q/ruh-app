import LanguageToggle from "@/components/LanguageToggle";
import ReciterDropdown from "@/components/ReciterDropdown";
import { Bookmark } from "lucide-react";

export default function DailyVerseHeader({
  selectedReciter,
  favoriteReciters,
  onSelectReciter,
  onToggleFavoriteReciter,
  translationLang,
  onSetTranslationLang,
  toggleBookmarkedAyahs,
  activeSurahNum,
  activeAyahNum,
  isBookmarked,
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-y-4 mb-4">
      <ReciterDropdown
        selectedReciter={selectedReciter}
        favoriteReciters={favoriteReciters}
        onSelect={onSelectReciter}
        onToggleFavorite={onToggleFavoriteReciter}
        inDailyVerse
      />
      <div className="flex gap-2">
        <LanguageToggle
          translationLang={translationLang}
          setTranslationLang={onSetTranslationLang}
        />
        <button
          onClick={() => toggleBookmarkedAyahs(activeSurahNum, activeAyahNum)}
          aria-label={
            isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"
          }
          className={`size-8 rounded-lg glass flex items-center justify-center transition-colors duration-200 cursor-pointer ${
            isBookmarked
              ? "text-accent hover:opacity-80"
              : "text-text-secondary hover:text-accent"
          }`}
        >
          <Bookmark size={14} fill={isBookmarked ? "currentColor" : "none"} />
        </button>
      </div>
    </div>
  );
}
