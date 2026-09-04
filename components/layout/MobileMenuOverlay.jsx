import { motion, AnimatePresence } from "framer-motion";
import {
  mobileMenuVariants,
  mobileLinkVariants,
} from "@/data/animationVariants";
import Link from "next/link";
import AuthButtomMobile from "./AuthButtomMobile";
import { X, Settings } from "lucide-react";

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
  pathname,
  onOpenProfile,
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
            className="fixed top-0 right-0 bottom-0 z-50 w-72 glass lg:hidden pt-24 pb-8 px-6"
          >
            {/* Close Button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-8 right-11 size-7 flex items-center justify-center rounded-xl text-text-secondary hover:text-text-primary hover:bg-text-secondary/5 cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Mobile Nav Links */}
            <nav className="h-[90%] flex flex-col justify-between gap-y-6">
              <ul className="space-y-5">
                {navLinks.map(({ href, label, icon: Icon }, i) => {
                  const isActive =
                    pathname === href ||
                    (href !== "/" && pathname.startsWith(href));

                  return (
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
                        className={`relative flex items-center gap-3 font-jakarta transition-colors ${isActive ? "text-accent font-bold" : "text-text-secondary font-medium hover:text-text-primary"}`}
                      >
                        <Icon
                          size={18}
                          className={
                            isActive ? "text-accent" : "text-text-secondary"
                          }
                        />
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
                  );
                })}

                {/* Profile Settings — visible for all users (guests see locked sections inside) */}
                {status !== "loading" && (
                  <motion.li
                    custom={navLinks.length}
                    variants={mobileLinkVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        onOpenProfile?.();
                      }}
                      className="relative flex items-center gap-3 font-jakarta text-text-secondary font-medium hover:text-text-primary transition-colors cursor-pointer w-full"
                    >
                      <Settings size={18} className="text-text-secondary" />
                      Profile & Settings
                    </button>
                  </motion.li>
                )}
              </ul>

              {/* Mobile Sign In / Sign Out */}
              <AuthButtomMobile
                status={status}
                user={user}
                signOut={signOut}
                setMobileOpen={setMobileOpen}
              />
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
