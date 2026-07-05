import Link from "next/link";
import { revelationBadge } from "@/data/quranData";

export default function SurahCard({ surah }) {
  const badge = revelationBadge[surah.revelation_place];

  return (
    <Link
      href={`/quran/${surah.id}`}
      className="group glass rounded-2xl p-5 flex items-center gap-4 hover:border-(--accent)/30 transition-all duration-200 hover:shadow-[0_0_20px_rgba(20,184,166,0.08)]"
    >
      {/* Surah Number Badge */}
      <div className="size-11 shrink-0 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-sm font-bold font-jakarta text-accent group-hover:bg-accent/20 transition-colors duration-200">
        {surah.id}
      </div>

      {/* Surah Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-jakarta font-bold text-sm text-text-primary truncate">
            {surah.name_simple}
          </h2>
          <span
            className="font-arabic-ui text-base text-text-secondary shrink-0"
            dir="rtl"
            lang="ar"
          >
            {surah.name_arabic}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-text-secondary font-inter">
            {surah.verses_count} verses
          </span>
          <span className="text-text-secondary/30">·</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full border font-medium ${badge.className}`}
          >
            {badge.label}
          </span>
        </div>
      </div>
    </Link>
  );
}
