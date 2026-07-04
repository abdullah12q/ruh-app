"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cardVariant } from "@/data/animationVariants";

export default function FeatureCard({ feature }) {
  const {
    icon: Icon,
    title,
    titleAr,
    description,
    href,
    gradient,
    iconColor,
  } = feature;

  return (
    <motion.div variants={cardVariant}>
      <Link
        href={href}
        className="group block glass rounded-2xl p-6 h-full hover:border-(--accent)/30 transition-all duration-300 relative overflow-hidden"
      >
        {/* Background gradient tint */}
        <div
          className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}
        />

        <div className="relative z-10">
          {/* Icon */}
          <div
            className={`w-11 h-11 rounded-xl glass flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${iconColor}`}
          >
            <Icon size={20} />
          </div>

          {/* Title */}
          <div className="flex items-baseline gap-2 mb-2">
            <h3 className="text-base font-bold text-text-primary font-jakarta">
              {title}
            </h3>
            <span className="text-sm text-text-secondary font-arabic-ui">
              {titleAr}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-text-secondary font-inter leading-relaxed">
            {description}
          </p>

          {/* CTA Arrow */}
          <div className="mt-4 flex items-center gap-1 text-accent text-sm font-medium font-jakarta opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-300">
            Explore <ChevronRight size={14} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
