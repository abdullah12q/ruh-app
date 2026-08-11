"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Plus, LogIn, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserHalaqahs } from "@/lib/queries/halaqah";
import HalaqahCard from "./HalaqahCard";
import CreateJoinModal from "./CreateJoinModal/CreateJoinModal";
import EditableUserCircleName from "./EditableUserCircleName";
import Link from "next/link";

export default function HalaqahDashboard({ userStudyCircleName }) {
  const { status } = useSession();
  const [modal, setModal] = useState(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = modal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modal]);

  const { data: halaqahs, isLoading, isError, refetch } = useUserHalaqahs();
  if (status === "loading") {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center py-32">
        <Loader2 size={28} className="text-accent animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="max-w-7xl mx-auto animate-fade-up">
        <div className="glass rounded-2xl p-10 text-center max-w-md mx-auto">
          <div className="text-4xl mb-4">🔒</div>
          <p className="text-text-primary font-jakarta font-semibold mb-2">
            Sign in to join a Study Circle
          </p>
          <p className="text-text-secondary font-inter text-sm">
            Create or join a private reading group with your friends and family
            or even alone.
          </p>
          <Link
            href="/auth/signin?callbackUrl=/halaqah"
            className="text-accent text-sm font-semibold hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 animate-fade-up">
        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setModal("create")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-jakarta font-semibold text-sm shadow-[0_0_20px_var(--accent-glow)] hover:shadow-[0_0_30px_var(--accent-glow)] transition-all duration-200 cursor-pointer"
          >
            <Plus size={16} />
            New Circle
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setModal("join")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass border-accent/20! text-accent font-jakarta font-semibold text-sm hover:border-accent/50! transition-all duration-300 cursor-pointer"
          >
            <LogIn size={16} />
            Join Circle
          </motion.button>
        </div>

        {/* Editable User Study Circle Name */}
        <EditableUserCircleName userStudyCircleName={userStudyCircleName} />
      </div>

      {/* Circles list */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-44 rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-text-secondary font-inter text-sm mb-3">
            Could not load your circles.
          </p>
          <button
            onClick={refetch}
            className="text-accent text-sm font-semibold hover:underline"
          >
            Try again
          </button>
        </div>
      ) : halaqahs?.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-12 text-center max-w-md mx-auto"
        >
          <div className="text-5xl mb-5">🕌</div>
          <p className="text-text-primary font-jakarta font-bold text-lg mb-2">
            No circles yet
          </p>
          <p className="text-text-secondary font-inter text-sm">
            Create a new circle or join one with an invite code to start reading
            together.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {halaqahs.map((h, i) => (
              <HalaqahCard key={h.id} halaqah={h} index={i} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create / Join Modal */}
      <AnimatePresence>
        {modal && (
          <CreateJoinModal mode={modal} onClose={() => setModal(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
