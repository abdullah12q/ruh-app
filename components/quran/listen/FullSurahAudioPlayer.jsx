import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Play,
  Pause,
  Download,
  Volume1,
  Volume2,
  VolumeX,
  Loader2,
  X,
  BookOpenText,
} from "lucide-react";
import { formatTime, getMoshafStyle } from "@/data/datas/audioData";
import useUIStore from "@/lib/store/useUIStore";
import { ID3Writer } from "browser-id3-writer";

export default function FullSurahAudioPlayer({
  audioUrl,
  surah,
  reciter,
  moshaf,
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const audioRef = useRef(null);
  const rafRef = useRef(null);

  const { volume, setVolume, clearGlobalPlayer, toggleMushafMode } =
    useUIStore();

  const moshafStyle = getMoshafStyle(moshaf?.moshafType);
  const timelinePct = duration ? (currentTime / duration) * 100 : 0;
  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  // Sync volume with global store
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Reset when URL changes — always auto-play the new track
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(0);
    setIsLoading(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, [audioUrl]);

  // rAF loop for smooth timeline updates and playback control
  useEffect(() => {
    if (!isPlaying) {
      audioRef.current?.pause();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    // Flag to prevent state updates if the component unmounts or the URL changes rapidly
    let isCurrent = true;

    if (audioRef.current) {
      setIsLoading(true);
      audioRef.current
        .play()
        .then(() => {
          if (isCurrent) setIsLoading(false);
        })
        .catch((err) => {
          // Only stop playing if the error is NOT an AbortError
          // (AbortError is expected when switching tracks quickly)
          if (isCurrent && err.name !== "AbortError") {
            console.log("Audio play error:", err);
            setIsPlaying(false);
            setIsLoading(false);
          }
        });

      const tick = () => {
        if (audioRef.current && isCurrent) {
          setCurrentTime(audioRef.current.currentTime);
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      isCurrent = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, audioUrl]);

  const fileNameSuffix = reciter.segmentId
    ? `الايات ${reciter.segmentId.trim()} Audio Tafsir`
    : reciter.nameEn.trim();

  const handleSeek = useCallback((newTime) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(
    (e) => {
      setDuration(e.target.duration);
      e.target.volume = volume;
      setIsLoading(false);
    },
    [volume],
  );

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) audioRef.current.currentTime = 0;
  }, []);

  const handleWaiting = useCallback(() => setIsLoading(true), []);
  const handleCanPlay = useCallback(() => setIsLoading(false), []);

  // Download handler
  const handleDownload = useCallback(async () => {
    setIsDownloading(true);

    try {
      // Fetch both the audio file and the cover image concurrently as an ArrayBuffer
      const [audioResponse, coverResponse] = await Promise.all([
        fetch(audioUrl),
        fetch("/icon.png"),
      ]);

      if (!audioResponse.ok)
        throw new Error("Audio network response was not ok");

      const audioArrayBuffer = await audioResponse.arrayBuffer();

      // Initialize the ID3 Writer with the audio buffer
      const writer = new ID3Writer(audioArrayBuffer);

      // Set the custom metadata tags
      writer
        .setFrame("TIT2", `Surah ${surah.name_simple}`) // Surah Title
        .setFrame("TPE1", [fileNameSuffix]) // Artist Name
        .setFrame("TALB", "Ruh - The Holy Quran") // Album Name
        .setFrame("TCON", ["Quran"]) // Genre
        .setFrame("COMM", {
          description: "Downloaded from",
          text: "Ruh App",
        });

      // If the image was fetched successfully, add it as the album cover (APIC frame)
      if (coverResponse.ok) {
        const coverArrayBuffer = await coverResponse.arrayBuffer();
        writer.setFrame("APIC", {
          type: 3, // 3 means "Cover (front)"
          data: coverArrayBuffer,
          description: "Ruh App Cover",
        });
      } else {
        console.warn(
          "Cover image could not be fetched. Proceeding without it.",
        );
      }

      // Build the new tags and get the modified Blob
      writer.addTag();
      const modifiedBlob = writer.getBlob();

      // Create a local URL for the new Blob
      const blobUrl = window.URL.createObjectURL(modifiedBlob);

      // Trigger the download natively
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${surah.name_simple} - ${fileNameSuffix}.mp3`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Blob download failed, falling back to new tab:", error);
      // Fallback: Open in new tab if CORS blocks the fetch or ID3 fails
      window.open(audioUrl, "_blank", "noopener,noreferrer");
    } finally {
      setIsDownloading(false);
    }
  }, [audioUrl, surah.name_simple, fileNameSuffix]);

  const baseCSS =
    "flex items-center gap-1.5 px-3 py-2 rounded-xl glass text-text-secondary hover:text-accent hover:border-accent/30! transition-all duration-300 text-xs font-semibold font-jakarta cursor-pointer";

  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 80 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-39"
    >
      {/* Frosted glass player bar */}
      <div className="glass backdrop-blur-sm border-t border-white/10 dark:border-white/5 px-4 sm:px-6 py-3 shadow-[0_-8px_40px_rgba(0,0,0,0.3)]">
        {/* Timeline — full width, above controls */}
        <div className="mb-3 flex items-center gap-3">
          <span className="text-[11px] tabular-nums text-text-secondary font-jakarta w-10 text-right shrink-0">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onChange={(e) => handleSeek(Number(e.target.value))}
            style={{ "--range-progress": `${timelinePct}%` }}
            className="range-fill flex-1 h-0.5 rounded-full appearance-none cursor-pointer outline-none"
            aria-label="Audio timeline"
          />
          <span className="text-[11px] tabular-nums text-text-secondary font-jakarta w-10 shrink-0">
            {formatTime(duration)}
          </span>
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between gap-4">
          {/* Left: Surah + reciter info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-x-2 flex-wrap">
              <span className="font-jakarta font-semibold text-xs sm:text-sm text-text-primary">
                {surah.name_simple}
              </span>
              <span
                className="font-quran text-lg sm:text-xl text-accent leading-none"
                dir="rtl"
                lang="ar"
              >
                {surah.name_arabic}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="hidden sm:block font-inter text-xs text-text-secondary truncate">
                {reciter.nameEn}
              </p>
              <p className="hidden sm:block text-accent/80 text-xs">•</p>
              <p
                className="font-quran text-xs text-text-secondary truncate"
                dir="rtl"
                lang="ar"
              >
                {reciter.nameAr}
              </p>
              {moshaf && (
                <>
                  <span className="text-text-secondary/30 mb-1">·</span>
                  <span
                    className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${moshafStyle.color}`}
                  >
                    <span className="hidden sm:block mx-1">
                      {moshafStyle.label}
                    </span>
                    <span className="font-arabic-ui">
                      {moshafStyle.labelAr}
                    </span>
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Center: Play/Pause */}
          <button
            onClick={() => setIsPlaying((v) => !v)}
            disabled={isLoading}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="size-10 sm:size-12 rounded-full bg-accent flex items-center justify-center text-white shadow-[0_0_20px_rgba(20,184,166,0.4)] hover:scale-105 active:scale-95 transition-transform duration-150 cursor-pointer shrink-0 disabled:opacity-60"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : isPlaying ? (
              <Pause size={20} />
            ) : (
              <Play size={20} />
            )}
          </button>

          {/* Right: Volume + Download + Close */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            {/* Volume */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
                aria-label="Toggle mute"
                className="text-text-secondary hover:text-accent transition-colors cursor-pointer"
              >
                <VolumeIcon size={15} />
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                style={{ "--range-progress": `${volume * 100}%` }}
                className="range-fill always-show-thumb w-12 sm:w-20 h-0.75 rounded-full appearance-none cursor-pointer outline-none"
                aria-label="Volume"
              />
            </div>

            {/* Read in Mushaf */}
            <Link
              href={`/quran/${surah.id}`}
              onClick={() => toggleMushafMode(true)}
              title={`Read ${surah.name_simple} in Mushaf mode`}
              className={baseCSS}
            >
              <BookOpenText size={13} />
              <span className="hidden sm:inline">Mushaf</span>
            </Link>

            {/* Download */}
            <button
              onClick={handleDownload}
              title={`Download ${surah.name_simple} - ${fileNameSuffix}`}
              disabled={isDownloading}
              className={`${baseCSS} disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {isDownloading ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Download size={13} />
              )}
              <span className="hidden sm:inline">
                {isDownloading ? "Downloading..." : "Download"}
              </span>
            </button>

            {/* Close player */}
            <button
              onClick={clearGlobalPlayer}
              aria-label="Close audio player"
              title="Close player"
              className="ml-1 size-7 flex items-center justify-center rounded-full text-text-secondary hover:text-red-400 hover:bg-red-400/10 border border-white/10 hover:border-red-400/30 transition-all duration-200 cursor-pointer"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Hidden native audio element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onWaiting={handleWaiting}
        onCanPlay={handleCanPlay}
      />
    </motion.div>
  );
}
