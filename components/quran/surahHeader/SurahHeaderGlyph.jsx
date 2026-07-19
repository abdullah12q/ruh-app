import { BookOpen } from "lucide-react";

export function SurahHeaderGlyph({ surahGlyph }) {
  return (
    <div className="relative mx-auto mb-8 flex size-40 items-center justify-center sm:size-48">
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 size-full animate-glow-pulse"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ruh-arch" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.15" />
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
  );
}
