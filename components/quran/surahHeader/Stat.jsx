export function Stat({ icon: Icon, label, value, capitalize = false }) {
  return (
    <div className="flex min-w-23 flex-1 flex-col items-center gap-1.5 px-4 py-4">
      <Icon size={14} className="text-accent/70" strokeWidth={1.5} />
      <span
        className={`font-jakarta text-sm font-semibold tabular-nums text-text-primary ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value}
      </span>
      <span className="font-jakarta text-[10px] uppercase tracking-[0.15em] text-text-secondary/70">
        {label}
      </span>
    </div>
  );
}
