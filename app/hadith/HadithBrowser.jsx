"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Library } from "lucide-react";
import {
  HADITH_COLLECTIONS,
  BOOKS_BY_COLLECTION,
  TABS,
  TOTAL_HADITHS,
  TOTAL_BOOKS,
} from "@/data/datas/hadithData";
import BooksTabs from "@/components/hadith/BooksTabs";
import HadithSearchBar from "@/components/hadith/HadithSearchBar";
import HadithBookCard from "@/components/hadith/HadithBookCard";
import ActiveTabDescription from "@/components/hadith/ActiveTabDescription";

export default function HadithBrowser() {
  const [activeTab, setActiveTab] = useState(HADITH_COLLECTIONS.NINE_BOOKS);
  const [query, setQuery] = useState("");

  const activeTabInfo = TABS.find((t) => t.id === activeTab);
  const currentBooks = useMemo(
    () => BOOKS_BY_COLLECTION[activeTab] ?? [],
    [activeTab],
  );

  const filteredBooks = useMemo(() => {
    if (!query.trim()) return currentBooks;
    const q = query.toLowerCase();
    return currentBooks.filter(
      (b) =>
        b.englishTitle.toLowerCase().includes(q) ||
        b.arabicTitle.includes(query) ||
        b.author.toLowerCase().includes(q),
    );
  }, [currentBooks, query]);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 animate-fade-up">
      <div className="max-w-6xl mx-auto">
        {/* Hero Header */}
        <div className="relative text-center mb-12">
          {/* Ghost Arabic watermark */}
          <span
            className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-0 sm:-translate-y-25 font-quran text-[4rem] sm:text-[10rem] text-accent opacity-5 whitespace-nowrap -z-10"
            dir="rtl"
            lang="ar"
          >
            الحديث النبوي
          </span>

          {/* Collection pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-accent text-xs font-semibold tracking-wider uppercase mb-6">
            <Library size={12} />
            Hadith Library
          </div>

          <h1 className="font-jakarta font-extrabold text-4xl sm:text-5xl text-text-primary mb-3">
            The Hadith{" "}
            <span className="font-arabic-ui text-accent" dir="rtl" lang="ar">
              أحاديث
            </span>
          </h1>
          <p className="font-inter text-text-secondary text-lg max-w-xl mx-auto mb-2">
            {TOTAL_BOOKS} Books · Over {TOTAL_HADITHS} Hadiths
          </p>
          <p className="font-inter text-text-secondary/60 text-sm max-w-md mx-auto mb-8">
            The recorded sayings, actions, and approvals of the Prophet Muhammad
            ﷺ
          </p>

          {/* Search */}
          <HadithSearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search books by title or author…"
          />
        </div>

        {/* Collection Stats Row */}
        <BooksTabs
          TABS={TABS}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setQuery={setQuery}
          BOOKS_BY_COLLECTION={BOOKS_BY_COLLECTION}
        />

        {/* Active Tab Description */}
        <ActiveTabDescription
          activeTab={activeTab}
          activeTabInfo={activeTabInfo}
          query={query}
          filteredBooks={filteredBooks}
        />

        {/* Book Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
          >
            {filteredBooks.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
                {filteredBooks.map((book) => (
                  <HadithBookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-text-secondary font-inter">
                  No books found for &quot;{query}&quot;
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
