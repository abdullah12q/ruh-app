"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { BookOpen, ChevronRight, Sparkles } from "lucide-react";
import { useMediaQuery } from "@custom-react-hooks/use-media-query";

export default function HeroSection() {
  const heroContainerRef = useRef(null);
  const videoContainerRef = useRef(null);
  const videoRef = useRef(null);
  const videoAnimRef = useRef(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useGSAP(
    () => {
      const tl = gsap.timeline({ delay: 0.5 });

      tl.fromTo(
        ".hero-badge",
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
      )
        .fromTo(
          ".hero-heading",
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power4.out" },
          "-=0.2",
        )
        .fromTo(
          ".hero-subtext",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.4",
        )
        .fromTo(
          ".hero-cta",
          { opacity: 0, y: 16, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" },
          "-=0.3",
        );

      if (!isMobile) {
        // Desktop: video entrance rides in the same timeline, after the CTA
        tl.fromTo(
          ".hero-video-container",
          { opacity: 0, scale: 0.95, y: 24 },
          { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.3",
        );
      } else {
        // Mobile: separate paused tween, played later on intersection
        videoAnimRef.current = gsap.fromTo(
          videoContainerRef.current,
          { opacity: 0, scale: 0.95, y: 24 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            paused: true,
          },
        );
      }
    },
    { scope: heroContainerRef, dependencies: [isMobile] },
  );

  // Trigger the video-container entrance animation and play when it's 70% visible
  useEffect(() => {
    if (!videoContainerRef.current || !videoRef.current) return;

    if (!isMobile) {
      // On desktop, play immediately
      videoRef.current
        .play()
        .catch((err) => console.log("Video autoplay failed:", err));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoAnimRef.current?.play();
            videoRef.current
              ?.play()
              .catch((err) => console.log("Video play failed:", err));
            observer.disconnect(); // it only should animate and play once
          }
        });
      },
      { threshold: 0.7 }, // Triggers when at least 70% of the video is visible
    );

    observer.observe(videoContainerRef.current);

    return () => observer.disconnect();
  }, [isMobile]);

  function scrollToFeatures() {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({
        behavior: "smooth",
        block: "start", // Aligns the top of the section with the top of the viewport
      });
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20">
      {/* Background ambient orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 -left-20 size-72 bg-accent opacity-[0.1] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 size-96 bg-cyan-400 opacity-[0.06] rounded-full blur-3xl" />
        <div className="absolute top-3/4 left-1/3 size-48 bg-accent opacity-[0.08] rounded-full blur-2xl" />
      </div>

      <div
        ref={heroContainerRef}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center w-full py-16"
      >
        {/* Left — Text Content */}
        <div className="flex flex-col items-center text-center md:items-start md:text-start">
          {/* Badge */}
          <div className="hero-badge opacity-0 inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-accent text-xs font-semibold font-jakarta tracking-widest uppercase mb-6 border border-accent/20">
            <Sparkles size={11} />
            Next-Generation Islamic Platform
          </div>

          {/* Main Heading */}
          <h1 className="hero-heading opacity-0 font-jakarta font-extrabold text-5xl sm:text-6xl xl:text-7xl leading-[1.05] tracking-tight mb-3">
            <span className="text-text-primary">Feed your</span>{" "}
            <span className="gradient-text">soul,</span>
            <br />
            <span className="text-text-primary">distraction-free.</span>
          </h1>

          {/* Arabic Wordmark */}
          <p
            className="hero-heading opacity-0 font-arabic-ui text-2xl sm:text-3xl text-text-secondary mb-4 tracking-wide"
            dir="rtl"
            lang="ar"
          >
            رُوح — تغذّي رُوحك بلا تشتيت
          </p>

          {/* Subtext */}
          <p className="hero-subtext opacity-0 font-inter text-base sm:text-lg text-text-secondary max-w-lg leading-relaxed mb-10">
            An immersive experience for reading and listening to the Quran,
            tracking prayer times, and exploring Hadith — crafted with
            intentional minimalism to help you find deep focus and tranquility.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta opacity-0 flex gap-4">
            <Link
              href="/quran"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-accent text-white font-semibold font-jakarta text-sm hover:opacity-90 hover:shadow-[0_0_30px_rgba(20,184,166,0.4)] active:scale-95 transition-all duration-200"
            >
              <BookOpen size={16} />
              Start Reading
            </Link>
            <button
              onClick={scrollToFeatures}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl glass text-text-primary font-semibold font-jakarta text-sm hover:border-accent/30! hover:scale-101 active:scale-95 transition-all duration-400 cursor-pointer"
            >
              Learn More
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Right — Rُuh Logo Video */}
        <div
          ref={videoContainerRef}
          className="hero-video-container opacity-0 relative w-full lg:pl-8 max-w-lg mx-auto lg:mx-0"
        >
          <video
            ref={videoRef}
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
