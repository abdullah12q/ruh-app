import {
  BookOpen,
  Clock,
  Star,
  Bookmark,
  Headphones,
  Heart,
  Music2,
  Play,
  Download,
  Shuffle,
} from "lucide-react";
import { cleanTime, timeToMinutes } from "./prayerTimesData";

export const features = [
  {
    icon: BookOpen,
    title: "Quran",
    titleAr: "القرآن",
    description:
      "Read, listen, download, and search the Holy Quran, enhanced by authentic recitations and word-by-word translations.",
    href: "/quran",
    gradient: "from-teal-500/10 to-cyan-500/10",
    iconColor: "text-[var(--accent)]",
  },
  {
    icon: Clock,
    title: "Prayer Times",
    titleAr: "أوقات الصلاة",
    description:
      "Accurate prayer times for your location with Azan notifications and Qibla direction.",
    href: "/prayer-times",
    gradient: "from-indigo-500/10 to-violet-500/10",
    iconColor: "text-indigo-400",
  },
  {
    icon: Star,
    title: "Hadith",
    titleAr: "الحديث",
    description:
      "Explore authentic Hadiths from the major collections, curated for daily reflection.",
    href: "/hadith",
    gradient: "from-amber-500/10 to-orange-500/10",
    iconColor: "text-amber-400",
  },
  {
    icon: Bookmark,
    title: "Bookmarks",
    titleAr: "المرجعية",
    description:
      "Save your favourite Ayahs with a single tap and revisit them anytime — all in one place.",
    gradient: "from-rose-500/10 to-pink-500/10",
    iconColor: "text-rose-400",
  },
];

export const stats = [
  { value: "114", label: "Surahs", labelAr: "سورة" },
  { value: "6,236", label: "Ayahs", labelAr: "آية" },
  { value: "99", label: "Names of Allah", labelAr: "أسماء الله" },
  { value: "30", label: "Juz", labelAr: "جزء" },
];

export const SPOTLIGHT_IDS = [42, 7, 14, 1, 2, 35, 10, 11, 12, 15, 16, 4];

export const audioFeatures = [
  {
    icon: Headphones,
    color: "text-accent",
    bg: "bg-accent/10",
    title: "Instant Play / Pause",
    desc: "Tap any reciter card to instantly preview Al-Fatiha. Switch reciters seamlessly without interruption.",
  },
  {
    icon: Heart,
    color: "text-rose-400",
    bg: "bg-rose-400/10",
    title: "Favourite Your Reciters",
    desc: "Heart the voices that resonate with you. Your favourites are saved and always one tap away.",
  },
  {
    icon: Music2,
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    title: "Browse 54 Reciters",
    desc: "From legendary scholars to contemporary voices — explore a handpicked collection of authenticated recitations.",
  },
];

export const FEATURED_SURAHS = [
  { id: 1, nameAr: "الفاتحة", nameEn: "Al-Fatihah", verses: 7 },
  { id: 2, nameAr: "البقرة", nameEn: "Al-Baqarah", verses: 286 },
  { id: 36, nameAr: "يس", nameEn: "Ya-Sin", verses: 83 },
  { id: 55, nameAr: "الرحمن", nameEn: "Ar-Rahman", verses: 78 },
  { id: 67, nameAr: "الملك", nameEn: "Al-Mulk", verses: 30 },
  { id: 112, nameAr: "الإخلاص", nameEn: "Al-Ikhlas", verses: 4 },
];

export const CAPABILITIES = [
  {
    icon: Play,
    color: "text-accent",
    bg: "bg-accent/10",
    title: "Full Continuous Playback",
    desc: "Listen to an entire Surah from start to finish without any interruptions — one recitation, unbroken.",
  },
  {
    icon: Download,
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    title: "Offline Download",
    desc: "Save any Surah recitation to your device and listen anywhere, even without an internet connection.",
  },
  {
    icon: Shuffle,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    title: "215+ Exclusive Sheikhs",
    desc: "Access world-renowned reciters unavailable in the verse-by-verse mode — curated full-Surah masters.",
  },
];

export const KAHF_CONTENT = {
  badge: {
    en: "Friday Night Reminder",
    ar: "تذكير ليلة الجمعة",
  },
  heading: {
    en: {
      normal: "Illuminate Your",
      highlight: "Friday Night",
    },
    ar: "أنِر ليلة جمعتك",
  },
  subheading: {
    en: "Start reading Surat Al-Kahf — it is the Sunnah of the blessed Friday night.",
    ar: "ابدأ بقراءة سورة الكهف — فهي سُنَّة ليلة الجمعة المباركة.",
  },
  surahName: {
    arabic: "سُورَةُ الْكَهْف",
    english: "Surat Al-Kahf • Chapter 18",
  },
  hadith: {
    arabic:
      "«مَنْ قَرَأَ سُورَةَ الْكَهْفِ فِي يَوْمِ الْجُمُعَةِ أَضَاءَ لَهُ مِنَ النُّورِ مَا بَيْنَ الْجُمُعَتَيْنِ»",
    english:
      '"Whoever reads Surat Al-Kahf on Friday, he will be illuminated with light between the two Fridays."',
    source: {
      en: "Narrated by Al-Hakim — authenticated by Al-Albani (Sahih al-Jami 6470)",
      ar: "رواه الحاكم — وصحَّحه الألباني (صحيح الجامع ٦٤٧٠)",
    },
  },
  cta: {
    en: "Read Surat Al-Kahf",
    ar: "اقرأ سورة الكهف",
  },
};

export function isAlKahfTime(maghribTime) {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun,1=Mon,...,4=Thu,5=Fri,6=Sat

  // Default Maghrib fallback: 19:00 (7 PM) — used when API hasn't loaded yet
  const DEFAULT_MAGHRIB_MINS = 19 * 60;

  const maghribMins =
    timeToMinutes(cleanTime(maghribTime)) ?? DEFAULT_MAGHRIB_MINS;
  const nowMins = now.getHours() * 60 + now.getMinutes();

  // Thursday after Maghrib (dayOfWeek === 4 && nowMins >= maghrib)
  const isThursdayAfterMaghrib = dayOfWeek === 4 && nowMins >= maghribMins;

  // All of Friday before Maghrib (dayOfWeek === 5 && nowMins < maghrib)
  const isFridayBeforeMaghrib = dayOfWeek === 5 && nowMins < maghribMins;

  return isThursdayAfterMaghrib || isFridayBeforeMaghrib;
}
