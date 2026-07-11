import { BookOpen, MapPin, Sparkles, Layers, FileText } from "lucide-react";
import { Stat } from "./Stat";
import ligaturesData from "@/ligatures.json";

export default function SurahHeader({ surah, startJuz, endJuz }) {
  const lookupKey = `surah-${surah.id}`;
  const surahGlyph = ligaturesData[lookupKey];

  return (
    <header className="relative mb-10 overflow-hidden rounded-4xl glass p-8 sm:p-14 text-center animate-fade-up">
      {/* Geometric texture */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.05]"
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
        <div className="mb-8 flex items-center justify-center">
          <span className="font-jakarta text-[11px] uppercase tracking-[0.25em] text-text-secondary">
            Surah {String(surah.id).padStart(3, "0")}
          </span>
          <span className="h-px w-10 bg-surface-glass-border" />
          <span className="font-jakarta text-[11px] uppercase tracking-[0.25em] text-text-secondary/60">
            of 114
          </span>
        </div>

        {/* Signature: mihrab-arch frame around the surah's calligraphic glyph */}
        <div className="relative mx-auto mb-8 flex size-40 items-center justify-center sm:size-48">
          <svg
            viewBox="0 0 200 200"
            className="absolute inset-0 size-full animate-glow-pulse"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="ruh-arch" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.9" />
                <stop
                  offset="100%"
                  stopColor="var(--accent)"
                  stopOpacity="0.15"
                />
              </linearGradient>
            </defs>
            <path
              d="M100 18 C60 18 34 54 34 98 L34 178 L166 178 L166 98 C166 54 140 18 100 18 Z"
              fill="var(--surface-glass)"
              stroke="url(#ruh-arch)"
              strokeWidth="1.5"
            />
          </svg>
          {surahGlyph ? (
            <span
              className="relative z-10 select-none font-surah-header text-6xl sm:text-7xl"
              aria-hidden="true"
            >
              {surahGlyph}
            </span>
          ) : (
            <BookOpen
              className="relative z-10 text-accent/60"
              size={40}
              strokeWidth={1.25}
            />
          )}
        </div>

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
        <div className="glass-light mx-auto flex max-w-lg flex-wrap items-stretch justify-center divide-x divide-(--surface-glass-border) overflow-hidden rounded-2xl">
          <Stat icon={BookOpen} label="Verses" value={surah.verses_count} />
          <Stat
            icon={MapPin}
            label="Revealed"
            value={surah.revelation_place}
            capitalize
          />
          {startJuz && (
            <Stat
              icon={Layers}
              label="Juz"
              value={startJuz === endJuz ? startJuz : `${startJuz} - ${endJuz}`}
            />
          )}
          <Stat
            icon={FileText}
            label={surah.pages?.[0] === surah.pages?.[1] ? "Page" : "Pages"}
            value={
              surah.pages?.[0] === surah.pages?.[1]
                ? surah.pages?.[0]
                : `${surah.pages?.[0]} - ${surah.pages?.[1]}`
            }
          />
          {surah.revelation_order && (
            <Stat
              icon={Sparkles}
              label="Order"
              value={surah.revelation_order}
            />
          )}
        </div>
      </div>
    </header>
  );
}
