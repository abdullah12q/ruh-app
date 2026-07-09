import { BookOpen, MapPin, Sparkles, Layers, FileText } from "lucide-react";

export default function SurahHeader({ surah, startJuz, endJuz }) {
  return (
    <header className="glass rounded-3xl p-8 sm:p-10 text-center mb-8 relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute inset-0 bg-linear-to-b from-accent/5 to-transparent pointer-events-none rounded-3xl" />

      <div className="relative z-10">
        {/* Surah Number */}
        <div className="inline-flex items-center justify-center size-12 rounded-2xl bg-accent/10 border border-accent/20 text-accent font-bold font-jakarta text-lg mb-4">
          {surah.id}
        </div>

        {/* Arabic Name */}
        <h1
          className="font-arabic-ui text-4xl sm:text-5xl text-text-primary mb-2"
          dir="rtl"
          lang="ar"
        >
          {surah.name_arabic}
        </h1>

        {/* Transliteration */}
        <h2 className="font-jakarta font-bold text-xl text-text-primary mb-1">
          {surah.name_simple}
        </h2>

        {/* Translated Name */}
        <p className="font-inter text-text-secondary text-sm mb-5">
          {surah.translated_name?.name}
        </p>

        {/* Meta Pills */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass text-xs font-medium text-text-secondary">
            <BookOpen size={13} className="text-accent/80" />
            <span>{surah.verses_count} Verses</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass text-xs font-medium text-text-secondary capitalize">
            <MapPin size={13} className="text-accent/80" />
            <span>{surah.revelation_place}</span>
          </span>
          {surah.revelation_order && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass text-xs font-medium text-text-secondary">
              <Sparkles size={13} className="text-accent/80" />
              <span>Revelation Order: {surah.revelation_order}</span>
            </span>
          )}
          {startJuz && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass text-xs font-medium text-text-secondary">
              <Layers size={13} className="text-accent/80" />
              <span>
                Juz: {startJuz} {endJuz !== startJuz && `- ${endJuz}`}
              </span>
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass text-xs font-medium text-text-secondary">
            <FileText size={13} className="text-accent/80" />
            <span>
              {surah.pages?.[0] === surah.pages?.[1]
                ? `Page: ${surah.pages?.[0]}`
                : `Pages: ${surah.pages?.[0]} - ${surah.pages?.[1]}`}
            </span>
          </span>
        </div>
      </div>
    </header>
  );
}
