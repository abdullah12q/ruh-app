import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cardVariant } from "@/data/animationVariants";
import BookmarksDrawer from "@/components/layout/bookmark/BookmarksDrawer";
import { useEffect, useState } from "react";

export default function FeatureCard({ feature }) {
  const {
    icon: Icon,
    title,
    titleAr,
    description,
    href,
    gradient,
    iconColor,
  } = feature;

  const [bookmarksOpen, setBookmarksOpen] = useState(false);

  // Lock body scroll when bookmarks drawer is open
  useEffect(() => {
    document.body.style.overflow = bookmarksOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [bookmarksOpen]);

  const wrapperClasses =
    "group block w-full text-left glass rounded-2xl p-6 h-full hover:border-(--accent)/30 transition-all duration-300 relative overflow-hidden cursor-pointer";

  const CardContent = (
    <>
      {/* Background gradient tint */}
      <div
        className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}
      />

      <div className="relative z-10">
        {/* Icon */}
        <div className="flex justify-center sm:justify-start">
          <div
            className={`size-11 rounded-xl glass flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${iconColor}`}
          >
            <Icon size={20} />
          </div>
        </div>

        {/* Title */}
        <div className="flex items-baseline justify-center sm:justify-start gap-2 mb-2">
          <h3 className="text-base font-bold text-text-primary font-jakarta">
            {title}
          </h3>
          <span className="text-sm text-text-secondary font-arabic-ui">
            {titleAr}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-text-secondary text-center sm:text-start font-inter leading-relaxed">
          {description}
        </p>

        {/* CTA Arrow */}
        <div className="mt-4 flex items-center gap-1 text-accent text-sm font-medium font-jakarta opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-300">
          Explore <ChevronRight size={14} />
        </div>
      </div>
    </>
  );

  return (
    <motion.div variants={cardVariant}>
      {href ? (
        <Link href={href} className={wrapperClasses}>
          {CardContent}
        </Link>
      ) : (
        // mfesh href y3ny deh el card bt3t el bookmark fa yft7 el drawer bt3ha
        <button
          onClick={() => setBookmarksOpen(true)}
          className={wrapperClasses}
        >
          {CardContent}
        </button>
      )}

      {!href && (
        <BookmarksDrawer
          isOpen={bookmarksOpen}
          onClose={() => setBookmarksOpen(false)}
        />
      )}
    </motion.div>
  );
}
