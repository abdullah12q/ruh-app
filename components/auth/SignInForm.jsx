"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import Image from "next/image";
import logo from "@/app/icon.png";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCredentialsSignIn(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      window.location.href = "/";
    }
  }

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

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
                Rُuh
              </span>
              <span className="text-xl font-bold font-arabic-ui text-accent">
                رُوح
              </span>
            </Link>
            <h1 className="font-jakarta font-bold text-2xl text-text-primary mb-2">
              Welcome back
            </h1>
            <p className="font-inter text-sm text-text-secondary">
              Sign in to continue your journey
            </p>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 glass px-5 py-3.5 rounded-2xl text-sm font-semibold text-text-primary hover:border-(--accent)/30 hover:text-accent transition-all duration-200 mb-6 cursor-pointer"
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
              className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-5 text-sm text-red-400 font-inter"
            >
              {error}
            </motion.div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleCredentialsSignIn} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold font-jakarta text-text-secondary mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full glass rounded-xl pl-11 pr-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 font-inter transition-all duration-200 focus:outline-none focus:border-accent!"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold font-jakarta text-text-secondary mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full glass rounded-xl pl-11 pr-12 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 font-inter transition-all duration-200 focus:outline-none focus:border-accent!"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 size-8 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-accent text-white font-bold text-sm hover:opacity-90 hover:shadow-[0_0_24px_rgba(20,184,166,0.4)] active:scale-95 disabled:cursor-not-allowed transition-all duration-200 mt-2 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn size={15} />
              )}
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-text-secondary font-inter mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-accent font-semibold hover:underline"
            >
              Create one free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
