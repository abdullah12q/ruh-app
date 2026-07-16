"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import useUIStore from "@/lib/store/useUIStore";

export function useAudioPlayer({ audioUrl, isPlaying }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);
  const rafRef = useRef(null);

  const { volume, setVolume } = useUIStore();

  // Keep the live <audio> element in sync whenever global volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Play or Pause the audio when the `isPlaying` state changes
  // Smoothly sync currentTime every frame while playing
  useEffect(() => {
    if (!isPlaying) {
      audioRef.current?.pause();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    if (audioRef.current) {
      audioRef.current
        .play()
        .catch((err) => console.log("Audio play error:", err));

      const tick = () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying]);

  // Automatically reset the time if the audio URL changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentTime(0);
  }, [audioUrl]);

  const handleSeek = useCallback((newTime) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, []);

  const handleVolumeChange = useCallback(
    (newVolume) => {
      if (audioRef.current) {
        audioRef.current.volume = newVolume;
      }
      setVolume(newVolume);
    },
    [setVolume],
  );

  const onTimeUpdate = useCallback((e) => {
    // fallback sync only — rAF loop handles the smooth frame-by-frame updates
    if (!rafRef.current) setCurrentTime(e.target.currentTime);
  }, []);

  const onLoadedMetadata = useCallback(
    (e) => {
      setDuration(e.target.duration);
      e.target.volume = volume; // ensure volume persists across verses
    },
    [volume],
  );

  return {
    currentTime,
    setCurrentTime,
    duration,
    audioRef,
    volume,
    handleSeek,
    handleVolumeChange,
    onTimeUpdate,
    onLoadedMetadata,
  };
}
