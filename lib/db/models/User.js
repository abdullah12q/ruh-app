import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    // ── Core Fields (also used by NextAuth MongoDB Adapter) ────
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [80, "Name cannot exceed 80 characters"],
    },
    studyCircleName: {
      type: String,
      default: null,
      trim: true,
      maxlength: [60, "Study circle name cannot exceed 60 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    // Only populated for Credentials provider users
    password: {
      type: String,
      select: false, // Never returned in queries by default
      minlength: [8, "Password must be at least 8 characters"],
    },
    image: {
      type: String,
      default: null,
    },
    emailVerified: {
      type: Date,
      default: null,
    },

    // ── Reading Streak ─────────────────────────────────────────
    streak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastReadDate: { type: Date, default: null },
    },

    // ── Reading Progress ───────────────────────────────────────
    readingProgress: [
      {
        surahId: { type: Number, required: true },
        lastAyah: { type: Number, required: true },
        completedAt: { type: Date, default: null },
        updatedAt: { type: Date, default: Date.now },
      },
    ],

    // ── Bookmarks ──────────────────────────────────────────────
    bookmarks: [
      {
        verseKey: { type: String, required: true }, // e.g. "2:255"
        note: { type: String, default: "" },
        savedAt: { type: Date, default: Date.now },
      },
    ],

    // ── Preferences ────────────────────────────────────────────
    // deh dummy lesa htt8yr
    preferences: {
      translationId: { type: Number, default: 131 }, // Saheeh International
      reciterId: { type: Number, default: 7 }, // Mishary Rashid Al-Afasy
      fontSize: { type: String, default: "text-2xl" },
      theme: { type: String, enum: ["dark", "light"], default: "dark" },
    },
  },
  {
    timestamps: true, // Adds createdAt, updatedAt
  },
);

// Prevent model recompilation on hot reload
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
