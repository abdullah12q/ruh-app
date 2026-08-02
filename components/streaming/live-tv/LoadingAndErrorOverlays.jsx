import { Tv, WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingAndErrorOverlays({
  channel,
  isLoading,
  hasError,
}) {
  return (
    <>
      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <div className="relative mb-4">
              <div className="size-16 rounded-full border-2 border-accent/30 flex items-center justify-center">
                <Tv size={24} className="text-accent" />
              </div>
              {/* Spinning ring */}
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent animate-spin" />
            </div>
            <p className="text-text-secondary text-sm font-inter">
              Connecting to live stream…
            </p>
            <p
              className="font-arabic-ui text-accent/70 text-sm mt-1"
              dir="rtl"
              lang="ar"
            >
              {channel.name}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Overlay */}
      <AnimatePresence>
        {hasError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <WifiOff size={32} className="text-red-400 mb-3" />
            <p className="text-text-primary font-semibold mb-1">
              Stream Unavailable
            </p>
            <p className="text-text-secondary text-sm text-center max-w-xs">
              Unable to connect to the live stream. Please try again later.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
