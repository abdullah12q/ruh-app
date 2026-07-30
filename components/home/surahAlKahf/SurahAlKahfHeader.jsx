import { Moon } from "lucide-react";
import { fadeUp, staggerContainer } from "@/data/animationVariants";
import { motion } from "framer-motion";

export default function SurahAlKahfHeader({ kahfContent }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="text-center mb-12"
    >
      {/* Badge */}
      <motion.div
        variants={fadeUp}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-amber-500 text-xs font-semibold tracking-wider uppercase mb-6 border border-amber-500/20"
      >
        <Moon size={12} className="fill-amber-500" />
        {kahfContent.badge.en}
        <span className="font-arabic-ui text-[11px]" dir="rtl" lang="ar">
          {kahfContent.badge.ar}
        </span>
      </motion.div>

      {/* English Heading */}
      <motion.h2
        variants={fadeUp}
        className="font-jakarta font-extrabold text-3xl sm:text-4xl lg:text-5xl text-text-primary mb-2"
      >
        {kahfContent.heading.en.normal}{" "}
        <span className="text-amber-500">
          {kahfContent.heading.en.highlight}
        </span>
      </motion.h2>

      {/* Arabic Heading */}
      <motion.h2
        variants={fadeUp}
        className="font-quran text-center! text-2xl sm:text-3xl text-amber-500/80 mb-6"
        dir="rtl"
        lang="ar"
      >
        {kahfContent.heading.ar}
      </motion.h2>

      {/* English Subheading */}
      <motion.p
        variants={fadeUp}
        className="font-jakarta text-text-secondary text-base sm:text-lg max-w-2xl mx-auto mb-2 leading-relaxed"
      >
        {kahfContent.subheading.en}
      </motion.p>

      {/* Arabic Subheading */}
      <motion.p
        variants={fadeUp}
        className="font-arabic-ui text-text-secondary/80 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
        dir="rtl"
        lang="ar"
      >
        {kahfContent.subheading.ar}
      </motion.p>
    </motion.div>
  );
}
