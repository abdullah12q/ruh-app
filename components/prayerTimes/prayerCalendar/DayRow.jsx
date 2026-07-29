import { motion } from "framer-motion";
import { PRAYER_NAMES } from "@/data/datas/prayerTimesData";
import PrayerCell from "./PrayerCell";

export default function DayRow({ day, isToday }) {
  const { timings, date } = day;
  const hijri = date?.hijri;
  const greg = date?.gregorian;
  const hasHoliday = hijri?.holidays?.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors ${
        isToday ? "bg-accent/10 border border-accent/25" : "hover:bg-white/3"
      }`}
    >
      {/* Date column */}
      <div className="w-28 shrink-0">
        <div className="flex items-center gap-1.5">
          {isToday && (
            <span className="size-1.5 rounded-full bg-accent shrink-0" />
          )}
          <span
            className={`font-jakarta text-xs font-semibold ${
              isToday ? "text-accent" : "text-text-primary"
            }`}
          >
            {greg?.date?.split("-").slice(0, 2).join("/")}
          </span>
        </div>
        <span className="font-inter text-[10px] text-text-secondary/60 leading-none">
          {greg?.weekday?.en?.slice(0, 3)} · {hijri?.day}{" "}
          {hijri?.month?.en?.slice(0, 3)}
        </span>
        {hasHoliday && (
          <span
            className="mt-0.5 block text-[9px] text-amber-400/80 font-jakarta leading-none truncate"
            title={hijri.holidays[0]}
          >
            ★ {hijri.holidays[0]}
          </span>
        )}
      </div>

      {/* Prayer times */}
      <div className="flex-1 grid grid-cols-6 gap-1">
        {PRAYER_NAMES.map(({ key }) => (
          <PrayerCell key={key} time={timings?.[key]} />
        ))}
      </div>
    </motion.div>
  );
}
