import { MapPin, RotateCcw } from "lucide-react";

export default function PrayerTimesDateAndLocAr({
  hijriWeekday,
  formattedDateAr,
  hijriDateAr,
  location,
  onRefetch,
}) {
  const [day, month, year] = formattedDateAr.split(" ");

  return (
    <div dir="rtl" className="font-quran flex flex-col">
      {hijriWeekday?.ar ? (
        <>
          <span className="text-xl font-semibold text-text-secondary/70 -my-2">
            {hijriWeekday?.ar}
          </span>
          <span className="font-arabic-ui text-xl text-text-primary -mb-2">
            <span>{day}</span>
            <span className="font-quran mx-2">{month}</span>
            <span>{year}</span>
          </span>
        </>
      ) : (
        <span className="animate-pulse">جاري تحميل التاريخ...</span>
      )}
      {hijriDateAr && (
        <span className="text-accent leading-tight -mb-1.5">
          {hijriDateAr} هـ
        </span>
      )}
      {location?.ar ? (
        <span className="flex flex-row items-center gap-1.5 mt-2.5 text-sm text-text-secondary">
          <MapPin size={12} className="text-accent" />
          <span className="font-medium text-text-secondary">
            <span>
              {location?.ar?.city} <span className="font-arabic-ui">،</span>{" "}
              {location?.ar?.state} <span className="font-arabic-ui">،</span>{" "}
              {location?.ar?.country}
            </span>
          </span>
          {onRefetch && (
            <button
              onClick={onRefetch}
              title="تحديث الموقع"
              className="ml-0.5 p-0.5 rounded-md text-text-secondary/50 hover:text-accent hover:bg-accent/10 transition-all cursor-pointer"
            >
              <RotateCcw size={10} />
            </button>
          )}
        </span>
      ) : (
        <span className="animate-pulse">جاري تحديد الموقع...</span>
      )}
    </div>
  );
}
