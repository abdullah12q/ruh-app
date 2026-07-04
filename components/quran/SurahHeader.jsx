export default function SurahHeader({ surah }) {
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
          <span className="px-3 py-1 rounded-full glass text-xs font-medium text-text-secondary">
            {surah.verses_count} Verses
          </span>
          <span className="px-3 py-1 rounded-full glass text-xs font-medium text-text-secondary capitalize">
            {surah.revelation_place}
          </span>
          <span className="px-3 py-1 rounded-full glass text-xs font-medium text-text-secondary">
            Juz {surah.pages?.[0]}+
          </span>
        </div>
      </div>
    </header>
  );
}
