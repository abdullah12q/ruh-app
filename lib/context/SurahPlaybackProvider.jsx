"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import useUIStore from "@/lib/store/useUIStore";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { formatAudioFileName } from "@/data/datas/audioData";
import { calculateNextVerse } from "@/data/datas/verseData";
import { fetchMushafPage, quranKeys } from "@/lib/queries/quran";
import { derivePageRange, buildVerseToPageMap } from "@/data/datas/mushafData";

const SurahPlaybackContext = createContext(null);

export function useSurahPlayback() {
  const ctx = useContext(SurahPlaybackContext);
  if (!ctx) {
    throw new Error(
      "useSurahPlayback must be used within a SurahPlaybackProvider",
    );
  }
  return ctx;
}

export default function SurahPlaybackProvider({
  surahId,
  verses,
  activeCurrentMushafPage,
  children,
}) {
  const {
    activeAyah,
    setActiveAyah,
    audioPlaying,
    setAudioPlaying,
    selectedReciter,
    mushafMode,
  } = useUIStore();

  const queryClient = useQueryClient();

  const activeAyahNum = activeAyah?.[surahId];

  // Single Global Audio Source
  const audioUrl = useMemo(() => {
    if (!surahId || !activeAyahNum || !selectedReciter?.path) return "";
    return `https://everyayah.com/data/${selectedReciter.path}/${formatAudioFileName(
      surahId,
      activeAyahNum,
    )}`;
  }, [surahId, activeAyahNum, selectedReciter]);

  const {
    currentTime,
    setCurrentTime,
    duration,
    audioRef,
    handleSeek,
    onTimeUpdate,
    onLoadedMetadata,
  } = useAudioPlayer({
    audioUrl,
    isPlaying: !!activeAyahNum && audioPlaying,
  });

  const { firstPage, lastPage } = useMemo(
    () => derivePageRange(verses),
    [verses],
  );
  const verseToPage = useMemo(() => buildVerseToPageMap(verses), [verses]);

  const [currentPage, setCurrentPageState] = useState(firstPage);
  const [direction, setDirection] = useState(0);

  const goToNextPage = useCallback(() => {
    setDirection(1);
    setCurrentPageState((p) => Math.min(lastPage, p + 1));
  }, [lastPage]);

  const goToPrevPage = useCallback(() => {
    setDirection(-1);
    setCurrentPageState((p) => Math.max(firstPage, p - 1));
  }, [firstPage]);

  const goToPage = useCallback((page) => {
    setCurrentPageState((p) => {
      setDirection(page > p ? 1 : -1);
      return page;
    });
  }, []);

  useEffect(() => {
    if (activeCurrentMushafPage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      goToPage(activeCurrentMushafPage);
    }
  }, [activeCurrentMushafPage, goToPage]);

  // Prefetch every Mushaf page up front so nav feels instant
  // Runs once the Surah page mounts, regardless of whether Mushaf Mode is
  // currently active, so by the time the user toggles into it the pages
  // are already warm in the React Query cache.
  useEffect(() => {
    if (!firstPage || !lastPage) return;

    let cancelled = false;
    const schedule =
      typeof window !== "undefined" && window.requestIdleCallback
        ? window.requestIdleCallback
        : (cb) => setTimeout(cb, 200);

    schedule(() => {
      if (cancelled) return;
      for (let page = firstPage; page <= lastPage; page++) {
        queryClient.prefetchQuery({
          queryKey: quranKeys.mushafPage(page),
          queryFn: () => fetchMushafPage(page),
          staleTime: 7 * 24 * 60 * 60 * 1000,
          gcTime: 30 * 24 * 60 * 60 * 1000,
        });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [firstPage, lastPage, queryClient]);

  // Playback Controls
  const playAyah = useCallback(
    (ayahNum) => {
      const pageNum = verseToPage.get(ayahNum) || currentPage;
      setActiveAyah(surahId, ayahNum, pageNum);
      setCurrentTime(0);
      setAudioPlaying(true);
    },
    [
      setActiveAyah,
      surahId,
      currentPage,
      setCurrentTime,
      setAudioPlaying,
      verseToPage,
    ],
  );

  const togglePlayPause = useCallback(() => {
    setAudioPlaying(!audioPlaying);
  }, [audioPlaying, setAudioPlaying]);

  const getFirstAyahOfPage = useCallback(
    (pageNum) =>
      verses.find((v) => v.page_number === pageNum)?.verse_number ?? null,
    [verses],
  );

  const handlePlayButtonPress = useCallback(() => {
    if (audioPlaying) {
      togglePlayPause();
      return;
    }

    const activePage = activeAyahNum ? verseToPage.get(activeAyahNum) : null;

    if (!activeAyahNum || activePage !== currentPage) {
      const firstAyah = getFirstAyahOfPage(currentPage);
      if (firstAyah) playAyah(firstAyah);
      return;
    }

    togglePlayPause();
  }, [
    audioPlaying,
    activeAyahNum,
    verseToPage,
    currentPage,
    getFirstAyahOfPage,
    playAyah,
    togglePlayPause,
  ]);

  // Auto-advance to the next verse when the current one finishes
  const handleNextVerse = useCallback(() => {
    if (!surahId || !activeAyahNum) return;
    setCurrentTime(0);

    const { surah: nextSurah, ayah: nextAyah } = calculateNextVerse(
      surahId,
      activeAyahNum,
      verses.length,
    );

    // Stop at the last ayah of the Surah rather than jumping to the next one.
    if (nextSurah > surahId) {
      setActiveAyah(surahId, activeAyahNum, currentPage);
      if (audioPlaying) setAudioPlaying(false);
      return;
    }

    // Auto scroll to next ayah
    const ayah = document.getElementById(`ayah-${nextAyah}`);
    if (ayah) {
      ayah.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    const nextPage = verseToPage.get(nextAyah);
    setActiveAyah(surahId, nextAyah, nextPage || currentPage);

    // Keep Mushaf Mode's visible page in sync when playback crosses a page boundary.
    if (mushafMode && nextPage && nextPage !== currentPage) {
      setDirection(1);
      setCurrentPageState(nextPage);
    }
  }, [
    surahId,
    activeAyahNum,
    verses,
    setActiveAyah,
    audioPlaying,
    setAudioPlaying,
    setCurrentTime,
    verseToPage,
    mushafMode,
    currentPage,
  ]);

  const handleFromNormalModeToMushafMode = useCallback(() => {
    if (!activeAyahNum) return;
    const pageNum = verseToPage.get(activeAyahNum) || currentPage;
    goToPage(pageNum);
    setCurrentPageState(pageNum);
  }, [activeAyahNum, verseToPage, currentPage, goToPage]);

  const handleFromMushafModeToNormalMode = useCallback(() => {
    // We use setTimeout to wait for React to unmount the MushafView and mount the AyahList
    setTimeout(() => {
      const ayah = document.getElementById(`ayah-${activeAyahNum}`);
      if (ayah) {
        ayah.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 300);
  }, [activeAyahNum]);

  // Prefetch the *audio file* for the next verse
  useEffect(() => {
    if (!activeAyahNum || !surahId || !selectedReciter?.path) return;

    const { surah: nextSurah, ayah: nextAyah } = calculateNextVerse(
      surahId,
      activeAyahNum,
      verses.length,
    );
    if (nextSurah > surahId) return;

    const preloader = new Audio(
      `https://everyayah.com/data/${selectedReciter.path}/${formatAudioFileName(
        nextSurah,
        nextAyah,
      )}`,
    );
    preloader.preload = "auto";
  }, [activeAyahNum, surahId, selectedReciter, verses]);

  const value = useMemo(
    () => ({
      surahId,
      activeAyahNum,
      audioPlaying,
      currentTime,
      duration,
      handleSeek,
      playAyah,
      togglePlayPause,
      handlePlayButtonPress,
      handleFromNormalModeToMushafMode,
      handleFromMushafModeToNormalMode,
      currentPage,
      firstPage,
      lastPage,
      direction,
      goToNextPage,
      goToPrevPage,
      goToPage,
    }),
    [
      surahId,
      activeAyahNum,
      audioPlaying,
      currentTime,
      duration,
      handleSeek,
      playAyah,
      togglePlayPause,
      handlePlayButtonPress,
      handleFromNormalModeToMushafMode,
      handleFromMushafModeToNormalMode,
      currentPage,
      firstPage,
      lastPage,
      direction,
      goToNextPage,
      goToPrevPage,
      goToPage,
    ],
  );

  return (
    <SurahPlaybackContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        src={audioUrl || undefined}
        autoPlay={audioPlaying}
        onEnded={handleNextVerse}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
      />
    </SurahPlaybackContext.Provider>
  );
}
