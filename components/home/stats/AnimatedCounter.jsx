import { useEffect, useState } from "react";

export default function AnimatedCounter({ value, inView }) {
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;

    const raw = value.replace(/,/g, "");
    const target = parseInt(raw, 10);
    if (isNaN(target)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplay(value);
      return;
    }

    const duration = 1800;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(eased * target);
      setDisplay(current.toLocaleString());
      if (progress < 1) requestAnimationFrame(tick);
      else setDisplay(value);
    }

    requestAnimationFrame(tick);
  }, [inView, value]);

  return display;
}
