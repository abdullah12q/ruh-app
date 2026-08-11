import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, LogIn, Loader2 } from "lucide-react";
import { createHalaqah, joinHalaqah } from "@/lib/actions/halaqah";
import SuccessState from "./SuccessState";
import CreateForm from "./CreateForm";
import JoinForm from "./JoinForm";
import { backdropVariants, panelVariants } from "@/data/animationVariants";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { halaqahKeys } from "@/lib/queries/halaqah";

export default function CreateJoinModal({ mode, onClose }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Create mode fields
  const [name, setName] = useState("");
  const [goalDate, setGoalDate] = useState("");

  // Join mode field
  const [code, setCode] = useState("");

  // Create mode success state
  const [createdHalaqah, setCreatedHalaqah] = useState({
    id: "",
    name: "",
    inviteCode: "",
  });

  const isCreate = mode === "create";

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      if (isCreate) {
        const result = await createHalaqah({
          name: name.trim(),
          khatmGoalDate: goalDate || undefined,
        });

        if (!result.success) {
          setError(result.error);
          return;
        }

        queryClient.invalidateQueries({ queryKey: halaqahKeys.list() });
        setCreatedHalaqah(result.halaqah);
      } else {
        const result = await joinHalaqah({ inviteCode: code });

        if (!result.success) {
          setError(result.error);
          return;
        }

        queryClient.invalidateQueries({ queryKey: halaqahKeys.list() });
        onClose();
      }
    });
  }

  function copyCode() {
    navigator.clipboard.writeText(createdHalaqah.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    // Backdrop
    <motion.div
      key="modal-backdrop"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      {/* Panel */}
      <motion.div
        key="modal-panel"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md glass rounded-2xl p-7 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
              {isCreate ? (
                <Plus size={16} className="text-accent" />
              ) : (
                <LogIn size={16} className="text-accent" />
              )}
            </div>
            <h2 className="font-jakarta font-bold text-text-primary text-lg">
              {isCreate ? "New Study Circle" : "Join a Circle"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Create success state */}
        <AnimatePresence mode="wait">
          {createdHalaqah.inviteCode ? (
            <SuccessState
              createdCode={createdHalaqah.inviteCode}
              copied={copied}
              onCopy={copyCode}
              onEnter={() => {
                router.push(
                  `/halaqah/${createdHalaqah.name}?halaqahId=${createdHalaqah.id}`,
                );
              }}
            />
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {isCreate ? (
                <CreateForm
                  name={name}
                  setName={setName}
                  goalDate={goalDate}
                  setGoalDate={setGoalDate}
                />
              ) : (
                <JoinForm code={code} setCode={setCode} />
              )}

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-400 text-xs font-inter bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 rounded-xl bg-accent text-white font-jakarta font-semibold text-sm shadow-[0_0_20px_var(--accent-glow)] hover:shadow-[0_0_30px_var(--accent-glow)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    {isCreate ? "Creating..." : "Joining..."}
                  </>
                ) : isCreate ? (
                  "Create Circle"
                ) : (
                  "Join Circle"
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
