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
          href={`/quran/${prevSurah}`}
          className="flex items-center gap-2 glass px-5 py-3 rounded-xl text-sm font-medium font-jakarta text-text-secondary hover:text-accent hover:border-(--accent)/30 transition-all duration-200"
        >
          <ChevronLeft size={16} />
          Surah {prevSurah}
        </Link>
      ) : (
        <div />
      )}

      {nextSurah ? (
        <Link
          href={`/quran/${nextSurah}`}
          className="flex items-center gap-2 glass px-5 py-3 rounded-xl text-sm font-medium font-jakarta text-text-secondary hover:text-accent hover:border-(--accent)/30 transition-all duration-200"
        >
          Surah {nextSurah}
          <ChevronRight size={16} />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
