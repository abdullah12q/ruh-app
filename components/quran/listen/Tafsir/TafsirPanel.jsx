import { AnimatePresence } from "framer-motion";
import { BookOpen } from "lucide-react";
import useUIStore from "@/lib/store/useUIStore";
import SegmentCard from "./SegmentCard";

// ht7wl el tafsir le reciter object 3shan yb2a zay reciter el asly fa setGlobalPlayer my7slsh feha error
function makeTafsirReciter(tafsirSegmentName) {
  return {
    id: "tafsir",
    nameEn: " Audio Tafsir",
    nameAr: tafsirSegmentName || "الخلاصة من تفسير الطبري",
    segmentId: tafsirSegmentName.split("الايات")[1] ?? null,
    letter: "ت",
    letterEn: "T",
  };
}

export default function TafsirPanel({ segments, tafsirName, surah }) {
  const { globalPlayer, setGlobalPlayer } = useUIStore();

  // A segment is "active" when it is currently loaded in the global player
  const activeUrl = globalPlayer?.audioUrl;

  function handlePlay(segment) {
    const tafsirReciter = makeTafsirReciter(segment.name);
    setGlobalPlayer({
      audioUrl: segment.url,
      surah,
      reciter: tafsirReciter,
      moshaf: null,
    });
  }

  return (
    <div className="space-y-6">
      {/* Panel header */}
      <div className="text-center relative">
        {/* Ambient glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
          <div className="size-64 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-accent text-xs font-semibold tracking-wider uppercase mb-4">
          <BookOpen size={12} />
          Audio Tafsir
        </div>

        <p
          className="font-quran text-2xl text-text-secondary mb-1"
          dir="rtl"
          lang="ar"
        >
          {tafsirName || "الخلاصة من تفسير الطبري"}
        </p>
        <p className="font-inter text-xs text-text-secondary/60">
          {segments.length} segment{segments.length !== 1 ? "s" : ""} available
          for {surah.name_simple}
        </p>
      </div>

      {/* Segment list */}
      {segments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 glass rounded-2xl gap-4">
          <BookOpen size={32} className="text-text-secondary/40" />
          <p className="font-jakarta text-sm text-text-secondary text-center max-w-xs">
            No tafsir audio available for Surah {surah.name_simple} yet.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {segments.map((seg, i) => {
              const isActive = seg.url === activeUrl;

              return (
                <SegmentCard
                  key={seg.id}
                  seg={seg}
                  i={i}
                  handlePlay={handlePlay}
                  isActive={isActive}
                />
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
