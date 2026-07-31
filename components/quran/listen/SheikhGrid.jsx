import { motion, AnimatePresence } from "framer-motion";
import SheikhCard from "./SheikhCard";
import { getMoshafStyle } from "@/data/datas/audioData";

export default function SheikhGrid({
  filteredReciters,
  selectedReciter,
  selectedMoshaf,
  handleSelectReciter,
  debouncedSearch,
  styleFilter,
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${debouncedSearch}-${styleFilter}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
      >
        {filteredReciters.length > 0 ? (
          filteredReciters.map((reciter, i) => (
            <SheikhCard
              key={reciter.id}
              reciter={reciter}
              isSelected={selectedReciter?.id === reciter.id}
              selectedMoshaf={
                selectedReciter?.id === reciter.id ? selectedMoshaf : null
              }
              onSelect={handleSelectReciter}
              getMoshafStyle={getMoshafStyle}
              index={i}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-16 text-text-secondary font-inter text-sm">
            No reciters found matching your search.
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
