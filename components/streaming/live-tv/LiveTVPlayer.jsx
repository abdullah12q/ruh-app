import StreamingTopBar from "../StreamingTopBar";
import LoadingAndErrorOverlays from "./LoadingAndErrorOverlays";
import useLiveTVPlayer from "@/hooks/useLiveTVPlayer";

export default function LiveTVPlayer({ channel, onCloseVideo }) {
  const {
    videoRef,
    isLoading,
    hasError,
    handleRefresh,
    handleFullscreen,
    onVolumeChange,
  } = useLiveTVPlayer(channel);

  if (!channel) return null;

  return (
    <div className="relative rounded-3xl overflow-hidden glass border border-accent/20 shadow-[0_0_60px_rgba(13,148,136,0.12)]">
      {/* Top Bar */}
      <StreamingTopBar
        type="Live TV"
        name={channel.name}
        isLoading={isLoading}
        hasError={hasError}
        handleFullscreen={handleFullscreen}
        handleRefresh={handleRefresh}
        onClose={onCloseVideo}
      />

      {/* Video Area */}
      <div className="relative bg-black aspect-video w-full">
        <video
          ref={videoRef}
          className="size-full object-contain"
          controls
          playsInline
          onVolumeChange={onVolumeChange}
        />

        {/* loading w error overlays */}
        <LoadingAndErrorOverlays
          channel={channel}
          isLoading={isLoading}
          hasError={hasError}
        />
      </div>
    </div>
  );
}
