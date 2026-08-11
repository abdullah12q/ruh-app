import mongoose, { Schema } from "mongoose";

const ReadingProgressSchema = new Schema(
  {
    halaqahId: {
      type: Schema.Types.ObjectId,
      ref: "Halaqah",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    surahNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 114,
    },
    ayahNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    // Explicit timestamp for time-windowed leaderboard queries (last 7 days, etc.)
    recordedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// ── Indexes ───────────────────────────────────────────────────────────────────

// Primary access pattern: "give me all progress for halaqah X" or "for user Y in halaqah X"
ReadingProgressSchema.index({ halaqahId: 1, userId: 1 });

// For the weekly summary cron — fetch all recent records across halaqahs
ReadingProgressSchema.index({ recordedAt: 1 });

// Prevent duplicate entries: a user can only mark an ayah once per halaqah
ReadingProgressSchema.index(
  { halaqahId: 1, userId: 1, surahNumber: 1, ayahNumber: 1 },
  { unique: true },
);

const ReadingProgress =
  mongoose.models.ReadingProgress ||
  mongoose.model("ReadingProgress", ReadingProgressSchema);

export default ReadingProgress;
