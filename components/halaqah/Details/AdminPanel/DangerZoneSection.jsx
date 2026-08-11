import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Loader2, X } from "lucide-react";
import { useDeleteHalaqah } from "@/lib/queries/halaqah";
import { useRouter } from "next/navigation";

export default function DangerZoneSection({ halaqahId }) {
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const router = useRouter();

  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteHalaqah();

  // UX trick: lw el user das delete bs m3mlsh confirm b3d 5 sawany, e2fl el confirm
  useEffect(() => {
    let timeout;
    if (deleteConfirm && !isDeleting) {
      timeout = setTimeout(() => {
        setDeleteConfirm(false);
        setDeleteError(null);
      }, 5000);
    }
    return () => clearTimeout(timeout);
  }, [deleteConfirm, isDeleting]);

  function handleTriggerConfirm() {
    setDeleteError(null);
    setDeleteConfirm(true);
  }

  function handleExecuteDelete() {
    deleteMutate(halaqahId, {
      onSuccess: () => {
        router.replace("/halaqah");
      },
      onError: (err) => {
        setDeleteError(err.message ?? "Failed to delete. Please try again.");
      },
    });
  }

  return (
    <div className="border-t border-red-500/10 pt-5">
      <h4 className="text-xs font-bold uppercase tracking-widest text-red-400/70 font-inter mb-3">
        Danger Zone
      </h4>
      <div className="text-center sm:text-left flex items-center justify-between flex-col sm:flex-row gap-4 p-3 rounded-xl border border-red-500/10 bg-red-500/5">
        <div>
          <p className="text-sm font-semibold font-jakarta text-text-primary">
            Delete this circle
          </p>
          <p className="text-xs text-text-secondary font-inter mt-0.5">
            This action is permanent and cannot be undone.
          </p>
        </div>
        <AnimatePresence mode="popLayout">
          {deleteConfirm ? (
            <motion.div
              key="confirm-delete"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-1.5"
            >
              <button
                onClick={handleExecuteDelete}
                disabled={isDeleting}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold font-jakarta transition-all duration-300 shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={12} />
                    Yes, delete it
                  </>
                )}
              </button>
              <button
                onClick={() => setDeleteConfirm(false)}
                className="p-1 rounded-lg text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                <X size={12} />
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="delete-btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={handleTriggerConfirm}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold font-jakarta transition-all duration-500 shrink-0 cursor-pointer bg-(--surface-glass-border)/30 border-red-500/20 text-red-400/70 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
            >
              <Trash2 size={12} />
              Delete
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {deleteConfirm && !isDeleting && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p
              className={`mt-2 text-xs font-inter ${deleteError ? "text-red-500 font-medium" : "text-red-400/70"}`}
            >
              {deleteError
                ? deleteError
                : 'Click "Yes, delete it" again to confirm.'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
