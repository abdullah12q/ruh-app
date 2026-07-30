import { fadeUp } from "@/data/animationVariants";
import { motion } from "framer-motion";

export default function SurahAlKahfName({ kahfContent }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex items-center justify-center gap-4 mb-10"
    >
      <div className="flex-1 h-px bg-linear-to-r from-transparent via-amber-400/40 to-amber-400/60" />
      <div className="text-center px-4">
        <p
          className="font-quran text-center! text-3xl sm:text-4xl text-amber-500/90 leading-loose"
          dir="rtl"
          lang="ar"
        >
          {kahfContent.surahName.arabic}
        </p>
        <p className="font-jakarta text-xs text-text-secondary/60 tracking-widest uppercase mt-1">
          {kahfContent.surahName.english}
        </p>
      </div>
      <div className="flex-1 h-px bg-linear-to-l from-transparent via-amber-400/40 to-amber-400/60" />
    </motion.div>
  );
}
