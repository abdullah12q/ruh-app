import { motion, AnimatePresence } from "framer-motion";
import { Check, X, UserMinus, Loader2, Crown } from "lucide-react";
import Image from "next/image";

export default function MemberItem({
  member,
  colorMap,
  currentUserId,
  pendingRemove,
  setPendingRemove,
  handleConfirmRemove,
  isRemoving,
}) {
  const isMe = member.userId === currentUserId;
  const isMemberAdmin = member.role === "admin";
  const canRemove = !isMe && !isMemberAdmin;
  const isPendingThis = pendingRemove === member.userId;

  return (
    <li className="flex items-center gap-3 py-2 px-3 rounded-xl bg-(--surface-glass-border)/20 hover:bg-(--surface-glass-border)/35 transition-colors duration-400">
      {/* Avatar */}
      {member.image ? (
        <Image
          src={member.image}
          alt={member.name}
          width={30}
          height={30}
          className="rounded-full object-cover shrink-0"
        />
      ) : (
        <div
          className="size-8 rounded-full flex items-center justify-center text-xs font-bold font-jakarta shrink-0"
          style={{
            backgroundColor: colorMap[member.userId],
          }}
        >
          {member.name?.[0]?.toUpperCase() || "U"}
        </div>
      )}

      {/* Name */}
      <span className="flex-1 text-sm font-inter text-text-primary truncate">
        {isMe ? "You" : member.name}
      </span>

      {/* Role badge */}
      {isMemberAdmin && (
        <Crown size={12} className="text-amber-400 shrink-0" title="Admin" />
      )}

      {/* Remove / confirm */}
      {canRemove && (
        <AnimatePresence mode="popLayout">
          {isPendingThis ? (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-1.5"
            >
              <button
                onClick={() => handleConfirmRemove(member.userId)}
                disabled={isRemoving}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-semibold hover:bg-red-500/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isRemoving ? (
                  <Loader2 size={10} className="animate-spin" />
                ) : (
                  <Check size={10} />
                )}
                Confirm
              </button>
              <button
                onClick={() => setPendingRemove(null)}
                className="p-1 rounded-lg text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                <X size={12} />
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="remove-btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPendingRemove(member.userId)}
              title={`Remove ${member.name}`}
              className="p-1.5 rounded-lg text-text-secondary/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
            >
              <UserMinus size={13} />
            </motion.button>
          )}
        </AnimatePresence>
      )}
    </li>
  );
}
