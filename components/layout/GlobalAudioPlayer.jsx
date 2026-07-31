"use client";

import { AnimatePresence } from "framer-motion";
import FullSurahAudioPlayer from "@/components/quran/listen/FullSurahAudioPlayer";
import useUIStore from "@/lib/store/useUIStore";

export default function GlobalAudioPlayer() {
  const { globalPlayer } = useUIStore();

  return (
    <AnimatePresence>
      {globalPlayer && (
        <div className="pt-25">
          <FullSurahAudioPlayer
            key={globalPlayer.audioUrl} // re-mount player when track changes
            audioUrl={globalPlayer.audioUrl}
            surah={globalPlayer.surah}
            reciter={globalPlayer.reciter}
            moshaf={globalPlayer.moshaf}
          />
        </div>
      )}
    </AnimatePresence>
  );
}
