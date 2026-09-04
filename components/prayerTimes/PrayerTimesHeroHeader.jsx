import { motion } from "framer-motion";
import { fadeUp } from "@/data/animationVariants";
import { untilNextPrayerHintColor } from "@/data/datas/prayerTimesData";
import NotificationToggleButton from "../NotificationToggleButton";

export default function PrayerTimesHeroHeader({
  isLoading,
  countdown,
  nextPrayer,
}) {
  return (
    <>
      <motion.div
        variants={fadeUp}
        className="flex items-center justify-center gap-2 mb-6"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-accent text-xs font-semibold tracking-wider uppercase">
          🕌 Prayer Times
        </span>

        {/* Notification Toggle Button */}
        <NotificationToggleButton />
      </motion.div>

      {/* m3ad el prayer ely gy ba3d ad ehh */}
      <motion.div variants={fadeUp} className="text-center mb-8">
        {isLoading || !countdown ? (
          <div className="h-11 w-72 skeleton rounded-xl mx-auto" />
        ) : (
          <h1 className="font-jakarta font-extrabold text-4xl sm:text-6xl text-text-primary drop-shadow-sm">
            {nextPrayer?.label}{" "}
            <span className={`${untilNextPrayerHintColor(countdown).text}`}>
              in {countdown}
            </span>
          </h1>
        )}
      </motion.div>
    </>
  );
}
