import ligaturesData from "@/data/ligatures.json";
import { SurahHeaderGlyph } from "./SurahHeaderGlyph";
import { SurahStats } from "./SurahStats";
import { SurahContextPanel } from "./SurahContextPanel";

export default function SurahHeader({ surah, surahInfo, startJuz, endJuz }) {
  const lookupKey = `surah-${surah.id}`;
  const surahGlyph = ligaturesData[lookupKey];

  return (
    <header className="relative mb-10 overflow-hidden rounded-4xl glass p-8 sm:p-14 text-center animate-fade-up">
      {/* Geometric texture */}
      <svg
        className="pointer-events-none absolute inset-0 size-full opacity-[0.05]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="ruh-star"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M24 4 L28 20 L44 24 L28 28 L24 44 L20 28 L4 24 L20 20 Z"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="0.75"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ruh-star)" />
      </svg>

      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 size-105 -translate-x-1/2 rounded-full bg-accent/10 blur-[110px]" />

      <div className="relative z-10">
        {/* Position in the quran */}
        <div className="mb-8 flex items-center justify-center gap-10">
          <span className="font-jakarta text-[11px] uppercase tracking-[0.25em] text-text-secondary">
            Surah {String(surah.id).padStart(3, "0")}
          </span>
          <span className="font-jakarta text-[11px] uppercase tracking-[0.25em] text-text-secondary/60">
            of 114
          </span>
        </div>

        {/* Signature: mihrab-arch frame around the surah's calligraphic glyph */}
        <SurahHeaderGlyph surahGlyph={surahGlyph} />

        {/* Names */}
        <h1
          className="mb-3 font-arabic-ui text-4xl leading-tight text-text-primary sm:text-6xl"
          dir="rtl"
          lang="ar"
        >
          {surah.name_arabic}
        </h1>
        <h2 className="mb-1 font-jakarta text-lg font-semibold tracking-tight text-text-primary sm:text-xl">
          {surah.name_simple}
        </h2>
        <p className="mb-10 font-inter text-sm text-text-secondary">
          {surah.translated_name?.name}
        </p>

        {/* Stat strip */}
        <SurahStats
          surah={surah}
          surahInfo={surahInfo}
          startJuz={startJuz}
          endJuz={endJuz}
        />

        {/* Context panel & Traditional commentary */}
        <SurahContextPanel surahId={surah.id} surahInfo={surahInfo} />
      </div>
    </header>
  );
}
