import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, RefreshCw, Wifi } from "lucide-react";

export default function TopBar({ lastUpdated, refetch, isFetching }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <Link
        href="/halaqah"
        className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary font-jakarta transition-colors group cursor-pointer"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-0.5 transition-transform duration-300"
        />
        All Circles
      </Link>

      {/* Live indicator */}
      <div className="flex items-center gap-2">
        {isFetching && (
          <motion.div
            key="fetching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader2
              size={13}
              className="text-accent/60 animate-spin"
              aria-label="Refreshing"
            />
          </motion.div>
        )}
        <Wifi size={13} className="text-accent/60" />
        <span className="text-xs font-inter text-text-secondary">
          Live · {lastUpdated ?? "—"}
        </span>
        <button
          onClick={refetch}
          title="Refresh now"
          className="size-7 rounded-lg flex items-center justify-center text-text-secondary hover:text-accent hover:bg-white/5 transition-colors cursor-pointer"
        >
          <RefreshCw size={13} />
        </button>
      </div>
    </div>
  );
}
