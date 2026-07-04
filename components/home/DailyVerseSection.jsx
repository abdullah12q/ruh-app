"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { dailyVerse } from "@/data/homeData";

export default function DailyVerseSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ type: "spring", duration: 1.4 }}
        >
          {/* Section Label */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-accent text-xs font-semibold font-jakarta tracking-wider uppercase mb-8">
            <Sparkles size={12} />
            Verse of the Day
          </div>

          {/* Glass Card */}
          <div className="glass rounded-3xl p-8 sm:p-12 relative overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent opacity-[0.04] rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              {/* Arabic Ayah */}
              <p
                className="font-quran text-3xl sm:text-4xl md:text-5xl text-text-primary mb-8 leading-loose text-center!"
                dir="rtl"
                lang="ar"
              >
                {dailyVerse.arabic}
              </p>

              {/* Divider */}
              <div className="w-16 h-px bg-(--accent)/40 mx-auto mb-6" />

              {/* Translation */}
              <p className="font-inter text-lg text-text-secondary italic mb-4">
                &ldquo;{dailyVerse.translation}&rdquo;
              </p>

              {/* Reference */}
              <p className="text-sm text-accent font-medium font-jakarta">
                — {dailyVerse.reference}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
