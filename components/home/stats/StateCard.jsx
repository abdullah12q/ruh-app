import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { statCardVariant } from "@/data/animationVariants";
import AnimatedCounter from "./AnimatedCounter";

export default function StatCard({ stat, index, inView }) {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-60, 60], [8, -8]);
  const rotateY = useTransform(x, [-60, 60], [-8, 8]);
  const springRotX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springRotY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  function handleMouseMove(e) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const accents = [
    {
      ring: "from-teal-400/60 to-cyan-500/40",
      glow: "rgba(20,184,166,0.25)",
      dot: "bg-teal-400",
      text: "text-teal-400",
    },
    {
      ring: "from-violet-400/60 to-purple-500/40",
      glow: "rgba(139,92,246,0.25)",
      dot: "bg-violet-400",
      text: "text-violet-400",
    },
    {
      ring: "from-rose-400/60 to-pink-500/40",
      glow: "rgba(251,113,133,0.25)",
      dot: "bg-rose-400",
      text: "text-rose-400",
    },
    {
      ring: "from-amber-400/60 to-orange-500/40",
      glow: "rgba(251,191,36,0.22)",
      dot: "bg-amber-400",
      text: "text-amber-400",
    },
  ];
  const accent = accents[index % accents.length];

  return (
    <motion.div
      custom={index}
      variants={statCardVariant}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springRotX,
        rotateY: springRotY,
        transformStyle: "preserve-3d",
        perspective: 800,
      }}
      whileHover={{ scale: 1.06 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="relative group cursor-default"
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
        style={{ background: accent.glow }}
      />

      {/* Card body */}
      <div className="relative glass rounded-2xl p-6 sm:p-7 overflow-hidden border border-white/6 dark:border-white/[0.07] flex flex-col items-center gap-3">
        {/* Shimmer on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-linear-to-br from-white/6 via-transparent to-transparent rounded-2xl" />
        </div>

        {/* Top accent ring glow */}
        <div
          className={`absolute -top-5 left-1/2 -translate-x-1/2 w-24 h-10 rounded-full bg-linear-to-r ${accent.ring} blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-500`}
        />

        {/* Pulsing dot */}
        <motion.span
          animate={{ scale: [1, 1.35, 1], opacity: [0.7, 1, 0.7] }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.4,
          }}
          className={`size-2 rounded-full ${accent.dot}`}
          style={{ boxShadow: `0 0 8px ${accent.glow}` }}
        />

        {/* Animated value */}
        <p
          className={`text-4xl sm:text-5xl font-extrabold font-jakarta ${accent.text} tracking-tight tabular-nums leading-none`}
        >
          <AnimatedCounter value={stat.value} inView={inView} />
        </p>

        {/* Divider */}
        <div
          className={`w-10 h-px bg-linear-to-r ${accent.ring} rounded-full`}
        />

        {/* Labels */}
        <div className="text-center">
          <p className="text-sm font-semibold text-text-primary font-jakarta">
            {stat.label}
          </p>
          <p className="text-xs text-text-secondary/60 font-arabic-ui mt-0.5 tracking-wide">
            {stat.labelAr}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
