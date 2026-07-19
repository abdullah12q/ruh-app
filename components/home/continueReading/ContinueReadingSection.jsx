"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Volume2 } from "lucide-react";
import useUIStore from "@/lib/store/useUIStore";
import { useSurah } from "@/lib/queries/quran";

export default function ContinueReadingSection() {
  const { activeAyah, lastRead, selectedReciter } = useUIStore();
  const [isMounted, setIsMounted] = useState(false);

  // We need to wait for mount to read from localStorage via Zustand persist
  // otherwise we get hydration mismatches
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const { data: surah, isLoading } = useSurah(lastRead?.surahId);

  // Prefer the ayah stored on lastRead
  const lastAyah =
    activeAyah?.surahNum !== lastRead?.surahId
      ? null // m3naha eno d5l 3la sora tanya bs m3mlsh feha activeAyah fa keda yo3tbr m2rash fel sora deh fa htb2a null
      : (lastRead?.ayahNumber ?? null);

  const progressPct = useMemo(() => {
    if (!surah?.verses_count || !lastAyah) return 0;
    return Math.min(
      100,
      Math.round((lastAyah?.ayahNum / surah.verses_count) * 100),
    );
  }, [surah, lastAyah]);

  // Ring geometry
  const R = 21;
  const CIRCUMFERENCE = 2 * Math.PI * R;
  const dashOffset = CIRCUMFERENCE - (progressPct / 100) * CIRCUMFERENCE;

  if (!isMounted || !lastRead?.surahId) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 z-20 relative"
      >
        <Link
          href={`/quran/${lastRead.surahId}${lastAyah ? "#ayah-" + lastAyah?.ayahNum : ""}`}
        >
          <div className="group relative overflow-hidden glass rounded-2xl p-5 sm:p-6 flex items-center justify-between border border-(--surface-glass-border) hover:border-accent/40 shadow-(--shadow-card) hover:shadow-[0_0_32px_rgba(20,184,166,0.16)] transition-all duration-500 ease-out cursor-pointer hover:-translate-y-0.5">
            {/* Surah arabic name */}
            {surah?.name_arabic && (
              <span
                aria-hidden
                className="pointer-events-none select-none absolute right-0.5 font-quran text-[3rem] sm:text-[6.5rem] leading-none text-accent/6 group-hover:text-accent/10 group-hover:-translate-x-1 transition-all duration-500 whitespace-nowrap"
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
                <svg
                  viewBox="0 0 48 48"
                  className="absolute inset-0 -rotate-90"
                >
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

              <div className="flex flex-col min-w-0 gap-1">
                <span className="text-[11px] text-accent font-jakarta font-semibold tracking-[0.15em] uppercase">
                  Continue Reading
                </span>

                {isLoading ? (
                  <div className="h-5 w-36 skeleton" />
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
                  <span className="text-text-secondary/70 text-xs font-jakarta">
                    {lastAyah
                      ? `Ayah ${lastAyah?.ayahNum} of ${surah.verses_count} · ${progressPct}%`
                      : `${surah.verses_count} ayahs`}
                  </span>
                )}

                {selectedReciter?.name && (
                  <span className="flex items-center gap-1 text-text-secondary/50 text-[11px] font-jakarta mt-0.5">
                    <Volume2 size={11} className="text-accent/60" />
                    <span className="truncate">{selectedReciter.name}</span>
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
    </AnimatePresence>
  );
}
