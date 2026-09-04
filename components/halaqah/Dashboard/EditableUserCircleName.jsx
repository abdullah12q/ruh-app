import { useEffect, useRef, useState } from "react";
import { Loader2, Pencil, Check, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  getStudyCircleName,
  updateStudyCircleName,
} from "@/lib/actions/halaqah";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export default function EditableUserCircleName() {
  const { data: session } = useSession();
  const user = session?.user;

  const { data: name, isFetching } = useQuery({
    queryKey: ["my-circle-name"],
    queryFn: () => getStudyCircleName(),
  });

  const inputRef = useRef(null);
  const [oldName, setOldName] = useState(name ?? "");
  const [newName, setNewName] = useState(name ?? "");
  const [isSavingName, setIsSavingName] = useState(false);

  useEffect(() => {
    if (!isFetching) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNewName(name);
      setOldName(name);
    }
  }, [name, isFetching]);

  async function handleSaveName(e) {
    e.preventDefault();

    const trimmedName = newName.trim();
    if (!trimmedName || trimmedName === oldName) return; // no change

    setIsSavingName(true);
    try {
      await updateStudyCircleName(trimmedName);
      setOldName(trimmedName);
    } catch (error) {
      console.error("Error updating name:", error);
    } finally {
      setIsSavingName(false);
    }
  }

  const hasUnsavedChanges =
    !isSavingName && newName.trim() !== "" && newName.trim() !== oldName;

  return (
    <div className="glass flex items-center justify-between gap-4 rounded-2xl px-5 py-2.5 border border-accent/20 w-full sm:w-auto min-w-65">
      <div className="flex-1 min-w-0">
        <span className="text-[11px] uppercase tracking-wider font-inter text-text-secondary font-semibold block mb-0.5">
          My Circle Name
        </span>

        {isFetching ? (
          <div className="h-6 w-42 glass rounded animate-pulse" />
        ) : (
          <form onSubmit={handleSaveName}>
            <input
              ref={inputRef}
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              disabled={isSavingName}
              maxLength={60}
              aria-label="Edit study circle name"
              placeholder={`eg. ${user?.name || "Your Name"}`}
              className="w-full bg-transparent border-b border-b-transparent focus:border-b focus:border-accent text-sm font-jakarta text-text-primary focus:outline-none py-0.5 placeholder-text-secondary/50 transition-colors duration-500"
            />
          </form>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {hasUnsavedChanges ? (
          <motion.div
            key="save-actions"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-1 -mr-2"
          >
            <button
              onClick={handleSaveName}
              disabled={isSavingName}
              className="flex items-center gap-1.5 p-2 rounded-lg text-accent hover:bg-accent/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSavingName ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Check size={16} />
              )}
            </button>
            <button
              onClick={() => setNewName(oldName)}
              disabled={isSavingName}
              className="p-2 rounded-lg text-text-secondary hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <X size={16} />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="edit-icon"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.4 }}
            onClick={() => inputRef.current?.focus()}
            className="p-2 rounded-lg text-text-secondary hover:text-accent hover:bg-accent/10 transition-colors cursor-pointer"
          >
            <Pencil size={14} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
