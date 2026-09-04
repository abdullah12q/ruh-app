import { useQuery } from "@tanstack/react-query";
import useUIStore from "@/lib/store/useUIStore";

const QURAN_API_BASE = "https://api.quran.com/api/v4";

// ── API Fetcher ─────────────────────────────────────────────────
async function quranFetch(endpoint) {
  const res = await fetch(`${QURAN_API_BASE}${endpoint}`);
  if (!res.ok) {
    throw new Error(`Quran API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// ── Query Keys Factory ──────────────────────────────────────────
// Centralized key factory for cache consistency
export const quranKeys = {
  all: ["quran"],
  surah: (id) => [...quranKeys.all, "surah", id],
  search: (query) => [...quranKeys.all, "search", query],
  translationEn: (surahId, ayahNum) => [
    ...quranKeys.all,
    "translation",
    "en",
    surahId,
    ayahNum,
  ],
  translationAr: (surahId, ayahNum) => [
    ...quranKeys.all,
    "translation",
    "ar",
    surahId,
    ayahNum,
  ],
  randomVerse: () => [...quranKeys.all, "random-verse"],
  specificVerse: (surahId, nextVerse) => [
    ...quranKeys.all,
    "specific-verse",
    surahId,
    nextVerse,
  ],
  mushafPage: (pageNumber) => [...quranKeys.all, "mushaf-page", pageNumber],
};

/**
 * useSurah — Fetches a single Surah's metadata.
 */
export function useSurah(surahId) {
  return useQuery({
    queryKey: quranKeys.surah(surahId),
    queryFn: () => quranFetch(`/chapters/${surahId}`).then((d) => d.chapter),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 48 * 60 * 60 * 1000,
    enabled: !!surahId,
  });
}

// ── Translation Fetchers ─────────────────────────────────────────

/**
 * useEnglishTranslation — Fetches Saheeh International English translation
 * for a single ayah from quranenc.com.
 *
 * @param surahId  - Surah number (1-114)
 * @param ayahNum  - Ayah number within the surah
 */
export async function fetchEnglishTranslation(surahId, ayahNum) {
  const res = await fetch(
    `https://quranenc.com/api/v1/translation/aya/english_saheeh/${surahId}/${ayahNum}`,
  );
  if (!res.ok) throw new Error(`quranenc EN error: ${res.status}`);
  const data = await res.json();
  // API returns { result: { translation, footnotes, ... } }
  return (
    {
      translation: data?.result?.translation,
      footnotes: data?.result?.footnotes,
    } ?? null
  );
}

export function useEnglishTranslation(surahId, ayahNum) {
  return useQuery({
    queryKey: quranKeys.translationEn(surahId, ayahNum),
    queryFn: () => fetchEnglishTranslation(surahId, ayahNum),
    staleTime: 60 * 60 * 1000,
    gcTime: 4 * 60 * 60 * 1000,
    enabled: !!surahId && !!ayahNum,
  });
}

/**
 * useArabicTranslation — Fetches Al-Mukhtasar Arabic tafsir
 * for a single ayah from the CDN-hosted tafsir API.
 *
 * @param surahId  - Surah number (1-114)
 * @param ayahNum  - Ayah number within the surah
 */
export async function fetchArabicTranslation(surahId, ayahNum) {
  const res = await fetch(
    `https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/ar-tafsir-al-mukhtasar/${surahId}/${ayahNum}.json`,
  );
  if (!res.ok) throw new Error(`tafsir AR error: ${res.status}`);
  const data = await res.json();
  // API returns { text, ... }
  return data?.text ?? null;
}

export function useArabicTranslation(surahId, ayahNum) {
  return useQuery({
    queryKey: quranKeys.translationAr(surahId, ayahNum),
    queryFn: () => fetchArabicTranslation(surahId, ayahNum),
    staleTime: 60 * 60 * 1000,
    gcTime: 4 * 60 * 60 * 1000,
    enabled: !!surahId && !!ayahNum,
  });
}

/**
 * useAyahTranslation — Convenience hook that automatically picks the
 * correct translation source based on the global translationLang setting.
 *
 * Returns { text, isLoading, isError } for easy consumption in AyahCard.
 *
 * @param surahId - Surah number
 * @param ayahNum - Ayah number
 */
export function useAyahTranslation(surahId, ayahNum) {
  const lang = useUIStore((s) => s.translationLang);

  const en = useEnglishTranslation(
    lang === "en" ? surahId : null,
    lang === "en" ? ayahNum : null,
  );
  const ar = useArabicTranslation(
    lang === "ar" ? surahId : null,
    lang === "ar" ? ayahNum : null,
  );

  if (lang === "ar") {
    return {
      text: ar.data,
      isLoading: ar.isLoading,
      isError: ar.isError,
      lang,
    };
  }
  return {
    text: en.data?.translation,
    footnotes: en.data?.footnotes,
    isLoading: en.isLoading,
    isError: en.isError,
    lang,
  };
}

/**
 * useQuranSearch — Client-side search across verses.
 *
 * @param query - Search string
 * @param enabled - Whether to enable the query
 */
export function useQuranSearch(query, enabled = true) {
  // Regex to check for Arabic characters
  const containsArabic = /[\u0600-\u06FF]/.test(query);

  return useQuery({
    queryKey: quranKeys.search(query),
    queryFn: async () => {
      const res = await fetch(
        `https://api.bonyanoss.org/ayat/search?text=${encodeURIComponent(query)}&limit=2000`,
      );
      if (!res.ok) throw new Error("Failed to fetch verse");
      const data = await res.json();

      // If the API returns verses 1, 2, and 3 in exact sequence, it is a fallback dump, not a search result.
      const isFallbackDump =
        data.data &&
        data.data.length >= 3 &&
        data.data[0].aya.number === 1 &&
        data.data[1].aya.number === 2 &&
        data.data[2].aya.number === 3;

      if (!data.success || isFallbackDump)
        throw new Error("Failed to fetch verse/s");

      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: enabled && !!query && query.trim().length > 2 && containsArabic,
  });
}

export const DAILY_VERSE_KEY = "ruh_daily_verse";
const DAY_MS = 24 * 60 * 60 * 1000; // 24 hours

/** Reads the cached verse from localStorage. Returns null if missing or expired. */
function getCachedDailyVerse() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DAILY_VERSE_KEY);
    if (!raw) return null;
    const { verse, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp < DAY_MS) return verse;
    return null; // expired
  } catch {
    return null;
  }
}

/** Writes a verse to localStorage with the current timestamp. */
export function cacheDailyVerse(verse) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      DAILY_VERSE_KEY,
      JSON.stringify({ verse, timestamp: Date.now() }),
    );
  } catch {
    // ignore storage errors (e.g. private mode)
  }
}

// used for prefetching
export async function fetchSpecificVerse(surahId, nextVerse) {
  const url = `https://staticquran.vercel.app/api/v1/surah/${surahId}/ayah/${nextVerse}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch verse");
  const data = await res.json();
  return {
    surah: data?.data?.sequence,
    ...data.data.ayah,
  };
}

export async function fetchRandomVerse() {
  const url = "https://staticquran.vercel.app/api/v1/ayah/random";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch verse");
  const data = await res.json();
  return { ...data.data };
}

/**
 * useBookmarkVerse — Fetches the full verse data for a single bookmarked ayah.
 *
 * Reuses `quranKeys.specificVerse` so the result is shared with the AyahCard
 * prefetch cache — no duplicate network requests for recently-played ayahs.
 *
 * @param surahId - Surah number (1-114)
 * @param ayahNum - Ayah number within the surah
 */
export function useBookmarkVerse(surahId, ayahNum) {
  return useQuery({
    queryKey: quranKeys.specificVerse(surahId, ayahNum),
    queryFn: () => fetchSpecificVerse(surahId, ayahNum),
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days — Quran text never changes
    gcTime: 30 * 24 * 60 * 60 * 1000,
    enabled: !!surahId && !!ayahNum,
  });
}

/**
 * useRandomOrNextVerse — Returns a daily verse that persists for 24 hours or the next verse if provided.
 *
 * The verse is stored in localStorage so that browser refreshes within
 * the same day always show the same verse. After 24 hours (or when the
 * user explicitly clicks "Get another verse") a new verse is fetched.
 */
export function useRandomOrNextVerse(surahId, nextVerse) {
  const isSpecific = !!nextVerse;

  const queryKey = isSpecific
    ? quranKeys.specificVerse(surahId, nextVerse)
    : quranKeys.randomVerse();

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!isSpecific) {
        const cached = getCachedDailyVerse();
        if (cached) return cached;
        return fetchRandomVerse();
      }
      return fetchSpecificVerse(surahId, nextVerse);
    },
    staleTime: DAY_MS, // React Query won't auto-refetch for 24 hours
    gcTime: DAY_MS * 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

/**
 * fetchMushafPage — Standalone fetcher for a single Madani Mushaf page.
 *
 * Extracted so it can be shared between `useMushafPage` (on-demand reads
 * inside MushafView) and `SurahPlaybackProvider`'s eager prefetch loop
 * (via `queryClient.prefetchQuery`) without duplicating the fetch logic.
 *
 * @param {number} pageNumber
 */
export async function fetchMushafPage(pageNumber) {
  return quranFetch(
    `/verses/by_page/${pageNumber}?words=true&word_fields=text_qpc_hafs,line_number,position,char_type_name&fields=verse_key,verse_number&per_page=50`,
  ).then((d) => d.verses);
}

export function useMushafPage(pageNumber) {
  return useQuery({
    queryKey: quranKeys.mushafPage(pageNumber),
    queryFn: () => fetchMushafPage(pageNumber),
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days — Quran text is immutable
    gcTime: 30 * 24 * 60 * 60 * 1000,
    enabled: typeof pageNumber === "number" && pageNumber > 0,
  });
}
