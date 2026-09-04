import { BookOpen, AArrowUp, AArrowDown, Languages } from "lucide-react";
import useUIStore from "@/lib/store/useUIStore";
import LanguageToggle from "@/components/LanguageToggle";

const FONT_SIZES = [
  { label: "10px", value: "text-[10px]", title: "Tiny" },
  { label: "XS", value: "text-xs", title: "Extra Small" },
  { label: "SM", value: "text-sm", title: "Small" },
  { label: "Base", value: "text-base", title: "Normal" },
  { label: "LG", value: "text-lg", title: "Large" },
  { label: "XL", value: "text-xl", title: "Extra Large" },
  { label: "2XL", value: "text-2xl", title: "2X Large" },
  { label: "3XL", value: "text-3xl", title: "3X Large" },
  { label: "4XL", value: "text-4xl", title: "4X Large" },
  { label: "5XL", value: "text-5xl", title: "5X Large" },
  { label: "6XL", value: "text-6xl", title: "6X Large" },
  { label: "7XL", value: "text-7xl", title: "7X Large" },
  { label: "8XL", value: "text-8xl", title: "8X Large" },
  { label: "9XL", value: "text-9xl", title: "9X Large" },
];

export default function ReadingPreferencesSection() {
  const { fontSize, setFontSize, translationLang, setTranslationLang } =
    useUIStore();

  const currentIndex = FONT_SIZES.findIndex((f) => f.value === fontSize);

  function decrease() {
    if (currentIndex > 0) setFontSize(FONT_SIZES[currentIndex - 1].value);
  }

  function increase() {
    if (currentIndex < FONT_SIZES.length - 1)
      setFontSize(FONT_SIZES[currentIndex + 1].value);
  }

  return (
    <div className="px-5 py-4 space-y-4">
      {/* Section Title */}
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-lg bg-accent/10 flex items-center justify-center">
          <BookOpen size={13} className="text-accent" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">
          Reading Preferences
        </span>
      </div>

      {/* Font Size */}
      <div className="space-y-2">
        <p className="text-xs text-text-secondary px-1">Quran Font Size</p>
        <div className="flex items-center gap-3 glass rounded-xl px-4 py-3">
          {/* Decrease */}
          <button
            onClick={decrease}
            disabled={currentIndex === 0}
            className="size-7 rounded-lg border border-text-secondary/10 flex items-center justify-center text-text-secondary hover:text-accent hover:border-accent/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            aria-label="Decrease font size"
          >
            <AArrowDown size={14} />
          </button>

          {/* Size indicator dots */}
          <div className="flex-1 flex items-center justify-center gap-1.5">
            {FONT_SIZES.map((f, i) => (
              <button
                key={f.value}
                onClick={() => setFontSize(f.value)}
                title={f.label}
                aria-label={`Font size ${f.label}`}
                aria-pressed={fontSize === f.value}
                className={`transition-all duration-500 rounded-full cursor-pointer ${
                  fontSize === f.value
                    ? "w-5 h-2.5 bg-accent"
                    : i < currentIndex
                      ? "size-2 bg-accent/40 hover:bg-accent/60"
                      : "size-2 bg-text-secondary/10 hover:bg-text-secondary/20"
                }`}
              />
            ))}
          </div>

          {/* Increase */}
          <button
            onClick={increase}
            disabled={currentIndex === FONT_SIZES.length - 1}
            className="size-7 rounded-lg border border-text-secondary/10 flex items-center justify-center text-text-secondary hover:text-accent hover:border-accent/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            aria-label="Increase font size"
          >
            <AArrowUp size={14} />
          </button>
        </div>
        <p className="text-[10px] text-text-secondary/60 text-center">
          {FONT_SIZES[currentIndex]?.title ?? "Medium"}
        </p>
      </div>

      {/* Translation Language */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Languages size={12} className="text-text-secondary" />
            <p className="text-xs text-text-secondary">Translation</p>
          </div>
          <LanguageToggle
            translationLang={translationLang}
            setTranslationLang={setTranslationLang}
          />
        </div>
      </div>
    </div>
  );
}
