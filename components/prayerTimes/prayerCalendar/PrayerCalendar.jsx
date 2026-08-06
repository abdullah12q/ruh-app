import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import useUIStore from "@/lib/store/useUIStore";
import { fadeUp } from "@/data/animationVariants";
import MonthlyView from "./MonthlyView";
import AnnualView from "./AnnualView";

const HIJRI_MONTHS = [
  "Muharram",
  "Safar",
  "Rabi al-Awwal",
  "Rabi al-Thani",
  "Jumada al-Awwal",
  "Jumada al-Thani",
  "Rajab",
  "Sha'ban",
  "Ramadan",
  "Shawwal",
  "Dhul Qi'dah",
  "Dhul Hijjah",
];

export default function PrayerCalendar({
  isLoading,
  coords,
  hijriYear,
  hijriMonth,
}) {
  const { prayerCalcMethod } = useUIStore();
  const [view, setView] = useState("monthly"); // "monthly" | "annual"

  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);

  useEffect(() => {
    // Only set the initial state if it's currently null
    if (hijriYear && hijriMonth && year === null && month === null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setYear(Number(hijriYear));
      setMonth(Number(hijriMonth));
    }
  }, [hijriYear, hijriMonth, year, month]);

  const canPrevMonth = month > 1;
  const canNextMonth = month < 12;

  function prevPeriod() {
    if (view === "monthly") {
      if (canPrevMonth) setMonth((m) => m - 1);
      else {
        setMonth(12);
        setYear((y) => y - 1);
      }
    } else {
      setYear((y) => y - 1);
    }
  }

  function nextPeriod() {
    if (view === "monthly") {
      if (canNextMonth) setMonth((m) => m + 1);
      else {
        setMonth(1);
        setYear((y) => y + 1);
      }
    } else {
      setYear((y) => y + 1);
    }
  }

  const periodLabel =
    view === "monthly" ? `${HIJRI_MONTHS[month - 1]} ${year} AH` : `${year} AH`;

  return (
    !isLoading &&
    coords && (
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        className="mt-16"
      >
        {/* Section header */}
        <div className="flex items-center gap-3 mb-6">
          <h2 className="font-jakarta font-bold text-lg text-text-primary">
            Prayer Times Calendar
          </h2>
          <div className="flex-1 h-px bg-(--surface-glass-border)" />
        </div>

        <div className="space-y-5">
          {/* Calendar header: view toggle + navigation */}
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-4">
            {/* View toggle */}
            <div className="inline-flex p-1 rounded-full glass border border-white/10">
              {["monthly", "annual"].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`relative flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium font-jakarta transition-colors cursor-pointer capitalize ${
                    view === v
                      ? "text-accent"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {view === v && (
                    <motion.div
                      layoutId="calendar-tab"
                      className="absolute inset-0 bg-accent/10 border border-accent/20 rounded-full"
                      transition={{ type: "spring", damping: 20 }}
                    />
                  )}
                  <Calendar size={13} className="relative" />
                  <span className="relative">{v}</span>
                </button>
              ))}
            </div>
            {/* Period navigation */}
            <div className="flex items-center gap-3">
              <button
                onClick={prevPeriod}
                className="size-8 glass rounded-xl flex items-center justify-center text-text-secondary hover:text-accent transition-colors cursor-pointer"
                aria-label="Previous"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="font-jakarta font-semibold text-sm text-text-primary min-w-40 text-center">
                {periodLabel}
              </span>
              <button
                onClick={nextPeriod}
                className="size-8 glass rounded-xl flex items-center justify-center text-text-secondary hover:text-accent transition-colors cursor-pointer"
                aria-label="Next"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
          {/* Calendar content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${view}-${year}-${month}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
            >
              {view === "monthly" ? (
                <MonthlyView
                  coords={coords}
                  method={prayerCalcMethod}
                  year={year}
                  month={month}
                />
              ) : (
                <AnnualView
                  coords={coords}
                  method={prayerCalcMethod}
                  year={year}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    )
  );
}
