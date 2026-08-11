"use server";

import connectDB from "@/lib/db/mongoose";
import Halaqah from "@/lib/db/models/Halaqah";
import ReadingProgress from "@/lib/db/models/ReadingProgress";
import Reflection from "@/lib/db/models/Reflection";
import { getAuthenticatedUserId } from "./halaqah";

async function assertMembership(halaqahId, userId) {
  const halaqah = await Halaqah.findOne({
    _id: halaqahId,
    "members.userId": userId,
  })
    .populate("members.userId", "name studyCircleName image")
    .select("name inviteCode khatmGoalDate members createdBy createdAt")
    .lean();

  if (!halaqah) {
    throw {
      success: false,
      error: "Study circle not found or you are not a member.",
    };
  }

  return halaqah;
}

export async function getHalaqahData(halaqahId) {
  try {
    const userId = await getAuthenticatedUserId();
    await connectDB();

    const halaqah = await assertMembership(halaqahId, userId);

    const progress = await ReadingProgress.find({ halaqahId })
      .select("userId surahNumber ayahNumber recordedAt -_id")
      .lean();

    return {
      success: true,
      halaqah: {
        id: halaqah._id.toString(),
        name: halaqah.name,
        inviteCode: halaqah.inviteCode,
        khatmGoalDate: halaqah.khatmGoalDate?.toISOString() ?? null,
        createdAt: halaqah.createdAt.toISOString(),
        createdBy: halaqah.createdBy.toString(),
        members: halaqah.members.map((m) => ({
          userId: m.userId?._id?.toString() || m.userId.toString(),
          name: m.userId?.studyCircleName || m.userId?.name || "Unknown User",
          image: m.userId?.image || null,
          role: m.role,
          joinedAt: m.joinedAt.toISOString(),
        })),
      },
      // Each entry: which user read which ayah in which surah
      progress: progress.map((p) => ({
        userId: p.userId.toString(),
        surahNumber: p.surahNumber,
        ayahNumber: p.ayahNumber,
        recordedAt: p.recordedAt.toISOString(),
      })),
    };
  } catch (err) {
    if (err?.success === false) return err;
    console.error("[getHalaqahData]", err);
    return { success: false, error: "Failed to load study circle data." };
  }
}

export async function getAyahReflections(halaqahId, surahNumber, ayahNumber) {
  try {
    const userId = await getAuthenticatedUserId();
    await connectDB();

    await assertMembership(halaqahId, userId);

    const reflections = await Reflection.find({
      halaqahId,
      surahNumber: Number(surahNumber),
      ayahNumber: Number(ayahNumber),
    })
      .populate("userId", "name studyCircleName image")
      .lean();

    return {
      success: true,
      reflections: reflections.map((r) => ({
        id: r._id.toString(),
        author: {
          id: r.userId._id.toString(),
          name: r.userId.studyCircleName || r.userId.name,
          image: r.userId.image ?? null,
        },
        content: r.content,
        createdAt: r.createdAt.toISOString(),
        isOwn: r.userId._id.toString() === userId,
      })),
    };
  } catch (err) {
    if (err?.success === false) return err;
    console.error("[getAyahReflections]", err);
    return { success: false, error: "Failed to load reflections." };
  }
}

export async function markAyahRead(halaqahId, surahNumber, ayahNumber) {
  try {
    const userId = await getAuthenticatedUserId();
    await connectDB();

    await assertMembership(halaqahId, userId);

    // Upsert: insert if new, silently skip if already exists
    // `$setOnInsert` only runs on INSERT, not UPDATE — keeps recordedAt stable
    await ReadingProgress.findOneAndUpdate(
      {
        halaqahId,
        userId,
        surahNumber: Number(surahNumber),
        ayahNumber: Number(ayahNumber),
      },
      {
        $setOnInsert: {
          halaqahId,
          userId,
          surahNumber: Number(surahNumber),
          ayahNumber: Number(ayahNumber),
          recordedAt: new Date(),
        },
      },
      { upsert: true, returnDocument: "after" },
    );

    return { success: true };
  } catch (err) {
    // Unique index violation is treated as a success (already marked) ely howa code 11000
    if (err?.code === 11000) return { success: true };
    if (err?.success === false) return err;
    console.error("[markAyahRead]", err);
    return { success: false, error: "Failed to mark ayah as read." };
  }
}

export async function batchMarkAyahs(halaqahId, surahNumber, ayahNumbers) {
  try {
    const userId = await getAuthenticatedUserId();
    await connectDB();

    await assertMembership(halaqahId, userId);

    if (!Array.isArray(ayahNumbers) || ayahNumbers.length === 0) {
      return { success: false, error: "No ayahs specified." };
    }

    const now = new Date();
    const docs = ayahNumbers.map((n) => ({
      halaqahId,
      userId,
      surahNumber: Number(surahNumber),
      ayahNumber: Number(n),
      recordedAt: now,
    }));

    try {
      // ordered:false to skip duplicate-key errors, insert the rest
      await ReadingProgress.insertMany(docs, { ordered: false });
    } catch (bulkErr) {
      // BulkWriteError with code 11000 means some/all were already marked fa da keda hn2blo 3ady y3ny success
      if (
        bulkErr?.code !== 11000 &&
        bulkErr?.writeErrors?.every?.((e) => e.code === 11000) === false
      ) {
        throw bulkErr;
      }
    }

    return { success: true, count: ayahNumbers.length };
  } catch (err) {
    if (err?.success === false) return err;
    console.error("[batchMarkAyahs]", err);
    return { success: false, error: "Failed to batch-mark ayahs." };
  }
}

export async function unmarkAyahRead(halaqahId, surahNumber, ayahNumber) {
  try {
    const userId = await getAuthenticatedUserId();
    await connectDB();

    await assertMembership(halaqahId, userId);

    await ReadingProgress.deleteOne({
      halaqahId,
      userId,
      surahNumber: Number(surahNumber),
      ayahNumber: Number(ayahNumber),
    });

    return { success: true };
  } catch (err) {
    if (err?.success === false) return err;
    console.error("[unmarkAyahRead]", err);
    return { success: false, error: "Failed to unmark ayah." };
  }
}

export async function unmarkFullSurah(halaqahId, surahNumber, ayahNumbers) {
  try {
    const userId = await getAuthenticatedUserId();
    await connectDB();

    await assertMembership(halaqahId, userId);

    if (!Array.isArray(ayahNumbers) || ayahNumbers.length === 0) {
      return { success: false, error: "No ayahs specified." };
    }

    await ReadingProgress.deleteMany({
      halaqahId,
      userId,
      surahNumber: Number(surahNumber),
      ayahNumber: { $in: ayahNumbers.map(Number) },
    });

    return { success: true, count: ayahNumbers.length };
  } catch (err) {
    if (err?.success === false) return err;
    console.error("[unmarkFullSurah]", err);
    return { success: false, error: "Failed to unmark surah." };
  }
}

export async function submitReflection(
  halaqahId,
  surahNumber,
  ayahNumber,
  content,
) {
  try {
    const userId = await getAuthenticatedUserId();
    await connectDB();

    await assertMembership(halaqahId, userId);

    const trimmed = content?.trim();
    if (!trimmed || trimmed.length === 0) {
      return { success: false, error: "Reflection cannot be empty." };
    }
    if (trimmed.length > 2000) {
      return {
        success: false,
        error: "Reflection cannot exceed 2000 characters.",
      };
    }

    const reflection = await Reflection.create({
      halaqahId,
      userId,
      surahNumber: Number(surahNumber),
      ayahNumber: Number(ayahNumber),
      content: trimmed,
    });

    return {
      success: true,
      reflection: {
        id: reflection._id.toString(),
        content: reflection.content,
        createdAt: reflection.createdAt.toISOString(),
      },
    };
  } catch (err) {
    if (err?.success === false) return err;
    console.error("[submitReflection]", err);
    return { success: false, error: "Failed to submit reflection." };
  }
}
