"use client";

import { motion } from "framer-motion";
import { MapPin, RotateCcw, Clock } from "lucide-react";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { staggerContainer, fadeUp } from "@/data/animationVariants";
import PrayerCard from "@/components/PrayerCard";
import PrayerTimesSectionSkeleton from "./PrayerTimesSectionSkeleton";
import PermissionDenied from "@/components/prayerTimes/PermissionDenied";
import NotificationToggleButton from "@/components/prayerTimes/NotificationToggleButton";

export default function PrayerTimesSection() {
  const {
    location,
    prayers,
    countdown,
    hijriDate,
    isLoading,
    isError,
    permissionDenied,
    refetch,
  } = usePrayerTimes();

  return (
    <section
      aria-label="Daily prayer times"
      className="py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-10"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-accent text-xs font-semibold tracking-wider uppercase mb-6"
          >
            <Clock size={12} />
            Prayer Times
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="font-jakarta font-extrabold text-3xl sm:text-4xl text-text-primary mb-3 flex items-center justify-center gap-10"
          >
            <span>
              Today&apos;s <span className="gradient-text">Salah Schedule</span>
            </span>

            {/* Notification Toggle Button */}
            <NotificationToggleButton />
          </motion.h2>

          {/* Location row */}
          <motion.div
            variants={fadeUp}
            className="flex items-center justify-center gap-3 text-sm text-text-secondary font-inter"
          >
            {location?.en.city && (
              <span className="font-jakarta flex items-center gap-1.5">
                <MapPin size={13} className="text-accent" />
                {location?.en?.city}, {location?.en?.state},{" "}
                {location?.en?.country}
              </span>
            )}
            {location?.en.city && hijriDate && (
              <span className="text-text-secondary/30">·</span>
            )}
            {hijriDate && (
              <span className="text-accent/80 font-jakarta font-medium text-xs">
                {hijriDate}
              </span>
            )}
          </motion.div>
        </motion.div>

        {/* Cards */}
        {permissionDenied ? (
          <PermissionDenied onRetry={refetch} />
        ) : isLoading ? (
          <PrayerTimesSectionSkeleton />
        ) : isError ? (
          <div className="text-center py-12 text-text-secondary">
            <p className="mb-4">Could not load prayer times.</p>
            <button
              onClick={refetch}
              className="flex items-center gap-2 mx-auto px-4 py-2 rounded-xl glass text-sm hover:text-accent transition-colors cursor-pointer"
            >
              <RotateCcw size={13} />
              Try again
            </button>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
          >
            {prayers.map((prayer, i) => (
              <PrayerCard
                key={prayer.key}
                prayer={prayer}
                countdown={countdown}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
