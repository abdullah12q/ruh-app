import { notFound } from "next/navigation";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { uthmanicHafs } from "@/app/fonts";

import SurahHeader from "@/components/quran/SurahHeader";
import SurahReadingControls from "@/components/quran/SurahReadingControls";
import BismillahCard from "@/components/quran/BismillahCard";
import AyahList from "@/components/quran/AyahList";
import SurahNavigation from "@/components/quran/SurahNavigation";

// Fetch Surah metadata from Quran.com API v4.
// hshelha later w hst5dm el custom hook bdlha
async function getSurah(id) {
  const res = await fetch(`https://api.quran.com/api/v4/chapters/${id}`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.chapter;
}

// Fetch all verses for a Surah (Arabic text only).
// Translation is fetched client-side per-ayah via useAyahTranslation.
// hshelha later w hst5dm el custom hook bdlha
async function getVerses(id) {
  const res = await fetch(
    `https://api.quran.com/api/v4/verses/by_chapter/${id}?language=en&fields=text_uthmani,verse_key,verse_number&per_page=300`,
    { next: { revalidate: 3600 } }, // Cache verses for 1 hour
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.verses;
}

// generateStaticParams: Pre-render the first 10 popular Surahs at build time.
// All other Surahs will be generated on-demand (ISR).
export async function generateStaticParams() {
  const popularSurahs = [1, 2, 18, 36, 55, 56, 67, 78, 112, 114];
  return popularSurahs.map((id) => ({ surahId: String(id) }));
}

// generateMetadata: Per-surah SEO metadata, generated server-side.
export async function generateMetadata({ params }) {
  const { surahId } = await params;
  const surah = await getSurah(surahId);
  if (!surah) return { title: "Surah Not Found" };

  return {
    title: `${surah.name_simple} (${surah.name_arabic}) — Surah ${surah.id}`,
    description: `Read Surah ${surah.name_simple} (${surah.translated_name?.name}) with English translation. ${surah.verses_count} verses, revealed in ${surah.revelation_place}.`,
    openGraph: {
      title: `Surah ${surah.name_simple} | Rُuh رُوح`,
      description: `${surah.verses_count} verses · ${surah.revelation_place.charAt(0).toUpperCase() + surah.revelation_place.slice(1)}`,
    },
  };
}

export default async function SurahPage({ params }) {
  const { surahId } = await params;
  const id = parseInt(surahId);

  if (isNaN(id) || id < 1 || id > 114) {
    notFound();
  }

  const [surah, verses] = await Promise.all([getSurah(id), getVerses(id)]);

  if (!surah) {
    notFound();
  }

  const prevSurah = id > 1 ? id - 1 : null;
  const nextSurah = id < 114 ? id + 1 : null;

  return (
    <div
      className={`min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8 ${uthmanicHafs.variable}`}
    >
      <div className="max-w-3xl mx-auto">
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
          <span className="text-text-primary">{surah.name_simple}</span>
        </nav>

        <SurahHeader surah={surah} />
        <SurahReadingControls surahId={id} />
        <BismillahCard surahId={id} />
        <AyahList verses={verses} surahId={id} />
        <SurahNavigation prevSurah={prevSurah} nextSurah={nextSurah} />
      </div>
    </div>
  );
}
