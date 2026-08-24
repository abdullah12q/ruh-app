"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { staggerContainer } from "@/data/animationVariants";
import { stats } from "@/data/datas/homeData";
import StatCard from "./StateCard";

export default function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  return (
    <section ref={ref} className="relative py-20 px-4 sm:px-6 lg:px-8">
      {/* Background decorative blobs */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/4 size-96 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 size-64 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2" />
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-accent/20 text-accent text-xs font-semibold font-jakarta tracking-widest uppercase">
            <span className="size-1.5 rounded-full bg-accent animate-pulse" />
            By The Numbers
          </span>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-5"
          style={{ perspective: 1200 }}
        >
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} inView={inView} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
