import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SurahNavigation({ prevSurah, nextSurah }) {
  return (
    <nav
      className="flex items-center justify-between mt-12 gap-4"
      aria-label="Surah navigation"
    >
      {prevSurah ? (
        <Link
          href={`/quran/${prevSurah.id}`}
          className="flex items-center gap-2 glass px-5 py-3 rounded-xl text-sm font-medium font-jakarta text-text-secondary hover:text-accent hover:border-(--accent)/30 transition-all duration-200"
        >
          <ChevronLeft size={16} />
          <span className="flex flex-col items-start leading-tight">
            <span>{prevSurah.name_simple}</span>
            <span
              className="text-xs font-arabic-ui opacity-70"
              dir="rtl"
              lang="ar"
            >
              {prevSurah.name_arabic}
            </span>
          </span>
        </Link>
      ) : (
        <div />
      )}

      {nextSurah ? (
        <Link
          href={`/quran/${nextSurah.id}`}
          className="flex items-center gap-2 glass px-5 py-3 rounded-xl text-sm font-medium font-jakarta text-text-secondary hover:text-accent hover:border-(--accent)/30 transition-all duration-200"
        >
          <span className="flex flex-col items-end leading-tight">
            <span>{nextSurah.name_simple}</span>
            <span
              className="text-xs font-arabic-ui opacity-70"
              dir="rtl"
              lang="ar"
            >
              {nextSurah.name_arabic}
            </span>
          </span>
          <ChevronRight size={16} />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
