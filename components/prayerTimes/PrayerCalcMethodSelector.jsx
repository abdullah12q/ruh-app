import { useState } from "react";
import useUIStore from "@/lib/store/useUIStore";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Settings2 } from "lucide-react";
import { useCalcMethods } from "@/lib/queries/prayerTimes&Calendar";

export default function PrayerCalcMethodSelector() {
  const { prayerCalcMethod, setPrayerCalcMethod } = useUIStore();
  const [open, setOpen] = useState(false);
  const { data: methods, isLoading: methodsLoading } = useCalcMethods();
  const current = methods?.find((m) => m.id === prayerCalcMethod);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-xs font-inter text-text-secondary hover:text-text-primary transition-colors cursor-pointer group"
        aria-label="Change calculation method"
        disabled={methodsLoading}
      >
        <Settings2 size={15} className="text-accent" />
        <span>
          {methodsLoading ? "Loading..." : (current?.name ?? "Select method")}
        </span>
        <ChevronDown
          size={12}
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 "
            />

            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-[50%] -translate-x-1/2 backdrop-blur-md mb-3.5 right-0 w-72 glass rounded-xl p-1 z-50 shadow-xl max-h-64 overflow-y-auto"
            >
              {methodsLoading ? (
                <div className="px-3 py-2 text-xs text-text-secondary font-inter animate-pulse">
                  Loading methods...
                </div>
              ) : (
                methods?.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => {
                      setPrayerCalcMethod(method.id);
                      setOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-inter transition-all duration-150 cursor-pointer ${
                      method.id === prayerCalcMethod
                        ? "bg-accent/15 text-accent font-semibold"
                        : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                    }`}
                  >
                    {method.name}
                  </button>
                ))
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
