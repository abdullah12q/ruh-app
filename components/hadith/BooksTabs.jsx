import { motion } from "framer-motion";
import { TOTAL_COUNTS } from "@/data/datas/hadithData";

export default function BooksTabs({
  TABS,
  activeTab,
  setActiveTab,
  setQuery,
  BOOKS_BY_COLLECTION,
}) {
  return (
    <div className="grid sm:grid-cols-3 gap-3 mb-8">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setQuery("");
            }}
            className={`relative glass rounded-2xl p-4 text-left transition-all duration-500 cursor-pointer group ${
              isActive
                ? "border-accent/40! shadow-lg! shadow-accent/20!"
                : "hover:border-accent/20!"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="active-collection"
                initial={false}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute inset-0 bg-accent/5 rounded-2xl"
              />
            )}
            <div className="relative">
              <div
                className={`flex items-center gap-2 mb-2 ${isActive ? "text-accent" : "text-text-secondary group-hover:text-accent/70"} transition-colors duration-500`}
              >
                <Icon size={14} />
                <span className="font-jakarta font-semibold text-xs uppercase tracking-wider">
                  {tab.label}
                </span>
              </div>
              <p
                className={`font-jakarta font-bold text-xl ${isActive ? "text-text-primary" : "text-text-secondary"} transition-colors`}
              >
                {TOTAL_COUNTS[tab.id].toLocaleString()}
              </p>
              <p className="text-text-secondary text-xs font-inter mt-0.5">
                hadiths · {BOOKS_BY_COLLECTION[tab.id].length} books
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
