export default function AyahEndMarker({ text, isActive }) {
  return (
    <span
      className={`inline-flex items-center justify-center font-quran text-2xl sm:text-3xl -my-5 select-none transition-all duration-300 ${
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
