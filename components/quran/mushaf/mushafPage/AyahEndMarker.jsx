export default function AyahEndMarker({ text, isActive, fontSize }) {
  return (
    <span
      className={`inline-flex items-center justify-center font-quran ${fontSize} select-none transition-all duration-300 ${
        isActive
          ? "text-accent drop-shadow-[0_0_8px_var(--accent-glow)]"
          : "text-accent/70"
      }`}
      aria-hidden="true"
    >
      {text}
    </span>
  );
}
