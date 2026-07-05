"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, X, Mic } from "lucide-react";
import { dropdownVariants } from "@/data/animationVariants";
import ReciterRow from "./ReciterRow";

export default function ReciterDropdown({
  reciters,
  selectedReciter,
  favoriteReciters,
  onSelect,
  onToggleFavorite,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Auto-focus search when dropdown opens
  useEffect(() => {
    if (dropdownOpen) {
      setTimeout(() => searchRef.current?.focus(), 80);
    }
  }, [dropdownOpen]);

  function handleSelect(reciter) {
    onSelect(reciter);
    setDropdownOpen(false);
    setSearch("");
  }

  // Filter and split by favorites
  const q = search.trim().toLowerCase();
  const filtered = reciters.filter(
    (r) =>
      r.name.toLowerCase().includes(q) || r.nameArabic.includes(search.trim()),
  );
  const favSet = new Set(favoriteReciters);
  const favoritesInList = filtered.filter((r) => favSet.has(r.id));
  const othersInList = filtered.filter((r) => !favSet.has(r.id));

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        id="reciter-dropdown-trigger"
        onClick={() => setDropdownOpen((p) => !p)}
        aria-haspopup="listbox"
        aria-expanded={dropdownOpen}
        aria-label="Select reciter"
        className="flex items-center gap-2 glass rounded-xl px-3 py-2 text-xs text-text-secondary hover:text-text-primary transition-all cursor-pointer min-w-40 max-w-55"
      >
        <Mic size={13} className="text-accent shrink-0" />
        <span className="truncate flex-1 text-left font-medium text-text-primary">
          {selectedReciter?.name ?? "Select Reciter"}
        </span>
        <motion.span
          animate={{ rotate: dropdownOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown size={13} />
        </motion.span>
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute top-full mt-2 left-0 z-50 w-72 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            style={{
              background:
                "linear-gradient(135deg, rgba(10,10,14,0.96) 0%, rgba(20,20,28,0.96) 100%)",
              backdropFilter: "blur(24px)",
            }}
            role="listbox"
            aria-label="Reciters list"
          >
            {/* Search bar */}
            <div className="p-3 border-b border-white/5">
              <div className="flex items-center px-3 py-2 gap-2 rounded-xl bg-white/5 border-2 border-transparent focus-within:border-accent transition-colors">
                <Search size={13} className="text-text-secondary shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search reciter…"
                  className="bg-transparent text-xs text-text-primary placeholder:text-text-secondary/60 outline-0 flex-1"
                  aria-label="Search reciters"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X size={11} />
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="max-h-72 overflow-y-auto py-2">
              {filtered.length === 0 && (
                <p className="text-center text-xs text-text-secondary py-6 px-4">
                  No reciters found
                </p>
              )}

              {/* Favorites section */}
              {favoritesInList.length > 0 && (
                <>
                  <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-accent/70">
                    ★ Favorites
                  </p>
                  {favoritesInList.map((reciter) => (
                    <ReciterRow
                      key={reciter.id}
                      reciter={reciter}
                      isSelected={selectedReciter?.id === reciter.id}
                      isFavorite
                      onSelect={handleSelect}
                      onToggleFavorite={onToggleFavorite}
                    />
                  ))}
                  {othersInList.length > 0 && (
                    <div className="mx-3 my-2 border-t border-white/5" />
                  )}
                </>
              )}

              {/* All reciters */}
              {othersInList.length > 0 && (
                <>
                  {favoritesInList.length > 0 && (
                    <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-text-secondary/50">
                      All Reciters
                    </p>
                  )}
                  {othersInList.map((reciter) => (
                    <ReciterRow
                      key={reciter.id}
                      reciter={reciter}
                      isSelected={selectedReciter?.id === reciter.id}
                      isFavorite={false}
                      onSelect={handleSelect}
                      onToggleFavorite={onToggleFavorite}
                    />
                  ))}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
