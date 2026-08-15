"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useUIStore from "@/lib/store/useUIStore";
import BismillahCard from "./BismillahCard";
import MushafView from "./mushaf/mushafView/MushafView";
import AyahList from "./ayahList/AyahList";

export default function ReadSurah({ surahId, verses }) {
  const { setAudioPlaying, mushafMode } = useUIStore();

  // Stop global audio when leaving the Surah page
  useEffect(() => {
    return () => {
      setAudioPlaying(false);
    };
  }, [setAudioPlaying]);

  return (
    <>
      {/* Bismillah card only in normal mode, not in mushaf mode */}
      <AnimatePresence>
        {!mushafMode && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden"
          >
            <BismillahCard surahId={surahId} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {mushafMode ? (
          // Mushaf Mode: page-by-page Madani layout.
          <motion.div
            key="mushaf"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <MushafView />
          </motion.div>
        ) : (
          // Normal Mode: Ayah-by-Ayah card list
          <motion.div
            key="ayahList"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <AyahList verses={verses} surahId={surahId} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
