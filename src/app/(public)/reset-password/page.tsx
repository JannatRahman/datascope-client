"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { ArrowLeft, KeyRound, CheckCircle2, AlertCircle } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!token) {
      setMessage({ type: "error", text: "Missing reset token. Please use the link from your email." });
      return;
    }
    if (password.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters." });
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setLoading(true);
    try {
      await authClient.resetPassword({ newPassword: password, token });
      setMessage({ type: "success", text: "Password reset successful. Redirecting to login..." });
      setTimeout(() => router.push("/login"), 1500);
    } catch {
      setMessage({ type: "error", text: "Reset failed. The link may be invalid or expired." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFBFC] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>

        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">Reset password</h1>
        <p className="mt-1 text-sm text-slate-500">Set a new password for your account.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="password" className="text-xs font-semibold text-slate-700">New password</label>
            <div className="relative mt-1">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-700">Confirm password</label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          {message && (
            <div
              className={`flex items-start gap-2 rounded-xl border p-3 text-xs ${
                message.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message.type === "success" ? <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" /> : <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />}
              <span>{message.text}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-slate-500">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
