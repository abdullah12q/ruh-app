"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import useUIStore from "@/lib/store/useUIStore";
import { RecentReadCard } from "./RecentReadCard";

export default function ContinueReadingSection() {
  const { recentReads, lastRead } = useUIStore();
  const [isMounted, setIsMounted] = useState(false);

  // We need to wait for mount to read from localStorage via Zustand persist
  // otherwise we get hydration mismatches
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const displayReads = recentReads?.length
    ? recentReads
    : lastRead
      ? [{ surahId: lastRead.surahId, ayahNumber: lastRead.ayahNumber }]
      : [];

  if (!isMounted || displayReads.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 z-20 relative">
      <h3 className="text-text-secondary font-jakarta text-sm font-semibold mb-4 ml-1">
        Continue Listening
      </h3>
      <div className="flex flex-col gap-3">
        <AnimatePresence>
          {displayReads.map((read, index) => (
            <RecentReadCard key={read.surahId} read={read} index={index} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
