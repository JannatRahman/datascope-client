"use client";

import { useState, type FormEvent, useEffect } from "react";
import Link from "next/link";
import { signUp, signIn, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  LineChart,
  Eye as ViewerIcon,
  Shield,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Database,
  Layers,
  FileSpreadsheet,
  Zap,
  Play,
  Pause,
  Home,
  AlertCircle,
} from "lucide-react";

type RegisterRole = "Viewer" | "Data Analyst";

// Verified database role IDs
const ROLE_IDS: Record<RegisterRole, string> = {
  Viewer: "829d8263-7403-4097-b8c0-ae07189c5675",
  "Data Analyst": "1e56fcdf-8ffe-4fb2-833d-1b4fa6687d37",
};

interface DemoStep {
  step: number;
  label: string;
  title: string;
  description: string;
  features: string[];
}

const DEMO_STEPS: DemoStep[] = [
  {
    step: 1,
    label: "Step 1: Role Selection",
    title: "Select your desired workspace access",
    description:
      "Choose Viewer for intuitive read-only dataset exploration, or Data Analyst for query builders, analytics, and exports.",
    features: [
      "Viewer: Search, filter & inspect 280k records",
      "Data Analyst: Saved views, analytics & CSV/JSON exports",
      "Dynamic RBAC & field masking applied instantly",
    ],
  },
  {
    step: 2,
    label: "Step 2: Authentication",
    title: "1-Click Google OAuth or Secure Email",
    description:
      "Connect with your existing Google account or register with email and password. Google logins automatically start with Viewer access.",
    features: [
      "Google Sign-In with instant verified session",
      "Encrypted password storage & Better Auth token handling",
      "Multi-tenant session isolation in Redis",
    ],
  },
  {
    step: 3,
    label: "Step 3: Immediate Exploration",
    title: "Instant access to 6 enterprise datasets",
    description:
      "Zero setup required. Your workspace immediately unlocks 280,000 real-time records across customer, sales, supply chain, and employee datasets.",
    features: [
      "100,000 Customers & 100,000 Sales Orders live",
      "Sub-300ms server-side pagination & filtering",
      "Pre-configured relational drill-down drawers",
    ],
  },
];

export default function RegisterPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // Role selection
  const [selectedRole, setSelectedRole] = useState<RegisterRole>("Viewer");

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Right side interactive demo player
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-play interactive registration demo
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % DEMO_STEPS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Google OAuth registration (defaults to Viewer)
  async function handleGoogleSignUp() {
    setError("");
    setGoogleLoading(true);
    try {
      const result = await signIn.social({
        provider: "google",
        callbackURL: "/viewer",
      });

      if (result?.data?.url) {
        window.location.href = result.data.url;
        return;
      }
      if (result?.error) {
        setError(
          result.error.message ||
            "Google sign-up failed. Verify Google OAuth redirect URI in Google Cloud Console."
        );
        setGoogleLoading(false);
      }
    } catch (err: unknown) {
      setError(
        "Google sign-up error: Ensure http://localhost:3000/api/auth/callback/google is authorized in Google Cloud Console."
      );
      setGoogleLoading(false);
    }
  }

  // Handle standard registration
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
      const chosenRoleId = ROLE_IDS[selectedRole];

      const result = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        ...({ roleId: chosenRoleId } as Record<string, unknown>),
      });

      if (result?.error) {
        setError(result.error.message ?? "Registration failed. Please try again.");
        setLoading(false);
      } else {
        const token =
          (result?.data as { token?: string })?.token ||
          (result?.data as { session?: { token?: string } })?.session?.token;

        if (token) {
          localStorage.setItem("datascope_token", token);
        }

        const destination = selectedRole === "Data Analyst" ? "/analyst" : "/viewer";
        setSuccess(`Account created as ${selectedRole}! Launching your workspace…`);
        setTimeout(() => router.replace(destination), 1200);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unexpected error during registration.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-[#FAFBFC] text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      {/* ─── LEFT COLUMN: Registration Form ─── */}
      <div className="flex flex-1 flex-col justify-between px-6 py-8 sm:px-12 md:px-16 lg:max-w-[560px] xl:max-w-[620px] 2xl:max-w-[660px]">
        {/* Top: Brand Logo linking to Homepage (/) */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 transition-transform hover:scale-[1.02]"
            title="Return to DataScope Home"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-indigo-700 shadow-md shadow-indigo-500/20 text-white">
              <Database className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                DataScope
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 -mt-1">
                Data Intelligence
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>
            <span className="text-slate-300">|</span>
            <Link
              href="/login"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Center: Auth Box */}
        <div className="mx-auto my-auto w-full max-w-[420px] py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Create an Account
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Select your workspace role and start exploring live datasets
            </p>
          </div>

          {/* Google Sign-in Button */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={googleLoading || loading}
            className="group relative flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 hover:shadow disabled:opacity-60 cursor-pointer active:scale-[0.99]"
          >
            {googleLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-indigo-600" />
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Sign up with Google (Viewer default)</span>
          </button>

          {/* Divider */}
          <div className="relative my-5 flex items-center justify-center">
            <div className="w-full border-t border-slate-200" />
            <span className="absolute bg-[#FAFBFC] px-3 text-xs font-medium uppercase tracking-wider text-slate-400">
              or register with email
            </span>
          </div>

          {/* Error / Success Notifications */}
          {error && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 animate-fadeIn">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 animate-fadeIn">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* ─── ROLE SELECTION CARDS ─── */}
          <div className="mb-5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Choose Your Workspace Role
            </label>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Viewer Card */}
              <div
                onClick={() => setSelectedRole("Viewer")}
                className={`relative flex flex-col p-3 rounded-xl border transition-all cursor-pointer select-none ${
                  selectedRole === "Viewer"
                    ? "border-emerald-600 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-500/20"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className={`p-1.5 rounded-lg ${selectedRole === "Viewer" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                    <ViewerIcon className="h-4 w-4" />
                  </div>
                  {selectedRole === "Viewer" && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  )}
                </div>
                <span className="text-xs font-bold text-slate-900">Viewer</span>
                <span className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                  Browse datasets, filter & view records.
                </span>
              </div>

              {/* Data Analyst Card */}
              <div
                onClick={() => setSelectedRole("Data Analyst")}
                className={`relative flex flex-col p-3 rounded-xl border transition-all cursor-pointer select-none ${
                  selectedRole === "Data Analyst"
                    ? "border-blue-600 bg-blue-50/50 shadow-sm ring-2 ring-blue-500/20"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className={`p-1.5 rounded-lg ${selectedRole === "Data Analyst" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                    <LineChart className="h-4 w-4" />
                  </div>
                  {selectedRole === "Data Analyst" && (
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <span className="text-xs font-bold text-slate-900">Data Analyst</span>
                <span className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                  Query analytics, saved views & exports.
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-xs font-semibold text-slate-700">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                required
                autoComplete="name"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
              />
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-xs font-semibold text-slate-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@company.com"
                required
                autoComplete="email"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-xs font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
              <label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                required
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group relative mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  <span>Creating your account…</span>
                </>
              ) : (
                <>
                  <span>Create Account & Join as {selectedRole}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          {/* Sign in link */}
          <div className="mt-5 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
              Sign In
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6 text-[11px] text-slate-400">
          <div className="flex gap-4">
            <Link href="/" className="hover:text-slate-600">Home</Link>
            <span>·</span>
            <span className="hover:text-slate-600 cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-slate-600 cursor-pointer">Terms of Service</span>
          </div>
          <span>© 2026 DATASCOPE</span>
        </div>
      </div>

      {/* ─── RIGHT COLUMN: Registration Interactive Visual Demo ─── */}
      <div className="hidden lg:flex flex-1 p-4 lg:p-6">
        <div className="relative flex w-full flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-[#1d4ed8] via-[#2563eb] to-[#1e1b4b] p-10 text-white shadow-2xl">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

          {/* Top Tag & Demo Controller */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md border border-white/15">
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              <span>Interactive Onboarding Demo</span>
            </div>

            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/15 hover:bg-white/25 px-3 py-1 text-xs font-medium backdrop-blur-md transition-colors cursor-pointer text-white"
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5 text-cyan-300" /> : <Play className="h-3.5 w-3.5 text-cyan-300" />}
              <span>{isPlaying ? "Pause Demo" : "Play Demo"}</span>
            </button>
          </div>

          {/* Center Showcase: Registration Walkthrough Simulator Card */}
          <div className="relative z-10 my-auto py-6">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl shadow-2xl max-w-lg mx-auto">
              {/* Stepper Tabs */}
              <div className="grid grid-cols-3 gap-2 pb-4 border-b border-white/15">
                {DEMO_STEPS.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActiveStep(idx);
                      setIsPlaying(false);
                    }}
                    className={`flex flex-col items-center p-2 rounded-xl text-center transition-all cursor-pointer ${
                      activeStep === idx
                        ? "bg-white text-slate-900 font-bold shadow-md"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-wider">Step {s.step}</span>
                    <span className="text-xs truncate w-full mt-0.5">
                      {idx === 0 ? "Role" : idx === 1 ? "Auth" : "Explore"}
                    </span>
                  </button>
                ))}
              </div>

              {/* Step Content */}
              <div className="pt-5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">
                  {DEMO_STEPS[activeStep].label}
                </span>
                <h3 className="mt-1 text-xl font-extrabold text-white">
                  {DEMO_STEPS[activeStep].title}
                </h3>
                <p className="mt-2 text-xs text-blue-100/90 leading-relaxed">
                  {DEMO_STEPS[activeStep].description}
                </p>

                {/* Features Checklist */}
                <div className="mt-4 space-y-2">
                  {DEMO_STEPS[activeStep].features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2.5 text-xs text-white/90">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Live Simulator Preview Graphic */}
                <div className="mt-5 rounded-xl border border-white/15 bg-slate-950/40 p-3.5 text-left text-xs font-mono">
                  <div className="flex items-center justify-between text-[11px] text-cyan-300 font-sans font-semibold mb-2">
                    <span>Target Destination</span>
                    <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-cyan-200">
                      {selectedRole === "Data Analyst" ? "/analyst" : "/viewer"}
                    </span>
                  </div>
                  <div className="text-slate-300">
                    <span className="text-emerald-400">✓</span> Database: PostgreSQL (280,000 synthetic records)
                  </div>
                  <div className="text-slate-300">
                    <span className="text-emerald-400">✓</span> Session Cache: Redis v6.3 (Active)
                  </div>
                  <div className="text-slate-300">
                    <span className="text-emerald-400">✓</span> Datasets Seeded: 6 tables with 74 schema fields
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Indicators */}
          <div className="relative z-10 flex items-center justify-between pt-2">
            <div className="flex gap-2">
              {DEMO_STEPS.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setActiveStep(idx);
                    setIsPlaying(false);
                  }}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    activeStep === idx ? "w-8 bg-cyan-300" : "w-2 bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>

            <div className="text-xs text-blue-200 font-medium">
              Step {activeStep + 1} of {DEMO_STEPS.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
