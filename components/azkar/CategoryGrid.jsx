import { useMemo } from "react";
import { ThikrCard } from "./ThikrCard";

export function CategoryGrid({
  progress,
  getCategoryItems,
  categoryId,
  decrementThikr,
  resetThikr,
}) {
  const items = useMemo(
    () => getCategoryItems(categoryId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [categoryId, progress, getCategoryItems],
  );

  return (
    <div className="grid grid-cols-1 gap-4">
      {items.map((item) => (
        <ThikrCard
          key={item.key}
          decrementThikr={decrementThikr}
          resetThikr={resetThikr}
          item={item}
        />
      ))}
    </div>
  );
}
