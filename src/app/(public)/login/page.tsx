"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { signIn, useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Shield,
  LineChart,
  Eye as ViewerIcon,
  Database,
  Sparkles,
  Users,
  Layers,
  FileSpreadsheet,
  Building,
  Server,
  Zap,
  Home,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type RoleOption = "Viewer" | "Data Analyst" | "Administrator";

interface CarouselSlide {
  title: string;
  subtitle: string;
  tag: string;
}

const CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    tag: "Unified Intelligence Hub",
    title: "Real-time enterprise data at scale",
    subtitle:
      "Establish instant relational connections across 280,000+ records, 6 enterprise datasets, and sub-300ms query latency.",
  },
  {
    tag: "Role-Governed Experience",
    title: "Choose the workspace built for you",
    subtitle:
      "Log in as a Viewer for intuitive data browsing, or as a Data Analyst for complex visual query building and live Recharts analytics.",
  },
  {
    tag: "High-Throughput Exports",
    title: "Bounded-memory streaming & exports",
    subtitle:
      "Export 100k+ record datasets as CSV or JSON in background jobs without memory exhaustion, fully governed by dataset access controls.",
  },
];

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // Active Role Selection - Default is Viewer, switching immediately pre-fills credentials
  const [selectedRole, setSelectedRole] = useState<RoleOption>("Viewer");

  // Form states with initial Viewer credentials ready
  const [email, setEmail] = useState("viewer@datascope.local");
  const [password, setPassword] = useState("DataScope2026!");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [redirecting, setRedirecting] = useState(false);

  // Carousel slide index
  const [currentSlide, setCurrentSlide] = useState(0);

  // Switch role and immediately load correct credentials for instant login
  function handleSelectRole(role: RoleOption) {
    setSelectedRole(role);
    setError("");
    if (role === "Viewer") {
      setEmail("viewer@datascope.local");
      setPassword("DataScope2026!");
    } else if (role === "Data Analyst") {
      setEmail("analyst@datascope.local");
      setPassword("DataScope2026!");
    } else if (role === "Administrator") {
      setEmail("admin@datascope.local");
      setPassword("DataScope2026!");
    }
  }

  // Handle Google OAuth Sign In (redirects to Google OAuth flow)
  async function handleGoogleSignIn() {
    setError("");
    setGoogleLoading(true);
    try {
      // Better Auth social login
      const result = await signIn.social({
        provider: "google",
        callbackURL: selectedRole === "Data Analyst" ? "/analyst" : "/viewer",
      });

      // If Better Auth returns a redirect URL, redirect the browser immediately
      if (result?.data?.url) {
        window.location.href = result.data.url;
        return;
      }
      if (result?.error) {
        setError(
          result.error.message ||
            "Google Sign-In failed. Please ensure http://localhost:3000/api/auth/callback/google is authorized in Google Cloud Console."
        );
        setGoogleLoading(false);
      }
    } catch {
      setError(
        "Google Sign-In error: Please verify that http://localhost:3000/api/auth/callback/google is added to Authorized redirect URIs in Google Cloud Console."
      );
      setGoogleLoading(false);
    }
  }

  // Handle standard email/password form submission
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // If there's an existing session from another role, sign out first to avoid stale tokens
      if (session) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("datascope_token");
        }
        await signOut();
      }

      const result = await signIn.email({ email: email.trim(), password });

      if (result?.error) {
        const msg = result.error.message || "";
        if (msg.toLowerCase().includes("invalid") || msg.toLowerCase().includes("credential")) {
          setError("Invalid email address or password. Please verify your credentials.");
        } else if (msg.toLowerCase().includes("deactivat") || msg.toLowerCase().includes("disabled")) {
          setError("This account is currently deactivated. Please contact your system administrator.");
        } else {
          setError(msg || "Authentication failed. Please check your credentials.");
        }
        setLoading(false);
        return;
      }

      // Store token if returned in response
      const token =
        (result?.data as { token?: string })?.token ||
        (result?.data as { session?: { token?: string } })?.session?.token;

      if (token) {
        localStorage.setItem("datascope_token", token);
      }

      setRedirecting(true);

      // Fetch actual role from backend to route accurately
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem("datascope_token") : null);

      try {
        const res = await fetch(`${apiUrl}/api/v1/auth/me`, {
          headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {},
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          const role = data?.user?.roleName;

          if (role === "Administrator") {
            router.replace("/admin");
            return;
          } else if (role === "Data Analyst") {
            router.replace("/analyst");
            return;
          } else {
            router.replace("/viewer");
            return;
          }
        }
      } catch (roleErr) {
        console.warn("[Login] Falling back to selected role navigation:", roleErr);
      }

      // Fallback
      if (selectedRole === "Data Analyst") {
        router.replace("/analyst");
      } else if (selectedRole === "Administrator") {
        router.replace("/admin");
      } else {
        router.replace("/viewer");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to reach the authentication service.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-[#FAFBFC] text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      {/* ─── LEFT COLUMN: Auth Form ─── */}
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
              href="/register"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
            >
              Join Free
            </Link>
          </div>
        </div>

        {/* Center: Auth Box */}
        <div className="mx-auto my-auto w-full max-w-[420px] py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Sign in to your data intelligence command center
            </p>
          </div>

          {/* Active Session Notice if already logged in */}
          {session?.user && (
            <div className="mb-5 flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50/70 p-3 text-xs text-indigo-900">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>
                  Logged in as <strong>{session.user.name}</strong>
                </span>
              </div>
              <div className="flex gap-2">
                <Link
                  href={selectedRole === "Data Analyst" ? "/analyst" : "/viewer"}
                  className="font-bold underline text-indigo-700"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          )}

          {/* Google Sign-in Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
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
            <span>Sign in with Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-5 flex items-center justify-center">
            <div className="w-full border-t border-slate-200" />
            <span className="absolute bg-[#FAFBFC] px-3 text-xs font-medium uppercase tracking-wider text-slate-400">
              or sign in as
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 animate-fadeIn">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* ─── ROLE SELECTOR: Clicking immediately switches & pre-fills credentials ─── */}
          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Your Access Mode
              </label>
              <button
                type="button"
                onClick={() => handleSelectRole("Administrator")}
                className={`text-[11px] font-semibold transition-colors cursor-pointer ${
                  selectedRole === "Administrator" ? "text-indigo-600 font-bold underline" : "text-slate-500 hover:text-indigo-600"
                }`}
              >
                Admin Mode
              </button>
            </div>

            {/* Segmented Selector for Viewer vs Analyst */}
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1 border border-slate-200/80">
              <button
                type="button"
                onClick={() => handleSelectRole("Viewer")}
                className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                  selectedRole === "Viewer"
                    ? "bg-white text-emerald-700 shadow-sm font-bold border border-slate-200/60"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <ViewerIcon className={`h-4 w-4 ${selectedRole === "Viewer" ? "text-emerald-600" : "text-slate-400"}`} />
                <span>Viewer</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectRole("Data Analyst")}
                className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                  selectedRole === "Data Analyst"
                    ? "bg-white text-blue-700 shadow-sm font-bold border border-slate-200/60"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <LineChart className={`h-4 w-4 ${selectedRole === "Data Analyst" ? "text-blue-600" : "text-slate-400"}`} />
                <span>Data Analyst</span>
              </button>
            </div>

            {/* Quick Helper Badge */}
            <div className="mt-2 flex items-center justify-between text-[11px] bg-slate-50 border border-slate-200/70 rounded-lg px-3 py-1.5 text-slate-600">
              <span>
                Target Workspace:{" "}
                <strong className={selectedRole === "Data Analyst" ? "text-blue-600" : selectedRole === "Administrator" ? "text-indigo-600" : "text-emerald-600"}>
                  {selectedRole === "Data Analyst" ? "/analyst" : selectedRole === "Administrator" ? "/admin" : "/viewer"}
                </strong>
              </span>
              <span className="text-[10px] text-slate-400">Credentials auto-loaded</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-slate-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@datascope.local"
                required
                autoComplete="email"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-semibold text-slate-700">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs font-medium text-indigo-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
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

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs text-slate-600">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Remember this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || redirecting}
              className="group relative mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {loading || redirecting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  <span>{redirecting ? "Accessing workspace…" : "Signing in…"}</span>
                </>
              ) : (
                <>
                  <span>Sign In as {selectedRole}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          {/* Registration Link */}
          <div className="mt-5 text-center text-xs text-slate-500">
            No account yet?{" "}
            <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
              Join for free
            </Link>
          </div>
        </div>

        {/* Bottom Footer */}
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

      {/* ─── RIGHT COLUMN: Inspired by Reference Hero Graphic ─── */}
      <div className="hidden lg:flex flex-1 p-4 lg:p-6">
        <div className="relative flex w-full flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-[#1d4ed8] via-[#2563eb] to-[#1e1b4b] p-10 text-white shadow-2xl">
          {/* Subtle Grid Backdrop Pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Glowing Radial Background Accents */}
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

          {/* Top Info Tag */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md border border-white/15">
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              <span>DataScope Enterprise 2026</span>
            </div>
            <div className="text-xs font-medium text-blue-200">280,000+ Real-time Records</div>
          </div>

          {/* Center Graphic: Circular Orbital Core */}
          <div className="relative z-10 my-auto flex items-center justify-center py-8">
            <div className="relative flex h-80 w-80 items-center justify-center sm:h-96 sm:w-96">
              <div className="absolute inset-0 rounded-full border border-white/20 border-dashed animate-[spin_60s_linear_infinite]" />
              <div className="absolute inset-8 rounded-full border border-cyan-400/25" />

              <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-500 p-1 shadow-2xl shadow-cyan-500/50">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0F172A]/80 backdrop-blur-xl border border-white/30 text-white">
                  <div className="flex flex-col items-center">
                    <Shield className="h-9 w-9 text-cyan-300" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-200 mt-1">
                      DataCore
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-lg shadow-black/20 text-slate-800 transition-transform hover:scale-110">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-bold">Customers (100k)</span>
              </div>

              <div className="absolute top-1/4 -right-4 flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-lg shadow-black/20 text-slate-800 transition-transform hover:scale-110">
                <Zap className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-bold">Sales (100k)</span>
              </div>

              <div className="absolute bottom-8 -right-2 flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-lg shadow-black/20 text-slate-800 transition-transform hover:scale-110">
                <Layers className="h-4 w-4 text-amber-600" />
                <span className="text-xs font-bold">Supply (30k)</span>
              </div>

              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-lg shadow-black/20 text-slate-800 transition-transform hover:scale-110">
                <Building className="h-4 w-4 text-purple-600" />
                <span className="text-xs font-bold">Inventory (20k)</span>
              </div>

              <div className="absolute bottom-12 -left-4 flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-lg shadow-black/20 text-slate-800 transition-transform hover:scale-110">
                <FileSpreadsheet className="h-4 w-4 text-indigo-600" />
                <span className="text-xs font-bold">Staff (5k)</span>
              </div>

              <div className="absolute top-1/4 -left-4 flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-lg shadow-black/20 text-slate-800 transition-transform hover:scale-110">
                <Server className="h-4 w-4 text-pink-600" />
                <span className="text-xs font-bold">Tickets (25k)</span>
              </div>
            </div>
          </div>

          {/* Bottom Showcase Carousel */}
          <div className="relative z-10">
            <div className="mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                {CAROUSEL_SLIDES[currentSlide].tag}
              </span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
                {CAROUSEL_SLIDES[currentSlide].title}
              </h2>
              <p className="mt-2 text-sm text-blue-100/90 leading-relaxed max-w-lg">
                {CAROUSEL_SLIDES[currentSlide].subtitle}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-2">
                {CAROUSEL_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      currentSlide === idx ? "w-8 bg-cyan-300" : "w-2 bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentSlide((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md cursor-pointer text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md cursor-pointer text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
