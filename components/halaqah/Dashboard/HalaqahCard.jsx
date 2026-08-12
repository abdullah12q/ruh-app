import { AnimatePresence, motion } from "framer-motion";
import {
  UsersRound,
  Crown,
  ChevronRight,
  Calendar,
  Check,
  Copy,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function HalaqahCard({ halaqah, index }) {
  const [copied, setCopied] = useState(false);

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
        <div className="flex items-center gap-4 text-xs text-text-secondary font-inter">
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
        {/* Invite code badge */}
        <div className="mt-4 pt-4 border-t border-(--surface-glass-border) flex items-center justify-between">
          <span className="text-xs text-text-secondary font-inter">Code:</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-accent bg-accent/10 px-2.5 py-1 rounded-lg border border-accent/20 cursor-pointer hover:bg-accent/20 hover:text-accent hover:border-accent transition-all duration-500"
          >
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
