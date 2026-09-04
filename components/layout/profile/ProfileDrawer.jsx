import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { drawerVariants } from "@/data/animationVariants";

import ProfileHeader from "./sections/ProfileHeader";
import StudyCircleSection from "./sections/StudyCircleSection";
import EmailSubscriptionsSection from "./sections/EmailSubscriptionsSection";
import BookmarksSection from "./sections/BookmarksSection";
import FavoriteRecitersSection from "./sections/FavoriteRecitersSection";
import PrayerNotificationsSection from "./sections/PrayerNotificationsSection";
import ReadingPreferencesSection from "./sections/ReadingPreferencesSection";
import AppearanceSection from "./sections/AppearanceSection";
import LocationSection from "./sections/LocationSection";
import ReadingStatsSection from "./sections/ReadingStatsSection";
import AccountSection from "./sections/AccountSection";

function SectionDivider() {
  return <div className="border-t border-text-secondary/8" />;
}

export default function ProfileDrawer({ isOpen, onClose, onOpenBookmarks }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="profile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-md sm:backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.aside
            key="profile-drawer"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-full sm:max-w-sm glass flex flex-col"
            aria-label="User Profile"
            role="complementary"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-text-secondary/8 shrink-0">
              <div>
                <h2 className="text-base font-extrabold font-jakarta text-text-primary">
                  Profile
                </h2>
                <p className="text-xs text-text-secondary mt-0.5 font-arabic-ui">
                  الملف الشخصي
                </p>
              </div>
              <button
                onClick={onClose}
                className="size-8 flex items-center justify-center rounded-xl text-text-secondary hover:text-text-primary hover:bg-text-secondary/5 transition-all cursor-pointer"
                aria-label="Close profile"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 pb-20 sm:pb-0 overflow-y-auto">
              <>
                {/* Profile Header (name, avatar, email) */}
                <ProfileHeader onClose={onClose} />

                {/* Study Circle */}
                <SectionDivider />
                <StudyCircleSection onClose={onClose} />

                {/* Email Subscriptions */}
                <SectionDivider />
                <EmailSubscriptionsSection onClose={onClose} />

                {/* Bookmarks */}
                <SectionDivider />
                <BookmarksSection
                  onOpenBookmarks={() => {
                    onClose();
                    onOpenBookmarks();
                  }}
                />

                {/* Favorite Reciters */}
                <SectionDivider />
                <FavoriteRecitersSection />

                {/* Prayer Notifications */}
                <SectionDivider />
                <PrayerNotificationsSection />

                {/* Reading Preferences */}
                <SectionDivider />
                <ReadingPreferencesSection />

                {/* Appearance */}
                <SectionDivider />
                <AppearanceSection />

                {/* Location & Prayer Times */}
                <SectionDivider />
                <LocationSection />

                {/* Reading Stats */}
                <SectionDivider />
                <ReadingStatsSection onClose={onClose} />

                {/* Account */}
                <SectionDivider />
                <AccountSection onClose={onClose} />
              </>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
