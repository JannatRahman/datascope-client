"use client";

import { useRef } from "react";

const stats = [
  {
    value: "100K+",
    label: "Sample Records",
    description: "Pre-loaded business records across all collections for real exploration",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
    gradient: "from-indigo-500 to-sky-500",
    bgGlow: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
  },
  {
    value: "6",
    label: "Data Collections",
    description: "Customers, Products, Orders, Employees, Inventory & Analytics datasets",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
      </svg>
    ),
    gradient: "from-violet-500 to-purple-500",
    bgGlow: "bg-violet-500/10",
    borderColor: "border-violet-500/20",
  },
  {
    value: "⚡",
    label: "Advanced Search",
    description: "Full-text search with debouncing, filters, sort, and &lt;50ms response times",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
    gradient: "from-orange-500 to-amber-500",
    bgGlow: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
  },
  {
    value: "✦",
    label: "Enterprise Architecture",
    description: "PostgreSQL + Redis caching, RBAC, audit logs, and performance monitoring",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    gradient: "from-emerald-500 to-emerald-500",
    bgGlow: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
];

function CountUp({ target, suffix = "" }: { target: string; suffix?: string }) {
  // For emoji/symbol values, just display them
  if (isNaN(parseInt(target))) {
    return <span>{target}{suffix}</span>;
  }
  return <span>{target}{suffix}</span>;
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section id="solutions" className="relative py-20 lg:py-24 bg-slate-50 overflow-hidden">
      {/* Subtle background grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span className="text-indigo-600 text-sm font-semibold">Platform Capabilities</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
            Built for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-600">
              Scale
            </span>
            {" "}& Performance
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Real platform metrics — not marketing numbers. What DataScope can actually do.
          </p>
        </div>

        {/* Stats grid */}
        <div ref={sectionRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`group relative bg-white rounded-2xl border ${stat.borderColor} p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
            >
              {/* Background glow */}
              <div className={`absolute inset-0 ${stat.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              <div className="relative z-10">
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white mb-5 shadow-md`}
                >
                  {stat.icon}
                </div>

                {/* Value */}
                <div
                  className={`text-4xl font-black mb-1 text-transparent bg-clip-text bg-gradient-to-r ${stat.gradient}`}
                >
                  <CountUp target={stat.value} />
                </div>

                {/* Label */}
                <div className="text-slate-900 font-semibold text-base mb-2">
                  {stat.label}
                </div>

                {/* Description */}
                <p
                  className="text-slate-500 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: stat.description }}
                />
              </div>

              {/* Bottom accent bar */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
            </div>
          ))}
        </div>

        {/* Bottom trust row */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
          {[
            { icon: "🔒", text: "Role-Based Access Control" },
            { icon: "⚡", text: "Redis-Powered Caching" },
            { icon: "📊", text: "Real-Time Analytics" },
            { icon: "🔄", text: "Async Data Export" },
            { icon: "📝", text: "Full Audit Logs" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-1.5">
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
