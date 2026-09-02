import AnimatedSearchCloseIcon from "@/components/AnimatedSearchCloseIcon";
import { Search, Users } from "lucide-react";

export default function FullSurahToolbar({
  filteredReciters,
  availableStyles,
  styleFilter,
  setStyleFilter,
  search,
  setSearch,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div className="flex items-center gap-2 text-text-secondary">
        <Users size={15} />
        <span className="font-jakarta text-sm font-medium">
          {filteredReciters.length} Reciters available
        </span>
      </div>

      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
        {/* Style filter pills */}
        <div className="flex gap-2 flex-wrap">
          {availableStyles.map((style) => (
            <button
              key={style}
              onClick={() => setStyleFilter(style.split("·")[0].trim())}
              className={`text-xs px-3 py-1 rounded-full border font-medium transition-all duration-200 cursor-pointer ${
                styleFilter === style.split("·")[0].trim()
                  ? "bg-accent text-white border-transparent"
                  : "glass text-text-secondary hover:text-text-primary"
              }`}
            >
              {style === "all" ? "All styles" : style}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Sheikh..."
            className="pl-8 pr-3 py-1.5 rounded-xl glass font-inter text-xs text-text-primary placeholder:text-text-secondary/50 outline-none focus:border-accent/40 w-40 transition-colors"
          />

          <AnimatedSearchCloseIcon
            value={search}
            position="right-3"
            onChange={setSearch}
          />
        </div>
      </div>
    </div>
  );
}
