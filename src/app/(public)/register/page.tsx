"use client";

import { useState, type FormEvent, useEffect } from "react";
import Link from "next/link";
import { signUp, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (!isPending && session) {
      router.replace("/");
    }
  }, [session, isPending, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const result = await signUp.email({ name, email, password });
      if (result?.error) {
        setError(result.error.message ?? "Registration failed. Please try again.");
      } else {
        setSuccess("Account created successfully! Redirecting…");
        setTimeout(() => router.replace("/"), 1500);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unexpected error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <p className="text-sm text-[#64748B]">Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mb-2 inline-flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4F46E5]">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2 1 3 3 3H17c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 11h6M9 15h4" />
              </svg>
            </div>
            <span className="text-xl font-bold text-[#0F172A]">DataScope</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-[#0F172A]">Create your account</h1>
          <p className="mt-1 text-sm text-[#64748B]">Start exploring your data today</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-medium text-[#334155]">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
                autoComplete="name"
                className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 text-sm text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 transition"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-[#334155]">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 text-sm text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 transition"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-[#334155]">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                autoComplete="new-password"
                className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 text-sm text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 transition"
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirm" className="text-sm font-medium text-[#334155]">Confirm Password</label>
              <input
                id="confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
                autoComplete="new-password"
                className={`rounded-lg border px-3 py-2.5 text-sm text-[#0F172A] placeholder-[#94A3B8] outline-none focus:ring-2 transition bg-[#F8FAFC] ${
                  confirmPassword && confirmPassword !== password
                    ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20"
                    : "border-[#E2E8F0] focus:border-[#4F46E5] focus:ring-[#4F46E5]/20"
                }`}
              />
              {confirmPassword && confirmPassword !== password && (
                <p className="text-xs text-[#EF4444]">Passwords do not match</p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-[#EF4444]/30 px-4 py-3 text-sm text-[#EF4444]">
                ⚠️ {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="rounded-lg bg-emerald-50 border border-[#10B981]/30 px-4 py-3 text-sm text-[#10B981]">
                ✓ {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 rounded-lg bg-[#4F46E5] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4338CA] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-[#64748B]">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-[#4F46E5] hover:text-[#4338CA] transition">
            Sign in
          </Link>
        </p>
        <p className="mt-3 text-center text-xs text-[#94A3B8]">
          <Link href="/auth-test" className="hover:underline">Auth test page</Link>
        </p>
      </div>
    </div>
  );
}
