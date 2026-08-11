import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import logo from "@/app/icon.png";
import { useMediaQuery } from "@custom-react-hooks/use-media-query";
import { signIn } from "next-auth/react";

export default function AuthLayout({
  title,
  description,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
  error,
  success,
  callbackUrl,
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  function handleGoogleSignIn() {
    signIn("google", { callbackUrl: callbackUrl || "/" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      {/* Background orbs */}
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-1/3 -left-20 size-64 bg-accent opacity-[0.05] rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-cyan-500 opacity-[0.04] rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass rounded-3xl p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <Image
                src={logo}
                alt="Ruh Logo"
                width={35}
                height={35}
                className="rounded-full"
              />
              <span className="text-2xl font-extrabold font-jakarta text-text-primary">
                {isMobile ? "R ُuh" : "Rُuh"}
              </span>
              <span className="text-xl font-bold font-arabic-ui text-accent">
                رُوح
              </span>
            </Link>
            <h1 className="font-jakarta font-bold text-2xl text-text-primary mb-2">
              {title}
            </h1>
            <p className="font-inter text-sm text-text-secondary">
              {description}
            </p>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 glass px-5 py-3.5 rounded-2xl text-sm font-semibold text-text-primary hover:border-accent/30 hover:text-accent transition-all duration-200 mb-6 cursor-pointer"
          >
            <Image src="/google.svg" alt="Google" width={18} height={18} />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-(--surface-glass-border)" />
            <span className="text-xs text-text-secondary font-jakarta">or</span>
            <div className="flex-1 h-px bg-(--surface-glass-border)" />
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-fit mx-auto bg-red-500/10 border border-red-500/20 rounded-xl p-2 mb-5 text-sm text-red-400 font-inter"
            >
              {error}
            </motion.div>
          )}

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 mb-5 text-sm text-green-400 font-inter"
            >
              {success}
            </motion.div>
          )}

          {children}

          {/* Footer */}
          <p className="text-center text-xs text-text-secondary font-inter mt-6">
            {footerText}{" "}
            <Link
              href={footerLinkHref}
              className="text-accent font-semibold hover:underline"
            >
              {footerLinkText}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
