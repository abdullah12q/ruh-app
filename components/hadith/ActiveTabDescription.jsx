import { AnimatePresence, motion } from "framer-motion";

export default function ActiveTabDescription({
  activeTab,
  activeTabInfo,
  query,
  filteredBooks,
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-jakarta font-bold text-xl text-text-primary flex items-center gap-2">
            {activeTabInfo?.label}
            <span
              className="font-quran text-accent text-base"
              dir="rtl"
              lang="ar"
            >
              {activeTabInfo?.labelAr}
            </span>
          </h2>
          <p className="text-text-secondary text-sm font-inter mt-0.5">
            {activeTabInfo?.description}
          </p>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {query && filteredBooks.length > 0 && (
          <motion.p
            key={query}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
            className="text-text-secondary text-sm font-inter"
          >
            {filteredBooks.length} result
            {filteredBooks.length !== 1 ? "s" : ""}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
