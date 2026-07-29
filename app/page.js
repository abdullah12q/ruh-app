import HeroSection from "@/components/home/hero/HeroSection";
import ContinueReadingSection from "@/components/home/continueReading/ContinueReadingSection";
import FeaturesSection from "@/components/home/features/FeaturesSection";
import DailyVerseSection from "@/components/home/dailyVerse/DailyVerseSection";
import PrayerTimesSection from "@/components/home/prayerTimes/PrayerTimesSection";
import AudioRecitationsSection from "@/components/home/audioRecitations/AudioRecitationsSection";
import FullSurahSection from "@/components/home/fullSurah/FullSurahSection";
import StatsSection from "@/components/home/stats/StatsSection";
import CTASection from "@/components/home/cta/CTASection";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <HeroSection />
      <ContinueReadingSection />
      <FeaturesSection />
      <DailyVerseSection />
      <PrayerTimesSection />
      <AudioRecitationsSection />
      <FullSurahSection />
      <StatsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
