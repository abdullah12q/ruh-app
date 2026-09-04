import { UsersRound } from "lucide-react";
import HalaqahDashboard from "@/components/halaqah/Dashboard/HalaqahDashboard";

export const metadata = {
  title: "Study Circle | حلقة",
  description:
    "Read the Quran together. Form a private study circle with friends and family, track shared progress, and leave reflections on Ayahs.",
};

export default function HalaqahPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-10 animate-fade-up">
        <div className="flex items-center gap-3 mb-3">
          <div className="size-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
            <UsersRound size={20} className="text-accent" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-jakarta text-text-primary tracking-tight">
            Study Circle
            <span className="font-arabic-ui text-accent ml-2 text-xl">
              حَلْقَة
            </span>
          </h1>
        </div>
        <p className="text-text-secondary font-inter text-sm max-w-xl">
          Read together. Track shared progress. Leave reflections on Ayahs —
          visible to your whole circle.
        </p>
      </div>

      <HalaqahDashboard />
    </div>
  );
}
