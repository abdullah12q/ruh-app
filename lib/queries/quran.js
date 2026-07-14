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
export function useEnglishTranslation(surahId, ayahNum) {
  return useQuery({
    queryKey: quranKeys.translationEn(surahId, ayahNum),
    queryFn: async () => {
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
    },
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
export function useArabicTranslation(surahId, ayahNum) {
  return useQuery({
    queryKey: quranKeys.translationAr(surahId, ayahNum),
    queryFn: async () => {
      const res = await fetch(
        `https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/ar-tafsir-al-mukhtasar/${surahId}/${ayahNum}.json`,
      );
      if (!res.ok) throw new Error(`tafsir AR error: ${res.status}`);
      const data = await res.json();
      // API returns { text, ... }
      return data?.text ?? null;
    },
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
 */
export function useQuranSearch(query) {
  return useQuery({
    queryKey: quranKeys.search(query),
    queryFn: () =>
      quranFetch(`/search?q=${encodeURIComponent(query)}&size=20&page=1`).then(
        (d) => d.search,
      ),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!query && query.length >= 2,
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
function cacheDailyVerse(verse) {
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

/**
 * useRandomVerse — Returns a daily verse that persists for 24 hours.
 *
 * The verse is stored in localStorage so that browser refreshes within
 * the same day always show the same verse. After 24 hours (or when the
 * user explicitly clicks "Get another verse") a new verse is fetched.
 */
export function useRandomVerse() {
  return useQuery({
    queryKey: quranKeys.randomVerse(),
    queryFn: async () => {
      // If there is a valid cached verse in your custom storage, use it
      const cached = getCachedDailyVerse();
      if (cached) return cached;

      const res = await fetch(
        "https://staticquran.vercel.app/api/v1/ayah/random",
      );
      if (!res.ok) throw new Error("Failed to fetch verse");

      const data = await res.json();
      const verse = data.data;

      cacheDailyVerse(verse);
      return verse;
    },
    staleTime: DAY_MS, // React Query won't auto-refetch for 24 hours
    gcTime: DAY_MS * 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
