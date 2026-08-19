import {
  Home,
  BookOpen,
  Clock,
  Star,
  Tv,
  Radio,
  UsersRound,
  Hand,
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/quran", label: "Quran", icon: BookOpen },
  { href: "/prayer-times", label: "Prayer Times", icon: Clock },
  { href: "/azkar", label: "Azkar", icon: Hand },
  { href: "/hadith", label: "Hadith", icon: Star },
  { href: "/halaqah", label: "Circles", icon: UsersRound },
  { href: "/radio", label: "Radio", icon: Radio },
  { href: "/live-tv", label: "Live TV", icon: Tv },
];

export default navLinks;
