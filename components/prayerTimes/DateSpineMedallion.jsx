export default function DateSpineMedallion() {
  return (
    <div className="relative shrink-0 flex items-center justify-center my-1 sm:my-0 sm:mx-1">
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        className="text-accent"
        style={{ filter: "drop-shadow(0 0 6px var(--accent-glow))" }}
      >
        <rect
          x="4"
          y="4"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
        />
        <rect
          x="4"
          y="4"
          width="18"
          height="18"
          transform="rotate(45 13 13)"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
        />
      </svg>
    </div>
  );
}
