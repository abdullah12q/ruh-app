import { motion } from "framer-motion";
import { Search } from "lucide-react";
import AnimatedSearchCloseIcon from "../AnimatedSearchCloseIcon";

export function MobileCategoryTabs({
  resetAll,
  categories,
  activeCategory,
  onSelect,
  searchQuery,
  setSearchQuery,
}) {
  return (
    <div className="lg:hidden mb-6 -mx-4 px-4 font-arabic-ui text-sm">
      <div className="mb-4 relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
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

      <div className="overflow-x-auto pb-1 custom-scrollbar">
        <div className="flex gap-2 min-w-max">
          {categories.length > 0 ? (
            categories.map((cat) => {
              const isActive = cat.id === activeCategory?.id;
              return (
                <motion.button
                  key={cat.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSelect(cat)}
                  dir="rtl"
                  className={`
                  px-4 py-2 rounded-full whitespace-nowrap transition-all duration-400
                  ${
                    isActive
                      ? "bg-accent text-white shadow-lg"
                      : "glass text-text-secondary hover:text-text-primary"
                  }
                `}
                >
                  {cat.title}
                </motion.button>
              );
            })
          ) : (
            <div className="text-sm text-text-secondary px-2 flex items-center">
              لا يوجد قسم بهذا الاسم
            </div>
          )}
        </div>
      </div>
      <button
        className="flex mx-auto my-2 px-4 py-2 rounded-full glass text-text-secondary hover:text-text-primary"
        onClick={resetAll}
      >
        إعادة كل الأقسام
      </button>
    </div>
  );
}
