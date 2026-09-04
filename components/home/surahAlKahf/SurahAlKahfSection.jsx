"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Star } from "lucide-react";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { fadeUp } from "@/data/animationVariants";
import { isAlKahfTime, KAHF_CONTENT } from "@/data/datas/homeData";
import Particles from "./Particles";
import SurahAlKahfHeader from "./SurahAlKahfHeader";
import SurahAlKahfName from "./SurahAlKahfName";
import SurahAlKahfCTA from "./SurahAlKahfCTA";
import SurahAlKahfHadith from "./SurahAlKahfHadith";
import SurahAlKahfSource from "./SurahAlKahfSource";

export default function SurahAlKahfSection() {
  const { permissionDenied, prayers, isLoading } = usePrayerTimes();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — only run on client
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Get today's Maghrib time from the prayer times hook
  const maghribTime = useMemo(() => {
    const maghrib = prayers?.find((p) => p.key === "Maghrib");
    return maghrib?.rawTime ?? null;
  }, [prayers]);

  const shouldShow = useMemo(() => {
    if (!mounted) return false;
    // If prayer data is still loading, hnst5dm el default fallback ely gowa isAlKahfTime
    return isAlKahfTime(isLoading ? null : maghribTime);
  }, [mounted, maghribTime, isLoading]);

  return (
    <AnimatePresence>
      {shouldShow && !permissionDenied && (
        <motion.section
          key="kahf-section"
          aria-label="Surah Al-Kahf Friday reminder"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.7 }}
          className="py-20 px-4 sm:px-6 lg:px-8 relative"
        >
          {/* Ambient glow background */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-100 rounded-full opacity-30 blur-3xl bg-amber-400/30" />
            <div className="absolute top-0 right-1/4 size-64 rounded-full opacity-20 blur-3xl bg-teal-400/40" />
            <div className="absolute bottom-0 left-1/4 size-64 rounded-full opacity-20 blur-3xl bg-indigo-400/30" />
          </div>

          {/* Animated Background Floating Particles */}
          <Particles />

          <div className="max-w-4xl mx-auto relative z-10">
            {/* Header */}
            <SurahAlKahfHeader kahfContent={KAHF_CONTENT} />

            {/* Surah Name Ornament */}
            <SurahAlKahfName kahfContent={KAHF_CONTENT} />

            {/* Hadith Card */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="relative rounded-3xl overflow-hidden p-px"
              style={{
                background:
                  "linear-gradient(135deg, rgba(251,191,36,0.4) 0%, rgba(20,184,166,0.2) 50%, rgba(99,102,241,0.2) 100%)",
              }}
            >
              {/* Inner card */}
              <div className="relative rounded-3xl glass p-8 sm:p-10">
                {/* Star decoration top-right */}
                <div className="absolute top-5 right-6 flex gap-1.5 opacity-40">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                      transition={{
                        duration: 2.5,
                        delay: i * 0.4,
                        repeat: Infinity,
                      }}
                    >
                      <Star
                        size={10}
                        className="fill-amber-400 text-amber-400"
                      />
                    </motion.div>
                  ))}
                </div>

                {/* BookOpen Icon */}
                <div className="flex items-center justify-center mb-6">
                  <div className="size-14 rounded-2xl flex items-center justify-center bg-amber-400/10 border border-amber-400/20">
                    <BookOpen size={24} className="text-amber-500" />
                  </div>
                </div>

                {/* Hadith — bilingual */}
                <SurahAlKahfHadith kahfContent={KAHF_CONTENT} />

                {/* Source — bilingual */}
                <SurahAlKahfSource kahfContent={KAHF_CONTENT} />
              </div>
            </motion.div>

            {/* CTA Button */}
            <SurahAlKahfCTA kahfContent={KAHF_CONTENT} />
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
