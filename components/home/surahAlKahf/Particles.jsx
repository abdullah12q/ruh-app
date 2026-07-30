import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Particles() {
  const [particles, setParticles] = useState([]);

  // Generate particles only on the client side after mounting 3shan kan by7sl moshkla mn 8erha
  useEffect(() => {
    const generatedParticles = Array.from({ length: 36 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 4,
      duration: Math.random() * 6 + 6,
    }));

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles(generatedParticles);
  }, []);

  // Return empty div during Server-Side Rendering (SSR) to prevent hydration mismatch
  if (particles.length === 0) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none" />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-amber-400/80 blur-[1px]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            opacity: [0, 0.7, 0],
            y: [0, -30, -60],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
