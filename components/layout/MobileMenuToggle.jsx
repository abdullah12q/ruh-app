import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function MobileMenuToggle({ mobileOpen, toggleMobileMenu }) {
  return (
    <button
      onClick={toggleMobileMenu}
      aria-label="Toggle mobile menu"
      aria-expanded={mobileOpen}
      className="md:hidden size-9 flex items-center justify-center rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all duration-200"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {mobileOpen ? (
          <motion.span
            key="x"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <X size={20} />
          </motion.span>
        ) : (
          <motion.span
            key="menu"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Menu size={20} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
