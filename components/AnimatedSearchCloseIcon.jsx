import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export default function AnimatedSearchCloseIcon({ value, position, onChange }) {
  return (
    <AnimatePresence>
      {value.trim() && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.2 }}
          whileTap={{ scale: 0.9 }}
          className={`absolute ${position} top-1/2 -translate-y-1/2 rounded-md p-1 hover:bg-accent/15 transition-colors duration-400 text-text-secondary cursor-pointer`}
          onClick={() => onChange("")}
        >
          <X size={14} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
