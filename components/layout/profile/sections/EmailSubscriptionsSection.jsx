import { useState, useEffect } from "react";
import { Mail, BellRing, BellOff, Loader2, Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  getUserHalaqahs,
  toggleEmailSubscription,
} from "@/lib/actions/halaqah";
import { AnimatePresence, motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

export default function EmailSubscriptionsSection({ onClose }) {
  const { status } = useSession();
  const [halaqahs, setHalaqahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (status !== "authenticated") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    // Fetch user's circles to show email subscriptions
    getUserHalaqahs().then((result) => {
      if (result?.success) {
        setHalaqahs(result.halaqahs || []);
      }
      setLoading(false);
    });
  }, [status]);

  async function handleToggle(halaqahId, currentOptOut) {
    if (togglingId) return;
    setTogglingId(halaqahId);
    try {
      const res = await toggleEmailSubscription(halaqahId, !currentOptOut);
      if (res?.success) {
        setHalaqahs((prev) =>
          prev.map((h) =>
            h.id === halaqahId ? { ...h, emailOptOut: !currentOptOut } : h,
          ),
        );
        queryClient.invalidateQueries({ queryKey: ["halaqah", "list"] });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingId(null);
    }
  }

  if (status !== "authenticated") {
    return (
      <div className="px-5 py-4 space-y-3">
        {/* Section Title */}
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-text-secondary/10 flex items-center justify-center">
            <Mail size={13} className="text-text-secondary" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">
            Email Digests
          </span>
        </div>
        {/* Locked card */}
        <div className="flex items-center gap-3 glass rounded-xl px-4 py-3 border border-text-secondary/10">
          <Lock size={13} className="text-text-secondary shrink-0" />
          <p className="text-xs text-text-secondary flex-1">
            Sign in to manage circle email digests.
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
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-lg bg-accent/10 flex items-center justify-center">
          <Mail size={13} className="text-accent" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">
          Email Digests
        </span>
      </div>

      {/* Content */}
      <AnimatePresence mode="popLayout">
        {loading ? (
          <div
            key="email-loading"
            className="h-20 w-full skeleton rounded-xl"
          />
        ) : halaqahs.length === 0 ? (
          <motion.div
            key="email-empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-xl p-4 text-center"
          >
            <p className="text-xs text-text-secondary">
              You are not in any study circles.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="email-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <p className="text-[10px] text-text-secondary/80 px-1 pb-1">
              Manage weekly summary emails for your study circles.
            </p>
            {halaqahs.map((halaqah) => (
              <div
                key={halaqah.id}
                className="flex items-center justify-between gap-3 glass rounded-xl px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">
                    {halaqah.name}
                  </p>
                  <p className="text-[10px] text-text-secondary">
                    {halaqah.emailOptOut ? "Opted out" : "Subscribed"}
                  </p>
                </div>

                <button
                  onClick={() => handleToggle(halaqah.id, halaqah.emailOptOut)}
                  disabled={togglingId === halaqah.id}
                  className={`shrink-0 flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-all duration-300 cursor-pointer ${
                    halaqah.emailOptOut
                      ? "bg-text-secondary/5 text-text-secondary border-text-secondary/10 hover:bg-text-secondary/10 hover:text-text-primary"
                      : "bg-accent/5 text-accent border-accent/10 hover:bg-accent/10 hover:border-accent/30"
                  }`}
                  aria-label="Toggle email subscription"
                >
                  {togglingId === halaqah.id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : halaqah.emailOptOut ? (
                    <BellOff size={12} />
                  ) : (
                    <BellRing size={12} />
                  )}
                  {halaqah.emailOptOut ? "Off" : "On"}
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
