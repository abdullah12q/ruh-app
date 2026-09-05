import mongoose, { Schema } from "mongoose";

const UserPreferencesSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One preferences document per user
    },
    // UI Store Syncable Fields
    uiState: {
      fontSize: { type: String, default: "text-2xl" },
      translationLanguage: { type: String, default: "ar" },
      mushafMode: { type: Boolean, default: false },
      autoScrollToNextAyah: { type: Boolean, default: true },
    },
    audioState: {
      selectedReciter: { type: Number, default: 42 },
      favoriteReciters: { type: [Number], default: [] },
    },
    prayerConfig: {
      prayerCalcMethod: { type: Number, default: 5 },
      dstAdjustment: { type: Number, default: 0 },
      prayerNotificationMode: { type: String, default: "none" },
      prayerNotificationOffsets: { type: [Number], default: [5, 0] },
    },
    readingProgress: [
      {
        surahId: { type: Number, default: 1 },
        ayahNumber: { type: Number, default: 1 },
        reciter: {
          type: {
            audioBitrate: String,
            full: String,
            name: String,
            nameArabic: String,
            id: Number,
            path: String,
          },
        },
        mushafMode: { type: Boolean, default: false },
        currentPage: { type: Number },
      },
    ],
    bookmarkedAyahs: {
      type: [String], // Array of strings like "1:1"
      default: [],
    },
    // Azkar Store Syncable Fields
    // progress is a Map/Object keyed by "categoryId::index"
    azkarProgress: {
      type: Map,
      of: new Schema(
        {
          remaining: { type: Number, required: true },
          total: { type: Number, required: true },
        },
        { _id: false },
      ),
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

const UserPreferences =
  mongoose.models.UserPreferences ||
  mongoose.model("UserPreferences", UserPreferencesSchema);

export default UserPreferences;
