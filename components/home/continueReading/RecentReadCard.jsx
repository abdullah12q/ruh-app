import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, Volume2 } from "lucide-react";
import useUIStore from "@/lib/store/useUIStore";
import { useSurah } from "@/lib/queries/quran";

export function RecentReadCard({ read, index }) {
  const { activeAyah, setSelectedReciter, mushafMode, toggleMushafMode } =
    useUIStore();
  const { data: surah, isLoading } = useSurah(read.surahId);

  // Sanitize the surahId and ayahNumber to prevent hash duplication from corrupted state 3shan s3at kan el url path byb2a "/quran/1#ayah-1#ayah-2" bdl "/quran/1#ayah-1" aw "/quran/1#ayah-2"
  const cleanSurahId = parseInt(read.surahId, 10); // 10 deh 3shan y3rf en el number base 10 (0-9)

  // If the user is currently listening to THIS surah, show live active ayah. Otherwise, show saved ayah.
  const currentAyahNum = activeAyah?.[cleanSurahId] || read.ayahNumber;
  const cleanAyahNum = currentAyahNum ? parseInt(currentAyahNum, 10) : null;

  const progressPct = useMemo(() => {
    if (!surah?.verses_count || !cleanAyahNum) return 0;
    return Math.min(100, Math.round((cleanAyahNum / surah.verses_count) * 100));
  }, [surah, cleanAyahNum]);

  // Ring geometry
  const R = 21;
  const CIRCUMFERENCE = 2 * Math.PI * R;
  const dashOffset = CIRCUMFERENCE - (progressPct / 100) * CIRCUMFERENCE;

  const currentPage = read.currentPage;

  const baseUrl = `/quran/${cleanSurahId}`;
  const extraUrl =
    read.mushafMode && currentPage
      ? `?page=${currentPage}`
      : cleanAyahNum && !read.mushafMode
        ? `#ayah-${cleanAyahNum}`
        : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.1 }}
    >
      <Link
        href={`${baseUrl}${extraUrl}`}
        onClick={() => {
          setSelectedReciter(read.reciter);
          toggleMushafMode(read.mushafMode);
        }}
      >
        <div className="group relative overflow-hidden glass rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-(--shadow-card) hover:shadow-[0_0_32px_rgba(20,184,166,0.16)]! transition-all duration-500 ease-out cursor-pointer hover:-translate-y-0.5">
          {/* Surah arabic name */}
          {surah?.name_arabic && (
            <span
              aria-hidden
              className="pointer-events-none select-none absolute right-0.5 font-quran text-[3rem] sm:text-[5.5rem] leading-none text-accent opacity-6 group-hover:opacity-10 group-hover:-translate-x-1 transition-all duration-500 whitespace-nowrap"
            >
              {surah.name_arabic}
            </span>
          )}

          {/* Top hairline accent that sweeps in on hover — a single considered motion cue */}
          <span className="absolute top-0 left-0 h-px bg-linear-to-r from-transparent via-accent to-transparent w-0 group-hover:w-full transition-all duration-700 ease-out" />

          {/* Bottom hairline accent that sweeps in on hover — a single considered motion cue */}
          <span className="absolute bottom-0 right-0 h-px bg-linear-to-l from-transparent via-accent to-transparent w-0 group-hover:w-full transition-all duration-700 ease-out" />

          <div className="flex items-center gap-4 relative z-10 min-w-0">
            {/* Progress ring replaces the static icon tile — it encodes real information (how far into the surah you are) instead of decorating */}
            <div className="relative size-12 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r={R}
                  fill="none"
                  stroke="var(--surface-glass-border)"
                  strokeWidth="2"
                />
                {progressPct > 0 && (
                  <circle
                    cx="24"
                    cy="24"
                    r={R}
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={dashOffset}
                    className="transition-all duration-700 ease-out"
                    style={{
                      filter: "drop-shadow(0 0 4px var(--accent-glow))",
                    }}
                  />
                )}
              </svg>
              <div className="size-8 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                <Play size={13} className="ml-0.5" fill="currentColor" />
              </div>
            </div>

            <div className="flex flex-col min-w-0 gap-0.5">
              {isLoading ? (
                <div className="h-5 w-36 skeleton rounded mt-1" />
              ) : surah ? (
                <div className="flex items-baseline gap-2 min-w-0">
                  <h3 className="text-text-primary font-jakarta font-semibold text-base sm:text-lg truncate">
                    {surah.name_simple}
                  </h3>
                  {surah.translated_name?.name && (
                    <span className="text-text-secondary text-xs font-jakarta hidden sm:inline truncate">
                      {surah.translated_name.name}
                    </span>
                  )}
                </div>
              ) : null}

              {surah && (
                <span className="text-text-secondary/80 text-xs font-jakarta">
                  {cleanAyahNum
                    ? `Ayah ${cleanAyahNum} of ${surah.verses_count} · ${progressPct}%`
                    : `${surah.verses_count} Ayahs`}
                </span>
              )}

              {/* Show the Reciter that was saved at the time this Surah was played */}
              {read.reciter && (
                <span className="flex items-center gap-1.5 text-text-secondary/60 text-[11px] font-jakarta mt-1">
                  <Volume2 size={10} className="text-accent/60 shrink-0" />
                  <span className="truncate">{read.reciter.name}</span>
                </span>
              )}
            </div>
          </div>

          <div className="size-9 rounded-full flex items-center justify-center shrink-0 relative z-10 text-text-secondary bg-(--surface-glass-border)/40 group-hover:bg-accent/10 group-hover:text-accent group-hover:translate-x-1 transition-all duration-300">
            <ArrowRight size={16} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
