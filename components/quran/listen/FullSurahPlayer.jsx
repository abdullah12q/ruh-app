"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FullSurahAudioPlayer from "./FullSurahAudioPlayer";
import { useDebounce } from "@/hooks/useDebounce";
import { getMoshafStyle } from "@/data/datas/audioData";
import SheikhGrid from "./SheikhGrid";
import FullSurahToolbar from "./FullSurahToolbar";

export default function FullSurahPlayer({ surah, reciters, surahId }) {
  const [fromSheikhCardClick, setFromSheikhCardClick] = useState(false);
  const [selectedReciter, setSelectedReciter] = useState(null);
  const [selectedMoshaf, setSelectedMoshaf] = useState(null);
  const [search, setSearch] = useState("");
  const [styleFilter, setStyleFilter] = useState("all");
  const debouncedSearch = useDebounce(search, 300);

  // Derive unique style filters from available reciters
  const availableStyles = useMemo(() => {
    const styles = new Set();
    reciters.forEach((r) =>
      r.moshaf.forEach((m) => {
        const s = getMoshafStyle(m.moshafType);
        styles.add(`${s.label} · ${s.labelAr}`);
      }),
    );
    return ["all", ...Array.from(styles)];
  }, [reciters]);

  const filteredReciters = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return reciters.filter((r) => {
      const matchesSearch =
        !q ||
        r.nameAr.includes(debouncedSearch) ||
        r.nameEn.toLowerCase().includes(q);

      const matchesStyle =
        styleFilter === "all" ||
        r.moshaf.some(
          (m) => getMoshafStyle(m.moshafType).label === styleFilter,
        );

      return matchesSearch && matchesStyle;
    });
  }, [reciters, debouncedSearch, styleFilter]);

  function handleSelectReciter(reciter, comingMoshaf = null) {
    if (selectedReciter?.id === reciter.id) return;
    setSelectedReciter(reciter);
    // Auto-select the first moshaf (prefer Murattal type=11)
    const preferred =
      reciter.moshaf.find((m) => String(m.moshafType) === "11") ||
      reciter.moshaf[0];
    setSelectedMoshaf(comingMoshaf ?? preferred);
    setFromSheikhCardClick(true);
  }

  const audioUrl = selectedMoshaf
    ? `${selectedMoshaf.server}${String(surahId).padStart(3, "0")}.mp3`
    : null;

  return (
    <div className="space-y-10">
      {/* Surah Hero */}
      <div className="relative text-center">
        {/* Ambient glow behind Arabic text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
          <div className="size-69 sm:size-96 rounded-full bg-accent/15 blur-3xl" />
        </div>

        <span
          className="font-quran text-6xl sm:text-8xl text-text-primary mb-3 drop-shadow-[0_0_30px_rgba(20,184,166,0.3)]"
          dir="rtl"
          lang="ar"
        >
          {surah.name_arabic}
        </span>
        <h1 className="font-jakarta font-extrabold text-2xl sm:text-3xl text-text-primary">
          Surah {surah.name_simple}
        </h1>
        <p className="font-inter text-text-secondary mt-2 text-sm">
          {surah.verses_count} verses ·{" "}
          {surah.revelation_place.charAt(0).toUpperCase() +
            surah.revelation_place.slice(1)}{" "}
          · Surah #{surah.id}
        </p>

        {selectedReciter && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 max-w-60 sm:max-w-max rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-semibold font-jakarta"
          >
            <span className="size-1.5 rounded-full bg-accent animate-pulse" />
            <span className="truncate">{selectedReciter.nameEn}</span>
            {selectedMoshaf && (
              <>
                <span>·</span>
                <span>{getMoshafStyle(selectedMoshaf.moshafType).label}</span>
                <span className="font-arabic-ui">
                  {getMoshafStyle(selectedMoshaf.moshafType).labelAr}
                </span>
              </>
            )}
          </motion.div>
        )}
      </div>

      {/* Sheikh Selector */}
      <div>
        {/* Toolbar */}
        <FullSurahToolbar
          filteredReciters={filteredReciters}
          availableStyles={availableStyles}
          styleFilter={styleFilter}
          setStyleFilter={setStyleFilter}
          search={search}
          setSearch={setSearch}
        />

        {/* Sheikh Grid */}
        <SheikhGrid
          filteredReciters={filteredReciters}
          selectedReciter={selectedReciter}
          selectedMoshaf={selectedMoshaf}
          handleSelectReciter={handleSelectReciter}
          setSelectedMoshaf={setSelectedMoshaf}
          debouncedSearch={debouncedSearch}
          styleFilter={styleFilter}
        />
      </div>

      {/* Sticky Audio Player */}
      <AnimatePresence>
        {selectedReciter && audioUrl && (
          <FullSurahAudioPlayer
            fromSheikhCardClick={fromSheikhCardClick}
            audioUrl={audioUrl}
            surah={surah}
            reciter={selectedReciter}
            moshaf={selectedMoshaf}
            getMoshafStyle={getMoshafStyle}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
