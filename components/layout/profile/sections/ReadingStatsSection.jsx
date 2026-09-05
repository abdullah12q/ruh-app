import { BarChart2, Bookmark, Star, BookOpen } from "lucide-react";
import useUIStore from "@/lib/store/useUIStore";
import Link from "next/link";
import surahMeta from "@/data/surahMeta";

export default function ReadingStatsSection({ onClose }) {
  const {
    lastRead,
    recentReads,
    favoriteReciters,
    bookmarkedAyahs,
    mushafMode,
  } = useUIStore();

  const bookmarkCount = bookmarkedAyahs.length;
  const favCount = favoriteReciters.length;

  // Most recent read
  const latestRead = recentReads?.[0] ?? lastRead ?? null;
  const lastSurah = latestRead
    ? surahMeta.find((s) => s.id === latestRead.surahId)
    : null;

  const stats = [
    {
      icon: Bookmark,
      label: "Bookmarks",
      value: bookmarkCount,
      color: "text-teal-400",
      bg: "bg-teal-500/10",
    },
    {
      icon: Star,
      label: "Fav Reciters",
      value: favCount,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
  ];

  const currentPage = latestRead?.currentPage ?? null;

  const baseUrl = `/quran/${lastSurah?.id}`;
  const extraUrl =
    mushafMode && currentPage
      ? `?page=${currentPage}`
      : latestRead?.ayahNumber && !mushafMode
        ? `#ayah-${latestRead?.ayahNumber}`
        : "";

  return (
    <div className="px-5 py-4 space-y-3">
      {/* Section Title */}
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-lg bg-accent/10 flex items-center justify-center">
          <BarChart2 size={13} className="text-accent" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">
          Reading Stats
        </span>
      </div>

      {/* Stat chips */}
      <div className="grid grid-cols-2 gap-2">
        {stats.map(({ icon: Icon, label, value, color, bg }) => (
          <div
            key={label}
            className="glass rounded-xl px-4 py-3 flex items-center gap-3"
          >
            <div
              className={`size-8 rounded-lg ${bg} flex items-center justify-center shrink-0`}
            >
              <Icon size={14} className={color} />
            </div>
            <div className="min-w-0">
              <p className={`text-lg font-extrabold font-jakarta ${color}`}>
                {value}
              </p>
              <p className="text-[10px] text-text-secondary leading-tight">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Last read surah */}
      {lastSurah && (
        <Link
          href={`${baseUrl}${extraUrl}`}
          onClick={onClose}
          className="flex items-center gap-3 glass rounded-xl px-4 py-3 hover:border-accent/30 transition-colors group"
          aria-label={`Continue reading ${lastSurah.nameAr}`}
        >
          <div className="size-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
            <BookOpen size={14} className="text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-text-secondary">Continue reading</p>
            <p className="text-sm font-semibold text-text-primary truncate">
              {lastSurah.name}{" "}
              <span className="text-xs font-arabic-ui">
                {" "}
                · {lastSurah.nameAr}
              </span>
              {latestRead?.ayahNumber && (
                <span className="text-text-secondary font-normal text-xs">
                  {" "}
                  · Ayah {latestRead.ayahNumber}
                </span>
              )}
            </p>
          </div>
          <span className="text-accent text-xs font-bold group-hover:translate-x-0.5 transition-transform">
            →
          </span>
        </Link>
      )}
    </div>
  );
}
