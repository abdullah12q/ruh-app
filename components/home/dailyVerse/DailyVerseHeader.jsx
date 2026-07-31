import imamList from "@/data/jsons/imam.json";
import LanguageToggle from "@/components/LanguageToggle";
import ReciterDropdown from "@/components/ReciterDropdown";

export default function DailyVerseHeader({
  selectedReciter,
  favoriteReciters,
  onSelectReciter,
  onToggleFavoriteReciter,
  translationLang,
  onSetTranslationLang,
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-y-4 mb-4">
      <ReciterDropdown
        reciters={imamList}
        selectedReciter={selectedReciter}
        favoriteReciters={favoriteReciters}
        onSelect={onSelectReciter}
        onToggleFavorite={onToggleFavoriteReciter}
        inDailyVerse
      />
      <LanguageToggle
        translationLang={translationLang}
        setTranslationLang={onSetTranslationLang}
      />
    </div>
  );
}
