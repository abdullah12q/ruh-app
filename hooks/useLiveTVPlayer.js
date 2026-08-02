import { useEffect, useRef, useState, useCallback } from "react";
import useUIStore from "@/lib/store/useUIStore";

export default function useLiveTVPlayer(channel) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { liveTvVolume, setLiveTvVolume } = useUIStore();

  useEffect(() => {
    if (!channel || !videoRef.current) return;

    videoRef.current.volume = liveTvVolume;
  }, [channel, liveTvVolume]);

  useEffect(() => {
    if (!channel || !videoRef.current) return;

    setIsLoading(true);
    setHasError(false);

    const video = videoRef.current;

    async function initPlayer() {
      // Destroy previous HLS instance if any
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      // import hls.js hena a7sn 3shan el package kbera
      const { default: Hls } = await import("hls.js");

      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 30,
        });
        hlsRef.current = hls;

        hls.loadSource(channel.url);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsLoading(false);
          video.play().catch((err) => {
            console.error("Video play error:", err);
          });
        });

        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            setHasError(true);
            setIsLoading(false);
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Native HLS (Safari)
        video.src = channel.url;
        video.addEventListener("loadedmetadata", () => {
          setIsLoading(false);
          video.play().catch((err) => {
            console.error("Video play error:", err);
          });
        });
        video.addEventListener("error", () => {
          setHasError(true);
          setIsLoading(false);
        });
      } else {
        setHasError(true);
        setIsLoading(false);
      }
    }

    initPlayer();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }
    };
  }, [channel, refreshKey]);

  const handleRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  function handleFullscreen() {
    const video = videoRef.current;
    if (!video) return;

    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
      // Safari support
      video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
      // IE11 support
      video.msRequestFullscreen();
    }
  }

  function onVolumeChange(e) {
    setLiveTvVolume(e.target.volume);
  }

  return {
    videoRef,
    isLoading,
    hasError,
    refreshKey,
    liveTvVolume,
    setLiveTvVolume,
    handleRefresh,
    handleFullscreen,
    onVolumeChange,
  };
}
