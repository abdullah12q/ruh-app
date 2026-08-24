import ListenBrowser from "@/components/quran/listen/ListenBrowser";
import { getSurahList } from "../page";

export const metadata = {
  title: "Listen & Download Quran Recitations And Tafsir",
  description:
    "Listen to complete Surah recitations by world-renowned Sheikhs. Choose any of the 114 Surahs and select your preferred reciter for a full, uninterrupted listening experience — and download for offline access.",
};

export default async function ListenPage() {
  const surahs = await getSurahList();
  return <ListenBrowser surahs={surahs} />;
}
