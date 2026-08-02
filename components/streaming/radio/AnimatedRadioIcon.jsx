import { Radio } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AnimatedRadioIcon({ isPlaying, hasError }) {
  return (
    <AnimatePresence mode="popLayout">
      <div className="relative shrink-0 size-16 rounded-2xl glass border border-accent/20 flex items-center justify-center overflow-hidden">
        {isPlaying && !hasError ? (
          <motion.div
            key="eq"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-end gap-0.5"
          >
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-accent"
                style={{
                  height: `${8 + i * 4}px`,
                  animation: `equalizer ${0.4 + i * 0.1}s ease-in-out infinite alternate`,
                }}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="radio"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Radio size={22} className="text-accent/50" />
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}
