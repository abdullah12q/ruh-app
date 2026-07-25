"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Headphones, Search } from "lucide-react";
import Link from "next/link";
import ListenSurahCard from "./ListenSurahCard";
import { useDebounce } from "@/hooks/useDebounce";

export default function ListenBrowser({ surahs }) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const filtered = surahs.filter((surah) => {
    const q = debouncedQuery.toLowerCase();
    return (
      surah.name_simple.toLowerCase().includes(q) ||
      surah.name_arabic.includes(q) ||
      surah.translated_name?.name?.toLowerCase().includes(q) ||
      String(surah.id).includes(q)
    );
  });

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-secondary mb-8 font-jakarta">
          <Link
            href="/quran"
            className="hover:text-accent transition-colors flex items-center gap-1"
          >
            <BookOpen size={13} />
            Quran
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-text-primary flex items-center gap-1">
            <Headphones size={13} />
            Listen & Download
          </span>
        </nav>

        {/* Page Header */}
        <div className="relative text-center mb-12">
          <span
            className="pointer-events-none select-none absolute left-1/2 top-2/3 -translate-x-1/2 -translate-y-1/2 font-quran text-[8rem] sm:text-[10rem] text-accent/10 whitespace-nowrap -z-10"
            dir="rtl"
            lang="ar"
          >
            استمع
          </span>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-accent text-xs font-semibold tracking-wider uppercase mb-6">
            <Headphones size={12} />
            Full Surah Mode
          </div>

          <h1 className="font-jakarta font-extrabold text-4xl sm:text-5xl text-text-primary mb-4">
            Listen & <span className="gradient-text">Download</span>
          </h1>
          <p className="font-inter text-text-secondary text-lg max-w-xl mx-auto mb-10">
            Choose a Surah · Select your Sheikh · Listen or Download
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, Arabic, or number…"
              className="w-full pl-10 pr-4 py-3 rounded-2xl glass font-inter text-sm text-text-primary placeholder:text-text-secondary/50 outline-none focus:border-accent/40 transition-colors"
            />
          </div>
        </div>

        {/* Surah Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={debouncedQuery}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
          >
            {surahs.length === 0 ? (
              // Loading skeleton
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div
                    key={i}
                    className="glass rounded-2xl p-5 flex items-center gap-4"
                  >
                    <div className="size-11 skeleton rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 skeleton rounded w-3/4" />
                      <div className="h-2 skeleton rounded w-1/2" />
                    </div>
                    <div className="h-8 w-20 skeleton rounded-xl" />
                  </div>
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {filtered.map((surah, i) => (
                  <ListenSurahCard key={surah.id} surah={surah} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-text-secondary font-inter">
                  No Surahs found for &quot;{query}&quot;
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
