"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "@/hooks/useDebounce";
import useUIStore from "@/lib/store/useUIStore";
import { getMoshafStyle } from "@/data/datas/audioData";
import SheikhGrid from "./Recitation/SheikhGrid";
import FullSurahToolbar from "./Recitation/FullSurahToolbar";
import TafsirPanel from "./Tafsir/TafsirPanel";
import ModeToggle from "./ModeToggle";

export default function FullSurahPlayer({
  surah,
  reciters,
  surahId,
  tafsirSegments = [],
  tafsirName = "",
}) {
  const [activeMode, setActiveMode] = useState("recitation");
  const [search, setSearch] = useState("");
  const [styleFilter, setStyleFilter] = useState("all");

  const debouncedSearch = useDebounce(search, 300);
  const { globalPlayer, setGlobalPlayer } = useUIStore();

  const isThisPageActive = globalPlayer?.surah?.id === surah.id;
  const activeReciter = isThisPageActive ? globalPlayer?.reciter : null;
  const activeMoshaf = isThisPageActive ? globalPlayer?.moshaf : null;

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
    // Auto-select the first moshaf (prefer Murattal type=11)
    const preferred =
      reciter.moshaf.find((m) => String(m.moshafType) === "11") ||
      reciter.moshaf[0];
    const moshaf = comingMoshaf ?? preferred;

    if (activeReciter?.id === reciter.id && activeMoshaf?.id === moshaf.id)
      return;

    const audioUrl = `${moshaf.server}${String(surahId).padStart(3, "0")}.mp3`;

    // Push to global store so the player survives navigation
    setGlobalPlayer({ audioUrl, surah, reciter, moshaf });
  }

  const activeMoshafStyle = activeMoshaf
    ? getMoshafStyle(activeMoshaf.moshafType)
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

        {activeReciter && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 max-w-60 sm:max-w-max rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-semibold font-jakarta"
          >
            <span className="size-1.5 rounded-full bg-accent animate-pulse" />
            <span className="truncate">{activeReciter.nameEn}</span>
            {activeMoshafStyle && (
              <>
                <span>·</span>
                <span>{activeMoshafStyle.label}</span>
                <span className="font-arabic-ui">
                  {activeMoshafStyle.labelAr}
                </span>
              </>
            )}
          </motion.div>
        )}
      </div>

      {/* Mode Toggle */}
      <ModeToggle activeMode={activeMode} setActiveMode={setActiveMode} />

      {/* Mode Content */}
      <AnimatePresence mode="popLayout">
        {activeMode === "recitation" ? (
          <motion.div
            key="recitation"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
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
              selectedReciter={activeReciter}
              selectedMoshaf={activeMoshaf}
              handleSelectReciter={handleSelectReciter}
              debouncedSearch={debouncedSearch}
              styleFilter={styleFilter}
            />
          </motion.div>
        ) : (
          <motion.div
            key="tafsir"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <TafsirPanel
              segments={tafsirSegments}
              tafsirName={tafsirName}
              surah={surah}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
