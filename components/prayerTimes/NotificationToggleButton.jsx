import { AnimatePresence, motion } from "framer-motion";
import { BellOff, BellRing } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";

export default function NotificationToggleButton() {
  const { permission, requestPermission, isSupported } = useNotifications();

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
          className="glass rounded-full p-2 mt-3 text-text-secondary hover:text-accent transition-colors duration-400 cursor-pointer"
        >
          <BellOff size={20} />
        </motion.button>
      )}
      {permission === "granted" && (
        <motion.div
          key="bell-on"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.4 }}
          title="Notifications enabled"
          className="glass rounded-full p-2 mt-3 text-accent"
        >
          <BellRing size={20} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
