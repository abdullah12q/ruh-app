"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Mail, Lock, UserPlus, User } from "lucide-react";
import AuthLayout from "./AuthLayout";
import AuthInput from "./AuthInput";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSuccess("Account created successfully! Logging you in...");

      // Log the user in right after registering
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.code || "Failed to log in automatically");
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create an account"
      description="Join us on your spiritual journey"
      footerText="Already have an account?"
      footerLinkText="Sign In"
      footerLinkHref="/auth/signin"
      error={error}
      success={success}
    >
      <form onSubmit={handleRegister} className="space-y-4">
        <AuthInput
          id="name"
          label="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          required
          icon={User}
        />
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
          minLength={8}
          icon={Lock}
        />
        <AuthInput
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
          minLength={8}
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
            <UserPlus size={15} />
          )}
          {isLoading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
    </AuthLayout>
  );
}
