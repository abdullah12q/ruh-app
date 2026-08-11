"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Mail, Lock, LogIn } from "lucide-react";
import AuthLayout from "./AuthLayout";
import AuthInput from "./AuthInput";

export default function SignInForm({ callbackUrl }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      setError(result.code || result.error);
    } else {
      window.location.href = callbackUrl || "/";
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to continue your journey"
      footerText="Don't have an account?"
      footerLinkText="Create one free"
      footerLinkHref="/auth/register"
      error={error}
      callbackUrl={callbackUrl}
    >
      <form onSubmit={handleCredentialsSignIn} className="space-y-4">
        <AuthInput
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          icon={Mail}
        />
        <AuthInput
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          icon={Lock}
        />
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
    </AuthLayout>
  );
}
