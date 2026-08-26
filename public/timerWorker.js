let timers = [];

function clearAllTimers() {
  timers.forEach((t) => clearTimeout(t.timeoutId));
  timers = [];
}

self.addEventListener("message", (event) => {
  const { type, payload } = event.data;

  if (type === "START_TIMER") {
    const {
      prayerTime, // timestamp (ms) of the prayer itself
      prayerName,
      offsetsMinutes = [5], // e.g. [15, 5] for two reminders
      graceMs = 60 * 1000, // still fire if we wake up up to this late
    } = payload;

    clearAllTimers();
    const now = Date.now();
    const schedule = [...offsetsMinutes, 0]; // 0 = prayer time itself

    schedule.forEach((minutesBefore) => {
      const fireAt = prayerTime - minutesBefore * 60 * 1000;
      const delay = fireAt - now;

      if (delay < -graceMs) return; // too late, skip silently

      const timeoutId = setTimeout(
        () => {
          self.postMessage({
            type: "PRAYER_ALERT",
            payload: {
              minutesBefore,
              message:
                minutesBefore === 0
                  ? `${prayerName || "Prayer"} time has begun`
                  : `${prayerName || "Prayer"} in ${minutesBefore} min`,
            },
          });
        },
        Math.max(delay, 0),
      );

      timers.push({ id: `${prayerName}-${minutesBefore}`, timeoutId });
    });
  }

  if (type === "STOP_TIMER") {
    clearAllTimers();
  }
});

self.addEventListener("error", (err) => {
  self.postMessage({ type: "WORKER_ERROR", payload: { message: err.message } });
});
