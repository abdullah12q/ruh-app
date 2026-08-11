import Link from "next/link";
import { Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen pt-4 flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-150 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)",
          opacity: 0.35,
        }}
      />

      {/* Ghost Arabic watermark */}
      <span
        className="absolute font-quran select-none pointer-events-none text-[26vw] leading-none text-text-primary opacity-[0.035]"
        aria-hidden="true"
      >
        مفقود
      </span>

      <div className="relative flex flex-col items-center animate-fade-up">
        {/* Signature: broken mihrab arch */}
        <div className="relative w-full max-w-110 aspect-440/320 mb-3">
          <svg
            viewBox="0 0 440 320"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Eight-point star lattice, faint, rotating */}
            <g
              className="motion-safe:animate-[spin_60s_linear_infinite] origin-center"
              style={{ transformOrigin: "220px 170px" }}
              opacity="0.12"
            >
              <path
                d="M220 60 L235 130 L305 145 L235 160 L220 230 L205 160 L135 145 L205 130 Z"
                stroke="var(--accent)"
                strokeWidth="1"
              />
              <path
                d="M220 75 L232 135 L292 148 L232 161 L220 221 L208 161 L148 148 L208 135 Z"
                stroke="var(--accent)"
                strokeWidth="1"
                transform="rotate(22.5 220 170)"
              />
            </g>

            {/* Outer arch outline */}
            <path
              d="M60 300 L60 160 Q60 60 220 60 Q380 60 380 160 L380 300"
              stroke="var(--accent)"
              strokeWidth="1.5"
              strokeOpacity="0.35"
              strokeLinecap="round"
            />
            {/* Inner arch outline */}
            <path
              d="M92 300 L92 175 Q92 92 220 92 Q348 92 348 175 L348 300"
              stroke="var(--accent)"
              strokeWidth="1"
              strokeOpacity="0.2"
              strokeLinecap="round"
            />

            {/* Base line */}
            <line
              x1="40"
              y1="300"
              x2="400"
              y2="300"
              stroke="var(--surface-glass-border)"
              strokeWidth="1"
            />

            {/* The crack — the break in the path */}
            <path
              d="M220 60 L206 122 L238 152 L198 214 L222 260 L210 300"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="motion-safe:animate-pulse"
              style={{ filter: "drop-shadow(0 0 6px var(--accent-glow))" }}
            />

            {/* Debris along the crack */}
            <circle
              cx="206"
              cy="122"
              r="2.5"
              fill="var(--accent)"
              opacity="0.6"
            />
            <circle
              cx="238"
              cy="152"
              r="2"
              fill="var(--accent)"
              opacity="0.5"
            />
            <circle
              cx="198"
              cy="214"
              r="2.5"
              fill="var(--accent)"
              opacity="0.6"
            />
            <circle
              cx="176"
              cy="180"
              r="1.5"
              fill="var(--accent)"
              opacity="0.4"
            />
            <circle
              cx="258"
              cy="200"
              r="1.5"
              fill="var(--accent)"
              opacity="0.4"
            />
          </svg>
        </div>

        <div className="glass flex items-center gap-2 px-4 py-1.5 rounded-full w-fit mx-auto mb-3">
          <Compass className="size-3.5 text-accent" strokeWidth={2} />
          <span
            className="text-[11px] font-jakarta font-semibold tracking-[0.2em] text-text-secondary uppercase"
            style={{ filter: "drop-shadow(0 0 24px var(--accent-glow))" }}
          >
            Error 404
          </span>
        </div>

        <h1 className="font-jakarta text-3xl sm:text-4xl font-bold text-text-primary text-center tracking-tight">
          You&apos;ve Stepped Off the Path
        </h1>
        <p className="mt-4 max-w-md text-center text-text-secondary text-base leading-relaxed">
          The page you&apos;re looking for has moved, been renamed, or never
          existed. Let&apos;s guide you back.
        </p>

        {/* Actions */}
        <Link
          href="/"
          className="mt-10 group inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-accent text-white font-jakarta font-medium text-sm transition-all duration-300 hover:shadow-[0_0_30px_var(--accent-glow)] hover:-translate-y-0.5 w-full sm:w-auto"
        >
          <Home className="size-4" strokeWidth={2} />
          Return Home
        </Link>

        {/* Micro footer line */}
        <div className="mt-7 flex items-center gap-2 text-text-secondary/70">
          <Compass className="size-3.5" strokeWidth={2} />
          <span className="text-xs font-jakarta">
            Lost? The path home is always open.
          </span>
        </div>
      </div>
    </div>
  );
}
