import Link from "next/link";
import { fadeUp } from "@/data/animationVariants";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

export default function SurahAlKahfCTA({ kahfContent }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="text-center mt-10"
    >
      <Link
        href="/quran/18"
        className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-jakarta font-semibold text-white text-sm sm:text-base transition-all duration-300 relative overflow-hidden shadow-lg hover:shadow-amber-500/20 hover:shadow-2xl hover:-translate-y-0.5"
        style={{
          background:
            "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)",
        }}
      >
        {/* Shimmer overlay */}
        <span
          className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-800"
          aria-hidden="true"
        />
        <BookOpen size={18} />
        <span>{kahfContent.cta.en}</span>
        <span> — </span>
        <span className="font-arabic-ui text-base" dir="rtl" lang="ar">
          {kahfContent.cta.ar}
        </span>
      </Link>

      {/* Small hint text */}
      <p className="mt-4 font-jakarta text-xs text-text-secondary/40">
        This reminder is shown every Thursday after Maghrib through Friday
        Maghrib.
      </p>
    </motion.div>
  );
}
