import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ChaptersList({
  filteredChapters,
  query,
  chapterCounts,
  bookInfo,
}) {
  return (
    <div className="space-y-2">
      {filteredChapters.length === 0 && (
        <p className="text-center py-10 text-text-secondary font-inter">
          No chapters found for &quot;{query}&quot;
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredChapters.map((chapter, i) => {
          const count = chapterCounts[chapter.id] ?? 0;
          return (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.4) }}
            >
              <div className="glass rounded-2xl overflow-hidden">
                {/* Chapter row */}
                <Link
                  href={`/hadith/${bookInfo.id}/${chapter.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-accent/5 transition-colors duration-500 group cursor-pointer"
                >
                  {/* Chapter number */}
                  <span className="shrink-0 size-8 rounded-lg bg-accent/10 text-accent text-xs font-jakarta font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  {/* Chapter titles */}
                  <div className="flex-1 min-w-0">
                    <p className="font-jakarta font-semibold text-sm text-text-primary group-hover:text-accent transition-colors truncate">
                      {chapter.english ?? "Untitled Chapter"}
                    </p>
                    {chapter.arabic && (
                      <p
                        className="font-arabic-ui text-sm text-text-secondary mt-0.5 truncate"
                        dir="rtl"
                        lang="ar"
                      >
                        {chapter.arabic}
                      </p>
                    )}
                  </div>
                  {/* Hadith count */}
                  <span className="shrink-0 text-xs font-inter text-text-secondary bg-accent/5 px-2.5 py-1 rounded-full">
                    {count} hadith{count !== 1 ? "s" : ""}
                  </span>
                  <ChevronRight
                    size={15}
                    className="shrink-0 text-text-secondary group-hover:text-accent group-hover:translate-x-1 transition-all duration-300"
                  />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
