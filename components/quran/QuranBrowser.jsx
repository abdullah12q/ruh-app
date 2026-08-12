"use client";

import { useState } from "react";
import { BookOpen, Headphones, ScrollText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SurahCard from "./SurahCard";
import SearchInput from "./SearchInput";
import VerseSearchResult from "./VerseSearchResult";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuranSearch } from "@/lib/queries/quran";
import Link from "next/link";

export default function QuranBrowser({ surahs }) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const [activeTab, setActiveTab] = useState("surahs");

  const { data: verseResults = [], isLoading: isSearchingVerses } =
    useQuranSearch(debouncedQuery, activeTab === "verses");

  const filteredSurahs = surahs.filter((surah) => {
    const searchLower = query.toLowerCase();
    return (
      surah.name_simple.toLowerCase().includes(searchLower) ||
      surah.name_arabic.includes(searchLower) ||
      surah.id.toString().includes(searchLower)
    );
  });

  const verseHint =
    activeTab === "verses" && debouncedQuery.trim().length > 2
      ? isSearchingVerses
        ? "Searching..."
        : `${verseResults.length} ${verseResults.length === 1 ? "match" : "matches"}`
      : undefined;

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 animate-fade-up">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-secondary mb-8 font-jakarta">
          <span className="text-text-primary flex items-center gap-1">
            <BookOpen size={13} />
            Quran
          </span>
          <span className="opacity-40">/</span>
          <Link
            href="/quran/listen"
            className="hover:text-accent transition-colors flex items-center gap-1"
          >
            <Headphones size={13} />
            Listen & Download
          </Link>
        </nav>

        {/* Page Header */}
        <div className="relative text-center mb-8">
          {/* light background keda mktob feha quran bel 3rby */}
          <span
            className="pointer-events-none select-none absolute left-1/2 top-2/3 -translate-x-1/2 -translate-y-1/2 font-quran text-[9rem] sm:text-[11rem] text-accent/4 whitespace-nowrap -z-10"
            dir="rtl"
            lang="ar"
          >
            القرآن
          </span>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-accent text-xs font-semibold tracking-wider uppercase mb-6">
            <BookOpen size={12} />
            Holy Quran
          </div>
          <h1 className="font-jakarta font-extrabold text-4xl sm:text-5xl text-text-primary mb-4">
            The Quran{" "}
            <span className="font-arabic-ui text-accent" dir="rtl" lang="ar">
              القرآن الكريم
            </span>
          </h1>
          <p className="font-inter text-text-secondary text-lg max-w-xl mx-auto mb-10">
            114 Surahs · 6,236 Ayahs · 30 Juz
          </p>

          <SearchInput
            value={query}
            onChange={setQuery}
            isLoading={isSearchingVerses}
            hint={verseHint}
          />

          {/* Segmented Tab Control */}
          <div className="inline-flex mt-6 p-1 rounded-full glass">
            <button
              onClick={() => setActiveTab("surahs")}
              className={`relative flex items-center gap-2 px-5 py-2 rounded-full font-medium text-sm transition-colors cursor-pointer ${
                activeTab === "surahs"
                  ? "text-accent"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {activeTab === "surahs" && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 bg-accent/10 border border-accent/20 rounded-full"
                  initial={false}
                  transition={{ type: "spring", damping: 20 }}
                />
              )}
              <BookOpen size={14} className="relative" />
              <span className="relative">Surahs</span>
            </button>
            <button
              onClick={() => setActiveTab("verses")}
              className={`relative flex items-center gap-2 px-5 py-2 rounded-full font-medium text-sm transition-colors cursor-pointer ${
                activeTab === "verses"
                  ? "text-accent"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {activeTab === "verses" && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 bg-accent/10 border border-accent/20 rounded-full"
                  initial={false}
                  transition={{ type: "spring", damping: 20 }}
                />
              )}
              <ScrollText size={14} className="relative" />
              <span className="relative">Ayahs</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeTab === "surahs" && (
            <motion.div
              key="surahs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {surahs.length === 0 ? (
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
                    </div>
                  ))}
                </div>
              ) : filteredSurahs.length > 0 ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {filteredSurahs.map((surah, i) => (
                    <SurahCard key={surah.id} surah={surah} index={i} />
                  ))}
                </div>
              ) : (
                <div className="text-center pt-20">
                  <p className="text-text-secondary">
                    No surahs found for &quot;{query}&quot;
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "verses" && (
            <motion.div
              key="verses"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              {debouncedQuery.trim().length <= 2 ? (
                <div className="text-center pt-20 text-text-secondary">
                  <p>Type at least 3 characters to search verses</p>
                </div>
              ) : verseResults.length > 0 ? (
                <div className="space-y-4">
                  {verseResults.map((result, i) => (
                    <VerseSearchResult
                      key={i}
                      result={result}
                      query={debouncedQuery}
                      index={i}
                    />
                  ))}
                </div>
              ) : !isSearchingVerses ? (
                <div className="text-center py-20 text-text-secondary">
                  <p>No verses found for &quot;{debouncedQuery}&quot;</p>
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
