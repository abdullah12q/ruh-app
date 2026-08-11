"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import useHalaqahStore from "@/lib/store/useHalaqahStore";
import { useHalaqahLiveData } from "@/lib/queries/halaqah";
import ProgressMap from "./ProgressMap/ProgressMap";
import Leaderboard from "./Leaderboard/Leaderboard";
import { useSession } from "next-auth/react";
import Link from "next/link";
import TopBar from "./TopBar";
import AdminPanel from "./AdminPanel/AdminPanel";
import { buildColorMap, getLeaderboard } from "@/data/datas/halaqahDetailsData";
import { useMemo } from "react";
import ReflectionModal from "./ReflectionModal/ReflectionModal";

export default function HalaqahDetails({ halaqahId, halaqah }) {
  const { data: session, status } = useSession();
  const currentUserId = session?.user?.id;

  const isAdmin = !!halaqah?.members?.some(
    (m) => m.userId === currentUserId && m.role === "admin",
  );

  // Build a stable color -> userId mapping
  const colorMap = useMemo(
    () => buildColorMap(halaqah?.members),
    [halaqah?.members],
  );

  const { isLoading, isError, error, isFetching, refetch, dataUpdatedAt } =
    useHalaqahLiveData(halaqahId);

  const { progressMap } = useHalaqahStore();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        {/* TopBar Skeleton */}
        <div className="flex justify-between items-center mb-6 mt-2">
          <div className="w-48 h-6 skeleton" />
          <div className="w-24 h-8 skeleton" />
        </div>

        {/* Admin Panel Skeleton */}
        {isAdmin && <div className="w-full h-12 skeleton mb-6" />}

        {/* Header Skeleton */}
        <div className="mb-8 space-y-2">
          <div className="w-64 h-9 skeleton" />
          <div className="w-40 h-5 skeleton" />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Progress Map Skeleton */}
          <div className="w-full h-125 skeleton" />

          {/* Leaderboard Skeleton */}
          <div className="w-full md:w-87.5 h-125 skeleton" />
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center py-32">
        <Loader2 size={28} className="text-accent animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="max-w-7xl mx-auto">
        <Link
          href="/halaqah"
          className="w-fit flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary font-jakarta mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </Link>
        <div className="glass rounded-2xl p-10 text-center max-w-md mx-auto">
          <div className="text-4xl mb-4">🔒</div>
          <p className="text-text-primary font-jakarta font-semibold mb-2">
            Sign in Required
          </p>
          <p className="text-text-secondary font-inter text-sm mb-6">
            You need to be signed in to view this study circle.
          </p>
          <Link
            href="/auth/signin?callbackUrl=/halaqah"
            className="text-accent text-sm font-semibold hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (isError || !halaqah) {
    return (
      <div className="max-w-7xl mx-auto">
        <Link
          href="/halaqah"
          className="w-fit flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary font-jakarta mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </Link>
        <div className="glass rounded-2xl p-10 text-center">
          <p className="text-text-primary font-jakarta font-semibold mb-2">
            Could not load this study circle.
          </p>
          {error && (
            <p className="text-red-400/90 font-inter text-sm mb-4">
              {error?.message || error?.toString()}
            </p>
          )}
          <button
            onClick={refetch}
            className="text-accent text-sm font-semibold hover:underline cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const leaderboard = getLeaderboard(progressMap, halaqah.members);
  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : null;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Top bar */}
      <TopBar
        lastUpdated={lastUpdated}
        refetch={refetch}
        isFetching={isFetching}
      />

      {/* Admin Controls Panel */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AdminPanel
            halaqah={halaqah}
            halaqahId={halaqahId}
            colorMap={colorMap}
            currentUserId={currentUserId}
          />
        </motion.div>
      )}

      {/* Circle name header */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 70 }}
        className="mb-8"
      >
        <h2 className="font-jakarta font-extrabold text-2xl text-text-primary tracking-tight">
          {halaqah.name}
        </h2>
        <p className="text-xs text-text-secondary font-inter mt-0.5">
          {halaqah.members.length} members ·{" "}
          <code className="font-mono text-accent/80">{halaqah.inviteCode}</code>
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Progress Map */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 70, delay: 0.2 }}
          className="w-full"
        >
          <ProgressMap
            halaqahId={halaqahId}
            progressMap={progressMap}
            members={halaqah.members}
            colorMap={colorMap}
            currentUserId={currentUserId}
          />
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 70, delay: 0.4 }}
          className="min-w-auto sm:min-w-fit"
        >
          <Leaderboard
            leaderboard={leaderboard}
            colorMap={colorMap}
            currentUserId={currentUserId}
          />
        </motion.div>
      </div>

      {/* Reflection Modal */}
      <ReflectionModal halaqahId={halaqahId} colorMap={colorMap} />
    </div>
  );
}
