import { motion, AnimatePresence } from "framer-motion";
import {
  mobileMenuVariants,
  mobileLinkVariants,
} from "@/data/animationVariants";
import Link from "next/link";
import AuthButtomMobile from "./AuthButtomMobile";
import { X } from "lucide-react";

export default function MobileMenuOverlay({
  navLinks,
  permissionDenied,
  hintColor,
  nextPrayerKey,
  mobileOpen,
  setMobileOpen,
  status,
  user,
  signOut,
}) {
  return (
    <AnimatePresence>
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 bottom-0 z-50 w-72 glass lg:hidden flex flex-col pt-24 pb-8 px-6"
          >
            {/* Close Button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-8 right-11 size-7 flex items-center justify-center rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Mobile Nav Links */}
            <nav>
              <ul className="space-y-1">
                {navLinks.map(({ href, label, icon: Icon }, i) => (
                  <motion.li
                    key={href}
                    custom={i}
                    variants={mobileLinkVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className="relative flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all duration-200 font-medium font-jakarta"
                    >
                      <Icon size={18} className="text-accent" />
                      {label}
                      {/* Pulsing dot when prayer is (≤ 60 minutes) with HintColor */}
                      {href === "/prayer-times" && !permissionDenied && (
                        <AnimatePresence>
                          {hintColor.text !== "gradient-text" &&
                            nextPrayerKey && (
                              <motion.span
                                key="prayer-dot"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{ type: "spring" }}
                                className={`absolute right-5 size-2 rounded-full ${hintColor.bg}`}
                              >
                                {/* ripple animation */}
                                <span
                                  className={`absolute inset-0 rounded-full ${hintColor.bg} animate-ping opacity-75`}
                                />
                              </motion.span>
                            )}
                        </AnimatePresence>
                      )}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Mobile Sign In / Sign Out */}
            <AuthButtomMobile
              status={status}
              user={user}
              signOut={signOut}
              setMobileOpen={setMobileOpen}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
