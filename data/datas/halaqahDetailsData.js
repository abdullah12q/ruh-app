const MEMBER_COLORS = [
  "#14b8a6",
  "#8b5cf6",
  "#f59e0b",
  "#f43f5e",
  "#0ea5e9",
  "#10b981",
  "#d946ef",
  "#f97316",
];

/**
 * Assign a stable color index to each member userId.
 * Sorted by userId string so the mapping is deterministic across clients.
 */
export function buildColorMap(members) {
  if (!members) return {};
  const sorted = [...members].sort((a, b) => a.userId.localeCompare(b.userId));
  const map = {};
  sorted.forEach((m, i) => {
    map[m.userId] = MEMBER_COLORS[i % MEMBER_COLORS.length];
  });
  return map;
}

export function getLeaderboard(progressMap, members) {
  const counts = {};
  const memberData = {};

  // Initialise all members at 0 so even unread members appear in the list
  for (const m of members) {
    counts[m.userId] = 0;
    memberData[m.userId] = m;
  }

  // Tally reads
  for (const userIds of progressMap.values()) {
    for (const uid of userIds) {
      if (uid in counts) counts[uid]++;
    }
  }

  return Object.entries(counts)
    .map(([userId, count]) => ({
      userId,
      count,
      name: memberData[userId]?.name,
      image: memberData[userId]?.image,
    }))
    .sort((a, b) => b.count - a.count);
}

export function formatRelativeTime(isoString) {
  if (!isoString) return "";

  const timeValue = new Date(isoString).getTime();
  if (isNaN(timeValue)) return ""; // for invalid dates

  // emn3 negative differences caused by client/server clock drift
  const diff = Math.max(0, Date.now() - timeValue);
  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ${minutes % 60}m ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Date(isoString).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
