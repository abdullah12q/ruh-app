import { motion } from "framer-motion";
import { cardVariant } from "@/data/animationVariants";
import { untilNextPrayerHintColor } from "@/data/datas/prayerTimesData";

export default function PrayerCard({ prayer, countdown }) {
  const { label, labelAr, icon, formattedTime, isNext } = prayer;

  const hintColor = untilNextPrayerHintColor(countdown);

  return (
    <motion.div
      variants={cardVariant}
      className={`relative rounded-2xl p-5 flex flex-col gap-3 transition-all duration-300 overflow-hidden ${
        isNext
          ? "bg-accent/10 border border-accent/30 shadow-[0_0_32px_rgba(20,184,166,0.12)]"
          : "glass hover:border-(--surface-glass-border) hover:shadow-md"
      }`}
    >
      {/* Glow orb for next prayer */}
      {isNext && (
        <div className="absolute -top-6 -right-6 size-20 rounded-full bg-accent/20 blur-2xl pointer-events-none" />
      )}

      {/* Icon + Next badge */}
      <div className="flex items-start justify-between">
        <div
          className={`size-10 rounded-xl flex items-center justify-center text-xl ${
            isNext ? "bg-accent/20" : "bg-white/5"
          }`}
        >
          {icon}
        </div>
        {isNext && (
          <span
            className={`text-[10px] font-bold font-jakarta ${hintColor.text} ${hintColor.bg} border ${hintColor.border} rounded-full px-2 py-0.5 leading-none`}
          >
            NEXT
          </span>
        )}
      </div>

      {/* Prayer name */}
      <div className="flex items-center justify-between">
        <p
          className={`font-jakarta font-bold text-sm ${
            isNext ? "text-accent" : "text-text-primary"
          }`}
        >
          {label}
        </p>
        <p className="font-quran text-text-secondary" dir="rtl">
          {labelAr}
        </p>
      </div>

      {/* Time */}
      <p
        className={`font-jakarta font-semibold tabular-nums ${
          isNext ? "text-accent text-lg" : "text-text-primary"
        }`}
      >
        {formattedTime}
      </p>

      {/* Countdown for next prayer */}
      {isNext && countdown && (
        <p
          className={`text-xs font-inter ${hintColor.text} tabular-nums -mt-1`}
        >
          in {countdown}
        </p>
      )}

      {/* Bottom accent line for next prayer */}
      {isNext && (
        <motion.div
          layoutId="home-prayer-bar"
          className="absolute bottom-0 left-4 right-4 h-0.5 bg-accent/60 rounded-full"
        />
      )}
    </motion.div>
  );
}
