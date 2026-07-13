"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { BookOpen, ChevronRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  const heroTextRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });
      tl.from(".hero-badge", {
        opacity: 0,
        y: -16,
        duration: 0.5,
        ease: "power3.out",
      })
        .from(
          ".hero-heading",
          { opacity: 0, y: 32, duration: 0.8, ease: "power4.out" },
          "-=0.2",
        )
        .from(
          ".hero-subtext",
          { opacity: 0, y: 20, duration: 0.6, ease: "power3.out" },
          "-=0.4",
        )
        .from(
          ".hero-cta",
          { opacity: 0, y: 16, scale: 0.96, duration: 0.5, ease: "power3.out" },
          "-=0.3",
        );
    }, heroTextRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20">
      {/* Background ambient orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 -left-20 size-72 bg-accent opacity-[0.1] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 size-96 bg-cyan-400 opacity-[0.06] rounded-full blur-3xl" />
        <div className="absolute top-3/4 left-1/3 size-48 bg-accent opacity-[0.08] rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center w-full py-16">
        {/* Left — Text Content */}
        <div
          ref={heroTextRef}
          className="flex flex-col items-center text-center md:items-start md:text-start"
        >
          {/* Badge */}
          <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-accent text-xs font-semibold font-jakarta tracking-widest uppercase mb-6 border border-accent/20">
            <Sparkles size={11} />
            Next-Generation Islamic Platform
          </div>

          {/* Main Heading */}
          <h1 className="hero-heading font-jakarta font-extrabold text-5xl sm:text-6xl xl:text-7xl leading-[1.05] tracking-tight mb-3">
            <span className="text-text-primary">Feed your</span>{" "}
            <span className="gradient-text">soul,</span>
            <br />
            <span className="text-text-primary">distraction-free.</span>
          </h1>

          {/* Arabic Wordmark */}
          <p
            className="hero-heading font-arabic-ui text-2xl sm:text-3xl text-text-secondary mb-4 tracking-wide"
            dir="rtl"
            lang="ar"
          >
            رُوح — تغذّي رُوحك بلا تشتيت
          </p>

          {/* Subtext */}
          <p className="hero-subtext font-inter text-base sm:text-lg text-text-secondary max-w-lg leading-relaxed mb-10">
            An immersive reading experience for the Quran, Hadith, and prayer —
            crafted with intentional minimalism to help you find deep focus and
            tranquility.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta flex gap-4">
            <Link
              href="/quran"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-accent text-white font-semibold font-jakarta text-sm hover:opacity-90 hover:shadow-[0_0_30px_rgba(20,184,166,0.4)] active:scale-95 transition-all duration-200"
            >
              <BookOpen size={16} />
              Start Reading
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl glass text-text-primary font-semibold font-jakarta text-sm hover:border-(--accent)/30 active:scale-95 transition-all duration-200"
            >
              Learn More
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        {/* Right — Rُuh Logo Video */}
        <div className="relative w-full lg:pl-8 max-w-lg mx-auto lg:mx-0">
          <video
            autoPlay
            muted
            playsInline
            className="size-full object-cover rounded-3xl"
          >
            <source src="/logo-animation.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-secondary">
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-(--surface-glass-border) flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 rounded-full bg-accent" />
        </motion.div>
        <span className="text-xs tracking-widest uppercase opacity-60">
          Scroll
        </span>
      </div>
    </section>
  );
}
