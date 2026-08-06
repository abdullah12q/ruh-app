import { notFound } from "next/navigation";
import Link from "next/link";
import { BookOpen, Headphones } from "lucide-react";
import FullSurahPlayer from "@/components/quran/listen/FullSurahPlayer";
import { getSurah } from "../../[surahId]/page";

// Fetch reciters in Arabic and English from mp3quran.net
// Merge both responses so each reciter has both nameArabic and nameEnglish
async function getReciters() {
  try {
    const [arRes, enRes] = await Promise.all([
      fetch("https://www.mp3quran.net/api/v3/reciters", {
        next: { revalidate: 3600 },
      }),
      fetch("https://www.mp3quran.net/api/v3/reciters?language=eng", {
        next: { revalidate: 3600 },
      }),
    ]);

    if (!arRes.ok || !enRes.ok) throw new Error("Failed to fetch reciters");

    const [arData, enData] = await Promise.all([arRes.json(), enRes.json()]);

    // Build a map from id -> English name w el letter bta3o
    const enMap = new Map(
      enData.reciters.map((r) => [
        r.id,
        { nameEn: r.name, letterEn: r.letter },
      ]),
    );

    // Merge: 3shan yb2a 3ndy english w 3rby
    const merged = arData.reciters.map((reciter) => ({
      id: reciter.id,
      nameAr: reciter.name,
      nameEn: enMap.get(reciter.id)?.nameEn ?? reciter.name,
      letter: reciter.letter,
      letterEn: enMap.get(reciter.id)?.letterEn ?? reciter.letter,
      moshaf: reciter.moshaf.map((m) => ({
        id: m.id,
        nameAr: m.name,
        server: m.server,
        surahTotal: m.surah_total,
        moshafType: m.moshaf_type,
        surahList: m.surah_list ? m.surah_list.split(",").map(Number) : [],
      })),
    }));

    // Sort elshyo5 by English name first
    return merged.sort((a, b) => a.nameEn.localeCompare(b.nameEn));
  } catch (error) {
    console.error("Reciters fetch error:", error);
    return [];
  }
}

// Fetch tafsir audio segments from mp3quran.net and filter by surahId
async function getTafsirSegments(surahId) {
  try {
    const res = await fetch("https://www.mp3quran.net/api/v3/tafsir", {
      next: { revalidate: 86400 }, // cache for 24 hours
    });

    if (!res.ok) throw new Error("Failed to fetch tafsir");

    const data = await res.json();
    const tafsirName = data.tafasir?.name ?? "";
    const allSegments = data.tafasir?.soar ?? [];

    // Filter to only segments for this surah
    const segments = allSegments
      .filter((s) => s.sura_id === surahId)
      .map((s) => ({ id: s.id, name: s.name, url: s.url }));

    return { segments, tafsirName };
  } catch (error) {
    console.error("Tafsir fetch error:", error);
    return { segments: [], tafsirName: "" };
  }
}

// generateStaticParams: pre-render popular Surahs
export async function generateStaticParams() {
  const popularSurahs = [1, 2, 18, 36, 55, 56, 67, 78, 112, 114];
  return popularSurahs.map((id) => ({ surahId: String(id) }));
}

export async function generateMetadata({ params }) {
  const { surahId } = await params;
  const surah = await getSurah(surahId);
  if (!surah) return { title: "Not Found" };

  return {
    title: `Listen to ${surah.name_simple} (${surah.name_arabic})`,
    description: `Listen to a full recitation of Surah ${surah.name_simple} by world-renowned Sheikhs and download the MP3 for offline listening.`,
  };
}

export default async function ListenSurahPage({ params }) {
  const { surahId } = await params;
  const id = parseInt(surahId);

  if (isNaN(id) || id < 1 || id > 114) {
    notFound();
  }

  const [surah, reciters, tafsirData] = await Promise.all([
    getSurah(id),
    getReciters(),
    getTafsirSegments(id),
  ]);

  if (!surah) {
    notFound();
  }

  // Filter reciters to only those who have this surah available
  const availableReciters = reciters
    .map((reciter) => ({
      ...reciter,
      moshaf: reciter.moshaf.filter((m) => m.surahList.includes(id)),
    }))
    .filter((reciter) => reciter.moshaf.length > 0);

  return (
    <div className="min-h-screen pt-28 pb-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-secondary mb-8 font-jakarta">
          <Link
            href="/quran"
            className="hover:text-accent transition-colors flex items-center gap-1"
          >
            <BookOpen size={13} />
            Quran
          </Link>
          <span className="opacity-40">/</span>
          <Link
            href="/quran/listen"
            className="hover:text-accent transition-colors flex items-center gap-1"
          >
            <Headphones size={13} />
            Listen
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-text-primary">{surah.name_simple}</span>
        </nav>

        <FullSurahPlayer
          surah={surah}
          reciters={availableReciters}
          surahId={id}
          tafsirSegments={tafsirData.segments}
          tafsirName={tafsirData.tafsirName}
        />
      </div>
    </div>
  );
}
