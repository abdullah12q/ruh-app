import { useMonthlyCalendar } from "@/lib/queries/prayerTimes&Calendar";
import CalendarSkeleton from "./CalendarSkeleton";
import DayRow from "./DayRow";
import { PRAYER_NAMES } from "@/data/datas/prayerTimesData";

export default function MonthlyView({ coords, method, year, month }) {
  const {
    data: days,
    isLoading,
    isError,
  } = useMonthlyCalendar({ coords, method, year, month });

  // Determine today's gregorian date string
  const todayStr = new Date().toLocaleDateString("en-CA"); // "2026-07-27"

  if (isLoading) return <CalendarSkeleton rows={30} />;
  if (isError)
    return (
      <p className="text-center py-8 text-text-secondary text-sm font-inter">
        Could not load calendar data. Please try again.
      </p>
    );

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="min-w-137.5 sm:min-w-0">
        {/* Column headers */}
        <div className="flex items-center gap-3 px-4 pb-1 border-b border-(--surface-glass-border)">
          <div className="w-28 shrink-0">
            <span className="text-[10px] text-text-secondary/50 font-jakarta uppercase tracking-wider">
              Date
            </span>
          </div>
          <div className="flex-1 grid grid-cols-6 gap-1">
            {PRAYER_NAMES.map(({ key }) => (
              <span
                key={key}
                className="text-[10px] text-text-secondary/50 font-jakarta uppercase tracking-wider"
              >
                {key}
              </span>
            ))}
          </div>
        </div>

        {/* Days nfsha b2a */}
        <div className="space-y-0.5">
          {days?.map((day, i) => {
            const greg = day.date?.gregorian;
            // Aladhan returns date as "DD-MM-YYYY"
            const parts = greg?.date?.split("-");
            const iso = parts ? `${parts[2]}-${parts[1]}-${parts[0]}` : null; // bdl "DD-MM-YYYY" htb2a "YYYY-MM-DD" 3shan tb2a === todayStr
            const isToday = iso === todayStr;
            return <DayRow key={i} day={day} isToday={isToday} />;
          })}
        </div>
      </div>
    </div>
  );
}
