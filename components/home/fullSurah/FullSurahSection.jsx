"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Download,
  Headphones,
  Play,
  ChevronRight,
  Wifi,
  WifiOff,
  Mic,
} from "lucide-react";
import {
  fadeUp,
  staggerContainer,
  cardVariant,
} from "@/data/animationVariants";
import { CAPABILITIES, FEATURED_SURAHS } from "@/data/datas/homeData";

export default function FullSurahSection() {
  const [hoveredSurah, setHoveredSurah] = useState(null);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 size-125 bg-violet-600 opacity-[0.07] rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-0 size-80 bg-accent opacity-[0.06] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 size-64 bg-cyan-400 opacity-[0.05] rounded-full blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-violet-400 text-xs font-semibold font-jakarta tracking-widest uppercase mb-5 border border-violet-400/20">
            <Download size={11} />
            Listen &amp; Download
          </div>

          <h2 className="font-jakarta font-bold text-3xl sm:text-4xl text-text-primary mb-4">
            Experience the{" "}
            <span className="bg-linear-to-r from-violet-400 via-accent to-cyan-400 bg-clip-text text-transparent">
              complete Surah
            </span>
            , uninterrupted
          </h2>
          <p className="font-inter text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Designed for deep listening and spiritual reflection.{" "}
            <span className="text-text-primary font-medium">
              Pick any of the 114 Surahs
            </span>
            , choose from{" "}
            <span className="text-violet-400 font-semibold">
              215+ world-class Sheikhs
            </span>{" "}
            with full Surah recordings, and listen or download — all in one
            immersive experience.
          </p>
        </motion.div>

        {/* Main grid: Left = features, Right = interactive surah preview */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* LEFT — Capability cards + CTA */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="flex flex-col gap-5"
          >
            {CAPABILITIES.map(({ icon: Icon, color, bg, title, desc }) => (
              <motion.div
                key={title}
                variants={cardVariant}
                className="flex items-start gap-4 glass rounded-2xl p-5 hover:border-violet-400/30 transition-all duration-300"
              >
                <div
                  className={`shrink-0 size-10 rounded-xl ${bg} flex items-center justify-center`}
                >
                  <Icon size={18} className={color} />
                </div>
                <div>
                  <h3 className="font-jakarta font-semibold text-text-primary text-sm mb-1">
                    {title}
                  </h3>
                  <p className="font-inter text-text-secondary text-xs leading-relaxed">
                    {desc}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Mode comparison badge */}
            <motion.div
              variants={cardVariant}
              className="glass rounded-2xl p-4 border border-violet-400/15"
            >
              <p className="font-jakarta text-xs font-semibold text-text-secondary uppercase tracking-widest mb-3">
                Two modes, one app
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-accent/8 border border-accent/20 p-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Headphones size={12} className="text-accent" />
                    <span className="font-jakarta text-[11px] font-bold text-accent">
                      Listen &amp; Read
                    </span>
                  </div>
                  <p className="font-inter text-[10px] text-text-secondary leading-relaxed">
                    Verse-by-verse audio synced with the text
                  </p>
                </div>
                <div className="rounded-xl bg-violet-400/8 border border-violet-400/20 p-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Download size={12} className="text-violet-400" />
                    <span className="font-jakarta text-[11px] font-bold text-violet-400">
                      Listen &amp; Download
                    </span>
                  </div>
                  <p className="font-inter text-[10px] text-text-secondary leading-relaxed">
                    Full Surah in one continuous recitation
                  </p>
                </div>
              </div>
            </motion.div>

            {/* CTA button */}
            <motion.div variants={cardVariant}>
              <Link
                href="/quran/listen"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-linear-to-r from-violet-500 to-accent text-white font-semibold font-jakarta text-sm hover:opacity-90 hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] active:scale-95 transition-all duration-500"
              >
                <Mic size={16} />
                Explore Listen &amp; Download
                <ChevronRight size={16} />
              </Link>
            </motion.div>
          </motion.div>

          {/* RIGHT — Animated Surah preview card */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="relative"
          >
            {/* Glowing card container */}
            <div className="glass rounded-3xl p-6 border border-violet-400/20 shadow-[0_0_60px_rgba(139,92,246,0.08)]">
              {/* Card header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="font-jakarta text-xs text-text-secondary uppercase tracking-widest font-semibold">
                    Browse Surahs
                  </p>
                  <h3 className="font-jakarta font-bold text-text-primary mt-0.5">
                    Pick a Surah to Begin
                  </h3>
                </div>
                {/* online / offline indicator */}
                <div className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-full text-xs font-jakarta font-medium text-accent border border-accent/20 whitespace-nowrap">
                  <Wifi size={11} />
                  Online <span className="ml-0.5">+</span> <WifiOff size={11} />{" "}
                  Offline
                </div>
              </div>

              {/* Surah list preview */}
              <div className="flex flex-col gap-2 mb-5">
                {FEATURED_SURAHS.map((surah, i) => (
                  <motion.div
                    key={surah.id}
                    variants={cardVariant}
                    custom={i}
                    onHoverStart={() => setHoveredSurah(surah.id)}
                    onHoverEnd={() => setHoveredSurah(null)}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-300 cursor-pointer group ${
                      hoveredSurah === surah.id
                        ? "bg-violet-400/10 border border-violet-400/25"
                        : "bg-white/3 border border-white/5 hover:border-violet-400/20"
                    }`}
                  >
                    <Link
                      href={`/quran/listen/${surah.id}`}
                      className="flex w-full items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {/* Surah number badge */}
                        <span
                          className={`shrink-0 size-7 rounded-lg flex items-center justify-center text-[10px] font-bold font-jakarta transition-colors duration-200 ${
                            hoveredSurah === surah.id
                              ? "bg-violet-400/20 text-violet-300"
                              : "bg-white/5 text-text-secondary"
                          }`}
                        >
                          {surah.id}
                        </span>
                        <div>
                          <p className="font-jakarta text-xs font-semibold text-text-primary leading-tight">
                            {surah.nameEn}
                          </p>
                          <p
                            className="font-arabic-ui text-[11px] text-text-secondary/70 leading-tight"
                            dir="rtl"
                            lang="ar"
                          >
                            {surah.nameAr}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-inter text-[10px] text-text-secondary/50">
                          {surah.verses}v
                        </span>
                        {/* Play icon animates in on hover */}
                        <motion.div
                          animate={{
                            opacity: hoveredSurah === surah.id ? 1 : 0,
                            scale: hoveredSurah === surah.id ? 1 : 0.7,
                          }}
                          transition={{ duration: 0.15 }}
                          className="size-6 rounded-full bg-violet-400/20 flex items-center justify-center"
                        >
                          <Play size={9} className="text-violet-300 " />
                        </motion.div>
                        <motion.div
                          animate={{
                            opacity: hoveredSurah === surah.id ? 1 : 0,
                            scale: hoveredSurah === surah.id ? 1 : 0.7,
                          }}
                          transition={{ duration: 0.15, delay: 0.05 }}
                          className="size-6 rounded-full bg-accent/15 flex items-center justify-center"
                        >
                          <Download size={9} className="text-accent" />
                        </motion.div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Bottom hint */}
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <p className="font-inter text-[11px] text-text-secondary/60">
                  All 114 Surahs available
                </p>
                <Link
                  href="/quran/listen"
                  className="font-jakarta text-[11px] font-semibold text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1"
                >
                  See all
                  <ChevronRight size={11} />
                </Link>
              </div>
            </div>

            {/* Floating accent orb behind card */}
            <div
              className="absolute -z-10 -bottom-8 -right-8 size-48 bg-violet-500 opacity-[0.15] rounded-full blur-3xl pointer-events-none"
              aria-hidden="true"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
