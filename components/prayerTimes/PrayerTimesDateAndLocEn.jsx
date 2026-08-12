import { MapPin, RotateCcw } from "lucide-react";

export default function PrayerTimesDateAndLocEn({
  gregorianWeekday,
  formattedDateEn,
  hijriDate,
  location,
  onRefetch,
}) {
  return (
    <div className="font-jakarta flex flex-col">
      {gregorianWeekday ? (
        <>
          <span className="font-inter text-[10px] font-semibold tracking-[0.2em] uppercase text-text-secondary/70 mb-1">
            {gregorianWeekday}
          </span>
          <span className="font-bold text-lg sm:text-xl text-text-primary leading-tight">
            {formattedDateEn}
          </span>
        </>
      ) : (
        <span className="text-sm animate-pulse">
          Loading today&apos;s date...
        </span>
      )}
      {hijriDate && (
        <span className="text-xs text-accent mt-0.5">{hijriDate} AH</span>
      )}
      {location?.en ? (
        <span className="flex items-center gap-1.5 mt-2.5 text-[11px] text-text-secondary">
          <MapPin size={12} className="text-accent shrink-0" />
          <span className="font-medium text-text-secondary">
            {location?.en?.city}, {location?.en?.state}, {location?.en?.country}
          </span>
          {onRefetch && (
            <button
              onClick={onRefetch}
              title="Update location"
              className="ml-0.5 p-0.5 rounded-md text-text-secondary/50 hover:text-accent hover:bg-accent/10 transition-all cursor-pointer"
            >
              <RotateCcw size={10} />
            </button>
          )}
        </span>
      ) : (
        <span className="animate-pulse text-sm">Detecting location...</span>
      )}
    </div>
  );
}
