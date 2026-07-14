import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import DailyVerseSection from "@/components/home/DailyVerseSection";
import AudioRecitationsSection from "@/components/home/AudioRecitationsSection";
import StatsSection from "@/components/home/StatsSection";
import CTASection from "@/components/home/CTASection";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <HeroSection />
      <FeaturesSection />
      <DailyVerseSection />
      <AudioRecitationsSection />
      <StatsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
