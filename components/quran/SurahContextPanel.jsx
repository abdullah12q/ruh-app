"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SurahContext from "@/data/surah-context.json";
import { TABS } from "./SurahTraditionalCommentary";
import { SurahExpandablePanel } from "./SurahExpandablePanel";

export function SurahContextPanel({ surahId, surahInfo }) {
  const [expanded, setExpanded] = useState(false);
  const surahContext = SurahContext[surahId];

  const hasCommentary = TABS.some((tab) => surahInfo?.[tab.key]?.value);

  if (!surahContext && !hasCommentary) return null;

  return (
    <div className="mx-auto mt-10 max-w-2xl">
      {/* Ornamental divider, echoes the star texture motif */}
      <div
        className="mb-6 flex items-center justify-center gap-3"
        aria-hidden="true"
      >
        <div className="h-px w-16 bg-linear-to-r from-transparent to-(--surface-glass-border)" />
        <svg
          width="12"
          height="12"
          viewBox="0 0 14 14"
          className="text-accent/50"
        >
          <path
            d="M7 0 L8.5 5.5 L14 7 L8.5 8.5 L7 14 L5.5 8.5 L0 7 L5.5 5.5 Z"
            fill="currentColor"
          />
        </svg>
        <div className="h-px w-16 bg-linear-to-l from-transparent to-(--surface-glass-border)" />
      </div>

      {/* Core themes */}
      {surahContext?.core_themes?.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
          {surahContext.core_themes.map((theme) => (
            <p
              key={theme}
              dir="rtl"
              lang="ar"
              className="rounded-full border border-accent/25 bg-accent/5 px-4 py-1.5 font-arabic-ui text-sm text-accent"
            >
              {theme}
            </p>
          ))}
        </div>
      )}

      {/* English summary, always visible */}
      {surahContext?.summary_english && (
        <p className="mx-auto max-w-xl text-center font-inter text-[15px] leading-relaxed text-text-secondary">
          {surahContext.summary_english}
        </p>
      )}

      {/* Toggle */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="group mx-auto mt-6 flex items-center gap-1.5 font-jakarta text-[11px] uppercase tracking-[0.2em] text-accent/80 transition-colors hover:text-accent cursor-pointer"
      >
        {expanded ? "Show Less" : "Explore Full Context"}
        <ChevronDown
          size={14}
          className={`transition-transform duration-300 ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Expandable panel feha Arabic summary, revelation reasons, other names, and commentary */}
      <SurahExpandablePanel
        expanded={expanded}
        surahContext={surahContext}
        surahInfo={surahInfo}
      />
    </div>
  );
}
