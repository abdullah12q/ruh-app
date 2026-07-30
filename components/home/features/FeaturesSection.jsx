"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/data/animationVariants";
import { features } from "@/data/datas/homeData";
import FeatureCard from "./FeatureCard";
import { useMediaQuery } from "@custom-react-hooks/use-media-query";

export default function FeaturesSection() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 1 }}
          className="text-center mb-16"
        >
          <h2 className="font-jakarta font-bold text-3xl sm:text-4xl text-text-primary mb-4">
            Everything you need for your{" "}
            <span className="gradient-text">spiritual journey</span>
          </h2>
          <p className="font-inter text-text-secondary max-w-xl mx-auto">
            All your Islamic resources in one beautifully designed,
            distraction-free space.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: isMobile ? 0.3 : 0.6 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
