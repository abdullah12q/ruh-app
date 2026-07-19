import { BookOpen } from "lucide-react";
import SurahCard from "./SurahCard";

export default function QuranBrowser({ surahs }) {
  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-accent text-xs font-semibold tracking-wider uppercase mb-6">
            <BookOpen size={12} />
            Holy Quran
          </div>
          <h1 className="font-jakarta font-extrabold text-4xl sm:text-5xl text-text-primary mb-4">
            The Quran{" "}
            <span className="font-arabic-ui text-accent" dir="rtl" lang="ar">
              القرآن الكريم
            </span>
          </h1>
          <p className="font-inter text-text-secondary text-lg max-w-xl mx-auto">
            114 Surahs · 6,236 Ayahs · 30 Juz
          </p>
        </div>

        {/* Surah Grid */}
        {surahs.length > 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
            {surahs.map((surah) => (
              <SurahCard key={surah.id} surah={surah} />
            ))}
          </div>
        ) : (
          /* Fallback Skeleton Grid */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className="glass rounded-2xl p-5 flex items-center gap-4"
              >
                <div className="size-11 skeleton rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 skeleton rounded w-3/4" />
                  <div className="h-2 skeleton rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
