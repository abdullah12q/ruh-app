import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, X } from "lucide-react";

const DIGEST_TIP_KEY = "ruh_digest_tip_dismissed";

export default function DigestTipBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(DIGEST_TIP_KEY)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(DIGEST_TIP_KEY, "1");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative mb-6 rounded-2xl overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(20,184,166,0.10) 0%, rgba(20,184,166,0.04) 100%)",
            border: "1px solid rgba(20,184,166,0.25)",
          }}
        >
          <div className="flex items-start gap-4 px-5 py-4 pr-12">
            {/* Icon */}
            <div
              className="shrink-0 mt-0.5 size-9 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(20,184,166,0.12)",
                border: "1px solid rgba(20,184,166,0.25)",
              }}
            >
              <Mail size={16} className="text-accent" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="font-jakarta font-semibold text-text-primary text-sm mb-1">
                📬 Make sure you receive your weekly digest
              </p>
              <p className="font-inter text-text-secondary text-xs leading-relaxed">
                Your Friday circle update is sent from{" "}
                <span className="text-accent font-medium">
                  ruh.app.official@gmail.com
                </span>
                . To make sure it lands in your{" "}
                <strong className="text-text-primary">Primary inbox</strong>,
                please{" "}
                <strong className="text-text-primary">
                  add it to your contacts
                </strong>{" "}
                or open it from your Spam folder and click{" "}
                <strong className="text-text-primary">
                  &quot;Not Spam&quot;
                </strong>
                .
              </p>
            </div>
          </div>

          {/* Dismiss button */}
          <button
            onClick={dismiss}
            aria-label="Dismiss tip"
            className="absolute top-3 right-3 size-7 rounded-lg flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
