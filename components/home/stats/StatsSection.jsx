"use client";

import { motion } from "framer-motion";
import { staggerContainer, cardVariant } from "@/data/animationVariants";
import { stats } from "@/data/datas/homeData";

export default function StatsSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={cardVariant}
              className="glass rounded-2xl p-6 text-center"
            >
              <p className="text-3xl sm:text-4xl font-extrabold text-accent font-jakarta mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-text-secondary font-medium font-jakarta">
                {stat.label}
              </p>
              <p className="text-xs text-(--text-secondary)/60 font-arabic-ui mt-0.5">
                {stat.labelAr}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
