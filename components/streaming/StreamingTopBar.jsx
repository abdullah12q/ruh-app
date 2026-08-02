import { Maximize2, Radio, Wifi, WifiOff, X } from "lucide-react";
import RefreshButton from "./RefreshButton";

export default function StreamingTopBar({
  type = "Radio",
  name,
  isLoading,
  hasError,
  handleFullscreen,
  handleRefresh,
  onClose,
}) {
  return (
    <div
      className={`flex items-center justify-between ${type !== "Radio" ? "gap-4" : "gap-2"} sm:gap-2 px-5 py-3.5 border-b border-white/6`}
    >
      <div className="flex items-center gap-3">
        {/* Live Badge */}
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold tracking-wider uppercase">
          <span className="size-1.5 rounded-full bg-red-400 animate-ping absolute" />
          <span className="size-1.5 rounded-full bg-red-400 relative" />
          Live
        </span>
        <span
          className={`text-text-primary text-xs sm:text-base font-semibold ${type === "Radio" ? "font-jakarta" : "font-arabic-ui"} line-clamp-3`}
          dir={type === "Radio" ? "ltr" : "rtl"}
          lang={type === "Radio" ? "en" : "ar"}
        >
          {name}
        </span>
      </div>

      <div
        className={`flex items-center ${type !== "Radio" ? "gap-1" : "gap-2"} sm:gap-2`}
      >
        {/* Connection Status */}
        <span className="text-text-secondary">
          {isLoading ? (
            <Wifi size={16} className="animate-pulse text-accent" />
          ) : hasError ? (
            <WifiOff size={16} className="text-red-400" />
          ) : (
            <Radio size={16} className="text-accent" />
          )}
        </span>

        {/* Refresh */}
        {handleRefresh && (
          <RefreshButton onClick={handleRefresh} isLoading={isLoading} />
        )}

        {/* Fullscreen */}
        {handleFullscreen && (
          <button
            onClick={handleFullscreen}
            className="p-1.5 rounded-lg hover:bg-white/10 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            title="Fullscreen"
          >
            <Maximize2 size={15} />
          </button>
        )}

        {/* Close */}
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-white/10 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          title="Close"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
