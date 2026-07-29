import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

export default function PermissionDenied({ onRetry }) {
  return (
    <div className="text-center py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex flex-col items-center gap-5 max-w-sm"
      >
        <div className="size-20 rounded-2xl glass flex items-center justify-center text-4xl">
          📍
        </div>
        <div>
          <h2 className="font-jakarta font-bold text-xl text-text-primary mb-2">
            Location access required
          </h2>
          <p className="font-inter text-sm text-text-secondary leading-relaxed">
            Prayer times are calculated from your coordinates. Allow location
            access to continue.
          </p>
        </div>
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold font-jakarta hover:opacity-90 transition-all cursor-pointer"
        >
          <RotateCcw size={15} />
          Grant location access
        </button>
      </motion.div>
    </div>
  );
}
