import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import useUIStore from "@/lib/store/useUIStore";
import useAzkarStore from "@/lib/store/useAzkarStore";

export default function SyncManager() {
  const { status } = useSession();
  const [isInitialSyncDone, setIsInitialSyncDone] = useState(false);
  const syncTimeout = useRef(null);

  // Initial Fetch on Mount/Login
  useEffect(() => {
    if (status === "authenticated" && !isInitialSyncDone) {
      async function fetchPreferences() {
        try {
          const res = await fetch("/api/user/preferences");
          if (!res.ok) throw new Error("Failed to fetch preferences");

          const { data } = await res.json();
          if (data) {
            useUIStore.getState().hydrateFromServer(data);
            useAzkarStore.getState().hydrateFromServer(data.azkarProgress);
          }
          setIsInitialSyncDone(true);
        } catch (error) {
          console.error("SyncManager initial fetch error:", error);
        }
      }

      fetchPreferences();
    }
  }, [isInitialSyncDone, status]);

  // Debounced Save on State Change
  useEffect(() => {
    if (status !== "authenticated" || !isInitialSyncDone) return;

    async function syncToDatabase() {
      const uiState = useUIStore.getState();
      const azkarState = useAzkarStore.getState();

      const payload = {
        uiState: {
          fontSize: uiState.fontSize,
          translationLanguage: uiState.translationLang,
          mushafMode: uiState.mushafMode,
          autoScrollToNextAyah: uiState.autoScrollToNextAyah,
        },
        audioState: {
          selectedReciter: uiState.selectedReciter?.id,
          favoriteReciters: uiState.favoriteReciters,
        },
        prayerConfig: {
          prayerCalcMethod: uiState.prayerCalcMethod,
          dstAdjustment: uiState.dstAdjustment,
          prayerNotificationMode: uiState.prayerNotificationMode,
          prayerNotificationOffsets: uiState.prayerNotificationOffsets,
        },
        readingProgress:
          uiState.recentReads?.map((read) => ({
            surahId: read.surahId,
            ayahNumber: read.ayahNumber,
            reciter: read.reciter,
            mushafMode: read.mushafMode,
            currentPage: read.currentPage,
          })) ?? null,
        bookmarkedAyahs: uiState.bookmarkedAyahs?.map(
          (b) => `${b.surahNum}:${b.ayahNum}`,
        ),
        azkarProgress: azkarState.progress,
      };

      try {
        await fetch("/api/user/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (error) {
        console.error("SyncManager sync error:", error);
      }
    }

    function handleStoreChange() {
      if (syncTimeout.current) clearTimeout(syncTimeout.current);

      // Debounce API calls by 3 seconds
      syncTimeout.current = setTimeout(() => {
        syncToDatabase();
      }, 3000);
    }

    // Subscribe to stores
    const unsubUI = useUIStore.subscribe(handleStoreChange);
    const unsubAzkar = useAzkarStore.subscribe(handleStoreChange);

    return () => {
      unsubUI();
      unsubAzkar();
      if (syncTimeout.current) clearTimeout(syncTimeout.current);
    };
  }, [isInitialSyncDone, status]);

  return null;
}
