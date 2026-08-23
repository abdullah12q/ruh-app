import { Check, Copy } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useMediaQuery } from "@custom-react-hooks/use-media-query";

export default function CopyButton({ onClick, copied, label, title }) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={title}
      className="flex items-center gap-1 px-2 py-1 rounded-xl hover:bg-accent/10 transition-colors duration-300 text-text-secondary hover:text-accent cursor-pointer text-[10px] font-inter"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-1"
          >
            <Check size={13} className="text-green-400" />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-1"
          >
            <Copy size={13} />
            <span>{isMobile ? title.split("Copy")[1] : title}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
