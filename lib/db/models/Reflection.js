import mongoose, { Schema } from "mongoose";

const ReflectionSchema = new Schema(
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

    content: {
      type: String,
      required: [true, "Reflection content cannot be empty"],
      trim: true,
      maxlength: [2000, "Reflection cannot exceed 2000 characters"],
    },
  },
  {
    timestamps: true, // createdAt = when reflection was posted
  },
);

// ── Indexes ───────────────────────────────────────────────────────────────────

// "Load all reflections for Ayah X in halaqah Y"
ReflectionSchema.index({ halaqahId: 1, surahNumber: 1, ayahNumber: 1 });

// "Load all reflections by me in halaqah Y"
ReflectionSchema.index({ halaqahId: 1, userId: 1 });

const Reflection =
  mongoose.models.Reflection || mongoose.model("Reflection", ReflectionSchema);

export default Reflection;
