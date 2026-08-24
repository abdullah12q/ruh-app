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
  },
  {
    timestamps: true, // Adds createdAt, updatedAt
  },
);

// Prevent model recompilation on hot reload
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
