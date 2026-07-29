import PrayerTimesPageClient from "./PrayerTimesPageClient";

export const metadata = {
  title: "Prayer Times — Daily Salah Schedule",
  description:
    "Accurate Islamic prayer times for your location with Fajr, Sunrise, Dhuhr, Asr, Maghrib, and Isha schedules. Monthly and annual Hijri calendar included.",
  keywords: [
    "Prayer Times",
    "Salah",
    "Islamic Prayer",
    "Fajr",
    "Sunrise",
    "Dhuhr",
    "Asr",
    "Maghrib",
    "Isha",
    "Hijri Calendar",
    "أوقات الصلاة",
  ],
  openGraph: {
    title: "Prayer Times | Rُuh رُوح",
    description:
      "Accurate prayer times for your location with a full Hijri calendar.",
  },
};

export default function PrayerTimesPage() {
  return <PrayerTimesPageClient />;
}
