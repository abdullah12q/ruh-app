import {
  BookOpen,
  Clock,
  Star,
  Moon,
  Headphones,
  Heart,
  Music2,
} from "lucide-react";

export const features = [
  {
    icon: BookOpen,
    title: "Quran",
    titleAr: "القرآن",
    description:
      "Read and listen to the Holy Quran with word-by-word translations and authentic recitations.",
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
    icon: Moon,
    title: "Focus Mode",
    titleAr: "وضع التركيز",
    description:
      "Distraction-free reading environment designed for deep focus and spiritual immersion.",
    href: "/quran",
    gradient: "from-emerald-500/10 to-teal-500/10",
    iconColor: "text-emerald-400",
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
