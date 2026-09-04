import mongoose, { Schema } from "mongoose";

const MemberSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // 'admin' can rename the group / remove members; 'member' can only read & write progress
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    // lw true, eluser dah msh hyreceive the weekly digest email for this circle.
    // zorar unsubscribe link in the email footer w kman fel halaqah card.
    emailOptOut: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

const HalaqahSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "A study circle must have a name"],
      trim: true,
      maxlength: [60, "Name cannot exceed 60 characters"],
    },

    inviteCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    // The user who created this circle — automatically made an admin in createHalaqah action
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    khatmGoalDate: {
      type: Date,
      default: null,
    },

    members: {
      type: [MemberSchema],
      default: [],
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  },
);

// ── Indexes ──────────────────────────────────────────────────────────────────
// Already unique on inviteCode via the schema field.
// Index members.userId so we can quickly check "is this user in any halaqah?"
HalaqahSchema.index({ "members.userId": 1 });

const Halaqah =
  mongoose.models.Halaqah || mongoose.model("Halaqah", HalaqahSchema);

export default Halaqah;
