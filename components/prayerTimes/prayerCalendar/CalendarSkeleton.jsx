export default function CalendarSkeleton({ rows = 10 }) {
  return (
    <div className="space-y-1 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-2 p-3 rounded-xl">
          <div className="w-24 h-4 skeleton rounded" />
          <div className="flex-1 grid grid-cols-6 gap-2">
            {Array.from({ length: 6 }).map((_, j) => (
              <div key={j} className="h-4 skeleton rounded" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
