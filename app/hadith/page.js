import HadithBrowser from "@/app/hadith/HadithBrowser";

export const metadata = {
  title: "Hadith Library",
  description:
    "Explore the complete Hadith library — 17 classical books including Sahih Bukhari, Sahih Muslim, and more. Read authentic narrations with Arabic text and English translations.",
  keywords: [
    "Hadith",
    "Sahih Bukhari",
    "Sahih Muslim",
    "Islamic books",
    "Prophet Muhammad",
  ],
};

export default function HadithPage() {
  return <HadithBrowser />;
}
