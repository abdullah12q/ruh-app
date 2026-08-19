import azkarData from "@/data/jsons/azkar.json";
import AzkarClient from "@/app/azkar/AzkarClient";

export const metadata = {
  title: "Azkar | أذكار",
  description:
    "أذكار الصباح والمساء والأدعية المأثورة — تابع ورد يومك بتركيز وسكينة.",
  keywords: ["أذكار", "أذكار الصباح", "أذكار المساء", "دعاء", "إسلام"],
  alternates: { canonical: "/azkar" },
  openGraph: {
    title: "Azkar | أذكار — Rُuh",
    description: "أذكار الصباح والمساء والأدعية المأثورة",
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
