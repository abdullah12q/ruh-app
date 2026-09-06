let timers = [];

self.addEventListener("message", (event) => {
  const { type, payload } = event.data;

  if (type === "START_TIMER") {
    const {
      prayerTime, // timestamp (ms) of the prayer itself
      nameEn,
      nameAr,
      offsetsMinutes, // e.g. [5, 0] for two reminders
    } = payload;

    const now = Date.now();
    const schedule = [...offsetsMinutes];

    schedule.forEach((minutesBefore) => {
      // Create a unique ID for this specific timer occurrence
      const id = `${nameEn}-${prayerTime}-${minutesBefore}`;

      // Clear only if this EXACT timer is already scheduled
      const existingIdx = timers.findIndex((t) => t.id === id);
      // -1 y3ny msh mwgod
      if (existingIdx !== -1) {
        clearTimeout(timers[existingIdx].timeoutId);
        timers.splice(existingIdx, 1);
      }

      const fireAt = prayerTime - minutesBefore * 60 * 1000;
      const delay = fireAt - now;

      if (delay < 0) return; // already past, skip silently

      const timeoutId = setTimeout(
        () => {
          self.postMessage({
            type: "PRAYER_ALERT",
            payload: {
              minutesBefore,
              nameEn,
              nameAr,
            },
          });
          // Remove from tracking array once fired
          timers = timers.filter((t) => t.timeoutId !== timeoutId);
        },
        delay,
      );

      timers.push({ id, timeoutId });
    });
  }

  if (type === "STOP_TIMER") {
    timers.forEach((t) => clearTimeout(t.timeoutId));
    timers = [];
  }
});

self.addEventListener("error", (err) => {
  self.postMessage({ type: "WORKER_ERROR", payload: { message: err.message } });
});
