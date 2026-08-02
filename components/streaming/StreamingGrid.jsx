export default function StreamingGrid({ Icon, type, count, children }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-5">
        <Icon size={16} className="text-accent" />
        <h2 className="font-jakarta font-semibold text-text-primary text-sm tracking-wide uppercase">
          All {type}s
        </h2>
        <div className="flex-1 h-px bg-white/6" />
        <span className="text-text-secondary text-xs font-inter">
          {count} {type}
          {count !== 1 ? "s" : ""}
        </span>
      </div>

      {children}
    </div>
  );
}
