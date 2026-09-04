import { useState, useTransition, useEffect } from "react";
import { UsersRound, Pencil, Check, X, Loader2, Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  getStudyCircleName,
  updateStudyCircleName,
} from "@/lib/actions/halaqah";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";

export default function StudyCircleSection({ onClose }) {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [circleName, setCircleName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const queryClient = useQueryClient();

  // Fetch the current study circle name from the server
  useEffect(() => {
    if (status !== "authenticated") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }
    getStudyCircleName().then((name) => {
      setCircleName(name ?? "");
      setLoading(false);
    });
  }, [status]);

  function startEdit() {
    setInputValue(circleName ?? "");
    setError("");
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setError("");
  }

  function confirmEdit() {
    if (!inputValue.trim()) {
      setError("Name cannot be empty.");
      return;
    }
    startTransition(async () => {
      const result = await updateStudyCircleName(inputValue.trim());
      if (result !== null) {
        setCircleName(result);
        setEditing(false);
        setError("");
        queryClient.invalidateQueries({ queryKey: ["my-circle-name"] });
      } else {
        setError("Failed to update. Please try again.");
      }
    });
  }

  if (status !== "authenticated") {
    return (
      <div className="px-5 py-4 space-y-3">
        {/* Section Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-text-secondary/10 flex items-center justify-center">
              <UsersRound size={13} className="text-text-secondary" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">
              Study Circle Name
            </span>
          </div>
          <Link
            href="/halaqah"
            onClick={onClose}
            className="text-[10px] font-semibold text-accent hover:text-accent/80 hover:translate-x-0.5 transition-all duration-400"
          >
            Go to Circles →
          </Link>
        </div>
        {/* Locked card */}
        <div className="flex items-center gap-3 glass rounded-xl px-4 py-3 border border-text-secondary/10">
          <Lock size={13} className="text-text-secondary shrink-0" />
          <p className="text-xs text-text-secondary flex-1">
            Sign in to manage your study circle name.
          </p>
          <Link
            href="/auth/signin"
            onClick={onClose}
            className="shrink-0 text-[11px] font-semibold text-accent hover:text-accent/80 transition-colors duration-400"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-4 space-y-3">
      {/* Section Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-accent/10 flex items-center justify-center">
            <UsersRound size={13} className="text-accent" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">
            Study Circle Name
          </span>
        </div>
        <Link
          href="/halaqah"
          onClick={onClose}
          className="text-[10px] font-semibold text-accent hover:text-accent/80 hover:translate-x-0.5 transition-all duration-400"
        >
          Go to Circles →
        </Link>
      </div>

      {/* Content */}
      <AnimatePresence mode="popLayout">
        {loading ? (
          <div
            key="study-circle-loading"
            className="h-9 w-full skeleton rounded-xl"
          />
        ) : editing ? (
          <motion.div
            key="study-circle-editing"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.4 }}
            className="space-y-1.5"
          >
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmEdit();
                  if (e.key === "Escape") cancelEdit();
                }}
                maxLength={60}
                autoFocus
                aria-label="Edit study circle name"
                placeholder={`eg. ${user?.name || "Your Name"}`}
                className="flex-1 min-w-0 bg-text-secondary/5 border border-accent/40 focus:border-accent rounded-xl px-3 py-2 text-sm text-text-primary outline-none transition-colors duration-500 placeholder:text-text-secondary/50"
              />
              <button
                onClick={confirmEdit}
                disabled={isPending}
                className="size-9 rounded-xl bg-accent/20 hover:bg-accent/40 text-accent flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Save"
              >
                {isPending ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Check size={13} />
                )}
              </button>
              <button
                onClick={cancelEdit}
                className="size-9 rounded-xl hover:bg-text-secondary/10 text-text-secondary flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Cancel"
              >
                <X size={13} />
              </button>
            </div>
            {error && <p className="text-xs text-rose-400 px-1">{error}</p>}
          </motion.div>
        ) : (
          <motion.div
            key="study-circle-display"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-between gap-2 glass rounded-xl px-3 py-2 group/circle"
          >
            <p className="text-sm font-semibold text-text-primary truncate">
              {circleName || (
                <span className="text-text-secondary italic text-xs">
                  No name set
                </span>
              )}
            </p>
            <button
              onClick={startEdit}
              className="shrink-0 size-7 rounded-lg opacity-0 group-hover/circle:opacity-100 hover:bg-text-secondary/10 text-text-secondary hover:text-accent flex items-center justify-center transition-all cursor-pointer"
              aria-label="Edit study circle name"
            >
              <Pencil size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
