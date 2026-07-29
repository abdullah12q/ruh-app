import { motion } from "framer-motion";
import { staggerContainer } from "@/data/animationVariants";
import PrayerCard from "../PrayerCard";
import PrayerCardSkeleton from "./PrayerCardSkeleton";

export default function DailyPrayerGrid({
  prayers,
  countdown,
  isLoading,
  hijriHolidays,
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <PrayerCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Islamic holiday banner */}
      {hijriHolidays?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/25"
        >
          <span className="text-lg">⭐</span>
          <div>
            <p className="font-jakarta font-semibold text-sm text-amber-400">
              Islamic Holiday
            </p>
            <p className="font-inter text-xs text-amber-400/70">
              {hijriHolidays.join(" · ")}
            </p>
          </div>
        </motion.div>
      )}

      {/* Prayer cards grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
      >
        {prayers.map((prayer) => (
          <PrayerCard key={prayer.key} prayer={prayer} countdown={countdown} />
        ))}
      </motion.div>
    </div>
  );
}
