import { create } from "zustand";
import { persist } from "zustand/middleware";
import imamList from "@/data/jsons/imam.json";

// Default reciter: Yasser Ad-Dussary (id 42)
const DEFAULT_RECITER_ID = 42;

/**
 * Global UI State Store — Rُuh Platform
 *
 * Manages:
 * - Font Size (persisted)
 * - Active Ayah (for audio-text synchronization)
 * - Audio playback state (persisted)
 * - Global Volume (shared across all audio players) (persisted)
 * - Translation language ('en' | 'ar') (persisted)
 * - Selected Reciter & Favorite Reciters (persisted)
 * - Bookmarked Ayahs (persisted)
 * - Reading Progress (persisted)
 */
const useUIStore = create(
  persist(
    (set) => ({
      // --- Font Size ---
      fontSize: "text-2xl",
      setFontSize: (value) => set({ fontSize: value }),

      // --- Audio-Text Sync ---
      activeAyah: null,
      // setActiveAyah: (ayahNum) => set({ activeAyah: ayahNum }),
      setActiveAyah: (
        surahNum,
        ayahNum, // { surahNum: 18, ayahNum: 10 }
      ) => set({ activeAyah: { surahNum, ayahNum } }),

      // --- Audio Player ---
      audioPlaying: false,
      setAudioPlaying: (comingState) => set({ audioPlaying: comingState }),

      // --- Global Volume (0–1, shared across all audio players) ---
      volume: 0.05,
      setVolume: (value) => set({ volume: value }),

      // --- Translation Language ---
      translationLang: "en", // 'en' | 'ar'
      setTranslationLang: (lang) => set({ translationLang: lang }),

      // --- Reciter ---
      selectedReciter:
        imamList.find((r) => r.id === DEFAULT_RECITER_ID) ?? imamList[0],
      setSelectedReciter: (reciter) => set({ selectedReciter: reciter }),

      // --- Favorite Reciters (stored as array of IDs) ---
      favoriteReciters: [],
      toggleFavoriteReciter: (reciterId) =>
        set((state) => ({
          favoriteReciters: state.favoriteReciters.includes(reciterId)
            ? state.favoriteReciters.filter((id) => id !== reciterId)
            : [...state.favoriteReciters, reciterId],
        })),

      // --- Bookmark Ayahs ---
      bookmarkedAyahs: [], // [{ surahNum: 18, ayahNum: 10 }]
      toggleBookmarkedAyahs: (surahNum, ayahNum) =>
        set((state) => {
          const isBookmarked = state.bookmarkedAyahs.some(
            (ayah) => ayah.surahNum === surahNum && ayah.ayahNum === ayahNum,
          );

          if (isBookmarked) {
            return {
              bookmarkedAyahs: state.bookmarkedAyahs.filter(
                (ayah) =>
                  ayah.surahNum !== surahNum || ayah.ayahNum !== ayahNum,
              ),
            };
          } else {
            const newBookmarks = [
              ...state.bookmarkedAyahs,
              { surahNum, ayahNum },
            ];

            // Sort the new array
            newBookmarks.sort((a, b) => {
              if (a.surahNum === b.surahNum) {
                // If in the same Surah, sort by Ayah number ascending
                return a.ayahNum - b.ayahNum;
              }
              // 8er keda, sort by Surah number ascending
              return a.surahNum - b.surahNum;
            });

            return { bookmarkedAyahs: newBookmarks };
          }
        }),

      // --- Reading Progress ---
      lastRead: null, // { surahId: 18, ayahNumber: 10 }
      setLastRead: (surahId, ayahNumber) =>
        set({ lastRead: { surahId, ayahNumber } }),
    }),
    {
      name: "ruh-ui-store", // dah esmha fel local storage
      // partialize deh m3naha my5odsh kol ely states w 5od ely ana h2olak 3leh bs
      partialize: (state) => ({
        fontSize: state.fontSize,
        volume: state.volume,
        translationLang: state.translationLang,
        selectedReciter: state.selectedReciter,
        favoriteReciters: state.favoriteReciters,
        bookmarkedAyahs: state.bookmarkedAyahs,
        lastRead: state.lastRead,
      }),
    },
  ),
);

export default useUIStore;
