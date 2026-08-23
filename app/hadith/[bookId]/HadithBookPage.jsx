"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Library } from "lucide-react";
import BookHeader from "@/components/hadith/book/BookHeader";
import ChaptersList from "@/components/hadith/book/ChaptersList";
import HadithSearchBar from "@/components/hadith/HadithSearchBar";

export default function HadithBookPage({
  bookInfo,
  metadata,
  chapters,
  chapterCounts,
}) {
  const [query, setQuery] = useState("");

  const englishTitle = metadata?.english?.title ?? bookInfo.englishTitle;
  const arabicTitle = metadata?.arabic?.title ?? bookInfo.arabicTitle;
  const englishAuthor = metadata?.english?.author ?? bookInfo.author;
  const arabicAuthor = metadata?.arabic?.author ?? bookInfo.author;

  const filteredChapters = useMemo(() => {
    if (!query.trim()) return chapters;
    const q = query.toLowerCase();
    return chapters.filter(
      (c) => c.english?.toLowerCase().includes(q) || c.arabic?.includes(query),
    );
  }, [chapters, query]);

  const totalHadiths = Object.values(chapterCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 animate-fade-up">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-secondary mb-8 font-jakarta flex-wrap">
          <Link
            href="/hadith"
            className="hover:text-accent transition-colors flex items-center gap-1"
          >
            <Library size={13} /> Hadith
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-text-primary max-w-50 sm:max-w-max truncate">
            {englishTitle}
          </span>
        </nav>

        {/* Book Header */}
        <BookHeader
          arabicTitle={arabicTitle}
          bookInfo={bookInfo}
          englishTitle={englishTitle}
          englishAuthor={englishAuthor}
          arabicAuthor={arabicAuthor}
          totalHadiths={totalHadiths}
          chapters={chapters}
        />

        {/* Chapter Search */}
        <HadithSearchBar
          margin="mb-6"
          value={query}
          onChange={setQuery}
          placeholder="Search chapters…"
        />

        {/* Chapters List */}
        <ChaptersList
          filteredChapters={filteredChapters}
          query={query}
          chapterCounts={chapterCounts}
          bookInfo={bookInfo}
        />
      </div>
    </div>
  );
}
