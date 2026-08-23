import { AnimatePresence, motion } from "framer-motion";
import { gradeStyle } from "@/data/datas/hadithData";

export default function GradesSection({ grades, gradesOpen, setGradesOpen }) {
  return (
    grades && (
      <div className="border-t border-(--surface-glass-border)">
        {/* Toggle row */}
        <button
          type="button"
          onClick={() => setGradesOpen((o) => !o)}
          className="w-full flex items-center justify-between px-5 py-2.5 text-xs font-inter text-text-secondary hover:text-text-primary transition-colors duration-500 cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <span>🏷</span>
            <span>Grades</span>
            {/* Preview awl grade when collapsed */}
            {!gradesOpen && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-jakarta font-semibold ${gradeStyle(grades[0].grade)}`}
              >
                {grades[0].grade}
              </span>
            )}
            {grades.length > 1 && !gradesOpen && (
              <span className="text-[10px] text-text-secondary opacity-60">
                +{grades.length - 1} more
              </span>
            )}
          </span>
          <motion.span
            animate={{ rotate: gradesOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            ▾
          </motion.span>
        </button>

        {/* Expanded grade list */}
        <AnimatePresence initial={false}>
          {gradesOpen && (
            <motion.div
              key="grades-list"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <ul className="px-5 pb-4 pt-1 space-y-1.5">
                {grades.map((g, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-3 text-xs font-inter"
                  >
                    <span className="text-text-secondary truncate">
                      {g.name}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-jakarta font-semibold whitespace-nowrap shrink-0 ${gradeStyle(g.grade)}`}
                    >
                      {g.grade}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  );
}
