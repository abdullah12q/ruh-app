import { useEffect, useRef, useMemo } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";

const ALERT_OFFSETS_MINUTES = [5]; // if e.g [15, 5] this will trigger two reminders one in 15 mins and one in 5 mins

export default function PrayerNotificationManager() {
  const { permission, isSupported } = useNotifications();
  const workerRef = useRef(null);
  const { prayers, nextPrayerKey } = usePrayerTimes();

  // Calculate the exact timestamp for the next prayer
  const { nextPrayerTime, nextPrayerNameEn, nextPrayerNameAr } = useMemo(() => {
    if (!prayers || !nextPrayerKey)
      return {
        nextPrayerTime: null,
        nextPrayerNameEn: null,
        nextPrayerNameAr: null,
      };

    const nextPrayer = prayers.find((p) => p.key === nextPrayerKey);
    if (!nextPrayer || !nextPrayer.rawTime)
      return { nextPrayerTime: null, nextPrayerName: null };

    const [h, m] = nextPrayer.rawTime.split(":").map(Number);
    const now = new Date();
    const target = new Date();
    target.setHours(h, m, 0, 0);

    // If the calculated time is in the past, it must be for tomorrow (e.g. Fajr after Isha)
    if (target < now) {
      target.setDate(target.getDate() + 1);
    }

    return {
      nextPrayerTime: target.getTime(),
      nextPrayerNameEn: nextPrayer.label,
      nextPrayerNameAr: nextPrayer.labelAr,
    };
  }, [prayers, nextPrayerKey]);

  useEffect(() => {
    if (!isSupported || permission !== "granted") return;

    const worker = new Worker("/timerWorker.js");
    workerRef.current = worker;

    worker.onmessage = (event) => {
      const { type, payload } = event.data;

      if (type === "PRAYER_ALERT") {
        const nameEn = nextPrayerNameEn || "Prayer";
        const nameAr = nextPrayerNameAr || "الصلاة";
        const mins = payload.minutesBefore;

        const title =
          mins === 0
            ? `${nameEn} Time - حان وقت ${nameAr}`
            : `${nameEn} in ${mins} min - ${nameAr} خلال ${mins} دقيقة`;

        const body =
          mins === 0
            ? `It's time for ${nameEn} prayer. \nحان الآن موعد صلاة ${nameAr}.`
            : `Next prayer is ${nameEn} in ${mins} minutes. \nالصلاة القادمة هي ${nameAr} خلال ${mins} دقائق.`;

        new Notification(title, {
          body: body,
          icon: "/icon.png",
          tag: `prayer-${nameEn}-${mins}`,
          silent: true, // 3shan feh custom audio hysht8l
        });

        try {
          const audioPath = `/adhanNotificationAudios/${nameEn ?? "Default"}${mins === 0 ? "_Now" : "_Before"}.mp3`;
          const audio = new Audio(audioPath);

          // Browsers require user interaction before playing audio,
          // but usually allow it if notifications are granted.
          // We catch the error just in case autoplay is blocked.
          audio.play().catch((err) => {
            console.error(
              "Browser blocked audio playback. User might need to interact with the page first.",
              err,
            );
          });
        } catch (error) {
          console.error("Error playing sound:", error);
        }
      }

      if (type === "WORKER_ERROR") {
        console.error("Prayer timer worker error:", payload.message);
      }
    };

    worker.onerror = (err) => {
      console.error("Prayer timer worker crashed:", err.message);
    };

    return () => {
      worker.postMessage({ type: "STOP_TIMER" });
      worker.terminate();
      workerRef.current = null;
    };
  }, [permission, isSupported, nextPrayerNameEn, nextPrayerNameAr]);

  useEffect(() => {
    if (workerRef.current && nextPrayerTime && permission === "granted") {
      workerRef.current.postMessage({
        type: "START_TIMER",
        payload: {
          prayerTime: nextPrayerTime,
          prayerName: nextPrayerNameEn,
          offsetsMinutes: ALERT_OFFSETS_MINUTES,
        },
      });
    }
  }, [nextPrayerTime, nextPrayerNameEn, permission]);

  return null;
}
