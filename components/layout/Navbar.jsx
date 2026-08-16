"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

import logo from "@/app/icon.png";
import navLinks from "@/data/navLinks";

import BookmarksDrawer from "./bookmark/BookmarksDrawer";
import BookmarkButton from "./bookmark/BookmarkButton";
import ThemeToggle from "./ThemeToggle";
import AuthButtomDesktop from "./AuthButtomDesktop";
import MobileMenuToggle from "./MobileMenuToggle";
import MobileMenuOverlay from "./MobileMenuOverlay";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { untilNextPrayerHintColor } from "@/data/datas/prayerTimesData";

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bookmarksOpen, setBookmarksOpen] = useState(false);
  const navRef = useRef(null);
  const pathname = usePathname();

  const { permissionDenied, nextPrayerKey, countdown } = usePrayerTimes();

  useEffect(() => {
    if (!navRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "+=80",
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.to(navRef.current, {
            paddingTop: `${12 - 8 * progress}px`,
            paddingBottom: `${12 - 8 * progress}px`,
            duration: 0.2,
            ease: "power1.out",
          });
        },
      });
    }, navRef);

    return () => ctx.revert();
  }, []);

  // Lock body scroll when mobile menu or bookmarks drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen || bookmarksOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, bookmarksOpen]);

  const hintColor = untilNextPrayerHintColor(countdown, true);

  return (
    <>
      <header
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-20 py-3 px-4 sm:px-6 lg:px-8 backdrop-blur-md"
      >
        <nav className="glass mx-auto max-w-7xl rounded-2xl px-5 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="Rُuh Home"
          >
            <Image
              src={logo}
              alt="Ruh Logo"
              width={35}
              height={35}
              priority
              className="rounded-full"
            />
            <span className="text-xl font-extrabold font-jakarta text-text-primary tracking-tight group-hover:text-accent transition-colors duration-200">
              <span className="sm:hidden">R ُuh</span>
              <span className="hidden sm:inline">Rُuh</span>
            </span>
            <span className="text-lg font-bold font-arabic-ui text-accent leading-none">
              رُوح
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ href, label }) => {
              const isActive =
                pathname === href ||
                (href !== "/" && pathname.startsWith(href));

              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`relative px-4 py-2 rounded-xl text-sm font-medium font-jakarta transition-all duration-800 group hover:bg-white/5 ${isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary"}`}
                  >
                    {label}
                    <span
                      className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-accent rounded-full transition-all duration-300 ${isActive ? "w-4" : "w-0 group-hover:w-4"}`}
                    />

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

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Bookmark Button */}
            <BookmarkButton onClick={() => setBookmarksOpen(true)} />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Auth Button (Desktop) */}
            <AuthButtomDesktop status={status} user={user} signOut={signOut} />

            {/* Mobile Menu Toggle */}
            <MobileMenuToggle
              mobileOpen={mobileOpen}
              toggleMobileMenu={() => setMobileOpen((v) => !v)}
            />
          </div>
        </nav>
      </header>

      {/* Bookmarks Drawer */}
      <BookmarksDrawer
        isOpen={bookmarksOpen}
        onClose={() => setBookmarksOpen(false)}
      />

      {/* Mobile Menu Overlay */}
      <MobileMenuOverlay
        navLinks={navLinks}
        permissionDenied={permissionDenied}
        hintColor={hintColor}
        nextPrayerKey={nextPrayerKey}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        status={status}
        user={user}
        signOut={signOut}
        pathname={pathname}
      />
    </>
  );
}
