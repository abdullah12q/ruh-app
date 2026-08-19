import { create } from "zustand";
import { persist } from "zustand/middleware";
import azkarData from "@/data/jsons/azkar.json";

/**
 * Build a stable key for each thikr entry.
 * Format: "categoryId::index"
 *
 * @param {number|string} categoryId
 * @param {number} index
 */
export function buildKey(categoryId, index) {
  return `${categoryId}::${index}`;
}

/**
 * Initialise the `progress` map from azkar.json.
 * categoryId is the 0-based index of the category in Object.entries(azkarData).
 * Returns: Record<string, { remaining: number, total: number }>
 */
function buildInitialProgress() {
  const progress = {};
  Object.values(azkarData).forEach((items, categoryId) => {
    items.forEach((item, index) => {
      const total = item.repeat ?? 1;
      progress[buildKey(categoryId, index)] = { remaining: total, total };
    });
  });
  return progress;
}

/**
 * Azkar Store — Rُuh Platform
 *
 * Manages:
 * - Active category tab
 * - Per-thikr count progress (remaining / total)
 * - Decrement, reset-single, reset-category, reset-all actions
 *
 * Persisted to localStorage under "ruh-azkar-store".
 */
const useAzkarStore = create(
  persist(
    (set, get) => ({
      // The category currently displayed — { id: number, title: string }
      activeCategory: null,
      setActiveCategory: (cat) => set({ activeCategory: cat }),

      // progress is initialised once and then updated via actions.
      // Shape: Record<"categoryId::index", { remaining, total }>
      progress: buildInitialProgress(),

      decrementThikr: (key) =>
        set((state) => {
          const entry = state.progress[key];
          if (!entry || entry.remaining === 0) return state;
          return {
            progress: {
              ...state.progress,
              [key]: { ...entry, remaining: entry.remaining - 1 },
            },
          };
        }),

      resetThikr: (key) =>
        set((state) => {
          const entry = state.progress[key];
          if (!entry) return state;
          return {
            progress: {
              ...state.progress,
              [key]: { ...entry, remaining: entry.total },
            },
          };
        }),

      resetCategory: (categoryId) =>
        set((state) => {
          const items = Object.values(azkarData)[categoryId] ?? [];
          const updates = {};
          items.forEach((_, index) => {
            const key = buildKey(categoryId, index);
            const entry = state.progress[key];
            if (entry) updates[key] = { ...entry, remaining: entry.total };
          });
          return { progress: { ...state.progress, ...updates } };
        }),

      resetAll: () => set({ progress: buildInitialProgress() }),

      getCategoryItems: (categoryId) => {
        const state = get();
        const items = Object.values(azkarData)[categoryId] ?? [];
        return items.map((item, index) => ({
          ...item,
          key: buildKey(categoryId, index),
          ...(state.progress[buildKey(categoryId, index)] ?? {
            remaining: item.repeat ?? 1,
            total: item.repeat ?? 1,
          }),
        }));
      },

      getCategoryProgress: (categoryId) => {
        const state = get();
        const items = Object.values(azkarData)[categoryId] ?? [];
        const total = items.length;
        const done = items.filter((_, index) => {
          const entry = state.progress[buildKey(categoryId, index)];
          return entry && entry.remaining === 0;
        }).length;
        return { done, total };
      },
    }),
    {
      name: "ruh-azkar-store",
      version: 3,
      partialize: (state) => ({
        activeCategory: state.activeCategory,
        progress: state.progress,
      }),
      // Merge fresh defaults with persisted progress to handle new entries
      merge: (persistedState, currentState) => {
        const freshProgress = buildInitialProgress();
        return {
          ...currentState,
          ...persistedState,
          progress: {
            ...freshProgress,
            ...(persistedState?.progress ?? {}),
          },
        };
      },
    },
  ),
);

export default useAzkarStore;
