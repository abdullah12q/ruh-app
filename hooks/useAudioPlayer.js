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

  const rafRef = useRef(null);

  // Tracks the last URL explicitly loaded into the active buffer so we
  // can skip calling .load() on a simple resume (isPlaying: false → true).
  const lastActiveUrlRef = useRef(null);

  // When an auto-advance swap happens the provider's state update will
  // change `audioUrl`. This flag tells the play/load effect to skip the
  // hard reset because the swap already took care of it.
  const isAutoAdvancingRef = useRef(false);

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

  // Starts (or restarts) the RAF loop that mirrors activeRef's currentTime into
  // state, throttled to ≥10ms deltas so we don't re-render every frame. Shared
  // by both the auto-advance path and the manual play/resume path.
  const startTicking = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const tick = () => {
      if (activeRef.current) {
        const t = activeRef.current.currentTime;
        if (Math.abs(t - lastCommittedTimeRef.current) >= 0.01) {
          lastCommittedTimeRef.current = t;
          setCurrentTime(t);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const stopTicking = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  // Create both Audio elements once on mount
  useEffect(() => {
    const a = new Audio();
    const b = new Audio();
    a.preload = "auto";
    b.preload = "auto";
    activeRef.current = a;
    standbyRef.current = b;

    // loadedmetadata: push duration to UI for the currently active buffer.
    // The standby buffer's duration doesn't need tracking here — once it
    // becomes active on swap, its own `.duration` property is already
    // populated natively, so we just read it directly at that point.
    const onMetadata = (e) => {
      if (e.target === activeRef.current) {
        setDuration(isNaN(e.target.duration) ? 0 : e.target.duration);
        e.target.volume = volumeRef.current;
      }
    };

    // ended: gapless swap
    const onEnded = () => {
      if (!activeRef.current || !standbyRef.current) return;

      const standby = standbyRef.current;

      // If standby has no src (last ayah or not yet loaded), delegate to provider.
      // Do NOT set isAutoAdvancingRef here — the provider will call setAudioPlaying(false)
      // which short-circuits the play/load effect cleanly on its own.
      if (!standby.getAttribute("src")) {
        activeRef.current.currentTime = 0;
        setCurrentTime(0);
        lastCommittedTimeRef.current = 0;
        onTrackEndedRef.current?.();
        return;
      }

      // Pointer swap
      const freed = activeRef.current;
      activeRef.current = standby;
      standbyRef.current = freed;

      const newActive = activeRef.current;

      // Update UI immediately. Duration is read straight off the element —
      // swapping refs doesn't touch the elements themselves, so its
      // loadedmetadata-populated `.duration` is already correct.
      setCurrentTime(0);
      lastCommittedTimeRef.current = 0;
      setDuration(isNaN(newActive.duration) ? 0 : newActive.duration);

      // Readiness guard
      // `readyState >= 3` (HAVE_FUTURE_DATA) means the browser has buffered
      // enough decoded audio to start playing without a stall. If we're not
      // there yet, wait for `canplay` before calling .play() to eliminate any
      // residual gap caused by the browser still decoding compressed frames.
      function doPlay() {
        newActive.volume = volumeRef.current;
        newActive
          .play()
          .catch((err) => console.log("Gapless play error:", err));
      }

      if (newActive.readyState >= 3) {
        doPlay();
      } else {
        newActive.addEventListener("canplay", doPlay, { once: true });
      }

      // Clear the freed buffer — the nextAudioUrl effect will reload it
      // with the new next-next URL after the provider state update.
      resetElement(standbyRef.current);

      // Signal the play/load effect to skip a hard reset on the upcoming
      // `audioUrl` prop change (caused by the provider advancing its state).
      isAutoAdvancingRef.current = true;

      // Notify provider → advances activeAyahNum → recomputes nextAudioUrl.
      onTrackEndedRef.current?.();
    };

    a.addEventListener("loadedmetadata", onMetadata);
    b.addEventListener("loadedmetadata", onMetadata);
    a.addEventListener("ended", onEnded);
    b.addEventListener("ended", onEnded);

    return () => {
      resetElement(a);
      resetElement(b);
      a.removeEventListener("loadedmetadata", onMetadata);
      b.removeEventListener("loadedmetadata", onMetadata);
      a.removeEventListener("ended", onEnded);
      b.removeEventListener("ended", onEnded);
      stopTicking();
    };
  }, [resetElement, stopTicking]);

  // Volume sync (both buffers)
  useEffect(() => {
    if (activeRef.current) activeRef.current.volume = volume;
    if (standbyRef.current) standbyRef.current.volume = volume;
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

    let isCancelled = false;

    fetch(nextAudioUrl)
      .then((res) => res.blob())
      .then((blob) => {
        if (isCancelled) return;
        const objectUrl = URL.createObjectURL(blob);

        if (standby.src && standby.src.startsWith("blob:")) {
          URL.revokeObjectURL(standby.src);
        }
        standby.src = objectUrl;
        standby.preload = "auto";
        standby.load();
      })
      .catch((err) => {
        if (isCancelled) return;
        console.log(
          "Blob prefetch failed (likely CORS), falling back to normal src:",
          err,
        );
        standby.src = nextAudioUrl;
        standby.preload = "auto";
        standby.load();
      });

    return () => {
      isCancelled = true;
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
      setVolume(newVolume);
    },
    [setVolume],
  );

  return {
    currentTime,
    setCurrentTime,
    duration,
    volume,
    handleSeek,
    handleVolumeChange,
  };
}
