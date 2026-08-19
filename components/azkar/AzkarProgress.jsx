import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

export function AzkarProgress({
  getCategoryProgress,
  categoryId,
  categoryTitle,
  resetCategory,
}) {
  const { done, total } = getCategoryProgress(categoryId);
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="sticky top-0 z-10 glass rounded-xl px-4 py-3 mb-6 flex flex-col gap-2">
      <div className="flex items-center justify-between" dir="rtl">
        <span className="text-sm font-arabic-ui text-text-primary font-medium">
          {categoryTitle}
        </span>
        <div className="flex items-center gap-3 font-arabic-ui text-xs text-text-secondary">
          <span>
            {done}/{total} مكتمل
          </span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => resetCategory(categoryId)}
            className=" hover:text-accent transition-colors flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-accent/10 cursor-pointer"
          >
            <RotateCcw className="size-3" />
            إعادة القسم
          </motion.button>
        </div>
      </div>

      {/* Progress track */}
      <div className="h-1.5 rounded-full bg-(--surface-glass-border) overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-linear-to-l from-accent to-teal-400"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}
