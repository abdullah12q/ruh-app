import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/data/animationVariants";
import SunArc from "@/components/prayerTimes/sunArc/SunArc";
import PrayerCalcMethodSelector from "./PrayerCalcMethodSelector";
import {
  formatterAr,
  formatterEn,
  getDateobj,
} from "@/data/datas/prayerTimesData";
import PrayerTimesHeroHeader from "./PrayerTimesHeroHeader";
import PrayerTimesDateAndLocEn from "./PrayerTimesDateAndLocEn";
import PrayerTimesDateAndLocAr from "./PrayerTimesDateAndLocAr";
import DateSpineMedallion from "./DateSpineMedallion";

export default function PrayerTimesHero({
  prayers,
  location,
  hijriDate,
  hijriDateAr,
  hijriWeekday,
  gregorianWeekday,
  gregorianDate,
  countdown,
  nextPrayerKey,
  isLoading,
  onRefetch,
}) {
  const nextPrayer = prayers?.find((p) => p.key === nextPrayerKey);

  const formattedGregorianDate = getDateobj(gregorianDate);

  const formattedDateEn = formatterEn.format(formattedGregorianDate);
  const formattedDateAr = formatterAr.format(formattedGregorianDate);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="mb-14"
    >
      {/* header */}
      <PrayerTimesHeroHeader
        isLoading={isLoading}
        countdown={countdown}
        nextPrayer={nextPrayer}
      />

      <motion.div variants={fadeUp} className="flex justify-center mb-10 px-4">
        <div className="relative group w-full max-w-2xl">
          {/* Soft outer ring glow on hover */}
          <div className="absolute -inset-0.5 bg-accent/20 rounded-3xl blur-md opacity-40 group-hover:opacity-80 transition duration-700" />

          <div className="relative glass rounded-3xl bg-surface-glass/40 backdrop-blur-xl overflow-hidden shadow-xl px-6 py-5 sm:px-8 sm:py-6">
            {/* Ambient corner glows */}
            <div className="pointer-events-none absolute -top-16 -left-16 size-40 rounded-full bg-accent/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -right-16 size-40 rounded-full bg-accent/20 blur-3xl" />

            <div className="relative flex flex-col sm:flex-row justify-between gap-1 sm:gap-0">
              <PrayerTimesDateAndLocEn
                gregorianWeekday={gregorianWeekday}
                formattedDateEn={formattedDateEn}
                hijriDate={hijriDate}
                location={location}
                onRefetch={onRefetch}
              />

              {/* Spine — mobile: horizontal, desktop: vertical */}
              {/* mobile */}
              <div className="flex sm:hidden items-center gap-3 w-full pt-2">
                <span className="h-px flex-1 bg-linear-to-r from-transparent via-(--surface-glass-border) to-(--surface-glass-border)" />
                <DateSpineMedallion />
                <span className="h-px flex-1 bg-linear-to-l from-transparent via-(--surface-glass-border) to-(--surface-glass-border)" />
              </div>
              {/* desktop */}
              <div className="hidden sm:flex flex-col items-center px-6">
                <span className="w-px flex-1 bg-linear-to-b from-transparent via-(--surface-glass-border) to-(--surface-glass-border)" />
                <DateSpineMedallion />
                <span className="w-px flex-1 bg-linear-to-t from-transparent via-(--surface-glass-border) to-(--surface-glass-border)" />
              </div>

              <PrayerTimesDateAndLocAr
                hijriWeekday={hijriWeekday}
                formattedDateAr={formattedDateAr}
                hijriDateAr={hijriDateAr}
                location={location}
                onRefetch={onRefetch}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Calc Method */}
      <motion.div variants={fadeUp} className="flex justify-center mb-8">
        <PrayerCalcMethodSelector />
      </motion.div>

      {/* Signature: the sun arc */}
      <motion.div
        variants={fadeUp}
        className="max-w-3xl mx-auto glass rounded-3xl p-4 sm:p-6 shadow-lg border border-(--surface-glass-border)/50"
      >
        <SunArc
          prayers={prayers}
          nextPrayerKey={nextPrayerKey}
          isLoading={isLoading}
        />
      </motion.div>
    </motion.div>
  );
}
