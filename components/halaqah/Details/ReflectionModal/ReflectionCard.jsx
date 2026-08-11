import { motion } from "framer-motion";
import Image from "next/image";
import { formatRelativeTime } from "@/data/datas/halaqahDetailsData";
import { reflectionVariants } from "@/data/animationVariants";

export default function ReflectionCard({ reflection, index, colorMap }) {
  const { author, content, createdAt, isOwn } = reflection;

  const relativeTime = formatRelativeTime(createdAt);

  return (
    <motion.div
      custom={index}
      variants={reflectionVariants}
      initial="hidden"
      animate="visible"
      className={`flex gap-3 group ${isOwn ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <div className="shrink-0">
        {author.image ? (
          <Image
            src={author.image}
            alt={author.name}
            width={32}
            height={32}
            className="size-8 rounded-full object-cover ring-1 ring-surface-glass-border"
          />
        ) : (
          <div
            className=" flex items-center justify-center size-8 rounded-full text-xs font-bold font-jakarta"
            style={{
              backgroundColor: colorMap[author.id],
            }}
          >
            {author?.name?.[0]?.toUpperCase() || "U"}
          </div>
        )}
      </div>

      {/* Bubble */}
      <div
        className={`flex flex-col gap-1 flex-1 max-w-[85%] ${isOwn ? "items-end" : "items-start"}`}
      >
        {/* Name + time */}
        <div
          className={`flex items-center gap-2 ${isOwn ? "flex-row-reverse" : ""}`}
        >
          <span className="text-[11px] font-jakarta font-semibold text-text-primary">
            {isOwn ? "You" : author.name}
          </span>
          <span className="text-[10px] text-text-secondary font-inter">
            {relativeTime}
          </span>
        </div>

        {/* Content bubble */}
        <div
          className={`px-3.5 py-2.5 rounded-2xl text-sm text-text-primary font-inter leading-relaxed whitespace-pre-wrap wrap-break-word border
            ${
              isOwn
                ? "bg-violet-500/15 border border-violet-500/25 rounded-tr-sm"
                : "bg-text-secondary/20 border-text-secondary/50 rounded-tl-sm"
            }`}
        >
          {content}
        </div>
      </div>
    </motion.div>
  );
}
