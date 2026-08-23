import Link from "next/link";
import { ChevronRight, Hash } from "lucide-react";
import { COLOR_MAP } from "@/data/datas/hadithData";

export default function HadithBookCard({ book }) {
  const colors = COLOR_MAP[book.color] ?? COLOR_MAP.teal;

  return (
    <Link
      href={`/hadith/${book.id}`}
      className={`group relative overflow-hidden glass rounded-2xl p-5 flex items-center gap-4 hover:border-accent/30! transition-all duration-500 ${colors.glow} cursor-pointer`}
    >
      {/* Book number badge */}
      <div
        className={`shrink-0 size-12 rounded-xl flex flex-col items-center justify-center font-jakarta font-bold text-sm ${colors.number}`}
      >
        <Hash size={12} className="mb-0.5 opacity-60" />
        <span className="leading-none">{book.length.toLocaleString()}</span>
      </div>

      {/* Text content */}
      <div className="flex-1 min-w-0 ">
        <p
          className={`font-arabic-ui text-base leading-tight mb-3 sm:mb-1 ${colors.accent}`}
          dir="rtl"
          lang="ar"
        >
          {book.arabicTitle}
        </p>
        <h3 className="font-jakarta font-semibold text-text-primary text-sm leading-tight truncate group-hover:text-accent transition-colors">
          {book.englishTitle}
        </h3>
        <p className="font-inter text-xs text-text-secondary mt-0.5 truncate">
          {book.author}
        </p>
      </div>

      {/* Arrow */}
      <ChevronRight
        size={16}
        className="text-text-secondary shrink-0 group-hover:text-accent group-hover:translate-x-1 transition-all duration-200"
      />
    </Link>
  );
}
