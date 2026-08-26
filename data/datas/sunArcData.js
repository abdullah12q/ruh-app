function toMinutes(hhmm) {
  if (!hhmm) return 0;
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

// Geometry
export const VB_WIDTH = 800;
export const VB_HEIGHT = 220;
export const PAD_X = 24;
const CURVE_WIDTH = VB_WIDTH - PAD_X * 2;
export const HORIZON_Y = 158;
const AMPLITUDE = 96;
const SAMPLES = 72;

export function buildArc(prayers) {
  const byKey = Object.fromEntries(prayers.map((p) => [p.key, p]));
  const tFajr = toMinutes(byKey.Fajr?.rawTime);
  const tSunrise = toMinutes(byKey.Sunrise?.rawTime);
  const tMaghrib = toMinutes(byKey.Maghrib?.rawTime);
  const tIsha = toMinutes(byKey.Isha?.rawTime);

  const span = tIsha - tFajr || 1;
  const daySpan = tMaghrib - tSunrise || 1;

  const altitude = (t) => Math.sin((Math.PI * (t - tSunrise)) / daySpan);
  const xFor = (t) => PAD_X + ((t - tFajr) / span) * CURVE_WIDTH;
  const yFor = (t) => HORIZON_Y - altitude(t) * AMPLITUDE;

  let path = "";
  for (let i = 0; i <= SAMPLES; i++) {
    const t = tFajr + (span * i) / SAMPLES;
    const x = xFor(t);
    const y = yFor(t);
    path +=
      i === 0
        ? `M ${x.toFixed(1)} ${y.toFixed(1)}`
        : ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }

  const markers = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"].map(
    (key) => {
      const p = byKey[key];
      const t = toMinutes(p?.rawTime);
      return { ...p, x: xFor(t), y: yFor(t) };
    },
  );

  return { path, markers, xFor, yFor, tFajr, tSunrise, tMaghrib, tIsha };
}

// hya hya zy untilNextPrayerHintColor() in prayerTimesData bs bn3ml return raw colors 3shan el SVG needs hex, not classes.
export function urgencyColor(countdown) {
  const hoursMatch = countdown?.match(/(\d+)h/);
  const minsMatch = countdown?.match(/^(\d+)m$/);

  // More than 1 hour away
  if (hoursMatch) return "var(--accent)";

  // amber-500 Between >15 and 60 minutes away
  if (minsMatch && parseInt(minsMatch[1]) <= 60 && parseInt(minsMatch[1]) > 15)
    return "#F59E0B";

  // rose-600 "Now" or 15 minutes or less
  return "#E11D48";
}
