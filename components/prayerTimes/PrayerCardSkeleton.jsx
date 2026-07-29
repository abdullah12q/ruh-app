export default function PrayerCardSkeleton() {
  return (
    <div className="glass rounded-2xl p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div className="size-12 skeleton rounded-xl" />
      </div>
      <div className="space-y-2">
        <div className="h-4 skeleton rounded w-2/3" />
        <div className="h-3 skeleton rounded w-1/3" />
      </div>
      <div className="h-6 skeleton rounded w-1/2" />
    </div>
  );
}
