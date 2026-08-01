import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  buildArc,
  HORIZON_Y,
  PAD_X,
  urgencyColor,
  VB_HEIGHT,
  VB_WIDTH,
} from "@/data/datas/sunArcData";

export default function SunArc({
  prayers,
  nextPrayerKey,
  countdown,
  isLoading,
}) {
  const [now, setNow] = useState(() => new Date());
  const [reduceMotion, setReduceMotion] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  const [pathLength, setPathLength] = useState(0);
  const pathRef = useRef(null);
  const hasAnimatedRef = useRef(false);

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

  // Measure once so the draw-in animation only plays on first mount,
  // not on every re-render caused by the countdown ticking.
  useEffect(() => {
    if (!pathRef.current || hasAnimatedRef.current) return;
    setPathLength(pathRef.current.getTotalLength());
    hasAnimatedRef.current = true;
  }, [arc]);

  if (isLoading || !arc) {
    return <div className="w-full aspect-800/220 rounded-2xl skeleton" />;
  }

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const inRange = nowMinutes >= arc.tFajr && nowMinutes <= arc.tIsha;
  const clamped = Math.min(Math.max(nowMinutes, arc.tFajr), arc.tIsha);
  const curX = arc.xFor(clamped);
  const curY = arc.yFor(clamped);
  const isDay = nowMinutes >= arc.tSunrise && nowMinutes <= arc.tMaghrib;
  const glow = urgencyColor(countdown);
  const activeMarker = arc.markers.find((m) => m.key === activeKey);

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
        className="w-full aspect-800/220"
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

        {/* the sun path — draws itself in once on mount */}
        <path
          ref={pathRef}
          d={arc.path}
          fill="none"
          stroke="url(#arc-stroke)"
          strokeWidth={2}
          strokeLinecap="round"
          style={
            reduceMotion || !pathLength
              ? undefined
              : {
                  strokeDasharray: pathLength,
                  strokeDashoffset: pathLength,
                  animation: "sun-arc-draw 1.4s ease-out forwards",
                }
          }
        />

        {/* live "now" guide line down to the horizon */}
        {inRange && (
          <line
            x1={curX}
            y1={curY}
            x2={curX}
            y2={HORIZON_Y}
            stroke={glow}
            strokeWidth={1}
            strokeDasharray="2 4"
            opacity={0.45}
          />
        )}

        {/* prayer markers */}
        {arc.markers.map((m) => (
          <g
            key={m.key}
            tabIndex={0}
            role="button"
            aria-label={`${m.label}, ${m.formattedTime}`}
            onMouseEnter={() => setActiveKey(m.key)}
            onMouseLeave={() => setActiveKey((k) => (k === m.key ? null : k))}
            onFocus={() => setActiveKey(m.key)}
            onBlur={() => setActiveKey((k) => (k === m.key ? null : k))}
            onClick={() => setActiveKey((k) => (k === m.key ? null : m.key))}
            className="cursor-pointer outline-none"
          >
            {/* invisible hit area for touch in mobile*/}
            <circle cx={m.x} cy={m.y} r={14} fill="transparent" />

            {m.isNext && (
              <circle cx={m.x} cy={m.y} r={9} fill={glow} opacity={0.22}>
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
              r={m.isNext || activeKey === m.key ? 5 : 3.5}
              fill={
                m.isNext
                  ? glow
                  : activeKey === m.key
                    ? "var(--accent)"
                    : "var(--surface)"
              }
              stroke={m.isNext ? glow : "var(--text-secondary)"}
              strokeWidth={1.2}
              className="transition-all duration-200"
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

      {/* floating detail tooltip */}
      <AnimatePresence>
        {activeMarker && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute backdrop-blur-xs font-jakarta text-[10px] sm:text-xs glass rounded-xl px-2 sm:px-3 py-1 sm:py-2 text-center pointer-events-none translate-x-[-50%] translate-y-[-125%]"
            style={{
              left: `${(activeMarker.x / VB_WIDTH) * 100}%`,
              top: `${(activeMarker.y / VB_HEIGHT) * 100}%`,
            }}
          >
            <p className="font-bold text-text-primary whitespace-nowrap">
              {activeMarker.label}{" "}
              <span className="font-quran text-text-secondary ml-1" dir="rtl">
                {activeMarker.labelAr}
              </span>
            </p>
            <p className="font-semibold sm:text-[11px] tabular-nums text-accent">
              {activeMarker.formattedTime}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* deep-night state */}
      {!inRange && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="glass rounded-full px-3 py-1.5 text-[10px] sm:text-xs font-inter text-text-secondary tracking-wide">
            Deep night · {nextPrayerKey} next
          </span>
        </div>
      )}
    </div>
  );
}
