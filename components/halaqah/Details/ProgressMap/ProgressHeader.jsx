import { motion } from "framer-motion";
import { BookOpen, Check, ListChecks, Search } from "lucide-react";

export default function ProgressHeader({
  totalAyahs,
  readAyahs,
  overallPct,
  members,
  colorMap,
  currentUserId,
  search,
  setSearch,
  surahSelectMode,
  onToggleSurahSelectMode,
}) {
  return (
    <div className="px-6 pt-6 pb-4 border-b border-(--surface-glass-border)">
      <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-accent" />
          <h3 className="font-jakarta font-bold text-text-primary text-sm">
            Progress Map
          </h3>
        </div>

        {/* Overall % badge + Select Surahs toggle */}
        <div className="flex items-center gap-2">
          <div className="text-xs text-text-secondary font-inter">
            {readAyahs} / {totalAyahs} ayahs
          </div>
          <div className="px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-bold font-mono text-accent">
            {overallPct}%
          </div>
          <motion.button
            layout
            transition={{ type: "spring", duration: 2 }}
            onClick={onToggleSurahSelectMode}
            title={
              surahSelectMode
                ? "Exit surah select mode"
                : "Select surahs to bulk mark"
            }
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-jakarta font-semibold border transition-colors duration-500 cursor-pointer ${
              surahSelectMode
                ? "bg-amber-500/20 border-amber-400/50 text-amber-400 hover:bg-amber-500/10 hover:border-amber-400/30 hover:text-amber-500/80"
                : "bg-white/5 border-(--surface-glass-border) text-text-secondary hover:text-amber-400 hover:border-amber-400/30"
            }`}
          >
            <ListChecks size={11} />
            {surahSelectMode ? "Exit Select" : "Select"}
          </motion.button>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="w-full h-1.5 rounded-full bg-(--surface-glass-border) overflow-hidden mb-4">
        <motion.div
          className="h-full rounded-full bg-linear-to-r from-accent to-teal-300"
          initial={{ width: 0 }}
          animate={{ width: `${overallPct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      {/* Member colour legend */}
      <div className="flex flex-wrap gap-3 mb-4 pb-4 border-b border-(--surface-glass-border)">
        {members.map((m) => {
          const color = colorMap[m.userId];
          return (
            <div
              key={m.userId}
              className="flex items-center gap-1.5 text-xs text-text-secondary font-inter"
            >
              <span
                className="size-2.5 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
              <span>
                {m.userId === currentUserId
                  ? `You (${m.name})`
                  : m.name || `...${m.userId.slice(-4)}`}
              </span>
            </div>
          );
        })}
      </div>

      {/* Instructions legend */}
      <div className="flex flex-wrap gap-4 text-[10px] text-text-secondary font-inter mb-4">
        <span className="flex items-center gap-1.5">
          <span className="size-3.5 rounded bg-accent/90 inline-flex items-center justify-center">
            <Check size={8} className="text-white" strokeWidth={3} />
          </span>
          Read by you (click to unmark)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3.5 rounded bg-accent/15 border border-accent/30" />
          Read by others
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3.5 rounded bg-violet-500/40 border border-violet-400/60" />
          Range preview
        </span>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={13}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary/50"
        />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter Surahs..."
          className="w-full glass rounded-lg pl-8 pr-4 py-2 text-xs font-inter text-text-primary placeholder-text-secondary/40 focus:outline-none focus:border-accent/40! transition-colors duration-500"
        />
      </div>
    </div>
  );
}
