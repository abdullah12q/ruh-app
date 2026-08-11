import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ChevronDown } from "lucide-react";
import RenameSection from "./RenameSection";
import MembersSection from "./MembersSection";
import DangerZoneSection from "./DangerZoneSection";

export default function AdminPanel({
  halaqah,
  halaqahId,
  colorMap,
  currentUserId,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-8 glass rounded-2xl overflow-hidden border border-accent/10">
      {/* Panel toggle header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 cursor-pointer group"
      >
        <div className="flex items-center gap-2.5">
          <div className="size-7 rounded-lg bg-accent/10 flex items-center justify-center">
            <Shield size={14} className="text-accent" />
          </div>
          <span className="text-sm font-semibold font-jakarta text-text-primary">
            Admin Controls
          </span>
          <span className="text-[10px] font-mono font-bold tracking-wider text-accent bg-accent/10 border border-accent/20 rounded-md px-1.5 py-0.5">
            ADMIN
          </span>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <ChevronDown
            size={16}
            className="text-text-secondary group-hover:text-accent transition-colors"
          />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-(--surface-glass-border) px-5 py-5 space-y-7">
              {/* Rename Section */}
              <RenameSection halaqah={halaqah} halaqahId={halaqahId} />

              {/* Members Section */}
              <MembersSection
                halaqah={halaqah}
                halaqahId={halaqahId}
                colorMap={colorMap}
                currentUserId={currentUserId}
              />

              {/* Danger Zone Section */}
              <DangerZoneSection halaqahId={halaqahId} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
