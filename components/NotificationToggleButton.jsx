import { AnimatePresence, motion } from "framer-motion";
import { BellOff, BellRing, Settings } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";

export default function NotificationToggleButton() {
  const { permission, requestPermission, isSupported } = useNotifications();

  function handleOpenSettings() {
    window.dispatchEvent(
      new CustomEvent("open-profile-drawer", {
        detail: { scrollTo: "prayer-notifications" },
      }),
    );
  }

  return (
    <AnimatePresence mode="popLayout">
      {isSupported && permission !== "granted" && (
        <motion.button
          key="bell-off"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.4 }}
          onClick={requestPermission}
          title="Enable desktop notifications"
          className="flex items-center gap-2 glass rounded-full px-3 py-1.5 text-text-secondary hover:text-accent hover:bg-accent/5 transition-colors duration-400 cursor-pointer"
        >
          <BellOff size={14} />
          <span className="text-[11px] font-bold tracking-wider uppercase">
            Notify Me
          </span>
        </motion.button>
      )}
      {permission === "granted" && (
        <motion.button
          key="bell-on"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.4 }}
          onClick={handleOpenSettings}
          title="Notification settings"
          className="flex items-center gap-2 glass rounded-full px-3 py-1.5 text-accent hover:bg-accent/10! transition-colors duration-300 cursor-pointer group"
        >
          <div className="relative size-3.5 flex items-center justify-center">
            <BellRing
              size={14}
              className="absolute transition-all duration-500 opacity-100 scale-100 group-hover:opacity-0 group-hover:scale-50 group-hover:-rotate-90"
            />
            <Settings
              size={14}
              className="absolute transition-all duration-500 opacity-0 scale-50 rotate-90 group-hover:opacity-100 group-hover:scale-100 group-hover:rotate-0"
            />
          </div>
          <span className="text-[11px] font-bold tracking-wider uppercase">
            Settings
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
