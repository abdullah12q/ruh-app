import { motion } from "framer-motion";
import { Play } from "lucide-react";

const channelColors = {
  3: { from: "#0D9488", to: "#0E7490", glow: "rgba(13,148,136,0.25)" }, // Quran — teal
  4: { from: "#6366F1", to: "#4F46E5", glow: "rgba(99,102,241,0.25)" }, // Sunnah — indigo
};

const defaultColor = {
  from: "#0D9488",
  to: "#0e7490",
  glow: "rgba(13,148,136,0.2)",
};

export default function ChannelCard({ channel, isActive, onClick, index }) {
  const color = channelColors[channel.id] ?? defaultColor;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      onClick={onClick}
      className={`relative group w-full text-left rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${
        isActive
          ? "ring-2 ring-accent shadow-[0_0_40px_var(--accent-glow)]"
          : "hover:scale-[1.02]"
      }`}
      style={
        isActive
          ? {
              boxShadow: `0 0 40px ${color.glow}, 0 8px 32px rgba(0,0,0,0.3)`,
            }
          : {}
      }
    >
      {/* Card Background */}
      <div
        className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${color.from}, ${color.to})`,
        }}
      />
      <div className="absolute inset-0 glass" />

      {/* Active border glow */}
      {isActive && (
        <div
          className="absolute inset-0 rounded-2xl border-2 border-accent/50"
          style={{ boxShadow: `inset 0 0 20px ${color.glow}` }}
        />
      )}

      <div className="relative p-5 flex items-center gap-4">
        {/* Channel Icon / TV Screen graphic */}
        <div
          className="shrink-0 size-14 rounded-xl flex items-center justify-center transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, ${color.from}33, ${color.to}22)`,
            border: `1px solid ${color.from}44`,
            boxShadow: isActive ? `0 0 20px ${color.glow}` : "none",
          }}
        >
          <span
            className="text-2xl font-arabic-ui font-bold"
            style={{ color: color.from }}
            dir="rtl"
            lang="ar"
          >
            {/* First letter of channel name */}
            {channel.name.charAt(0)}
          </span>
        </div>

        {/* Channel Info */}
        <div className="flex-1 min-w-0">
          {/* LIVE badge */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="relative flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/25 text-red-400 text-[10px] font-bold tracking-widest uppercase">
              <span className="size-1.5 rounded-full bg-red-400 animate-ping absolute left-2" />
              <span className="size-1.5 rounded-full bg-red-400 relative ml-0" />
              <span className="ml-1">Live</span>
            </span>
          </div>

          {/* Channel Name (Arabic) */}
          <p
            className="font-arabic-ui text-text-primary font-semibold text-base leading-tight truncate"
            dir="rtl"
            lang="ar"
          >
            {channel.name}
          </p>
        </div>

        {/* Play button */}
        <div
          className={`shrink-0 size-9 rounded-full flex items-center justify-center transition-all duration-300 ${
            isActive
              ? "bg-accent text-white shadow-[0_0_16px_var(--accent-glow)]"
              : "bg-white/10 text-text-secondary group-hover:bg-accent/20 group-hover:text-accent"
          }`}
        >
          <Play size={14} className={isActive ? "fill-white" : ""} />
        </div>
      </div>

      {/* Bottom progress bar when active */}
      {isActive && (
        <div
          className="h-0.5 w-full"
          style={{
            background: `linear-gradient(to right, ${color.from}, ${color.to})`,
          }}
        />
      )}
    </motion.button>
  );
}
