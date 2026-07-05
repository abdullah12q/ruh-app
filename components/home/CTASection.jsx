"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useMediaQuery } from "@custom-react-hooks/use-media-query";

export default function CTASection() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: isMobile ? 0.5 : 0.6 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="glass rounded-3xl p-10 sm:p-14 relative overflow-hidden"
        >
          {/* Decorative background */}
          <div className="absolute inset-0 bg-linear-to-br from-accent/5 to-transparent rounded-3xl pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent opacity-[0.06] rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-accent text-xs font-semibold font-jakarta tracking-wider uppercase mb-6">
              <Sparkles size={12} />
              Free Forever
            </div>

            <h2 className="font-jakarta font-extrabold text-3xl sm:text-4xl text-text-primary mb-4 leading-tight">
              Begin your journey with{" "}
              <span className="gradient-text">Rُuh</span> today.
            </h2>

            <p className="font-inter text-text-secondary mb-8 text-base sm:text-lg">
              Track your reading streaks, bookmark your favorite Ayahs, and
              connect with a community of believers. No distractions. Ever.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/auth/signin"
                className="px-8 py-3.5 rounded-2xl bg-accent text-white font-bold font-jakarta text-sm hover:opacity-90 hover:shadow-[0_0_30px_rgba(20,184,166,0.4)] active:scale-95 transition-all duration-200"
              >
                Create Free Account
              </Link>
              <Link
                href="/quran"
                className="px-8 py-3.5 rounded-2xl glass text-text-primary font-semibold font-jakarta text-sm hover:border-(--accent)/30 active:scale-95 transition-all duration-200"
              >
                Browse as Guest
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
