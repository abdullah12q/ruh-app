import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteHalaqah,
  getUserHalaqahs,
  renameHalaqah,
  removeMember,
} from "@/lib/actions/halaqah";
import {
  getHalaqahData,
  getAyahReflections,
  markAyahRead,
  batchMarkAyahs,
  unmarkAyahRead,
  unmarkFullSurah,
  submitReflection,
} from "@/lib/actions/halaqahData";
import useHalaqahStore from "@/lib/store/useHalaqahStore";

// ── Query Keys Factory ──────────────────────────────────────────
// Centralized key factory for cache consistency
export const halaqahKeys = {
  all: ["halaqah"],
  // List of all circles the user belongs to
  list: () => [...halaqahKeys.all, "list"],
  // Full progress data for one circle (polled)
  data: (halaqahId) => [...halaqahKeys.all, "data", halaqahId],
  // Reflections for a specific Ayah in a circle
  reflections: (halaqahId, surahNumber, ayahNumber) => [
    ...halaqahKeys.all,
    "reflections",
    halaqahId,
    surahNumber,
    ayahNumber,
  ],
};

export function useUserHalaqahs() {
  return useQuery({
    queryKey: halaqahKeys.list(),
    queryFn: async () => {
      const result = await getUserHalaqahs();
      if (!result.success) throw new Error(result.error);
      return result.halaqahs;
    },
    retry: 2,
  });
}

/**
 * useHalaqahLiveData — Polls the shared progress map for a study circle.
 *
 * ── Why polling instead of WebSockets / SSE? ────────────────────────────────
 * Vercel's serverless functions are stateless — they cannot hold a persistent
 * WebSocket connection. Vercel's Edge Runtime can do SSE, but adds complexity.
 * For a study circle (not a live quiz), polling every 15 seconds is perfectly
 * adequate and keeps the architecture simple and cost-free.
 *
 * ── Polling strategy ─────────────────────────────────────────────────────────
 * - `refetchInterval: 15_000` — TanStack Query re-runs the queryFn every 15s
 *   as long as the component is mounted and the window is focused.
 * - `refetchIntervalInBackground: false` — Pauses polling when the tab is
 *   hidden (saves server resources when nobody is looking).
 * - `refetchOnWindowFocus: true` — Fires an immediate refetch when the user
 *   switches back to the tab, giving instant freshness on re-engage.
 * - On success, we sync the raw progress array into the Zustand store's
 *   progressMap so all child components can do O(1) lookups.
 *
 * @param {string|null} halaqahId — ObjectId string; null = disabled
 */
export function useHalaqahLiveData(halaqahId) {
  const { setProgressFromArray } = useHalaqahStore();

  const query = useQuery({
    queryKey: halaqahKeys.data(halaqahId),
    queryFn: async () => {
      const result = await getHalaqahData(halaqahId);
      if (!result.success) throw new Error(result.error);
      return result; // { halaqah, progress }
    },
    enabled: !!halaqahId,
    staleTime: 10 * 1000, // Consider data stale after 10s
    gcTime: 5 * 60 * 1000,
    refetchInterval: 15 * 1000, // Poll every 15 seconds
    refetchIntervalInBackground: false, // Pause when tab is hidden
    refetchOnWindowFocus: true, // Instant refresh on tab re-focus
    retry: 2,
  });

  // est5dmna useEffect msh onSuccess 3shan onSuccess et3mlha deprecated f TanStack Query v5
  useEffect(() => {
    if (query.data) {
      setProgressFromArray(query.data.progress);
    }
  }, [query.data, setProgressFromArray]);

  return query;
}

export function useAyahReflections(halaqahId, surahNumber, ayahNumber) {
  const isEnabled = !!halaqahId && surahNumber != null && ayahNumber != null;

  return useQuery({
    queryKey: halaqahKeys.reflections(halaqahId, surahNumber, ayahNumber),
    queryFn: async () => {
      const result = await getAyahReflections(
        halaqahId,
        surahNumber,
        ayahNumber,
      );
      if (!result.success) throw new Error(result.error);
      return result.reflections;
    },
    enabled: isEnabled,
    staleTime: 8 * 1000, // Reflections go stale ba3d 8s
    gcTime: 2 * 60 * 1000,
    refetchInterval: 10 * 1000, // Faster poll: 10s while modal is open
    refetchOnWindowFocus: true,
    retry: 1,
  });
}

export function useDeleteHalaqah() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (halaqahId) => deleteHalaqah(halaqahId),

    onSuccess: () => {
      // Invalidate the list so it disappears from the UI
      queryClient.invalidateQueries({
        queryKey: halaqahKeys.list(),
      });
    },

    onError: (error) => {
      console.error("[useDeleteHalaqah] mutation error:", error);
    },
  });
}

export function useRenameHalaqah(halaqahId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newName) => renameHalaqah(halaqahId, newName),

    onSuccess: (result) => {
      if (result?.success) {
        // Refresh both the list and the live detail data
        queryClient.invalidateQueries({ queryKey: halaqahKeys.list() });
        queryClient.invalidateQueries({
          queryKey: halaqahKeys.data(halaqahId),
        });
      }
    },

    onError: (error) => {
      console.error("[useRenameHalaqah] mutation error:", error);
    },
  });
}

export function useRemoveMember(halaqahId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (targetUserId) => removeMember(halaqahId, targetUserId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: halaqahKeys.data(halaqahId) });
      queryClient.invalidateQueries({ queryKey: halaqahKeys.list() });
    },

    onError: (error) => {
      console.error("[useRemoveMember] mutation error:", error);
    },
  });
}

export function useMarkAyahRead(halaqahId) {
  const queryClient = useQueryClient();

  const { optimisticallyMarkRead } = useHalaqahStore();

  return useMutation({
    mutationFn: ({ userId, surahNumber, ayahNumber }) =>
      markAyahRead(halaqahId, surahNumber, ayahNumber),

    // Instantly update the local UI
    onMutate: ({ userId, surahNumber, ayahNumber }) => {
      optimisticallyMarkRead(userId, surahNumber, ayahNumber);
    },

    // On server success, invalidate to pick up any concurrent changes
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: halaqahKeys.data(halaqahId),
      });
    },

    // No manual rollback — the next 15s poll corrects any inconsistency.
    onError: (error) => {
      console.error("[useMarkAyahRead] mutation error:", error);
    },
  });
}

export function useBatchMarkAyahs(halaqahId) {
  const queryClient = useQueryClient();
  const { optimisticallyBatchMarkRead } = useHalaqahStore();

  return useMutation({
    mutationFn: ({ surahNumber, ayahNumbers }) =>
      batchMarkAyahs(halaqahId, surahNumber, ayahNumbers),

    onMutate: ({ userId, surahNumber, ayahNumbers }) => {
      optimisticallyBatchMarkRead(userId, surahNumber, ayahNumbers);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: halaqahKeys.data(halaqahId) });
    },

    onError: (error) => {
      console.error("[useBatchMarkAyahs] mutation error:", error);
    },
  });
}

export function useUnmarkAyahRead(halaqahId) {
  const queryClient = useQueryClient();
  const { optimisticallyUnmarkRead } = useHalaqahStore();

  return useMutation({
    mutationFn: ({ surahNumber, ayahNumber }) =>
      unmarkAyahRead(halaqahId, surahNumber, ayahNumber),

    onMutate: ({ userId, surahNumber, ayahNumber }) => {
      optimisticallyUnmarkRead(userId, surahNumber, ayahNumber);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: halaqahKeys.data(halaqahId) });
    },

    onError: (error) => {
      console.error("[useUnmarkAyahRead] mutation error:", error);
    },
  });
}

export function useUnmarkFullSurah(halaqahId) {
  const queryClient = useQueryClient();
  const { optimisticallyBatchUnmark } = useHalaqahStore();

  return useMutation({
    mutationFn: ({ surahNumber, ayahNumbers }) =>
      unmarkFullSurah(halaqahId, surahNumber, ayahNumbers),

    onMutate: ({ userId, surahNumber, ayahNumbers }) => {
      optimisticallyBatchUnmark(userId, surahNumber, ayahNumbers);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: halaqahKeys.data(halaqahId) });
    },

    onError: (error) => {
      console.error("[useUnmarkFullSurah] mutation error:", error);
    },
  });
}

export function useSubmitReflection(halaqahId, surahNumber, ayahNumber) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ content }) =>
      submitReflection(halaqahId, surahNumber, ayahNumber, content),

    onSuccess: (result) => {
      if (result.success) {
        // Invalidate so the modal re-fetches and shows the new reflection
        queryClient.invalidateQueries({
          queryKey: halaqahKeys.reflections(halaqahId, surahNumber, ayahNumber),
        });
      }
    },

    onError: (error) => {
      console.error("[useSubmitReflection] mutation error:", error);
    },
  });
}
