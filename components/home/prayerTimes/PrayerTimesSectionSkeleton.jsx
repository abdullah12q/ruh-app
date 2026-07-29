export default function PrayerTimesSectionSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="glass rounded-2xl p-5 space-y-3">
          <div className="size-10 skeleton rounded-xl" />
          <div className="h-3 skeleton rounded w-3/4" />
          <div className="h-4 skeleton rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}
