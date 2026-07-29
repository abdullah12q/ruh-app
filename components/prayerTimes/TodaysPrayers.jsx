import { fadeUp } from "@/data/animationVariants";
import DailyPrayerGrid from "./DailyPrayerGrid";
import { motion } from "framer-motion";
import DstAdjustmentToggle from "./DstAdjustmentToggle";

export default function TodaysPrayers({
  prayers,
  countdown,
  isLoading,
  hijriHolidays,
}) {
  return (
    <>
      {/* Section header */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-3 mb-5 mt-2"
      >
        <h2 className="font-jakarta font-bold text-lg text-text-primary">
          Today&apos;s Prayers
        </h2>
        <div className="flex-1 h-px bg-(--surface-glass-border)" />
        {/* DST control */}
        <DstAdjustmentToggle />
      </motion.div>

      {/* Daily prayer grid */}
      <DailyPrayerGrid
        prayers={prayers}
        countdown={countdown}
        isLoading={isLoading}
        hijriHolidays={hijriHolidays}
      />
    </>
  );
}
