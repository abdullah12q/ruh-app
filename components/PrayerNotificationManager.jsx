import { useEffect, useRef, useMemo } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import useUIStore from "@/lib/store/useUIStore";

export default function PrayerNotificationManager() {
  const { permission, isSupported } = useNotifications();
  const workerRef = useRef(null);
  const { prayers, nextPrayerKey } = usePrayerTimes();

  const { prayerNotificationMode, prayerNotificationOffsets } = useUIStore();

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
      return {
        nextPrayerTime: null,
        nextPrayerNameEn: null,
        nextPrayerNameAr: null,
      };

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

  // Initialize Worker
  useEffect(() => {
    if (!isSupported || permission !== "granted") return;

    const worker = new Worker("/timerWorker.js");
    workerRef.current = worker;

    worker.onmessage = (event) => {
      const { type, payload } = event.data;

      if (type === "PRAYER_ALERT") {
        const { minutesBefore, nameEn, nameAr } = payload;

        // Always get the latest preferences directly from the store to avoid stale closures and without needing to recreate the worker when they change.
        const state = useUIStore.getState();
        const mode = state.prayerNotificationMode;
        const volume = state.prayerNotificationVolume;

        if (mode === "disabled") return;

        const safeNameEn = nameEn || "Prayer";
        const safeNameAr = nameAr || "الصلاة";

        const title =
          minutesBefore === 0
            ? `${safeNameEn} Time - حان وقت ${safeNameAr}`
            : `${safeNameEn} in ${minutesBefore} min - ${safeNameAr} خلال ${minutesBefore} دقيقة`;

        const body =
          minutesBefore === 0
            ? `It's time for ${safeNameEn} prayer. \nحان الآن موعد صلاة ${safeNameAr}.`
            : `Next prayer is ${safeNameEn} in ${minutesBefore} minutes. \nالصلاة القادمة هي ${safeNameAr} خلال ${minutesBefore} دقائق.`;

        new Notification(title, {
          body: body,
          icon: "/icon.png",
          tag: `prayer-${safeNameEn}-${minutesBefore}`,
          silent: true, // 3shan feh custom audio hysht8l
        });

        // 'muted' mode: show the notification popup but skip the adhan audio
        if (mode === "muted") return;

        try {
          const audioPath = `/adhanNotificationAudios/${safeNameEn ?? "Default"}${minutesBefore === 0 ? "_Now" : "_Before"}.mp3`;
          const audio = new Audio(audioPath);
          audio.volume = volume ?? 1.0;

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
  }, [permission, isSupported]);

  // Manage Timers
  useEffect(() => {
    if (prayerNotificationMode === "disabled") {
      if (workerRef.current) {
        workerRef.current.postMessage({ type: "STOP_TIMER" });
      }
      return;
    }

    if (workerRef.current && nextPrayerTime && permission === "granted") {
      workerRef.current.postMessage({
        type: "START_TIMER",
        payload: {
          prayerTime: nextPrayerTime,
          nameEn: nextPrayerNameEn,
          nameAr: nextPrayerNameAr,
          offsetsMinutes: prayerNotificationOffsets || [5, 0],
        },
      });
    }
  }, [
    nextPrayerTime,
    nextPrayerNameEn,
    nextPrayerNameAr,
    permission,
    prayerNotificationOffsets,
    prayerNotificationMode,
  ]);

  return null;
}
