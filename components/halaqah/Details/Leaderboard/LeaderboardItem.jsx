import { motion } from "framer-motion";
import Image from "next/image";

const RANK_ICONS = {
  0: <div>🥇</div>,
  1: <div>🥈</div>,
  2: <div>🥉</div>,
};

export default function LeaderboardItem({
  userId,
  count,
  image,
  name,
  displayRank,
  idx,
  isLeader,
  barPct,
  colorMap,
  finalDisplayName,
}) {
  return (
    <motion.div
      role="listitem"
      key={userId}
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.06, duration: 0.3 }}
      className={`px-5 py-3.5 ${isLeader ? "bg-accent/5" : ""}`}
    >
      <div className="flex items-center gap-3">
        {/* Rank icon / number */}
        <div className="w-5 flex items-center justify-center shrink-0">
          {RANK_ICONS[displayRank] ?? (
            <span className="text-xs text-text-secondary/50 font-mono">
              {displayRank + 1}
            </span>
          )}
        </div>

        {/* Avatar placeholder */}
        {image ? (
          <Image
            src={image}
            alt="Profile"
            width={32}
            height={32}
            className="rounded-full object-cover size-8"
          />
        ) : (
          <div
            className="size-8 rounded-full flex items-center justify-center text-sm font-bold font-jakarta shrink-0"
            style={{
              backgroundColor: isLeader ? "var(--accent)" : colorMap[userId],
            }}
          >
            {name?.[0]?.toUpperCase() || "U"}
          </div>
        )}

        {/* Name + bar */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-1">
            <span
              title={finalDisplayName}
              className={`text-xs font-semibold truncate ${
                isLeader ? "text-accent" : "text-text-primary"
              }`}
            >
              {finalDisplayName}
            </span>
            <span className="text-xs font-mono text-text-secondary shrink-0">
              {count}
            </span>
          </div>

          {/* Progress bar relative to leader */}
          <div className="w-full h-1 rounded-full bg-(--surface-glass-border) overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                isLeader ? "bg-accent" : "bg-text-secondary/50"
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${barPct}%` }}
              transition={{
                duration: 0.6,
                delay: idx * 0.08,
                ease: "easeOut",
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
