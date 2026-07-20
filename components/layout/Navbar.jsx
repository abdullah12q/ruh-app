"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { Moon, Sun, Menu, X, LogIn, LogOut, Bookmark } from "lucide-react";

import logo from "@/app/icon.png";
import navLinks from "@/data/navLinks";
import {
  mobileMenuVariants,
  mobileLinkVariants,
} from "@/data/animationVariants";
import BookmarksDrawer from "./bookmark/BookmarksDrawer";
import useUIStore from "@/lib/store/useUIStore";

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bookmarksOpen, setBookmarksOpen] = useState(false);
  const navRef = useRef(null);

  const { bookmarkedAyahs } = useUIStore();
  const bookmarkedCount = bookmarkedAyahs.length;

  // Avoid hydration mismatch for theme-dependent UI
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

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

  const isDark = resolvedTheme === "dark";

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
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="relative px-4 py-2 rounded-xl text-sm font-medium font-jakarta text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all duration-200 group"
                >
                  {label}
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-accent rounded-full group-hover:w-4 transition-all duration-300" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Bookmark Button */}
            <button
              onClick={() => setBookmarksOpen(true)}
              aria-label="Open bookmarks"
              className="relative size-9 flex items-center justify-center rounded-xl text-text-secondary hover:text-accent hover:bg-white/5 transition-all duration-200 cursor-pointer"
            >
              <Bookmark size={17} strokeWidth={1.75} />
              <AnimatePresence mode="popLayout">
                {bookmarkedCount > 0 && (
                  <motion.span
                    key={bookmarkedCount}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: "spring" }}
                    className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-accent text-white text-[9px] font-bold font-jakarta flex items-center justify-center leading-none"
                  >
                    {bookmarkedCount > 99 ? "99+" : bookmarkedCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                aria-label={
                  isDark ? "Switch to light mode" : "Switch to dark mode"
                }
                className="size-9 flex items-center justify-center rounded-xl text-text-secondary hover:text-accent hover:bg-white/5 transition-all duration-200 cursor-pointer"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isDark ? (
                    <motion.span
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun size={18} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon size={18} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            )}

            {/* Auth Button (Desktop) */}
            {status === "authenticated" ? (
              <div className="hidden md:flex items-center gap-3">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="size-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent text-sm">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-accent transition-all duration-200 cursor-pointer"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            ) : status === "loading" ? (
              <div className="hidden md:block size-8 rounded-full bg-white/5 animate-pulse" />
            ) : (
              <Link
                href="/auth/signin"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-sm font-semibold font-jakarta hover:opacity-90 active:scale-95 transition-all duration-200"
              >
                <LogIn size={15} />
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
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
          </div>
        </nav>
      </header>

      {/* Bookmarks Drawer */}
      <BookmarksDrawer
        isOpen={bookmarksOpen}
        onClose={() => setBookmarksOpen(false)}
      />

      {/* Mobile Menu Overlay */}
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
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 bottom-0 z-50 w-72 glass md:hidden flex flex-col pt-24 pb-8 px-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-8 right-11 flex items-center justify-center rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5"
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
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all duration-200 font-medium font-jakarta"
                      >
                        <Icon size={18} className="text-accent" />
                        {label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Mobile Sign In / Sign Out */}
              <div className="mt-auto">
                {status === "authenticated" ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5">
                      {user?.image ? (
                        <Image
                          src={user.image}
                          alt={user.name || "User"}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="size-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent text-sm">
                          {user?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                      )}
                      <div className="truncate">
                        <p className="text-sm font-semibold text-text-primary truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-text-secondary truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        signOut();
                      }}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-text-primary font-semibold font-jakarta hover:bg-white/10 transition-all duration-200 cursor-pointer"
                    >
                      <LogOut size={16} className="text-accent" />
                      Sign Out
                    </button>
                  </div>
                ) : status === "loading" ? (
                  <div className="h-12 w-full rounded-xl bg-white/5 animate-pulse" />
                ) : (
                  <Link
                    href="/auth/signin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-accent text-white font-semibold font-jakarta hover:opacity-90 transition-all duration-200"
                  >
                    <LogIn size={16} />
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
