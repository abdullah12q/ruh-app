"use server";

import connectDB from "@/lib/db/mongoose";
import Halaqah from "@/lib/db/models/Halaqah";
import ReadingProgress from "@/lib/db/models/ReadingProgress";
import Reflection from "@/lib/db/models/Reflection";
import crypto from "crypto";
import SURAH_META from "@/data/surahMeta";

const TOTAL_AYAHS = 6236;

export async function generateUnsubscribeToken(userId, halaqahId) {
  const payload = `${userId}:${halaqahId}`;
  const sig = crypto
    .createHmac("sha256", process.env.CRON_SECRET)
    .update(payload)
    .digest("hex")
    .slice(0, 16); // Short enough for a URL, long enough to be unguessable
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

export async function verifyUnsubscribeToken(token) {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length !== 3) return null;
    const [userId, halaqahId, receivedSig] = parts;
    const payload = `${userId}:${halaqahId}`;
    const expectedSig = crypto
      .createHmac("sha256", process.env.CRON_SECRET)
      .update(payload)
      .digest("hex")
      .slice(0, 16);
    if (receivedSig !== expectedSig) return null;
    return { userId, halaqahId };
  } catch {
    return null;
  }
}

export async function getAllHalaqahDigestData() {
  await connectDB();

  // Fetch all halaqahs with populated member user data
  const halaqahs = await Halaqah.find({})
    .populate("members.userId", "name studyCircleName email image")
    .lean();

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const emails = [];

  for (const halaqah of halaqahs) {
    const halaqahId = halaqah._id.toString();

    // Fetch progress for this circle
    const progress = await ReadingProgress.find({ halaqahId })
      .select("userId surahNumber ayahNumber -_id")
      .lean();

    // Build a per-member read count map
    const memberReadCounts = {};
    for (const member of halaqah.members) {
      const uid = member.userId?._id?.toString() || member.userId?.toString();
      memberReadCounts[uid] = 0;
    }
    for (const p of progress) {
      const uid = p.userId.toString();
      if (uid in memberReadCounts) memberReadCounts[uid]++;
    }

    // Total unique ayahs read by anyone
    const uniqueAyahsRead = new Set(
      progress.map((p) => `${p.surahNumber}:${p.ayahNumber}`),
    ).size;
    const overallPct = Math.round((uniqueAyahsRead / TOTAL_AYAHS) * 100);

    // Build leaderboard (top 3)
    const leaderboard = halaqah.members
      .map((m) => {
        const uid = m.userId?._id?.toString() || m.userId?.toString();
        return {
          userId: uid,
          name: m.userId?.studyCircleName || m.userId?.name || "Member",
          image: m.userId?.image || null,
          count: memberReadCounts[uid] ?? 0,
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    // Fetch the 3 most recent reflections from the past week
    const recentReflections = await Reflection.find({
      halaqahId,
      createdAt: { $gte: oneWeekAgo },
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("userId", "name studyCircleName")
      .lean();

    const reflectionPreviews = recentReflections.map((r) => ({
      authorName: r.userId?.studyCircleName || r.userId?.name || "A member",
      surahName: SURAH_META.find((s) => s.id === r.surahNumber)?.name,
      surahNumber: r.surahNumber,
      ayahNumber: r.ayahNumber,
      // Truncate long reflections for the email preview
      content:
        r.content.length > 160 ? r.content.slice(0, 157) + "..." : r.content,
    }));

    // Build per-member email payloads
    for (const member of halaqah.members) {
      // Skip opted-out members y3ny 3mlo unsubscribe
      if (member.emailOptOut) continue;

      const user = member.userId;
      const userEmail = user?.email;
      const userId = user?._id?.toString() || user?.toString();

      // Skip if no email (guard bs mzonsh eno ynf3 ykon msh mwgod)
      if (!userEmail || typeof userEmail !== "string") continue;

      const myCount = memberReadCounts[userId] ?? 0;
      const myRank = leaderboard.findIndex((l) => l.userId === userId) + 1;

      const unsubToken = generateUnsubscribeToken(userId, halaqahId);
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

      emails.push({
        to: userEmail,
        recipientName: user?.studyCircleName || user?.name || "Member",
        halaqah: {
          id: halaqahId,
          name: halaqah.name,
          inviteCode: halaqah.inviteCode,
          overallPct,
          uniqueAyahsRead,
          memberCount: halaqah.members.length,
        },
        leaderboard,
        reflectionPreviews,
        myStats: {
          count: myCount,
          rank: myRank > 0 ? myRank : null,
        },
        links: {
          circle: `${appUrl}/halaqah/${halaqah.name}?halaqahId=${halaqahId}`,
          unsubscribe: `${appUrl}/api/unsubscribe?token=${unsubToken}`,
        },
      });
    }
  }

  return emails;
}
