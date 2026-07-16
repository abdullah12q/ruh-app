"use client";

import useUIStore from "@/lib/store/useUIStore";
import AyahCard from "./AyahCard";
import { useEffect } from "react";

export default function AyahList({ verses, surahId }) {
  const { setAudioPlaying } = useUIStore();

  // Stop global audio when leaving the Surah page
  useEffect(() => {
    return () => {
      setAudioPlaying(false);
    };
  }, [setAudioPlaying]);

  return (
    <div className="space-y-4">
      {verses.map((ayah) => (
        <AyahCard
          key={ayah.id}
          totalVerses={verses.length}
          ayah={ayah}
          surahId={surahId}
        />
      ))}
    </div>
  );
}
