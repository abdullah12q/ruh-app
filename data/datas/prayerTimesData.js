export const PRAYER_NAMES = [
  { key: "Fajr", label: "Fajr", labelAr: "الفجر", icon: "🌙" },
  { key: "Sunrise", label: "Sunrise", labelAr: "الشروق", icon: "🌅" },
  { key: "Dhuhr", label: "Dhuhr", labelAr: "الظهر", icon: "☀️" },
  { key: "Asr", label: "Asr", labelAr: "العصر", icon: "🌤️" },
  { key: "Maghrib", label: "Maghrib", labelAr: "المغرب", icon: "🌇" },
  { key: "Isha", label: "Isha", labelAr: "العشاء", icon: "🌃" },
];

/** Converts "HH:MM" 24-hour string to total minutes from midnight. */
function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

/** Strips timezone suffix like "(EET)" from Aladhan time strings. */
export function cleanTime(raw) {
  if (!raw) return null;
  return raw.split(" ")[0];
}

/** Formats "HH:MM" 24h to "H:MM AM/PM". */
export function formatPrayerTime(timeStr) {
  if (!timeStr) return "--:--";
  const clean = cleanTime(timeStr);
  const [h, m] = clean.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

/** Returns the next salah key and minutes until it, based on current time. */
export function getNextPrayer(timings) {
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();

  for (const prayer of PRAYER_NAMES) {
    const raw = timings[prayer.key];
    if (!raw) continue;
    const prayerMins = timeToMinutes(cleanTime(raw));
    if (prayerMins > nowMins) {
      return { key: prayer.key, minutesUntil: prayerMins - nowMins };
    }
  }

  // Past Isha — next prayer is Fajr tomorrow
  const fajrMins = timeToMinutes(cleanTime(timings["Fajr"]));
  const minutesUntilMidnight = 24 * 60 - nowMins;
  return { key: "Fajr", minutesUntil: minutesUntilMidnight + fajrMins };
}

/** Formats minutesUntil into "Xh Ym" or "Xm" string. */
export function formatCountdown(minutesUntil) {
  if (minutesUntil <= 0) return "Now";
  const h = Math.floor(minutesUntil / 60);
  const m = minutesUntil % 60;
  if (h > 0 && m === 0) return `${h}h`;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function untilNextPrayerHintColor(countdown, inNav = false) {
  const hoursMatch = countdown?.match(/(\d+)h/);
  const minsMatch = countdown?.match(/^(\d+)m$/);

  // More than 1 hour away
  if (hoursMatch)
    return {
      text: "gradient-text",
      bg: inNav ? "bg-accent" : "bg-accent/15",
      border: inNav ? "border-accent" : "border-accent/25",
    };

  // Between 31 and 60 minutes away
  if (
    minsMatch &&
    parseInt(minsMatch[1]) <= 60 &&
    parseInt(minsMatch[1]) > 30
  ) {
    return {
      text: "text-amber-500",
      bg: inNav ? "bg-amber-500" : "bg-amber-500/15",
      border: inNav ? "border-amber-500" : "border-amber-500/25",
    };
  }

  // "Now" or 30 minutes or less
  if (
    !countdown ||
    countdown === "Now" ||
    (minsMatch && parseInt(minsMatch[1]) <= 30)
  ) {
    return {
      text: "text-rose-600",
      bg: inNav ? "bg-rose-600" : "bg-rose-600/15",
      border: inNav ? "border-rose-600" : "border-rose-600/25",
    };
  }
  return {
    text: "gradient-text",
    bg: inNav ? "bg-accent" : "bg-accent/15",
    border: inNav ? "border-accent" : "border-accent/25",
  };
}

export function getDateobj(gregorianDate) {
  const [day, month, year] = gregorianDate?.toString().split("-") || [];
  const dateObj = year ? new Date(`${year}-${month}-${day}`) : new Date();

  return dateObj;
}

export const formatterEn = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

export const formatterAr = new Intl.DateTimeFormat("ar-EG", {
  month: "long",
  day: "numeric",
  year: "numeric",
});
