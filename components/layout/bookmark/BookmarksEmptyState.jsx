import { motion } from "framer-motion";
import { Bookmark, BookOpen } from "lucide-react";
import Link from "next/link";

export default function BookmarksEmptyState({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center h-full py-16 px-6 text-center"
    >
      {/* Bookmark Icon */}
      <div className="relative mb-6">
        <div className="size-20 rounded-3xl glass border-accent/15! flex items-center justify-center">
          <Bookmark size={28} className="text-accent/50" strokeWidth={1.5} />
        </div>
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-3xl bg-accent/5 blur-xl -z-10" />
      </div>

      <h3 className="font-jakarta font-semibold text-base text-text-primary mb-2">
        No bookmarks yet
      </h3>
      <p className="font-inter text-sm text-text-secondary/70 max-w-50 leading-relaxed mb-6">
        Tap the{" "}
        <Bookmark
          size={12}
          className="inline text-accent"
          fill="currentColor"
        />{" "}
        icon on any ayah while reading to save it here.
      </p>

      {/* CTA */}
      <Link
        href="/quran"
        onClick={() => {
          setTimeout(() => {
            onClose();
          }, 750);
        }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 border border-accent/20 text-accent text-sm font-medium font-jakarta hover:bg-accent/20 transition-all duration-200"
      >
        <BookOpen size={14} />
        Open Quran
      </Link>
    </motion.div>
  );
}
