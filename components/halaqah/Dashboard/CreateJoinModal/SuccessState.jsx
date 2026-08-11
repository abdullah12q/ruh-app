import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, ArrowRight } from "lucide-react";

export default function SuccessState({ createdCode, copied, onCopy, onEnter }) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-4"
    >
      <div className="text-4xl mb-4">🎉</div>
      <p className="font-jakarta font-bold text-text-primary text-lg mb-1">
        Circle created!
      </p>
      <p className="text-text-secondary font-inter text-sm mb-6">
        Share this code with your group to invite them.
      </p>

      {/* Code display */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <code className="text-3xl font-mono font-extrabold tracking-[0.3em] text-accent bg-accent/10 border border-accent/20 rounded-xl px-6 py-4">
          {createdCode}
        </code>
        <button
          onClick={onCopy}
          className="p-2.25 rounded-xl glass flex items-center justify-center text-text-secondary hover:text-accent hover:border-accent/30! transition-colors duration-300 cursor-pointer"
        >
          <AnimatePresence mode="popLayout">
            {copied ? (
              <motion.div
                key="check"
                initial={{ opacity: 0, scale: 0, rotate: -90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0, rotate: 90 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <Check size={16} className="text-accent" />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ opacity: 0, scale: 0, rotate: 90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0, rotate: -90 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <Copy size={16} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      <button
        onClick={onEnter}
        className="group flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-accent text-white font-jakarta font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer"
      >
        Enter Circle
        <ArrowRight
          size={10}
          className="group-hover:translate-x-0.5 transition-transform duration-300"
        />
      </button>
    </motion.div>
  );
}
