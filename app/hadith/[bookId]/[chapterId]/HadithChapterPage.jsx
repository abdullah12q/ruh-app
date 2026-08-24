"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Library, BookOpen, ChevronLeft } from "lucide-react";
import ChapterHeader from "@/components/hadith/chapter/ChapterHeader";
import HadithLanguageToggle from "@/components/hadith/chapter/HadithLanguageToggle";
import HadithCard from "@/components/hadith/chapter/HadithCard";
import HadithPagination from "@/components/hadith/chapter/HadithPagination";

const PAGE_SIZE = 30;

export default function HadithChapterPage({
  bookInfo,
  metadata,
  chapter,
  hadiths,
}) {
  const [langMode, setLangMode] = useState("both");
  const [page, setPage] = useState(0);

  const englishTitle = metadata?.english?.title ?? bookInfo.englishTitle;
  const arabicTitle = metadata?.arabic?.title ?? bookInfo.arabicTitle;
  const chapterEn = chapter?.english ?? "Chapter";
  const chapterAr = chapter?.arabic ?? "";

  const totalPages = Math.ceil(hadiths.length / PAGE_SIZE);
  const pageHadiths = useMemo(
    () => hadiths.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [hadiths, page],
  );

  function goPage(n) {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <div className="animate-fade-up">
          <nav className="flex items-center gap-2 text-sm text-text-secondary mb-8 font-jakarta flex-wrap">
            <Link
              href="/hadith"
              className="hover:text-accent transition-colors flex items-center gap-1"
            >
              <Library size={13} /> Hadith
            </Link>
            <span className="opacity-40">/</span>
            <Link
              href={`/hadith/${bookInfo.id}`}
              className="hover:text-accent transition-colors flex items-center gap-1 max-w-30 sm:max-w-none truncate"
            >
              <BookOpen size={13} />
              <span className="truncate">{englishTitle}</span>
            </Link>
            <span className="opacity-40">/</span>
            <span className="text-text-primary max-w-35 sm:max-w-none truncate">
              {chapterEn}
            </span>
          </nav>
          {/* Chapter Header */}
          <ChapterHeader
            chapterAr={chapterAr}
            englishTitle={englishTitle}
            arabicTitle={arabicTitle}
            chapterEn={chapterEn}
            hadiths={hadiths}
            totalPages={totalPages}
            page={page}
          />
        </div>

        {/* Language Toggle */}
        <HadithLanguageToggle langMode={langMode} setLangMode={setLangMode} />

        {/* Hadiths */}
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          {pageHadiths.map((hadith, i) => (
            <HadithCard
              key={hadith.id}
              hadith={hadith}
              index={i}
              langMode={langMode}
            />
          ))}
        </motion.div>

        {/* Pagination */}
        <HadithPagination page={page} totalPages={totalPages} goPage={goPage} />

        {/* Back to book */}
        <div className="text-center mt-8">
          <Link
            href={`/hadith/${bookInfo.id}`}
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors font-inter"
          >
            <ChevronLeft size={14} />
            Back to {englishTitle}
          </Link>
        </div>
      </div>
    </div>
  );
}
