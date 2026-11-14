"use client";

const pillars = [
  {
    id: "rbac",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Role-Based Access Control",
    subtitle: "Three-tier role system",
    description:
      "Every user is assigned a platform role — Admin, Analyst, or Viewer — that determines what actions they can perform across the entire platform.",
    gradient: "from-indigo-500 to-indigo-600",
    bgGlow: "bg-indigo-500/5",
    borderColor: "border-indigo-500/20",
    accentColor: "text-indigo-400",
    badgeColor: "bg-indigo-900/40 text-indigo-300 border-indigo-700/40",
    roles: [
      { label: "Admin", desc: "Full platform control, user management, all datasets", color: "bg-red-500/80" },
      { label: "Analyst", desc: "Search, filter, export, save views, analytics", color: "bg-indigo-500/80" },
      { label: "Viewer", desc: "Read-only access to assigned datasets", color: "bg-emerald-500/80" },
    ],
  },
  {
    id: "dataset-perms",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        <path d="M18 15l-3 3 3 3" opacity="0" />
      </svg>
    ),
    title: "Dataset-Level Permissions",
    subtitle: "Granular per-dataset access",
    description:
      "Beyond platform roles, each dataset has its own access control. Users can be granted Viewer, Editor, or Manager access independently per dataset.",
    gradient: "from-violet-500 to-purple-600",
    bgGlow: "bg-violet-500/5",
    borderColor: "border-violet-500/20",
    accentColor: "text-violet-400",
    badgeColor: "bg-violet-900/40 text-violet-300 border-violet-700/40",
    roles: [
      { label: "Manager", desc: "Manage dataset members and field configuration", color: "bg-purple-500/80" },
      { label: "Editor", desc: "Create, update, and delete records", color: "bg-indigo-500/80" },
      { label: "Viewer", desc: "Read records and run searches only", color: "bg-slate-500/80" },
    ],
  },
  {
    id: "auth",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: "Secure Authentication",
    subtitle: "JWT + refresh token sessions",
    description:
      "Authentication uses hashed passwords (bcrypt), short-lived JWT access tokens, and long-lived refresh tokens stored as hashed values in the database.",
    gradient: "from-emerald-500 to-emerald-600",
    bgGlow: "bg-emerald-500/5",
    borderColor: "border-emerald-500/20",
    accentColor: "text-emerald-400",
    badgeColor: "bg-emerald-900/40 text-emerald-300 border-emerald-700/40",
    roles: [
      { label: "bcrypt hashing", desc: "Passwords never stored in plain text", color: "bg-emerald-500/80" },
      { label: "JWT access tokens", desc: "Short-lived, signed, stateless verification", color: "bg-sky-500/80" },
      { label: "Refresh token rotation", desc: "Secure session renewal with hashed storage", color: "bg-teal-500/80" },
    ],
  },
  {
    id: "api",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Protected API Endpoints",
    subtitle: "Middleware-enforced guards",
    description:
      "Every API route is protected by layered middleware: authentication verification, role authorization, dataset access check, and rate limiting — in that order.",
    gradient: "from-orange-500 to-red-500",
    bgGlow: "bg-orange-500/5",
    borderColor: "border-orange-500/20",
    accentColor: "text-orange-400",
    badgeColor: "bg-orange-900/40 text-orange-300 border-orange-700/40",
    roles: [
      { label: "Auth guard", desc: "Verifies JWT on every request", color: "bg-orange-500/80" },
      { label: "Role guard", desc: "Checks platform-level permission", color: "bg-red-500/80" },
      { label: "Rate limiting", desc: "Prevents abuse and DDoS via Redis", color: "bg-rose-500/80" },
    ],
  },
];

// Architecture flow diagram (pure JSX)
function SecurityFlowDiagram() {
  const layers = [
    { label: "Client Request", sub: "HTTPS + JWT header", color: "bg-slate-700 border-slate-600", icon: "🌐" },
    { label: "Auth Middleware", sub: "Verify & decode JWT", color: "bg-indigo-900/60 border-indigo-700/60", icon: "🔑" },
    { label: "Role Guard", sub: "Check platform role", color: "bg-violet-900/60 border-violet-700/60", icon: "👤" },
    { label: "Dataset Guard", sub: "Check dataset access", color: "bg-purple-900/60 border-purple-700/60", icon: "🗄️" },
    { label: "Rate Limiter", sub: "Redis token bucket", color: "bg-orange-900/60 border-orange-700/60", icon: "⚡" },
    { label: "Controller", sub: "Business logic runs", color: "bg-emerald-900/60 border-emerald-700/60", icon: "✅" },
  ];

  return (
    <div className="bg-[#111827] rounded-2xl border border-[#1E293B]/50 p-6">
      <div className="text-xs font-bold text-slate-300 mb-5 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        API Request Lifecycle — Security Layers
      </div>
      <div className="flex flex-col gap-2">
        {layers.map((layer, i) => (
          <div key={i} className="flex items-center gap-3">
            {/* Line + dot */}
            <div className="flex flex-col items-center w-6 shrink-0">
              {i > 0 && <div className="w-0.5 h-2 bg-slate-700" />}
              <div className="w-2 h-2 rounded-full bg-slate-600 shrink-0" />
            </div>
            {/* Card */}
            <div className={`flex-1 flex items-center gap-3 border ${layer.color} rounded-xl px-3 py-2`}>
              <span className="text-sm">{layer.icon}</span>
              <div className="flex-1">
                <div className="text-xs font-semibold text-slate-200">{layer.label}</div>
                <div className="text-[10px] text-slate-500">{layer.sub}</div>
              </div>
              {i < layers.length - 1 ? (
                <svg className="w-3 h-3 text-slate-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Blocked path */}
      <div className="mt-4 flex items-center gap-2 bg-red-950/40 border border-red-800/40 rounded-xl px-3 py-2">
        <svg className="w-3.5 h-3.5 text-red-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
        </svg>
        <div className="text-[10px] text-red-300 font-medium">Unauthorized → 401 / Forbidden → 403 at any layer</div>
      </div>
    </div>
  );
}

export default function SecuritySection() {
  return (
    <section id="solutions" className="relative py-20 lg:py-28 bg-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-50 rounded-full blur-3xl opacity-50 translate-y-1/4 -translate-x-1/4" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-full px-4 py-1.5 mb-4">
            <svg className="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="text-emerald-700 text-sm font-semibold">Security & Access Control</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
            Enterprise-grade{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-600">
              security
            </span>
            {" "}by design
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Multi-layered security ensures the right people see only the right data — enforced at every level, from the network edge to the database row.
          </p>
        </div>

        {/* Top: 4 pillar cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              className={`group relative bg-white border ${pillar.borderColor} rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
            >
              {/* Hover glow */}
              <div className={`absolute inset-0 ${pillar.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`} />

              {/* Top accent */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${pillar.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pillar.gradient} flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  {pillar.icon}
                </div>

                {/* Badge */}
                <div className={`inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full border mb-3 ${pillar.badgeColor}`}>
                  {pillar.subtitle}
                </div>

                {/* Title */}
                <h3 className="text-slate-900 font-bold text-sm mb-2 leading-snug">{pillar.title}</h3>

                {/* Description */}
                <p className="text-slate-500 text-xs leading-relaxed mb-4">{pillar.description}</p>

                {/* Role/feature list */}
                <div className="flex flex-col gap-1.5">
                  {pillar.roles.map((role) => (
                    <div key={role.label} className="flex items-start gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${role.color} mt-1 shrink-0`} />
                      <div>
                        <span className="text-[9px] font-bold text-slate-700">{role.label}</span>
                        <span className="text-[9px] text-slate-400"> — {role.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom: Flow diagram + compliance badges */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left: Architecture flow */}
          <SecurityFlowDiagram />

          {/* Right: Security checklist + tech stack */}
          <div className="flex flex-col gap-5">
            {/* Checklist */}
            <div className="bg-slate-50 border border-[#E2E8F0] rounded-2xl p-6">
              <div className="text-sm font-bold text-slate-800 mb-4">Security Checklist</div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Password hashing (bcrypt)",
                  "JWT token signing (HS256)",
                  "Refresh token rotation",
                  "Role-based authorization",
                  "Dataset access guards",
                  "Redis rate limiting",
                  "SQL injection prevention",
                  "Input validation (Zod)",
                  "CORS configuration",
                  "Activity audit logging",
                  "Session invalidation",
                  "Secure HTTP headers",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-slate-600">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <svg className="w-2.5 h-2.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Tech stack badges */}
            <div className="bg-[#111827] rounded-2xl border border-[#1E293B]/50 p-6">
              <div className="text-xs font-bold text-slate-300 mb-4">Security Stack</div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { tech: "PostgreSQL", role: "Primary data store", icon: "🐘", color: "border-indigo-700/50 bg-indigo-900/20" },
                  { tech: "Redis", role: "Rate limiting & cache", icon: "⚡", color: "border-red-700/50 bg-red-900/20" },
                  { tech: "Drizzle ORM", role: "Type-safe SQL queries", icon: "🔧", color: "border-emerald-700/50 bg-emerald-900/20" },
                  { tech: "Zod", role: "Schema validation", icon: "✅", color: "border-violet-700/50 bg-violet-900/20" },
                  { tech: "JWT / bcrypt", role: "Auth & hashing", icon: "🔑", color: "border-amber-700/50 bg-amber-900/20" },
                  { tech: "Express.js", role: "Middleware pipeline", icon: "🚀", color: "border-slate-600/50 bg-slate-800/40" },
                ].map((t) => (
                  <div key={t.tech} className={`flex items-center gap-2.5 border ${t.color} rounded-xl p-2.5`}>
                    <span className="text-lg">{t.icon}</span>
                    <div>
                      <div className="text-[10px] font-bold text-slate-200">{t.tech}</div>
                      <div className="text-[8px] text-slate-500">{t.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
