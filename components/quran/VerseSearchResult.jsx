import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// ── Arabic-aware highlighting ──────────────────────────────────
// The verse text keeps full diacritics (tashkeel) but the user's
// query almost never will, so we match on a normalized (diacritic-
// stripped, hamza/ta-marbuta-unified) copy of the text while still
// rendering + highlighting the *original* string with tashkeel intact.
// el const ely t7t dah wel 2 functions ely t7teh dol mt5den mn el ai
const ARABIC_DIACRITICS = /[\u064B-\u0652\u0670\u0610-\u061A\u06D6-\u06ED]/;

function normalizeArabic(text) {
  const chars = [];
  const map = []; // normalized index -> original index
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ARABIC_DIACRITICS.test(ch)) continue;

    let normCh = ch;
    if (/[إأآٱ]/.test(ch)) normCh = "ا";
    else if (ch === "ى") normCh = "ي";
    else if (ch === "ة") normCh = "ه";

    chars.push(normCh);
    map.push(i);
  }
  return { normalized: chars.join(""), map };
}

function getHighlightSegments(text, query) {
  if (!query?.trim()) return [{ text, highlight: false }];

  const { normalized, map } = normalizeArabic(text);
  const { normalized: normQuery } = normalizeArabic(query);
  if (!normQuery) return [{ text, highlight: false }];

  const idx = normalized.indexOf(normQuery);
  if (idx === -1) return [{ text, highlight: false }];

  const start = map[idx];
  const lastCharIdx = idx + normQuery.length - 1;

  // THE FIX: Instead of blindly adding +1, we look at where the NEXT base letter
  // starts in the original text. If there isn't a next letter, we go to the end of the string.
  // This ensures ALL trailing diacritics are safely included inside the highlight span.
  const end = lastCharIdx + 1 < map.length ? map[lastCharIdx + 1] : text.length;

  const segments = [];
  if (start > 0)
    segments.push({ text: text.slice(0, start), highlight: false });

  segments.push({ text: text.slice(start, end), highlight: true });

  if (end < text.length)
    segments.push({ text: text.slice(end), highlight: false });

  return segments;
}

export default function VerseSearchResult({ result, query, index = 0 }) {
  const surahId = result.surahNumber;
  const ayahId = result.aya?.numberInSurah;
  const segments = getHighlightSegments(result.aya.text, query);

  const surahName = result.surahName.replace("سُورَةُ", "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: Math.min(index * 0.05, 0.4),
        ease: "easeOut",
      }}
    >
      <Link
        href={`/quran/${surahId}#ayah-${ayahId}`}
        className="group relative block overflow-hidden rounded-3xl p-6 sm:p-7 glass border border-white/5 bg-background/40 transition-all duration-500 hover:border-accent/30 hover:shadow-[0_0_36px_-8px_var(--accent-glow)]"
      >
        {/* Ambient corner glow, only visible on hover */}
        <div className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-accent/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Top hairline accent that sweeps in on hover — a single considered motion cue */}
        <span className="absolute top-0 left-0 h-px bg-linear-to-r from-transparent via-accent to-transparent w-0 group-hover:w-full transition-all duration-700 ease-out" />

        {/* Bottom hairline accent that sweeps in on hover — a single considered motion cue */}
        <span className="absolute bottom-0 right-0 h-px bg-linear-to-l from-transparent via-accent to-transparent w-0 group-hover:w-full transition-all duration-700 ease-out" />

        <div className="relative flex flex-col gap-5">
          {/* Header: reference badge + surah name + arrow */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 px-3 py-1.5">
                <span className="font-jakarta text-accent text-sm font-bold leading-none">
                  {surahId}:{ayahId}
                </span>
              </div>
              <span
                className="font-quran text-text-secondary/70 text-xl"
                dir="rtl"
              >
                {surahName}
              </span>
            </div>

            <div className="size-8 shrink-0 rounded-full bg-white/5 flex items-center justify-center text-text-secondary group-hover:bg-accent group-hover:text-background transition-all duration-500">
              <ArrowRight
                size={16}
                className="group-hover:-rotate-45 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Arabic verse text, with the matched query highlighted */}
          <p
            className="text-right text-xl sm:text-[1.5rem] leading-loose"
            dir="rtl"
          >
            {segments.map((seg, i) =>
              seg.highlight ? (
                <span
                  key={i}
                  className="text-accent bg-accent/10 rounded-md px-1 py-0.5 box-decoration-clone"
                >
                  {seg.text}
                </span>
              ) : (
                <span key={i}>{seg.text}</span>
              ),
            )}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
