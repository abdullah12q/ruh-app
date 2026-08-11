import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useUIStore from "@/lib/store/useUIStore";
import { useRadioAudioPlayer } from "@/hooks/useRadioAudioPlayer";
import StreamingTopBar from "../StreamingTopBar";
import AnimatedRadioIcon from "./AnimatedRadioIcon";
import InfoAndControls from "./InfoAndControls";

export default function RadioPlayer({
  station,
  onCloseAudio,
  onPlayingChange,
}) {
  const { radioVolume, setRadioVolume } = useUIStore();

  const {
    audioRef,
    isPlaying,
    isLoading,
    hasError,
    togglePlayPause,
    handleRefresh,
    handleVolumeChange,
  } = useRadioAudioPlayer(station, radioVolume, setRadioVolume);

  // Notify parent when playing state changes
  useEffect(() => {
    onPlayingChange?.(isPlaying);
  }, [isPlaying, onPlayingChange]);

  if (!station) return null;

  return (
    <div className="relative rounded-3xl overflow-hidden glass shadow-[0_0_60px_rgba(13,148,136,0.12)]!">
      <audio ref={audioRef} preload="none" />

      {/* Top Bar */}
      <StreamingTopBar
        name={station.name}
        isLoading={isLoading}
        hasError={hasError}
        onClose={onCloseAudio}
      />

      {/* Player Body */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-6">
        <AnimatedRadioIcon isPlaying={isPlaying} hasError={hasError} />

        {/* Info + Controls */}
        <InfoAndControls
          station={station}
          togglePlayPause={togglePlayPause}
          isLoading={isLoading}
          isPlaying={isPlaying}
          hasError={hasError}
          handleRefresh={handleRefresh}
          radioVolume={radioVolume}
          setRadioVolume={setRadioVolume}
          handleVolumeChange={handleVolumeChange}
        />
      </div>

      {/* Bottom animated bar when playing */}
      <AnimatePresence>
        {isPlaying && !hasError && (
          <motion.div
            initial={{ opacity: 0, y: -1 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.4 }}
            className="absolute left-0 bottom-0 w-full h-[1.25px] bg-linear-to-r from-accent via-surface to-accent bg-size-[200%_100%] animate-[shimmer_7s_linear_infinite]"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
