import { create } from "zustand";
import { persist } from "zustand/middleware";
import imamList from "@/data/jsons/imam.json";

// Default reciter: Yasser Ad-Dussary (id 42)
const DEFAULT_RECITER_ID = 42;

// Default prayer calc method: Egyptian General Authority (id 5)
const DEFAULT_PRAYER_METHOD_ID = 5;

/**
 * Global UI State Store — Rُuh Platform
 *
 * Manages:
 * - Font Size (persisted)
 * - Active Ayah (for audio-text synchronization) (persisted)
 * - Reading Progress (persisted)
 * - Audio playback state (persisted)
 * - Global Audio Player { audioUrl, surah, reciter, moshaf }
 * - Global Volume (shared across all audio players) (persisted)
 * - Translation language ('en' | 'ar' | 'hide') (persisted)
 * - Selected Reciter & Favorite Reciters (persisted)
 * - Bookmarked Ayahs (persisted)
 * - Prayer Times Calculation Method (persisted)
 * - Daylight Saving Time (DST) Adjustment (-1, 0, +1) (persisted)
 * - Geolocation Coordinates { lat, lon } (persisted)
 * - Reverse-Geocoded Location { en, ar } (persisted)
 * - Global Radio Volume (shared across all radio stations) (persisted)
 * - Global Live TV Volume (shared across all live TV channels) (persisted)
 * - Mushaf Mode (page-by-page Madani layout) (persisted)
 * - Auto Scroll to Next Ayah (persisted)
 * - Prayer Notification Mode (persisted)
 * - Prayer Notification Volume (persisted)
 * - Prayer Notification Offsets (persisted)
 */
const useUIStore = create(
  persist(
    (set) => ({
      // --- Font Size ---
      fontSize: "text-2xl",
      setFontSize: (value) => set({ fontSize: value }),

      // --- Audio-Text Sync & History Tracking ---
      activeAyah: {}, // Stores active ayah per surah: { [surahNum]: ayahNum }
      // --- Reading Progress ---
      lastRead: null, // { surahId: 18, ayahNumber: 10 }
      recentReads: [], // Array to store the last 3 Surahs: [{ surahId, ayahNumber, reciter, mushafMode, currentPage }]
      setActiveAyah: (surahNum, ayahNum, currentPage) =>
        set((state) => {
          // Filter out the current Surah if it's already in the history so we can move it to the top
          const filteredReads = (state.recentReads || []).filter(
            (r) => r.surahId !== surahNum,
          );

          // Create the new history entry, capturing the currently selected reciter
          const newRead = {
            surahId: surahNum,
            ayahNumber: ayahNum,
            reciter: state.selectedReciter,
            mushafMode: state.mushafMode,
            currentPage,
          };

          // Put it at the front and keep only the latest 3
          const updatedRecentReads = [newRead, ...filteredReads].slice(0, 3);

          return {
            activeAyah: {
              ...(state.activeAyah || {}),
              [surahNum]: ayahNum,
            },
            recentReads: updatedRecentReads,
            lastRead: { surahId: surahNum, ayahNumber: ayahNum, currentPage },
          };
        }),

      // --- Audio Player ---
      audioPlaying: false,
      setAudioPlaying: (comingState) => set({ audioPlaying: comingState }),

      // --- Global Audio Player ---
      globalPlayer: null, // { audioUrl, surah, reciter, moshaf }
      setGlobalPlayer: (track) => set({ globalPlayer: track }),
      clearGlobalPlayer: () => set({ globalPlayer: null }),

      // --- Global Volume (0–1, shared across all audio players) ---
      volume: 0.05,
      setVolume: (value) => set({ volume: value }),

      // --- Translation Language ---
      translationLang: "ar", // 'en' | 'ar' | 'hide'
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

      // --- Prayer Times Calculation Method ---
      // Aladhan API method IDs. Default: 5 = Egyptian General Authority
      prayerCalcMethod: DEFAULT_PRAYER_METHOD_ID,
      setPrayerCalcMethod: (method) => set({ prayerCalcMethod: method }),

      // --- DST Adjustment (-1, 0, +1) ---
      dstAdjustment: 0,
      setDstAdjustment: (val) => set({ dstAdjustment: val }),

      // --- Saved Geolocation ---
      savedCoords: null, // { lat: number, lon: number } | null
      setSavedCoords: (coords) => set({ savedCoords: coords }),

      savedLocation: null, // { en: { city, state, country }, ar: { city, state, country } } | null
      setSavedLocation: (location) => set({ savedLocation: location }),

      // --- Global Radio Volume (0-1, shared across all radio stations) ---
      radioVolume: 0.1,
      setRadioVolume: (volume) => set({ radioVolume: volume }),

      // --- Global Live TV Volume (0-1, shared across all live TV channels) ---
      liveTvVolume: 0.1,
      setLiveTvVolume: (volume) => set({ liveTvVolume: volume }),

      // --- Mushaf Mode (page-by-page Madani layout) ---
      mushafMode: false,
      toggleMushafMode: (mode = undefined) =>
        set((s) => ({ mushafMode: mode ?? !s.mushafMode })),

      // --- Auto Scroll (Normal Mode) ---
      autoScrollToNextAyah: true,
      toggleAutoScrollToNextAyah: (value = undefined) =>
        set((s) => ({
          autoScrollToNextAyah: value ?? !s.autoScrollToNextAyah,
        })),

      // --- Prayer Notification Mode ---
      // 'enabled' → full notification + adhan audio (default)
      // 'muted'   → browser popup only, audio silenced
      // 'disabled' → nothing fires at all
      prayerNotificationMode: "enabled",
      setPrayerNotificationMode: (mode) =>
        set({ prayerNotificationMode: mode }),

      // --- Prayer Notification Volume ---
      prayerNotificationVolume: 0.5,
      setPrayerNotificationVolume: (volume) =>
        set({ prayerNotificationVolume: volume }),

      // --- Prayer Notification Offsets ---
      prayerNotificationOffsets: [5, 0], // [5, 0] = 5 min before and at time, [0] = at time, [5] = 5 min before
      setPrayerNotificationOffsets: (offsets) =>
        set({ prayerNotificationOffsets: offsets }),
    }),
    {
      name: "ruh-ui-store", // dah esmha fel local storage
      version: 5, // change this number when new persisted fields are added
      migrate: (persistedState, version) => {
        if (version === 0 || !version) {
          // v0 → v1: add recentReads
          return {
            ...persistedState,
            recentReads: [],
          };
        }
        if (version === 1) {
          // v1 → v2: add savedCoords & savedLocation (null = not yet fetched)
          return {
            ...persistedState,
            savedCoords: null,
            savedLocation: null,
          };
        }
        if (version === 2) {
          // v2 → v3: add autoScrollToNextAyah
          return {
            ...persistedState,
            autoScrollToNextAyah: true,
          };
        }
        if (version === 3) {
          // v3 → v4: add prayerNotificationMode
          return {
            ...persistedState,
            prayerNotificationMode: "enabled",
          };
        }
        if (version === 4) {
          // v4 → v5: add prayerNotificationVolume, prayerNotificationOffsets
          return {
            ...persistedState,
            prayerNotificationVolume: 0.5,
            prayerNotificationOffsets: [5, 0],
          };
        }
        return persistedState;
      },
      // partialize deh m3naha my5odsh kol ely states w 5od ely ana h2olak 3leh bs
      partialize: (state) => ({
        fontSize: state.fontSize,
        activeAyah: state.activeAyah,
        lastRead: state.lastRead,
        recentReads: state.recentReads,
        volume: state.volume,
        translationLang: state.translationLang,
        selectedReciter: state.selectedReciter,
        favoriteReciters: state.favoriteReciters,
        bookmarkedAyahs: state.bookmarkedAyahs,
        prayerCalcMethod: state.prayerCalcMethod,
        dstAdjustment: state.dstAdjustment,
        savedCoords: state.savedCoords,
        savedLocation: state.savedLocation,
        radioVolume: state.radioVolume,
        liveTvVolume: state.liveTvVolume,
        mushafMode: state.mushafMode,
        autoScrollToNextAyah: state.autoScrollToNextAyah,
        prayerNotificationMode: state.prayerNotificationMode,
        prayerNotificationVolume: state.prayerNotificationVolume,
        prayerNotificationOffsets: state.prayerNotificationOffsets,
      }),
    },
  ),
);

export default useUIStore;
