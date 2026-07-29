"use client";

import { RotateCcw } from "lucide-react";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import PrayerTimesHero from "@/components/prayerTimes/PrayerTimesHero";
import PrayerCalendar from "@/components/prayerTimes/prayerCalendar/PrayerCalendar";
import PermissionDenied from "@/components/prayerTimes/PermissionDenied";
import TodaysPrayers from "@/components/prayerTimes/TodaysPrayers";

export default function PrayerTimesPageClient() {
  const {
    coords,
    location,
    prayers,
    countdown,
    nextPrayerKey,
    hijriDate,
    hijriDateAr,
    hijriWeekday,
    hijriHolidays,
    hijriYear,
    hijriMonth,
    gregorianDate,
    gregorianWeekday,
    isLoading,
    isError,
    permissionDenied,
    refetch,
  } = usePrayerTimes();

  if (isError && !isLoading) {
    return (
      <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center py-20">
          <span className="text-5xl mb-4 block">⚠️</span>
          <h2 className="font-jakarta font-bold text-xl text-text-primary mb-3">
            Could not load prayer times
          </h2>
          <p className="font-inter text-sm text-text-secondary mb-6">
            The Aladhan API is unavailable. Please try again.
          </p>
          <button
            onClick={refetch}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass text-sm text-text-secondary hover:text-accent transition-colors cursor-pointer"
          >
            <RotateCcw size={14} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        {permissionDenied ? (
          <PermissionDenied onRetry={refetch} />
        ) : (
          <>
            <PrayerTimesHero
              prayers={prayers}
              location={location}
              hijriDate={hijriDate}
              hijriDateAr={hijriDateAr}
              hijriWeekday={hijriWeekday}
              gregorianWeekday={gregorianWeekday}
              gregorianDate={gregorianDate}
              countdown={countdown}
              nextPrayerKey={nextPrayerKey}
              isLoading={isLoading}
              onRefetch={refetch}
            />

            {/* Today's prayers */}
            <TodaysPrayers
              prayers={prayers}
              countdown={countdown}
              isLoading={isLoading}
              hijriHolidays={hijriHolidays}
            />

            {/* Calendar section */}
            <PrayerCalendar
              isLoading={isLoading}
              coords={coords}
              hijriYear={hijriYear}
              hijriMonth={hijriMonth}
            />

            {/* Placeholder while waiting for coords (but not denied) */}
            {isLoading && (
              <div className="mt-16 glass rounded-2xl p-10 flex items-center justify-center">
                <div className="text-center space-y-3">
                  <div className="size-10 skeleton rounded-xl mx-auto" />
                  <p className="text-sm text-text-secondary font-inter animate-pulse">
                    Loading calendar…
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
