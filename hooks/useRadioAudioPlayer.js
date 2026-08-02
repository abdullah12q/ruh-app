import { useEffect, useRef, useState, useCallback } from "react";

export function useRadioAudioPlayer(station, radioVolume, setRadioVolume) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Sync volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = radioVolume;
    }
  }, [radioVolume]);

  // Handle stream lifecycle and events
  useEffect(() => {
    if (!station || !audioRef.current) return;

    const audio = audioRef.current;
    let cancelled = false; // guards against stale events from a previous station

    setIsLoading(true);
    setHasError(false);
    setIsPlaying(false);

    audio.src = station.streamUrl;
    audio.volume = radioVolume;
    audio.load();

    const handleCanPlay = () => {
      if (!cancelled) {
        setIsLoading(false);
        audio.play().catch((error) => {
          console.error("Playback failed:", error);
          setIsPlaying(false);
        });
      }
    };
    const handlePlaying = () => {
      if (!cancelled) {
        setIsLoading(false);
        setIsPlaying(true);
      }
    };
    const handleError = () => {
      if (cancelled || audio.error?.code === audio.error?.MEDIA_ERR_ABORTED)
        return;
      setHasError(true);
      setIsLoading(false);
    };
    const handlePause = () => {
      if (!cancelled) setIsPlaying(false);
    };
    const handlePlay = () => {
      if (!cancelled) setIsPlaying(true);
    };
    const handleWaiting = () => {
      if (!cancelled) setIsLoading(true);
    };
    const handleStalled = () => {
      if (!cancelled) setIsLoading(true);
    };

    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("error", handleError);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("stalled", handleStalled);

    return () => {
      cancelled = true;
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("stalled", handleStalled);

      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    };
  }, [station]); // eslint-disable-line react-hooks/exhaustive-deps

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      setIsLoading(true);
      audio.play().catch((error) => {
        console.error("Playback failed:", error);
        setIsPlaying(false);
        setIsLoading(false);
      });
    }
  }, [isPlaying]);

  const handleRefresh = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !station) return;

    setIsLoading(true);
    setHasError(false);
    setIsPlaying(false);

    audio.pause();
    audio.src = station.streamUrl;
    audio.load();
    audio.play().catch((error) => {
      console.error("Playback failed:", error);
      setIsPlaying(false);
      setIsLoading(false);
    });
  }, [station]);

  const handleVolumeChange = useCallback(
    (e) => {
      const val = parseFloat(e.target.value);
      setRadioVolume(val);
      if (audioRef.current) audioRef.current.volume = val;
    },
    [setRadioVolume],
  );

  return {
    audioRef,
    isPlaying,
    isLoading,
    hasError,
    togglePlayPause,
    handleRefresh,
    handleVolumeChange,
  };
}
