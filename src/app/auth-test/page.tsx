"use client";

import { useState, type FormEvent } from "react";
import { useSession, signIn, signUp, signOut } from "@/lib/auth-client";

// ── helpers ──────────────────────────────────────────────────────────────────
function Field({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-[#334155]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 transition"
      />
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-lg bg-red-50 border border-[#EF4444] px-4 py-3 text-sm text-[#EF4444]">
      {message}
    </div>
  );
}

function SuccessBox({ message }: { message: string }) {
  return (
    <div className="rounded-lg bg-emerald-50 border border-[#10B981] px-4 py-3 text-sm text-[#10B981]">
      {message}
    </div>
  );
}

// ── Register Panel ────────────────────────────────────────────────────────────
function RegisterPanel() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const result = await signUp.email({ name, email, password });
      if (result?.error) {
        setError(result.error.message ?? "Registration failed. Please try again.");
      } else {
        setSuccess("Account created! You are now logged in.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unexpected error during registration.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-[#0F172A]">Create Account</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Name" id="reg-name" value={name} onChange={setName} placeholder="Your full name" />
        <Field label="Email" id="reg-email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
        <Field label="Password" id="reg-password" type="password" value={password} onChange={setPassword} placeholder="At least 8 characters" />
        {error && <ErrorBox message={error} />}
        {success && <SuccessBox message={success} />}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-lg bg-[#4F46E5] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4338CA] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Creating account…" : "Register"}
        </button>
      </form>
    </div>
  );
}

// ── Login Panel ───────────────────────────────────────────────────────────────
function LoginPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn.email({ email, password });
      if (result?.error) {
        setError(result.error.message ?? "Login failed. Check your credentials.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unexpected error during login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-[#0F172A]">Sign In</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Email" id="login-email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
        <Field label="Password" id="login-password" type="password" value={password} onChange={setPassword} placeholder="Your password" />
        {error && <ErrorBox message={error} />}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-lg bg-[#4F46E5] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4338CA] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in…" : "Login"}
        </button>
      </form>
    </div>
  );
}

// ── Session Panel ─────────────────────────────────────────────────────────────
function SessionPanel() {
  const { data: session, isPending } = useSession();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await signOut();
    setLoading(false);
  }

  if (isPending) {
    return (
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
        <p className="text-sm text-[#64748B]">Checking session…</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#64748B]" />
          <p className="text-sm text-[#64748B]">No active session — not logged in.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#10B981] bg-emerald-50 p-8 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#10B981]" />
        <h2 className="text-lg font-semibold text-[#0F172A]">Active Session</h2>
      </div>
      <div className="mb-6 overflow-auto rounded-lg bg-white border border-[#E2E8F0] p-4">
        <pre className="text-xs text-[#334155] whitespace-pre-wrap break-all">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
      <button
        onClick={handleLogout}
        disabled={loading}
        className="rounded-lg bg-[#EF4444] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
      >
        {loading ? "Signing out…" : "Logout"}
      </button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AuthTestPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#EEF2FF] px-4 py-1.5 text-sm font-medium text-[#4F46E5]">
            🔐 Better Auth Test Page
          </div>
          <h1 className="text-3xl font-bold text-[#0F172A]">DataScope Auth</h1>
          <p className="mt-2 text-[#64748B]">
            Test registration, login, and session management via Better Auth.
          </p>
        </div>

        {/* Session status bar */}
        <div className={`mb-6 rounded-xl px-5 py-3 text-sm font-medium flex items-center gap-2 ${
          session
            ? "bg-emerald-50 text-[#10B981] border border-[#10B981]"
            : "bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]"
        }`}>
          <span className={`h-2 w-2 rounded-full ${session ? "bg-[#10B981]" : "bg-[#64748B]"}`} />
          {session
            ? `Logged in as ${session.user?.name} (${session.user?.email})`
            : "Not logged in"}
        </div>

        {/* Current Session */}
        <div className="mb-6">
          <SessionPanel />
        </div>

        {/* Register + Login side by side when not logged in */}
        {!session && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <RegisterPanel />
            <LoginPanel />
          </div>
        )}

        {/* Info box */}
        <div className="mt-8 rounded-xl border border-[#E2E8F0] bg-white p-5 text-sm text-[#64748B]">
          <p className="font-medium text-[#334155] mb-1">ℹ️ How this works</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Register creates a user via <code className="bg-[#F1F5F9] px-1 rounded">signUp.email()</code></li>
            <li>Login authenticates via <code className="bg-[#F1F5F9] px-1 rounded">signIn.email()</code></li>
            <li>Session is read in real-time by <code className="bg-[#F1F5F9] px-1 rounded">useSession()</code></li>
            <li>Logout calls <code className="bg-[#F1F5F9] px-1 rounded">signOut()</code> and clears the session cookie</li>
            <li>All auth routes handled by <code className="bg-[#F1F5F9] px-1 rounded">/api/auth/[...all]</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
