import azkarData from "@/data/jsons/azkar.json";
import AzkarClient from "@/app/azkar/AzkarClient";

export const metadata = {
  title: "Azkar | أذكار — Morning & Evening Remembrance",
  description:
    "Morning and evening Azkar, daily supplications, and authentic Islamic remembrances — track your daily wird with focus and tranquility. أذكار الصباح والمساء والأدعية المأثورة.",
  keywords: ["Azkar", "Dhikr", "Islamic Remembrance", "Morning Azkar", "Evening Azkar", "أذكار", "أذكار الصباح", "أذكار المساء", "دعاء", "إسلام"],
  alternates: { canonical: "/azkar" },
  openGraph: {
    title: "Azkar | أذكار — Morning & Evening Remembrance | Rُuh",
    description: "Morning and evening Azkar, daily supplications, and authentic Islamic remembrances — أذكار الصباح والمساء.",
    type: "website",
  },
};

export default function AzkarPage() {
  const categories = Object.entries(azkarData).map(([title], id) => ({
    id,
    title,
  }));

  return <AzkarClient categories={categories} azkarData={azkarData} />;
}
