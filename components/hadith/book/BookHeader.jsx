import { BookOpen, Hash, Layers } from "lucide-react";
import React from "react";

export default function BookHeader({
  arabicTitle,
  bookInfo,
  englishTitle,
  englishAuthor,
  arabicAuthor,
  totalHadiths,
  chapters,
}) {
  return (
    <div className="relative mb-10 group">
      {/* Ambient glow behind the card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 0%, var(--accent-glow), transparent)",
        }}
      />

      {/* Main card */}
      <div
        className="relative glass rounded-3xl overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--surface-glass) 0%, rgba(20,184,166,0.04) 100%)",
          boxShadow:
            "0 0 0 1px var(--surface-glass-border), 0 24px 64px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {/* Top accent bar */}
        <div
          className="h-0.75 w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--accent), #6ee7df, var(--accent), transparent)",
          }}
        />

        {/* Decorative corner orb */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 -left-20 size-56 bg-accent rounded-full opacity-20 blur-3xl"
        />

        {/* Content */}
        <div className="relative px-7 pt-7 pb-8 sm:px-10 sm:pt-9 sm:pb-10">
          {/* Collection badge */}
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-5 text-xs text-accent font-semibold tracking-widest uppercase"
            style={{
              background:
                "linear-gradient(135deg, rgba(20,184,166,0.14), rgba(110,231,223,0.08))",
              border: "1px solid rgba(20,184,166,0.25)",
              boxShadow: "0 0 12px rgba(20,184,166,0.12)",
            }}
          >
            <BookOpen size={12} strokeWidth={2.5} />
            {bookInfo.collectionLabel}
          </div>

          {/* English title */}
          <h1
            className="font-jakarta font-extrabold leading-tight mb-2"
            style={{
              fontSize: "clamp(1.6rem, 4vw, 2.6rem)",
              background:
                "linear-gradient(135deg, var(--text-primary) 40%, var(--accent) 120%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {englishTitle}
          </h1>

          {/* Arabic title */}
          <p
            dir="rtl"
            lang="ar"
            className="font-quran text-accent opacity-85 -mt-2"
            style={{
              fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
              textShadow: "0 0 20px var(--accent-glow)",
            }}
          >
            {arabicTitle}
          </p>

          {/* English Author */}
          <p className="font-inter text-sm text-text-secondary mb-2">
            {englishAuthor}
          </p>

          {/* Arabic Author */}
          <p
            dir="rtl"
            lang="ar"
            className="font-inter text-sm text-text-secondary mb-8"
          >
            {arabicAuthor}
          </p>

          {/* Divider */}
          <div
            className="mb-7 h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--surface-glass-border) 30%, var(--surface-glass-border) 70%, transparent)",
            }}
          />

          {/* Stats pills */}
          <div className="flex flex-wrap gap-4">
            {/* Hadiths stat */}
            <div
              className="flex items-center gap-3.5 px-5 py-3.5 rounded-2xl transition-transform duration-300 hover:-translate-y-0.5"
              style={{
                background:
                  "linear-gradient(135deg, rgba(20,184,166,0.1) 0%, rgba(20,184,166,0.04) 100%)",
                border: "1px solid rgba(20,184,166,0.2)",
                boxShadow:
                  "0 4px 20px rgba(20,184,166,0.08), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              <div
                className="flex items-center justify-center size-8 rounded-xl"
                style={{
                  background: "linear-gradient(135deg, var(--accent), #0f766e)",
                  boxShadow: "0 4px 12px var(--accent-glow)",
                }}
              >
                <Hash size={14} strokeWidth={2.5} className="text-white" />
              </div>
              <div>
                <p className="font-jakarta font-bold text-text-primary text-xl leading-none">
                  {totalHadiths.toLocaleString()}
                </p>
                <p className="font-inter text-xs text-text-secondary tracking-widest mt-0.5 uppercase">
                  Hadiths
                </p>
              </div>
            </div>

            {/* Chapters stat */}
            <div
              className="flex items-center gap-3.5 px-5 py-3.5 rounded-2xl transition-transform duration-300 hover:-translate-y-0.5"
              style={{
                background:
                  "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(99,102,241,0.03) 100%)",
                border: "1px solid rgba(99,102,241,0.18)",
                boxShadow:
                  "0 4px 20px rgba(99,102,241,0.06), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              <div
                className="flex items-center justify-center size-8 rounded-xl"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                  boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
                }}
              >
                <Layers size={14} strokeWidth={2.5} className="text-white" />
              </div>
              <div>
                <p className="font-jakarta font-bold text-text-primary text-xl leading-none">
                  {chapters.length}
                </p>
                <p className="font-inter text-xs text-text-secondary tracking-widest mt-0.5 uppercase">
                  Chapters
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom shimmer bar */}
        <div
          className="h-px w-full opacity-40"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--accent), transparent)",
          }}
        />
      </div>
    </div>
  );
}
