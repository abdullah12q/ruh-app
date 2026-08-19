import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import React from "react";

export default function DesktopNavLinks({
  navLinks,
  pathname,
  permissionDenied,
  hintColor,
  nextPrayerKey,
}) {
  return (
    <ul className="hidden lg:flex items-center gap-1">
      {navLinks.map(({ href, label }) => {
        const isActive =
          pathname === href || (href !== "/" && pathname.startsWith(href));

        return (
          <li key={href}>
            <Link
              href={href}
              className={`relative px-4 py-2 rounded-xl text-[11px] xl:text-sm font-medium font-jakarta transition-all duration-800 group hover:bg-white/5 ${isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary"}`}
            >
              {label}
              <span
                className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-accent rounded-full transition-all duration-300 ${isActive ? "w-4" : "w-0 group-hover:w-4"}`}
              />

              {/* Pulsing dot when prayer is (≤ 60 minutes) with HintColor */}
              {href === "/prayer-times" && !permissionDenied && (
                <AnimatePresence>
                  {hintColor.text !== "gradient-text" && nextPrayerKey && (
                    <motion.span
                      key="prayer-dot"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ type: "spring" }}
                      className={`absolute top-2 right-0.5 size-2 rounded-full ${hintColor.bg}`}
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
          </li>
        );
      })}
    </ul>
  );
}
