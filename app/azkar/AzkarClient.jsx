"use client";

import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useAzkarStore from "@/lib/store/useAzkarStore";
import { CategorySidebar } from "../../components/azkar/CategorySidebar";
import { MobileCategoryTabs } from "../../components/azkar/MobileCategoryTabs";
import { AzkarProgress } from "../../components/azkar/AzkarProgress";
import { CategoryGrid } from "../../components/azkar/CategoryGrid";

export default function AzkarClient({ categories }) {
  const {
    activeCategory,
    setActiveCategory,
    progress,
    decrementThikr,
    resetThikr,
    resetCategory,
    resetAll,
    getCategoryItems,
    getCategoryProgress,
  } = useAzkarStore();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    return categories.filter((cat) => cat.title.includes(searchQuery.trim()));
  }, [categories, searchQuery]);

  const validIds = useMemo(
    () => new Set(categories.map((c) => c.id)),
    [categories],
  );

  // Guard: if persisted category no longer exists, fall back to first
  const safeCategory = useMemo(() => {
    if (activeCategory && validIds.has(activeCategory.id))
      return activeCategory;
    return categories[0] ?? null;
  }, [activeCategory, validIds, categories]);

  const handleSelect = useCallback(
    (cat) => {
      setActiveCategory(cat);

      // Scroll the main content area to top on category switch
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 10);
    },
    [setActiveCategory],
  );

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8" dir="rtl">
      {/* Hero header */}
      <div className="relative overflow-hidden py-16 px-4 text-center">
        {/* Ambient glow */}
        <motion.div
          animate={{ opacity: [0.5, 1], y: [-20, 0] }}
          transition={{ duration: 0.6 }}
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, var(--accent-glow) 0%, transparent 70%)",
          }}
        />
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative text-4xl sm:text-5xl font-bold font-arabic-ui text-text-primary mb-3"
          lang="ar"
        >
          الأذكار
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative text-text-secondary font-quran text-center! text-xl -my-2"
          lang="ar"
        >
          اُذْكُرِ اللَّهَ يَذْكُرْكَ
        </motion.p>
      </div>

      {/* Page body */}
      <div className="max-w-6xl mx-auto px-4 pb-24 flex gap-8 items-start">
        {/* Desktop sidebar */}
        <CategorySidebar
          resetAll={resetAll}
          categories={filteredCategories}
          activeCategory={safeCategory}
          onSelect={handleSelect}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Mobile tabs */}
          <MobileCategoryTabs
            resetAll={resetAll}
            categories={filteredCategories}
            activeCategory={safeCategory}
            onSelect={handleSelect}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {/* Progress strip */}
          <AzkarProgress
            getCategoryProgress={getCategoryProgress}
            categoryId={safeCategory.id}
            categoryTitle={safeCategory.title}
            resetCategory={resetCategory}
          />

          {/* Thikr grid with page transition */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={safeCategory.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CategoryGrid
                progress={progress}
                getCategoryItems={getCategoryItems}
                categoryId={safeCategory.id}
                decrementThikr={decrementThikr}
                resetThikr={resetThikr}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
