import { create } from "zustand";
import imamList from "@/imam.json";

// Default reciter: Yasser Ad-Dussary (id 42)
const DEFAULT_RECITER_ID = 42;

/**
 * Global UI State Store — Rُuh Platform
 *
 * Manages:
 * - Focus Mode (distraction-free reading)
 * - Font Size
 * - Sidebar visibility
 * - Active Ayah (for audio-text synchronization)
 * - Audio playback state
 * - Current Surah being read
 * - Translation language ('en' | 'ar')
 * - Selected Reciter & Favorite Reciters
 */
const useUIStore = create((set) => ({
  // --- Focus Mode ---
  focusMode: false,
  toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode })),
  setFocusMode: (value) => set({ focusMode: value }),

  // --- Font Size ---
  fontSize: "text-2xl",
  setFontSize: (value) => set({ fontSize: value }),

  // --- Sidebar ---
  isSidebarOpen: false,
  setSidebarOpen: (value) => set({ isSidebarOpen: value }),
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  // --- Audio-Text Sync ---
  activeAyah: null,
  setActiveAyah: (ayahKey) => set({ activeAyah: ayahKey }),
  clearActiveAyah: () => set({ activeAyah: null }),

  // --- Audio Player ---
  audioPlaying: false,
  setAudioPlaying: (value) => set({ audioPlaying: value }),
  toggleAudio: () => set((state) => ({ audioPlaying: !state.audioPlaying })),

  // --- Current Reading Context ---
  currentSurahId: null,
  setCurrentSurahId: (id) => set({ currentSurahId: id }),

  // --- Translation Language ---
  translationLang: "en", // 'en' | 'ar'
  setTranslationLang: (lang) => set({ translationLang: lang }),

  // --- Reciter ---
  selectedReciter:
    imamList.find((r) => r.id === DEFAULT_RECITER_ID) ?? imamList[0],
  setSelectedReciter: (reciter) => set({ selectedReciter: reciter }),

  // --- Favorite Reciters (stored as array of IDs) bs el logic hyt8yr ba3den ---
  favoriteReciters: [],
  toggleFavoriteReciter: (reciterId) =>
    set((state) => ({
      favoriteReciters: state.favoriteReciters.includes(reciterId)
        ? state.favoriteReciters.filter((id) => id !== reciterId)
        : [...state.favoriteReciters, reciterId],
    })),

  currentVerseKey: null,
  setCurrentVerseKey: (key) => set({ currentVerseKey: key }),

  // --- Reading Progress ---
  readingProgress: {}, // { [surahId]: lastAyahRead }
  updateReadingProgress: (surahId, ayahNumber) =>
    set((state) => ({
      readingProgress: {
        ...state.readingProgress,
        [surahId]: ayahNumber,
      },
    })),
}));

export default useUIStore;
