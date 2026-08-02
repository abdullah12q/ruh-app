"use client";

import { useEffect, useMemo, useState } from "react";
import { Radio, Search } from "lucide-react";
import { motion } from "framer-motion";
import RadioCard from "./RadioCard";
import StreamingHeader from "../StreamingHeader";
import StreamingFooter from "../StreamingFooter";
import StreamingActivePlayer from "../StreamingActivePlayer";
import StreamingGrid from "../StreamingGrid";
import NoStreamingState from "../NoStreamingState";
import SearchAndFilterBar from "./SearchAndFilterBar";

export default function RadioBrowser({ stations }) {
  const [activeStation, setActiveStation] = useState(
    stations.length > 0 ? stations[0] : null,
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState("All");

  // Extract unique genres from all stations
  function extractGenres(stations) {
    const genreSet = new Set();
    stations.forEach((s) => {
      if (Array.isArray(s.genre)) s.genre.forEach((g) => genreSet.add(g));
    });
    return ["All", ...Array.from(genreSet).sort()];
  }

  const genres = useMemo(() => extractGenres(stations), [stations]);

  // Update tab title dynamically
  useEffect(() => {
    if (activeStation) {
      document.title = `${activeStation.name} — Radio | Rُuh`;
    }
  }, [activeStation]);

  // Filter stations based on search + genre
  const filteredStations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return stations.filter((s) => {
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        (s.nameAr && s.nameAr.includes(searchQuery.trim())) ||
        (s.country && s.country.toLowerCase().includes(q)) ||
        (Array.isArray(s.genre) &&
          s.genre.some((g) => g.toLowerCase().includes(q)));

      const matchesGenre =
        activeGenre === "All" ||
        (Array.isArray(s.genre) && s.genre.includes(activeGenre));

      return matchesSearch && matchesGenre;
    });
  }, [stations, searchQuery, activeGenre]);

  function handleCardClick(station) {
    if (activeStation?.id !== station.id) {
      setActiveStation(station);
      setIsPlaying(true);
    }
  }

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <StreamingHeader isRadio radioStations={stations} />

        {/* No Stations State */}
        {stations.length === 0 && (
          <NoStreamingState
            Icon={Radio}
            title="Stations"
            subTitle="radio stations"
          />
        )}

        {stations.length > 0 && (
          <>
            {/* Active Player */}
            <StreamingActivePlayer
              activePlayer={activeStation}
              setActivePlayer={setActiveStation}
              setIsPlaying={setIsPlaying}
            />

            {/* Search + Filter Bar */}
            <SearchAndFilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              genres={genres}
              activeGenre={activeGenre}
              setActiveGenre={setActiveGenre}
            />

            {/* Station Grid */}
            <StreamingGrid
              Icon={Radio}
              type="Station"
              count={filteredStations.length}
            >
              {filteredStations.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="inline-flex items-center justify-center size-16 rounded-full glass mb-4">
                    <Search size={24} className="text-text-secondary" />
                  </div>
                  <p className="font-jakarta font-semibold text-text-primary mb-1">
                    No stations found
                  </p>
                  <p className="text-text-secondary text-sm font-inter">
                    Try a different search or genre filter.
                  </p>
                </motion.div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredStations.map((station, index) => (
                    <RadioCard
                      key={station.id}
                      station={station}
                      isActive={activeStation?.id === station.id}
                      isPlaying={isPlaying && activeStation?.id === station.id}
                      onClick={() => handleCardClick(station)}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </StreamingGrid>

            {/* Footer */}
            <StreamingFooter
              Icon={Radio}
              title="24/7 Islamic Radio"
              subTitle="Stations stream continuously. Click any card to tune in."
            />
          </>
        )}
      </div>
    </div>
  );
}
