import { useState, useEffect, useRef, useCallback } from "react";
import useUIStore from "@/lib/store/useUIStore";

// useAudioPlayer — Double-Buffer Gapless Playback
// Maintains two HTMLAudioElement instances (activeRef + standbyRef).
// While the active element plays ayah N, the standby silently preloads
// ayah N+1. On `ended`, the buffers are pointer-swapped and .play() is
// called immediately on the ready-to-go standby — no src change, no load,
// no network wait, no audible gap.
export function useAudioPlayer({
  audioUrl,
  nextAudioUrl = "",
  isPlaying,
  onTrackEnded,
}) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const activeRef = useRef(null); // currently playing
  const standbyRef = useRef(null); // silently preloaded next
  const freedRef = useRef(null); // finishing its overlap (crossfade)

  const rafRef = useRef(null);

  // Tracks the last URL explicitly loaded into the active buffer so we
  // can skip calling .load() on a simple resume (isPlaying: false → true).
  const lastActiveUrlRef = useRef(null);

  // When an auto-advance swap happens the provider's state update will
  // change `audioUrl`. This flag tells the play/load effect to skip the
  // hard reset because the swap already took care of it.
  const isAutoAdvancingRef = useRef(false);

  // Flag to prevent multiple early triggers for the same track
  const hasTriggeredNextRef = useRef(false);
  const OVERLAP_THRESHOLD = 0.13; // seconds of overlap for gapless transition

  // Last `currentTime` value committed to state — used by the RAF throttle
  // to skip updates smaller than 10 ms and avoid unnecessary re-renders.
  const lastCommittedTimeRef = useRef(0);

  const { volume, setVolume } = useUIStore();

  // Stable refs for imperative handler closure─
  // The `ended` handler is created once inside a mount-effect so it cannot
  // close over changing prop values. These refs keep it current.
  const onTrackEndedRef = useRef(onTrackEnded);
  useEffect(() => {
    onTrackEndedRef.current = onTrackEnded;
  }, [onTrackEnded]);

  const volumeRef = useRef(volume);
  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  // Fully unloads an element: revokes any blob URL it holds, clears its src,
  // and tells the browser to drop the buffered media. Used on unmount, on the
  // freed buffer after a swap, and whenever nextAudioUrl clears.
  const resetElement = useCallback((el) => {
    if (!el) return;
    el.pause();
    if (el.src && el.src.startsWith("blob:")) URL.revokeObjectURL(el.src);
    el.removeAttribute("src");
    el.load();
  }, []);

  // Extracted swap logic so it can be called early via tick or via fallback ended event
  const triggerNext = useCallback(() => {
    if (!activeRef.current || !standbyRef.current || !freedRef.current) return;

    const standby = standbyRef.current;

    // If standby has no src (last ayah or not yet loaded), delegate to provider.
    if (!standby.getAttribute("src")) {
      activeRef.current.currentTime = 0;
      setCurrentTime(0);
      lastCommittedTimeRef.current = 0;
      onTrackEndedRef.current?.();
      return;
    }

    // Pointer swap (3 buffers)
    const oldActive = activeRef.current;
    activeRef.current = standby;
    standbyRef.current = freedRef.current; // The old freed becomes the new standby
    freedRef.current = oldActive; // The old active goes to freed, allowed to finish overlap!

    const newActive = activeRef.current;

    // Update UI immediately.
    setCurrentTime(0);
    lastCommittedTimeRef.current = 0;
    setDuration(isNaN(newActive.duration) ? 0 : newActive.duration);

    // Readiness guard
    function doPlay() {
      newActive.volume = volumeRef.current;
      newActive.play().catch((err) => console.log("Gapless play error:", err));
    }

    if (newActive.readyState >= 3) {
      doPlay();
    } else {
      newActive.addEventListener("canplay", doPlay, { once: true });
    }

    isAutoAdvancingRef.current = true;
    hasTriggeredNextRef.current = false; // Reset for the new active track!
    onTrackEndedRef.current?.();
  }, []);

  // Starts (or restarts) the RAF loop that mirrors activeRef's currentTime into
  // state, throttled to >=50ms deltas so we don't re-render every frame. Shared
  // by both the auto-advance path and the manual play/resume path.
  const startTicking = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const tick = () => {
      if (activeRef.current) {
        const t = activeRef.current.currentTime;
        const d = activeRef.current.duration;

        // UI State update
        if (Math.abs(t - lastCommittedTimeRef.current) >= 0.05) {
          lastCommittedTimeRef.current = t;
          setCurrentTime(t);
        }

        // Early overlap trigger
        if (!hasTriggeredNextRef.current && d > 0) {
          // If track is long enough, trigger early overlap. Otherwise, fallback to 'ended'.
          const threshold = d > 1.0 ? OVERLAP_THRESHOLD : 0;
          if (t >= d - threshold) {
            hasTriggeredNextRef.current = true;
            triggerNext();
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [triggerNext]);

  const stopTicking = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  // Create Audio elements once on mount
  useEffect(() => {
    const a = new Audio();
    const b = new Audio();
    const c = new Audio();
    a.preload = "auto";
    b.preload = "auto";
    c.preload = "auto";
    activeRef.current = a;
    standbyRef.current = b;
    freedRef.current = c;

    const onMetadata = (e) => {
      if (e.target === activeRef.current) {
        setDuration(isNaN(e.target.duration) ? 0 : e.target.duration);
        e.target.volume = volumeRef.current;
      }
    };

    const onEnded = (e) => {
      if (e.target === activeRef.current) {
        // Natural end of the active track (e.g. if track was too short to trigger early overlap)
        if (!hasTriggeredNextRef.current) {
          hasTriggeredNextRef.current = true;
          triggerNext();
        }
      } else if (e.target === freedRef.current) {
        // The old track finished its overlap playback. Clean it up.
        resetElement(freedRef.current);
      }
    };

    a.addEventListener("loadedmetadata", onMetadata);
    b.addEventListener("loadedmetadata", onMetadata);
    c.addEventListener("loadedmetadata", onMetadata);
    a.addEventListener("ended", onEnded);
    b.addEventListener("ended", onEnded);
    c.addEventListener("ended", onEnded);

    return () => {
      resetElement(a);
      resetElement(b);
      resetElement(c);
      a.removeEventListener("loadedmetadata", onMetadata);
      b.removeEventListener("loadedmetadata", onMetadata);
      c.removeEventListener("loadedmetadata", onMetadata);
      a.removeEventListener("ended", onEnded);
      b.removeEventListener("ended", onEnded);
      c.removeEventListener("ended", onEnded);
      stopTicking();
    };
  }, [resetElement, stopTicking, triggerNext]);

  // Volume sync (all buffers)
  useEffect(() => {
    if (activeRef.current) activeRef.current.volume = volume;
    if (standbyRef.current) standbyRef.current.volume = volume;
    if (freedRef.current) freedRef.current.volume = volume;
  }, [volume]);

  // Play / Pause + handle manual URL changes
  useEffect(() => {
    const active = activeRef.current;
    if (!active) return;

    if (!isPlaying) {
      active.pause();
      stopTicking();
      // Always clear the flag on pause so a manual resume doesn't misfire.
      isAutoAdvancingRef.current = false;
      return;
    }

    // Auto-advance path
    // The swap + .play() was already called inside `onEnded`. Just restart the
    // RAF loop (cleanup from the previous effect run cancelled it) and update
    // `lastActiveUrlRef` so the next manual URL check is accurate.
    if (isAutoAdvancingRef.current) {
      isAutoAdvancingRef.current = false;
      lastActiveUrlRef.current = audioUrl;
      startTicking();
      return stopTicking;
    }

    // Manual URL change or initial play
    // Only call .load() if the URL actually changed; this lets a simple
    // pause → resume avoid resetting the playback position.
    if (lastActiveUrlRef.current !== audioUrl) {
      if (active.src && active.src.startsWith("blob:")) {
        URL.revokeObjectURL(active.src);
      }
      active.src = audioUrl || "";
      active.load();
      lastActiveUrlRef.current = audioUrl;
      setCurrentTime(0);
      setDuration(0);
      hasTriggeredNextRef.current = false; // Reset for new manual track load
    }

    active.play().catch((err) => console.log("Audio play error:", err));
    startTicking();

    return stopTicking;
  }, [isPlaying, audioUrl, startTicking, stopTicking]);

  // Preload next track into standby buffer via Blob
  // Fetches the audio file completely into RAM as a Blob. This bypasses Chrome's
  // media pipeline queue (which causes ERR_CACHE_OPERATION_NOT_SUPPORTED on
  // rapid sequential requests) and guarantees zero network latency on swap.
  useEffect(() => {
    const standby = standbyRef.current;
    if (!standby) return;

    if (!nextAudioUrl) {
      resetElement(standby);
      return;
    }

    const abortController = new AbortController();
    let currentObjectUrl = null;

    let isCancelled = false;

    fetch(nextAudioUrl, { signal: abortController.signal })
      .then((res) => res.blob())
      .then((blob) => {
        if (abortController.signal.aborted) return;

        currentObjectUrl = URL.createObjectURL(blob);

        if (standby.src && standby.src.startsWith("blob:")) {
          URL.revokeObjectURL(standby.src);
        }
        standby.src = currentObjectUrl;
        standby.preload = "auto";
        standby.load();
      })
      .catch((err) => {
        if (err.name === "AbortError") return; // Ignore aborted requests
        console.log(
          "Blob prefetch failed (likely CORS), falling back to normal src:",
          err,
        );
        standby.src = nextAudioUrl;
        standby.preload = "auto";
        standby.load();
      });

    return () => {
      abortController.abort(); // Cancels the network request
      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl); // Cleans up the specific blob
      }
    };
  }, [nextAudioUrl, resetElement]);

  const handleSeek = useCallback((newTime) => {
    if (activeRef.current) {
      activeRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, []);

  const handleVolumeChange = useCallback(
    (newVolume) => {
      if (activeRef.current) activeRef.current.volume = newVolume;
      if (standbyRef.current) standbyRef.current.volume = newVolume;
      if (freedRef.current) freedRef.current.volume = newVolume;
      setVolume(newVolume);
    },
    [setVolume],
  );

  return {
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    volume,
    handleSeek,
    handleVolumeChange,
  };
}
