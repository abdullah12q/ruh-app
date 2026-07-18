"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { AUTH_ERROR_MESSAGES } from "@/data/authErrors";
import { useMediaQuery } from "@custom-react-hooks/use-media-query";

// error based on the NextAuth `error` query parameter
export default function AuthErrorView() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error") || "Default";
  const errorInfo =
    AUTH_ERROR_MESSAGES[errorCode] || AUTH_ERROR_MESSAGES.Default;

  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      {/* Background orbs */}
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-1/3 -left-20 size-64 bg-red-500 opacity-[0.04] rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-accent opacity-[0.03] rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md text-center"
      >
        <div className="glass rounded-3xl p-8 sm:p-10">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-5xl mb-6"
            role="img"
            aria-label={errorInfo.title}
          >
            {errorInfo.icon}
          </motion.div>

          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="text-xl font-extrabold font-jakarta text-text-primary">
              {isMobile ? "R ُuh" : "Rُuh"}
            </span>
            <span className="text-lg font-bold font-arabic-ui text-accent">
              رُوح
            </span>
          </Link>

          {/* Title */}
          <h1 className="font-jakarta font-bold text-2xl text-text-primary mb-3">
            {errorInfo.title}
          </h1>

          {/* Description */}
          <p className="font-inter text-sm text-text-secondary leading-relaxed mb-8">
            {errorInfo.description}
          </p>

          {/* Error code badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8">
            <AlertTriangle size={12} className="text-yellow-500" />
            <span className="text-xs font-mono text-text-secondary">
              {errorCode}
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link
              href="/auth/signin"
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-accent text-white font-bold text-sm hover:opacity-90 hover:shadow-[0_0_24px_rgba(20,184,166,0.4)] active:scale-95 transition-all duration-200"
            >
              <RefreshCw size={15} />
              Try Again
            </Link>

            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all duration-200"
            >
              <ArrowLeft size={15} />
              Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
