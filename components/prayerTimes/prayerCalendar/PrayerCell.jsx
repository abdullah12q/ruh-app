import { cleanTime, formatPrayerTime } from "@/data/datas/prayerTimesData";

export default function PrayerCell({ time }) {
  const formatted = formatPrayerTime(cleanTime(time));

  return (
    <span className="font-jakarta text-xs tabular-nums text-text-secondary whitespace-nowrap">
      {formatted}
    </span>
  );
}
