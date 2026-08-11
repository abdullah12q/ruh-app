import { create } from "zustand";

/**
 * Halaqah (Study Circle) Store — Rُuh Platform
 *
 * leh 3mlna el progressMap hena fel store?
 * Building the map once in the store (on data load) means components
 * can do a single O(1) lookup instead of scanning the array on every render.
 */
const useHalaqahStore = create((set, get) => ({
  /**
   * progressMap: Map<"surahNumber:ayahNumber", string[]>
   *
   * Key:   composite string e.g. "2:255"
   * Value: array of userId strings who have marked this Ayah as read
   *
   * Example:
   *   "1:1" → ["userId_A", "userId_B"]   ← both members read Al-Fatiha:1
   *   "2:1" → ["userId_A"]               ← only member A read Al-Baqarah:1
   */
  progressMap: new Map(),

  /**
   * setProgressFromArray — Takes the raw flat array from the server and
   * builds the O(1)-lookup Map. Called whenever TanStack Query returns
   * fresh data (on poll or initial load).
   *
   * @param {Array<{ userId, surahNumber, ayahNumber }>} progressArray
   */
  setProgressFromArray: (progressArray) => {
    const map = new Map();
    for (const entry of progressArray) {
      const key = `${entry.surahNumber}:${entry.ayahNumber}`;
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key).push(entry.userId);
    }
    set({ progressMap: map });
  },

  /**
   * optimisticallyMarkRead — Immediately updates the local progressMap
   * before the server confirms. This makes the UI feel instant.
   * If the server action fails, the next poll will correct it.
   *
   * @param {string} userId
   * @param {number} surahNumber
   * @param {number} ayahNumber
   */
  optimisticallyMarkRead: (userId, surahNumber, ayahNumber) => {
    const { progressMap } = get();
    const key = `${surahNumber}:${ayahNumber}`;
    const existing = progressMap.get(key) ?? [];

    // Prevent duplicates in the optimistic update
    if (existing.includes(userId)) return;

    const newMap = new Map(progressMap);
    newMap.set(key, [...existing, userId]);
    set({ progressMap: newMap });
  },

  /**
   * optimisticallyBatchMarkRead — Optimistically marks an array of ayahs
   * in a single Map rebuild pass (far cheaper than N individual set calls).
   *
   * Used by "Mark Full Surah" and "Range Mark" buttons.
   *
   * @param {string} userId
   * @param {number} surahNumber
   * @param {number[]} ayahNumbers
   */
  optimisticallyBatchMarkRead: (userId, surahNumber, ayahNumbers) => {
    const { progressMap } = get();
    const newMap = new Map(progressMap);

    for (const ayahNumber of ayahNumbers) {
      const key = `${surahNumber}:${ayahNumber}`;
      const existing = newMap.get(key) ?? [];
      if (!existing.includes(userId)) {
        newMap.set(key, [...existing, userId]);
      }
    }

    set({ progressMap: newMap });
  },

  /**
   * optimisticallyUnmarkRead — Removes a single userId from the readers
   * array for one ayah. Mirrors the server-side deleteOne.
   *
   * @param {string} userId
   * @param {number} surahNumber
   * @param {number} ayahNumber
   */
  optimisticallyUnmarkRead: (userId, surahNumber, ayahNumber) => {
    const { progressMap } = get();
    const key = `${surahNumber}:${ayahNumber}`;
    const existing = progressMap.get(key) ?? [];
    const filtered = existing.filter((uid) => uid !== userId);

    const newMap = new Map(progressMap);
    if (filtered.length === 0) {
      newMap.delete(key); // Clean up empty entries
    } else {
      newMap.set(key, filtered);
    }

    set({ progressMap: newMap });
  },

  /**
   * optimisticallyBatchUnmark — Removes a userId from all ayahs in the
   * provided array. Used for "Unmark Full Surah".
   *
   * @param {string} userId
   * @param {number} surahNumber
   * @param {number[]} ayahNumbers
   */
  optimisticallyBatchUnmark: (userId, surahNumber, ayahNumbers) => {
    const { progressMap } = get();
    const newMap = new Map(progressMap);

    for (const ayahNumber of ayahNumbers) {
      const key = `${surahNumber}:${ayahNumber}`;
      const existing = newMap.get(key) ?? [];
      const filtered = existing.filter((uid) => uid !== userId);
      if (filtered.length === 0) {
        newMap.delete(key);
      } else {
        newMap.set(key, filtered);
      }
    }

    set({ progressMap: newMap });
  },

  // Reflection Modal
  selectedAyah: null, // { surahNumber: number, ayahNumber: number } | null
  isModalOpen: false,

  openReflectionModal: (surahNumber, ayahNumber) =>
    set({
      selectedAyah: { surahNumber, ayahNumber },
      isModalOpen: true,
    }),

  closeReflectionModal: () =>
    set({
      isModalOpen: false,
      // Keep selectedAyah briefly to avoid layout flash during close animation
    }),

  clearSelectedAyah: () => set({ selectedAyah: null }),
}));

export default useHalaqahStore;
