import QuranBrowser from "@/components/quran/QuranBrowser";

export const metadata = {
  title: "Quran",
  description:
    "Read the Holy Quran online with translations, word-by-word analysis, and audio recitations. Browse all 114 Surahs.",
};

// Fetch all Surahs from Quran.com API v4
// Revalidates every 24 hours (ISR)
export async function getSurahList() {
  try {
    const res = await fetch(
      "https://api.quran.com/api/v4/chapters?language=en",
      {
        next: { revalidate: 86400 }, // Cache for 24 hours
      },
    );
    if (!res.ok) throw new Error("Failed to fetch surah list");
    const data = await res.json();
    return data.chapters;
  } catch (error) {
    console.error("Surah list fetch error:", error);
    return [];
  }
}

export default async function QuranPage() {
  const surahs = await getSurahList();
  return <QuranBrowser surahs={surahs} />;
}
