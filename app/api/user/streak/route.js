import { auth } from "@/lib/auth";
import connectDB from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";
import { NextResponse } from "next/server";

/**
 * POST /api/user/streak
 * Protected route — updates the authenticated user's reading streak.
 *
 * Body: { surahId: number, ayahNumber: number }
 *
 * Streak logic:
 * - If lastReadDate is today → no streak change, just update progress.
 * - If lastReadDate is yesterday → increment current streak.
 * - If lastReadDate is older → reset current streak to 1.
 */
export async function POST(request) {
  // ── Authentication Guard ──────────────────────────────────────
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Parse Body ────────────────────────────────────────────────
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { surahId, ayahNumber } = body;
  if (typeof surahId !== "number" || typeof ayahNumber !== "number") {
    return NextResponse.json(
      { error: "surahId and ayahNumber must be numbers" },
      { status: 422 },
    );
  }

  // ── Database Operation ────────────────────────────────────────
  try {
    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastRead = user.streak.lastReadDate
      ? new Date(user.streak.lastReadDate)
      : null;

    if (lastRead) {
      lastRead.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today - lastRead) / (1000 * 60 * 60 * 24));

      if (daysDiff === 0) {
        // Already read today — no streak change
      } else if (daysDiff === 1) {
        // Consecutive day — increment streak
        user.streak.current += 1;
        user.streak.lastReadDate = today;
      } else {
        // Streak broken
        user.streak.current = 1;
        user.streak.lastReadDate = today;
      }
    } else {
      // First ever read
      user.streak.current = 1;
      user.streak.lastReadDate = today;
    }

    // Update longest streak record
    if (user.streak.current > user.streak.longest) {
      user.streak.longest = user.streak.current;
    }

    // Update reading progress for this Surah
    const progressIndex = user.readingProgress.findIndex(
      (p) => p.surahId === surahId,
    );
    if (progressIndex >= 0) {
      user.readingProgress[progressIndex].lastAyah = ayahNumber;
      user.readingProgress[progressIndex].updatedAt = new Date();
    } else {
      user.readingProgress.push({ surahId, lastAyah: ayahNumber });
    }

    await user.save();

    return NextResponse.json({
      streak: user.streak,
      message: "Streak updated successfully",
    });
  } catch (error) {
    console.error("Streak update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
