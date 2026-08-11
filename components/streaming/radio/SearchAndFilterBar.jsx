import { Search, SlidersHorizontal, X } from "lucide-react";

export default function SearchAndFilterBar({
  searchQuery,
  setSearchQuery,
  genres,
  activeGenre,
  setActiveGenre,
}) {
  return (
    <div className="mb-6 space-y-4">
      {/* Search input */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search stations, reciters, countries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-10 py-3 rounded-xl glass text-text-primary placeholder:text-text-secondary text-sm font-inter focus:outline-none transition-all duration-200"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/10 text-text-secondary transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Genre filter chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5">
        <SlidersHorizontal size={14} className="text-text-secondary shrink-0" />
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setActiveGenre(genre)}
            id={`radio-genre-${genre.replace(/\s+/g, "-").toLowerCase()}`}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeGenre === genre
                ? "bg-accent text-white shadow-[0_0_12px_var(--accent-glow)]"
                : "glass text-text-secondary hover:text-text-primary hover:bg-white/8 border border-white/8"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
}
