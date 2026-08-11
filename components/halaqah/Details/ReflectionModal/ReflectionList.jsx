import { motion } from "framer-motion";
import { MessageSquare, Loader2 } from "lucide-react";
import ReflectionCard from "./ReflectionCard";

export default function ReflectionList({
  isLoading,
  reflections,
  listBottomRef,
  colorMap,
}) {
  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0">
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Loader2 size={24} className="text-accent/50 animate-spin" />
          <p className="text-xs text-text-secondary font-inter">
            Loading reflections...
          </p>
        </div>
      )}

      {/* No reflections */}
      {!isLoading && reflections.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-12 gap-3 text-center"
        >
          <div className="size-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
            <MessageSquare size={22} className="text-violet-400/60" />
          </div>
          <p className="font-jakarta font-semibold text-text-secondary text-sm">
            No reflections yet
          </p>
          <p className="text-xs text-text-secondary/60 font-inter max-w-xs">
            Be the first to share a thought on this Ayah with your circle.
          </p>
        </motion.div>
      )}

      {/* Reflections */}
      {!isLoading &&
        reflections.map((reflection, i) => (
          <ReflectionCard
            key={reflection.id}
            reflection={reflection}
            index={i}
            colorMap={colorMap}
          />
        ))}

      {/* Scroll anchor */}
      <div ref={listBottomRef} />
    </div>
  );
}
