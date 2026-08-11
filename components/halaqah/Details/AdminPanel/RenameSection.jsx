import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Check, Loader2 } from "lucide-react";
import { useRenameHalaqah } from "@/lib/queries/halaqah";
import { useRouter } from "next/navigation";

export default function RenameSection({ halaqah, halaqahId }) {
  const [renameValue, setRenameValue] = useState(halaqah.name);
  const [renameError, setRenameError] = useState(null);
  const [renameSuccess, setRenameSuccess] = useState(false);
  const inputRef = useRef(null);

  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRenameValue(halaqah.name);
  }, [halaqah.name]);

  const { mutate: renameMutate, isPending: isRenaming } =
    useRenameHalaqah(halaqahId);

  function handleRename(e) {
    e.preventDefault();
    setRenameError(null);
    setRenameSuccess(false);

    const trimmed = renameValue.trim();
    if (trimmed === halaqah.name) return; // no change

    renameMutate(trimmed, {
      onSuccess: (result) => {
        if (result?.success) {
          setRenameSuccess(true);
          setTimeout(() => setRenameSuccess(false), 2500);

          // encodeURIComponent ensures spaces or special chars in the name don't break the URL.
          // lw m3mltsh keda, el page htgbly not found page 3shan el url halaqah name et8yr w mb2ash mwgod
          router.replace(
            `/halaqah/${encodeURIComponent(trimmed)}?halaqahId=${halaqahId}`,
          );
        } else {
          setRenameError(result?.error || "Failed to rename.");
        }
      },
      onError: () => setRenameError("Something went wrong. Please retry."),
    });
  }

  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-widest text-text-secondary font-inter mb-3">
        Rename Circle
      </h4>
      <form onSubmit={handleRename} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Pencil
            size={12}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary/50 pointer-events-none"
          />
          <input
            ref={inputRef}
            type="text"
            value={renameValue}
            onChange={(e) => {
              setRenameValue(e.target.value);
              setRenameError(null);
              setRenameSuccess(false);
            }}
            maxLength={60}
            placeholder="New circle name..."
            className="w-full glass rounded-xl pl-8 pr-3 py-2 text-sm font-jakarta text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-accent! transition-all duration-500"
          />
        </div>
        <button
          type="submit"
          disabled={
            isRenaming ||
            !renameValue.trim() ||
            renameValue.trim() === halaqah.name
          }
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-accent/10 border border-accent/20 text-accent text-xs font-semibold font-jakarta hover:bg-accent/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {isRenaming ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Check size={12} />
          )}
          {isRenaming ? "Saving..." : renameSuccess ? "Saved!" : "Save"}
        </button>
      </form>

      <AnimatePresence>
        {renameError && (
          <motion.p
            key="rename-error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-xs text-red-400/90 font-inter"
          >
            {renameError}
          </motion.p>
        )}
        {renameSuccess && !renameError && (
          <motion.p
            key="rename-success"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-xs text-accent font-inter"
          >
            Circle renamed successfully.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
