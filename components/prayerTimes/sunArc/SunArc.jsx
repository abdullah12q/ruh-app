import {
  buildArc,
  HORIZON_Y,
  PAD_X,
  VB_HEIGHT,
  VB_WIDTH,
} from "@/data/datas/sunArcData";
import { useEffect, useMemo, useState } from "react";

export default function SunArc({ prayers, nextPrayerKey, isLoading }) {
  const [now, setNow] = useState(() => new Date());
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduceMotion(mq.matches);
    return () => clearInterval(id);
  }, []);

  const arc = useMemo(
    () => (prayers?.length ? buildArc(prayers) : null),
    [prayers],
  );

  if (isLoading || !arc) {
    return <div className="w-full h-45 sm:h-55 rounded-2xl skeleton" />;
  }

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const inRange = nowMinutes >= arc.tFajr && nowMinutes <= arc.tIsha;
  const clamped = Math.min(Math.max(nowMinutes, arc.tFajr), arc.tIsha);
  const curX = arc.xFor(clamped);
  const curY = arc.yFor(clamped);
  const isDay = nowMinutes >= arc.tSunrise && nowMinutes <= arc.tMaghrib;

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
        className="w-full h-45 sm:h-55"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="arc-stroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--sun-arc-dawn)" />
            <stop offset="18%" stopColor="var(--accent)" />
            <stop offset="50%" stopColor="#5EEAD4" />
            <stop offset="82%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--sun-arc-dusk)" />
          </linearGradient>
          <linearGradient id="arc-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="sun-glow">
            <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="moon-glow">
            <stop
              offset="0%"
              stopColor="var(--sun-arc-moon)"
              stopOpacity="0.6"
            />
            <stop
              offset="100%"
              stopColor="var(--sun-arc-moon)"
              stopOpacity="0"
            />
          </radialGradient>
        </defs>

        {/* faint night stars — invisible in light mode via --sun-arc-star-opacity */}
        {[
          [40, 30],
          [90, 55],
          [720, 40],
          [760, 70],
          [660, 25],
        ].map(([sx, sy], i) => (
          <circle
            key={i}
            cx={sx}
            cy={sy}
            r={1.4}
            fill="var(--text-secondary)"
            style={{ opacity: "var(--sun-arc-star-opacity)" }}
          />
        ))}

        {/* horizon */}
        <line
          x1={PAD_X}
          y1={HORIZON_Y}
          x2={VB_WIDTH - PAD_X}
          y2={HORIZON_Y}
          stroke="var(--surface-glass-border)"
          strokeDasharray="3 5"
          strokeWidth={1}
        />

        {/* area under the day portion of the curve */}
        <path
          d={`${arc.path} L ${VB_WIDTH - PAD_X} ${HORIZON_Y} L ${PAD_X} ${HORIZON_Y} Z`}
          fill="url(#arc-fill)"
        />

        {/* the sun path itself */}
        <path
          d={arc.path}
          fill="none"
          stroke="url(#arc-stroke)"
          strokeWidth={2}
          strokeLinecap="round"
        />

        {/* prayer markers */}
        {arc.markers.map((m) => (
          <g key={m.key}>
            {m.isNext && (
              <circle
                cx={m.x}
                cy={m.y}
                r={9}
                fill="var(--accent)"
                opacity={0.22}
              >
                {!reduceMotion && (
                  <>
                    <animate
                      attributeName="r"
                      values="9;15;9"
                      dur="2.6s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.28;0.05;0.28"
                      dur="2.6s"
                      repeatCount="indefinite"
                    />
                  </>
                )}
              </circle>
            )}
            <circle
              cx={m.x}
              cy={m.y}
              r={m.isNext ? 5 : 3.5}
              fill={m.isNext ? "var(--accent)" : "var(--surface)"}
              stroke={m.isNext ? "var(--accent)" : "var(--text-secondary)"}
              strokeWidth={1.2}
            />
          </g>
        ))}

        {/* current sun/moon position */}
        {inRange && (
          <>
            <circle
              cx={curX}
              cy={curY}
              r={22}
              fill={isDay ? "url(#sun-glow)" : "url(#moon-glow)"}
            />
            <circle
              cx={curX}
              cy={curY}
              r={4.5}
              fill={isDay ? "#FBBF24" : "var(--sun-arc-moon)"}
            />
          </>
        )}
      </svg>

      {!inRange && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[9px] sm:text-sm font-inter text-text-secondary/60 tracking-wide">
            Deep night · {nextPrayerKey} next
          </span>
        </div>
      )}
    </div>
  );
}
