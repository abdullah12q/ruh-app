"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db/mongoose";
import { auth } from "@/lib/auth";
import User from "@/lib/db/models/User";
import Halaqah from "@/lib/db/models/Halaqah";
import ReadingProgress from "@/lib/db/models/ReadingProgress";
import Reflection from "@/lib/db/models/Reflection";

async function generateUniqueInviteCode() {
  const CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Omits O/0, I/1 (visually confusing)
  const CODE_LENGTH = 6;

  // for loop attempts 3shan lw el generated dah already mwgod fel db y3ml attempt tanya
  for (let attempt = 0; attempt < 10; attempt++) {
    // Generate CODE_LENGTH random bytes and map each to CHARSET
    const bytes = randomBytes(CODE_LENGTH);
    const code = Array.from(bytes)
      .map((b) => CHARSET[b % CHARSET.length])
      .join("");

    // Check lw elcode already in the database
    const exists = await Halaqah.exists({ inviteCode: code });
    if (!exists) return code;
  }

  throw new Error("Could not generate a unique invite code. Please retry.");
}

export async function getAuthenticatedUserId() {
  const session = await auth();
  if (!session?.user?.id) {
    throw { success: false, error: "You must be signed in to do this." };
  }
  return session.user.id;
}

export async function getStudyCircleName() {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) return null;

    await connectDB();

    const user = await User.findById(userId).select("studyCircleName").lean();

    return user?.studyCircleName || null;
  } catch (err) {
    console.error("[getStudyCircleName]", err);
    return null;
  }
}

export async function updateStudyCircleName(studyCircleName) {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) return null;

    await connectDB();

    const user = await User.findByIdAndUpdate(
      userId,
      { studyCircleName },
      { returnDocument: "after", runValidators: true },
    ).lean(); // .lean() converts the Mongoose document to a plain JS object, which is safer for Next.js

    return user?.studyCircleName || null;
  } catch (err) {
    console.error("[updateStudyCircleName]", err);
    return null;
  }
}

export async function createHalaqah({ name, khatmGoalDate }) {
  try {
    const userId = await getAuthenticatedUserId();
    const userHalaqahs = await getUserHalaqahs();

    const trimmedName = name?.trim();
    if (!trimmedName || trimmedName.length === 0) {
      return { success: false, error: "A study circle name is required." };
    }
    if (trimmedName.length > 60) {
      return {
        success: false,
        error: "Name cannot exceed 60 characters.",
      };
    }

    const regex = /^[^a-zA-Z0-9]|[^a-zA-Z0-9]$/;

    if (regex.test(trimmedName)) {
      return {
        success: false,
        error:
          "Study circle name cannot start or end with a special character.",
      };
    }

    const existingName = userHalaqahs.halaqahs.find(
      (h) => h.name === trimmedName && h.myRole === "admin",
    );
    if (existingName) {
      return {
        success: false,
        error:
          "You are already admin of a study circle with this name. Please choose a different name.",
      };
    }

    let goalDate = null;
    if (khatmGoalDate) {
      goalDate = new Date(khatmGoalDate);
      if (isNaN(goalDate.getTime())) {
        return { success: false, error: "Invalid date format for Khatm goal." };
      }
      if (goalDate < new Date()) {
        return {
          success: false,
          error: "Khatm goal date must be in the future.",
        };
      }
    }

    await connectDB();
    const inviteCode = await generateUniqueInviteCode();

    const halaqah = await Halaqah.create({
      name: trimmedName,
      inviteCode,
      createdBy: userId,
      khatmGoalDate: goalDate,
      // el Creator hyb2a admin automatically
      members: [
        {
          userId,
          role: "admin",
          joinedAt: new Date(),
        },
      ],
    });

    // Refresh the halaqah list on the dashboard
    revalidatePath("/halaqah");

    return {
      success: true,
      halaqah: {
        id: halaqah._id.toString(),
        name: halaqah.name,
        inviteCode: halaqah.inviteCode,
      },
    };
  } catch (err) {
    console.log("in err", err);
    if (err?.success === false) return err;

    console.error("[createHalaqah]", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function joinHalaqah({ inviteCode }) {
  try {
    const userId = await getAuthenticatedUserId();

    const normalised = inviteCode?.trim().toUpperCase();
    if (!normalised || normalised.length === 0) {
      return {
        success: false,
        error: "Please enter an invite code.",
      };
    }
    if (normalised.length !== 6) {
      return {
        success: false,
        error: "Invite codes are exactly 6 characters long.",
      };
    }

    await connectDB();

    const halaqah = await Halaqah.findOne({ inviteCode: normalised });
    if (!halaqah) {
      return { success: false, error: "No study circle found with that code." };
    }

    const alreadyMember = halaqah.members.some(
      (m) => m.userId.toString() === userId,
    );
    if (alreadyMember) {
      return {
        success: false,
        error: "You are already a member of this study circle.",
      };
    }

    // Atomic push — avoids race conditions where two users join simultaneously
    await Halaqah.findByIdAndUpdate(
      halaqah._id,
      {
        $push: {
          members: {
            userId,
            role: "member",
            joinedAt: new Date(),
          },
        },
      },
      { new: true, runValidators: true },
    );

    revalidatePath("/halaqah");

    return { success: true };
  } catch (err) {
    if (err?.success === false) return err;

    console.error("[joinHalaqah]", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function deleteHalaqah(halaqahId) {
  try {
    const userId = await getAuthenticatedUserId();

    await connectDB();

    const halaqah = await Halaqah.findById(halaqahId);
    if (!halaqah) {
      return { success: false, error: "No study circle found with that ID." };
    }

    const isAdmin = halaqah.members.some(
      (m) => m.userId.toString() === userId && m.role === "admin",
    );
    if (!isAdmin) {
      return {
        success: false,
        error: "You are not an admin of this study circle to delete it.",
      };
    }

    await Halaqah.findByIdAndDelete(halaqahId);

    revalidatePath("/halaqah");

    return { success: true };
  } catch (err) {
    if (err?.success === false) return err;

    console.error("[deleteHalaqah]", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function renameHalaqah(halaqahId, newName) {
  try {
    const userId = await getAuthenticatedUserId();

    const trimmedName = newName?.trim();
    if (!trimmedName || trimmedName.length === 0) {
      return { success: false, error: "A study circle name is required." };
    }
    if (trimmedName.length > 60) {
      return { success: false, error: "Name cannot exceed 60 characters." };
    }

    await connectDB();

    // Auth: caller must be an admin of this halaqah
    const halaqah = await Halaqah.findById(halaqahId);
    if (!halaqah) {
      return { success: false, error: "Study circle not found." };
    }

    const isAdmin = halaqah.members.some(
      (m) => m.userId.toString() === userId && m.role === "admin",
    );
    if (!isAdmin) {
      return {
        success: false,
        error: "You are not an admin of this study circle.",
      };
    }

    const duplicate = await Halaqah.findOne({
      _id: { $ne: halaqahId }, // exclude the circle being renamed
      "members.userId": userId,
      "members.role": "admin",
      name: trimmedName,
    });
    if (duplicate) {
      // Extra check: confirm the user is actually admin in that duplicate
      const isDupAdmin = duplicate.members.some(
        (m) => m.userId.toString() === userId && m.role === "admin",
      );
      if (isDupAdmin) {
        return {
          success: false,
          error:
            "You already admin a study circle with this name. Please choose a different name.",
        };
      }
    }

    const updated = await Halaqah.findByIdAndUpdate(
      halaqahId,
      { name: trimmedName },
      { new: true, runValidators: true },
    ).lean();

    revalidatePath("/halaqah");

    return { success: true, name: updated.name };
  } catch (err) {
    if (err?.success === false) return err;
    console.error("[renameHalaqah]", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function removeMember(halaqahId, targetUserId) {
  try {
    const userId = await getAuthenticatedUserId();

    if (userId === targetUserId) {
      return {
        success: false,
        error: "You cannot remove yourself from the circle.",
      };
    }

    await connectDB();

    const halaqah = await Halaqah.findById(halaqahId);
    if (!halaqah) {
      return { success: false, error: "Study circle not found." };
    }

    // Caller must be admin
    const callerMember = halaqah.members.find(
      (m) => m.userId.toString() === userId,
    );
    if (!callerMember || callerMember.role !== "admin") {
      return {
        success: false,
        error: "You are not an admin of this study circle.",
      };
    }

    // Cannot remove another admin
    const targetMember = halaqah.members.find(
      (m) => m.userId.toString() === targetUserId,
    );
    if (!targetMember) {
      return { success: false, error: "This user is not a member." };
    }
    if (targetMember.role === "admin") {
      return { success: false, error: "You cannot remove another admin." };
    }

    // Run deletions in parallel with removing the member
    await Promise.all([
      Halaqah.findByIdAndUpdate(halaqahId, {
        $pull: { members: { userId: targetUserId } },
      }),
      ReadingProgress.deleteMany({ halaqahId, userId: targetUserId }),
      Reflection.deleteMany({ halaqahId, userId: targetUserId }),
    ]);

    revalidatePath("/halaqah");

    return { success: true };
  } catch (err) {
    if (err?.success === false) return err;
    console.error("[removeMember]", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function getUserHalaqahs() {
  try {
    const userId = await getAuthenticatedUserId();

    await connectDB();

    // Find all Halaqahs where this user is in the members array
    const halaqahs = await Halaqah.find({ "members.userId": userId })
      .select("name inviteCode khatmGoalDate members createdAt createdBy")
      .lean(); // .lean() returns plain JS objects — much faster, no Mongoose overhead

    // Serialise ObjectIds to strings for safe Client Component usage
    const serialised = halaqahs.map((h) => ({
      id: h._id.toString(),
      name: h.name,
      inviteCode: h.inviteCode,
      khatmGoalDate: h.khatmGoalDate?.toISOString() ?? null,
      createdAt: h.createdAt.toISOString(),
      createdBy: h.createdBy.toString(),
      memberCount: h.members.length,
      // Expose current user's role in this circle
      myRole:
        h.members.find((m) => m.userId.toString() === userId)?.role ?? "member",
    }));

    return { success: true, halaqahs: serialised };
  } catch (err) {
    if (err?.success === false) return err;
    console.error("[getUserHalaqahs]", err);
    return { success: false, error: "Failed to load your study circles." };
  }
}
