import { AnimatePresence, motion } from "framer-motion";
import {
  UsersRound,
  Crown,
  ChevronRight,
  Calendar,
  Check,
  Copy,
  BellRing,
  BellOff,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toggleEmailSubscription } from "@/lib/actions/halaqah";

export default function HalaqahCard({ halaqah, index }) {
  const [copied, setCopied] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [optimisticOptOut, setOptimisticOptOut] = useState(halaqah.emailOptOut);

  const isAdmin = halaqah.myRole === "admin";

  const goalDate = halaqah.khatmGoalDate
    ? new Date(halaqah.khatmGoalDate)
    : null;

  const daysLeft = goalDate
    ? // eslint-disable-next-line react-hooks/purity
      Math.ceil((goalDate - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  function handleCopy(e) {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(halaqah.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleToggleEmail(e) {
    e.preventDefault();
    e.stopPropagation();
    if (isToggling) return;

    setIsToggling(true);

    // Immediately update UI locally
    const newOptOutState = !optimisticOptOut;
    setOptimisticOptOut(newOptOutState);

    try {
      const result = await toggleEmailSubscription(halaqah.id, newOptOutState);
      if (!result.success) {
        // Revert the UI if the server failed
        setOptimisticOptOut(!newOptOutState);
        console.error(result.error);
      }
    } catch (err) {
      // Revert on network error
      setOptimisticOptOut(!newOptOutState);
    } finally {
      setIsToggling(false);
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        delay: index * 0.06,
        duration: 0.35,
        ease: "easeOut",
        layout: { duration: 0.7, type: "spring", bounce: 0.1 },
      }}
    >
      <Link
        href={`/halaqah/${halaqah.id}`}
        className="block group relative overflow-hidden glass rounded-2xl p-6 hover:shadow-[0_0_24px_rgba(20,184,166,0.1)]!"
      >
        {/* Top sweep line on hover */}
        <span className="absolute top-0 left-0 h-px bg-linear-to-r from-transparent via-accent to-transparent w-0 group-hover:w-full transition-all duration-700 ease-out" />
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 min-w-0">
            {isAdmin && (
              <Crown
                size={13}
                className="text-amber-400 shrink-0"
                aria-label="You are admin"
              />
            )}
            <h2 className="font-jakarta font-bold text-text-primary text-base leading-tight truncate">
              {halaqah.name}
            </h2>
          </div>
          <ChevronRight
            size={18}
            className="text-text-secondary/50 shrink-0 group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-200"
          />
        </div>
        {/* Stats row */}
        <div className="flex items-center gap-4 text-xs text-text-secondary font-inter mb-4">
          <span className="flex items-center gap-1.5">
            <UsersRound size={12} className="text-accent/70" />
            {halaqah.memberCount}{" "}
            {halaqah.memberCount === 1 ? "member" : "members"}
          </span>
          {daysLeft !== null && (
            <span className="flex items-center gap-1.5">
              <Calendar size={12} className="text-accent/70" />
              {daysLeft > 0 ? `${daysLeft}d to Khatm` : "Goal reached 🎉"}
            </span>
          )}
        </div>

        {/* Actions row */}
        <div className="pt-4 border-t border-(--surface-glass-border) flex items-center justify-between gap-2">
          <button
            onClick={handleToggleEmail}
            disabled={isToggling}
            className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-all duration-300 cursor-pointer ${
              optimisticOptOut
                ? "bg-text-secondary/5 text-text-secondary border-text-secondary/10 hover:bg-text-secondary/10 hover:text-text-primary"
                : "bg-accent/5 text-accent border-accent/10 hover:bg-accent/10 hover:border-accent/30"
            }`}
            title={
              optimisticOptOut
                ? "Turn on Email Digests"
                : "Turn off Email Digests"
            }
          >
            {isToggling ? (
              <Loader2 size={12} className="animate-spin" />
            ) : optimisticOptOut ? (
              <BellOff size={12} />
            ) : (
              <BellRing size={12} />
            )}
            {optimisticOptOut ? "Emails Off" : "Emails On"}
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-widest text-accent bg-accent/10 px-2.5 py-1.5 rounded-lg border border-accent/20 cursor-pointer hover:bg-accent/20 hover:text-accent hover:border-accent transition-all duration-500"
          >
            <span className="text-text-secondary font-inter font-normal tracking-normal">
              Code:
            </span>
            {halaqah.inviteCode}
            <AnimatePresence mode="popLayout">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <Check size={12} />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <Copy size={12} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </Link>
    </motion.div>
  );
}
