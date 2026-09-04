import { Bookmark, BookmarkCheck } from "lucide-react";
import useUIStore from "@/lib/store/useUIStore";

export default function BookmarksSection({ onOpenBookmarks }) {
  const { bookmarkedAyahs } = useUIStore();
  const count = bookmarkedAyahs.length;

  return (
    <div className="px-5 py-4 space-y-3">
      {/* Section Title */}
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-lg bg-accent/10 flex items-center justify-center">
          <Bookmark size={13} className="text-accent" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">
          Bookmarks
        </span>
      </div>

      {/* Card */}
      <button
        onClick={onOpenBookmarks}
        className="w-full flex items-center justify-between glass rounded-xl px-4 py-3 hover:border-accent/30 transition-all duration-200 group cursor-pointer"
        aria-label="Open bookmarks drawer"
      >
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <BookmarkCheck size={15} className="text-accent" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-text-primary">
              Saved Ayahs
            </p>
            <p className="text-xs text-text-secondary">
              {count === 0
                ? "No bookmarks yet"
                : `${count} ayah${count !== 1 ? "s" : ""} bookmarked`}
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-accent group-hover:translate-x-0.5 transition-transform duration-400">
          View →
        </span>
      </button>
    </div>
  );
}
