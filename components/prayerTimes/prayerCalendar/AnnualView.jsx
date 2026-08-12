import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { PRAYER_NAMES } from "@/data/datas/prayerTimesData";
import CalendarSkeleton from "./CalendarSkeleton";
import DayRow from "./DayRow";
import { useAnnualCalendar } from "@/lib/queries/prayerTimes&Calendar";

export default function AnnualView({ coords, method, year }) {
  const {
    data: annualData,
    isLoading,
    isError,
  } = useAnnualCalendar({ coords, method, year });
  const [expandedMonth, setExpandedMonth] = useState(null);

  const todayStr = new Date().toLocaleDateString("en-CA"); // "2026-07-27"

  if (isLoading) return <CalendarSkeleton rows={12} />;
  if (isError)
    return (
      <p className="text-center py-8 text-text-secondary text-sm font-inter">
        Could not load annual calendar data.
      </p>
    );

  // annualData is keyed by month number ("1"..."12")
  const months = annualData ? Object.entries(annualData) : [];

  return (
    <div className="space-y-2">
      {months.map(([monthNum, days]) => {
        const monthName =
          days?.[0]?.date?.hijri?.month?.en ?? `Month ${monthNum}`;
        const monthHasToday = days?.some((d) => {
          // Aladhan returns date as "DD-MM-YYYY"
          const parts = d.date?.gregorian?.date?.split("-");
          const iso = parts ? `${parts[2]}-${parts[1]}-${parts[0]}` : null; // bdl "DD-MM-YYYY" htb2a "YYYY-MM-DD" 3shan tb2a === todayStr
          return iso === todayStr;
        });
        const isExpanded = expandedMonth === monthNum;

        return (
          <div key={monthNum} className="glass rounded-2xl overflow-hidden">
            {/* Month header — clickable to expand */}
            <button
              onClick={() => setExpandedMonth(isExpanded ? null : monthNum)}
              className="w-full flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-white/3 transition-colors"
            >
              <div className="flex items-center gap-3">
                {monthHasToday && (
                  <span className="size-2 rounded-full bg-accent" />
                )}
                <span
                  className={`font-jakarta font-semibold text-sm ${monthHasToday ? "text-accent" : "text-text-primary"}`}
                >
                  {monthName}
                </span>
                <span className="text-xs text-text-secondary/50 font-inter">
                  {days?.length} days
                </span>
              </div>
              <ChevronRight
                size={14}
                className={`text-text-secondary transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
              />
            </button>

            {/* Expandable day rows */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  key="days"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden px-2 pb-2"
                >
                  {/* Column headers */}
                  <div className="flex items-center gap-3 px-4 py-1.5 mb-1">
                    <div className="w-28 shrink-0">
                      <span className="text-[10px] text-text-secondary/40 font-jakarta uppercase tracking-wider">
                        Date
                      </span>
                    </div>
                    <div className="flex-1 grid grid-cols-6 gap-1">
                      {PRAYER_NAMES.map(({ key }) => (
                        <span
                          key={key}
                          className="text-[10px] text-text-secondary/40 font-jakarta uppercase tracking-wider"
                        >
                          {key}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    {days?.map((day, i) => {
                      // Aladhan returns date as "DD-MM-YYYY"
                      const parts = day.date?.gregorian?.date?.split("-");
                      const iso = parts
                        ? `${parts[2]}-${parts[1]}-${parts[0]}`
                        : null; // bdl "DD-MM-YYYY" htb2a "YYYY-MM-DD" 3shan tb2a === todayStr
                      const isToday = iso === todayStr;
                      return <DayRow key={i} day={day} isToday={isToday} />;
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
