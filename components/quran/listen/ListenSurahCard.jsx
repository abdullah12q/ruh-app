"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Headphones, Mic } from "lucide-react";
import { revelationBadge } from "@/data/datas/quranData";

export default function ListenSurahCard({ surah, index }) {
  const badge = revelationBadge[surah.revelation_place];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{
        type: "spring",
        damping: 60,
        stiffness: 200,
        delay: Math.min(index * 0.02, 0.3),
      }}
    >
      <Link
        href={`/quran/listen/${surah.id}`}
        className="group relative overflow-hidden glass rounded-2xl p-5 flex items-center gap-4 hover:border-accent/30 transition-all duration-300 hover:shadow-[0_0_28px_rgba(20,184,166,0.1)]"
      >
        {/* Top sweep */}
        <span className="absolute top-0 left-0 h-px bg-linear-to-r from-transparent via-accent to-transparent w-0 group-hover:w-full transition-all duration-700 ease-out" />

        {/* Surah Number Badge */}
        <div className="size-11 shrink-0 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-sm font-bold font-jakarta text-accent group-hover:bg-accent/20 transition-colors duration-300 relative overflow-hidden">
          <span className="group-hover:opacity-0 transition-opacity duration-200">
            {surah.id}
          </span>
          <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Headphones size={14} className="text-accent" />
          </span>
        </div>

        {/* Surah Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-jakarta font-bold text-sm text-text-primary truncate">
              {surah.name_simple}
            </h2>
            {/* Floating Arabic name */}
            <span
              aria-hidden
              className="pointer-events-none select-none absolute right-16 -top-4 font-quran text-[2.5rem] sm:text-[3rem] leading-none text-accent/50 group-hover:text-accent group-hover:-translate-x-1 transition-all duration-500 whitespace-nowrap"
            >
              {surah.name_arabic}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-text-secondary font-inter">
              {surah.verses_count} verses
            </span>
            <span className="text-text-secondary/30">·</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full border font-medium ${badge.className}`}
            >
              {badge.label}
            </span>
          </div>
        </div>

        {/* Listen CTA */}
        <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent/10 border border-accent/20 text-accent text-xs font-semibold font-jakarta group-hover:bg-accent group-hover:text-white group-hover:border-transparent transition-all duration-300 z-10">
          <Mic size={11} />
          Listen
        </div>
      </Link>
    </motion.div>
  );
}
