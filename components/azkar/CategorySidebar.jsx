import { motion } from "framer-motion";
import { RotateCcw, Search } from "lucide-react";
import AnimatedSearchCloseIcon from "../AnimatedSearchCloseIcon";

export function CategorySidebar({
  resetAll,
  categories,
  activeCategory,
  onSelect,
  searchQuery,
  setSearchQuery,
}) {
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 sticky top-24 self-start max-h-[calc(100vh-7rem)]">
      <div className="flex items-center justify-between mb-2 font-arabic-ui text-xs text-text-secondary shrink-0">
        <p>الأقسام</p>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={resetAll}
          className="hover:text-accent transition-colors flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-accent/10 cursor-pointer"
        >
          <RotateCcw className="size-3" />
          إعادة كل الأقسام
        </motion.button>
      </div>

      <div className="mb-3 relative shrink-0">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-text-secondary" />
        <input
          type="text"
          placeholder="ابحث عن قسم..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full glass rounded-xl py-2 pr-9 pl-3 text-sm focus:outline-none focus:border-accent/50! transition-colors duration-400 text-text-primary placeholder:text-text-secondary/50 font-arabic-ui"
          dir="rtl"
        />

        <AnimatedSearchCloseIcon
          value={searchQuery}
          position="left-3"
          onChange={setSearchQuery}
        />
      </div>

      <div className="flex flex-col gap-1 overflow-y-auto pl-1 flex-1 custom-scrollbar pb-4">
        {categories.length > 0 ? (
          categories.map((cat) => {
            const isActive = cat.id === activeCategory?.id;
            return (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelect(cat)}
                disabled={isActive}
                dir="rtl"
                className={`
              flex items-center gap-3 w-full text-right px-3 py-2.5 border border-transparent rounded-xl
              text-sm font-arabic-ui transition-all duration-400
              ${
                isActive
                  ? "bg-accent/15 text-accent border-accent/25 font-medium"
                  : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
              } cursor-pointer`}
              >
                <span className="truncate">{cat.title}</span>
                {isActive && (
                  <motion.span
                    layoutId="sidebar-indicator"
                    className="ml-auto size-1.5 rounded-full bg-accent shrink-0"
                  />
                )}
              </motion.button>
            );
          })
        ) : (
          <div className="text-center py-8 text-sm text-text-secondary font-arabic-ui">
            لا يوجد قسم بهذا الاسم
          </div>
        )}
      </div>
    </aside>
  );
}
