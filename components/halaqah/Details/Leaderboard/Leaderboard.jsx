import { Trophy } from "lucide-react";
import LeaderboardItem from "./LeaderboardItem";

export default function Leaderboard({ leaderboard, colorMap, currentUserId }) {
  const leaderCount = leaderboard[0]?.count || 0;
  const totalRead = leaderboard.reduce((acc, m) => acc + m.count, 0);

  let currentRank = 0;
  let prevCount = -1;

  const rankedLeaderboard = leaderboard.map((user, index) => {
    // Only update the rank if the score is different from the previous user
    if (user.count !== prevCount) {
      // eslint-disable-next-line react-hooks/immutability
      currentRank = index;
      prevCount = user.count;
    }
    return { ...user, displayRank: currentRank };
  });

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-(--surface-glass-border)">
        <div className="flex items-center gap-2 mb-1">
          <Trophy size={15} className="text-accent" />
          <h3 className="font-jakarta font-bold text-text-primary text-sm">
            Leaderboard
          </h3>
        </div>
        <p className="text-xs text-text-secondary font-inter">
          {totalRead} total ayahs read by the group
        </p>
      </div>

      {/* Ranked list */}
      <div role="list" className="divide-y divide-(--surface-glass-border)">
        {rankedLeaderboard.map(
          ({ userId, count, image, name, displayRank }, idx) => {
            const isMe = userId === currentUserId;
            const isLeader = count > 0 && count === leaderCount;
            const barPct =
              leaderCount > 0 ? Math.round((count / leaderCount) * 100) : 0;

            const baseName = isMe ? "You" : name;
            const displayName = isLeader
              ? `${baseName} ${isMe ? "are" : "is"} Tied for 1st 👑`
              : baseName;

            const finalDisplayName =
              isLeader &&
              rankedLeaderboard.filter((u) => u.count === leaderCount).length >
                1
                ? displayName
                : isLeader
                  ? `${baseName} ${isMe ? "are" : "is"} Leading 👑`
                  : baseName;

            return (
              <LeaderboardItem
                key={userId}
                userId={userId}
                count={count}
                image={image}
                name={name}
                displayRank={displayRank}
                idx={idx}
                isLeader={isLeader}
                barPct={barPct}
                colorMap={colorMap}
                finalDisplayName={finalDisplayName}
              />
            );
          },
        )}

        {/* Empty State */}
        {leaderboard.length === 0 && (
          <div className="py-8 text-center text-xs text-text-secondary font-inter">
            No progress yet. Start reading!
          </div>
        )}
      </div>
    </div>
  );
}
