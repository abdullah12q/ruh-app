import Link from "next/link";
import { revelationBadge } from "@/data/datas/quranData";

export default function SurahCard({ surah }) {
  const badge = revelationBadge[surah.revelation_place];

  return (
    <Link
      href={`/quran/${surah.id}`}
      className="group relative overflow-hidden glass rounded-2xl p-5 flex items-center gap-4 hover:border-(--accent)/30 transition-all duration-200 hover:shadow-[0_0_20px_rgba(20,184,166,0.1)]!"
    >
      {/* Surah Number Badge */}
      <div className="size-11 shrink-0 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-sm font-bold font-jakarta text-accent group-hover:bg-accent/20 transition-colors duration-200">
        {surah.id}
      </div>

      {/* Top hairline accent that sweeps in on hover — a single considered motion cue */}
      <span className="absolute top-0 left-0 h-px bg-linear-to-r from-transparent via-accent to-transparent w-0 group-hover:w-full transition-all duration-700 ease-out" />

      {/* Bottom hairline accent that sweeps in on hover — a single considered motion cue */}
      <span className="absolute bottom-0 right-0 h-px bg-linear-to-l from-transparent via-accent to-transparent w-0 group-hover:w-full transition-all duration-700 ease-out" />

      {/* Surah Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-jakarta font-bold text-sm text-text-primary truncate">
            {surah.name_simple}
          </h2>
          <span
            aria-hidden
            className="pointer-events-none select-none absolute right-0.5 -top-4 font-quran text-[2.5rem] sm:text-[3rem] leading-none text-accent/50 group-hover:text-accent group-hover:-translate-x-1 transition-all duration-500 whitespace-nowrap"
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
