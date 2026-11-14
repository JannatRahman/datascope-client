"use client";

import { useEffect, useRef } from "react";

// --- Mock Dashboard Preview SVG Component ---
function DashboardPreview() {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Outer glow */}
      <div className="absolute -inset-4 bg-indigo-500/20 rounded-3xl blur-2xl" />

      {/* Main window frame */}
      <div className="relative bg-[#111827] rounded-2xl shadow-2xl border border-[#1E293B]/60 overflow-hidden">
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/80 border-b border-[#1E293B]/50">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400/80" />
            <div className="w-3 h-3 rounded-full bg-amber-400/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
          </div>
          <div className="flex-1 mx-3">
            <div className="bg-slate-700/60 rounded-md px-3 py-1 text-xs text-slate-400 font-mono text-center w-48 mx-auto">
              datascope.app/explore
            </div>
          </div>
        </div>

        {/* App content */}
        <div className="flex h-[340px]">
          {/* Sidebar */}
          <div className="w-40 bg-slate-800/60 border-r border-[#1E293B]/40 p-3 flex flex-col gap-1 shrink-0">
            <div className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">
              Collections
            </div>
            {["Customers", "Products", "Orders", "Employees", "Inventory", "Analytics"].map(
              (item, i) => (
                <div
                  key={item}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[10px] font-medium cursor-pointer transition-colors ${
                    i === 0
                      ? "bg-indigo-600/80 text-white"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      i === 0
                        ? "bg-indigo-200"
                        : ["bg-purple-400", "bg-emerald-400", "bg-orange-400", "bg-pink-400", "bg-sky-400"][i - 1]
                    }`}
                  />
                  {item}
                </div>
              )
            )}
            <div className="mt-auto pt-2 border-t border-[#1E293B]/40">
              <div className="text-[9px] text-slate-500 px-2">Saved Views</div>
              {["Q4 Leads", "Top Orders"].map((v) => (
                <div
                  key={v}
                  className="flex items-center gap-2 px-2 py-1 mt-1 rounded-md text-[9px] text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                  {v}
                </div>
              ))}
            </div>
          </div>

          {/* Main area */}
          <div className="flex-1 p-3 flex flex-col gap-2.5 overflow-hidden">
            {/* Search + filters row */}
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-1.5 border border-[#1E293B]/60">
                <svg className="w-3 h-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <span className="text-[10px] text-slate-400">Search records...</span>
                <div className="ml-auto text-[8px] text-slate-500 bg-slate-700 px-1.5 py-0.5 rounded">⌘K</div>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800 border border-[#1E293B]/60 rounded-lg px-2.5 py-1.5">
                <svg className="w-3 h-3 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                <span className="text-[10px] text-slate-300">Filters</span>
                <span className="text-[8px] bg-indigo-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center">3</span>
              </div>
              <div className="bg-indigo-600 text-white rounded-lg px-2.5 py-1.5 text-[10px] font-medium">Export</div>
            </div>

            {/* Stats mini-row */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Total Records", value: "124,832", color: "text-indigo-400" },
                { label: "Filtered", value: "3,241", color: "text-purple-400" },
                { label: "Exported", value: "892", color: "text-emerald-400" },
              ].map((s) => (
                <div key={s.label} className="bg-slate-800/80 rounded-lg p-2 border border-[#1E293B]/40">
                  <div className={`text-sm font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-[8px] text-slate-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="flex-1 bg-slate-800/50 rounded-lg border border-[#1E293B]/40 overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-5 gap-0 border-b border-[#1E293B]/50 bg-slate-800/80">
                {["", "Name", "Status", "Revenue", "Region"].map((h, i) => (
                  <div key={i} className={`px-2 py-1.5 text-[9px] font-semibold text-slate-400 uppercase tracking-wider ${i === 0 ? "w-6" : ""}`}>
                    {i === 0 ? (
                      <div className="w-2.5 h-2.5 rounded border border-slate-500" />
                    ) : (
                      <div className="flex items-center gap-0.5">
                        {h}
                        {i === 2 && <svg className="w-2 h-2 text-indigo-400 ml-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg>}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Table rows */}
              {[
                { name: "Acme Corp", status: "Active", revenue: "$124K", region: "North", dot: "bg-emerald-400" },
                { name: "TechFlow Inc", status: "Pending", revenue: "$89K", region: "West", dot: "bg-amber-400" },
                { name: "NovaStar Ltd", status: "Active", revenue: "$203K", region: "East", dot: "bg-emerald-400" },
                { name: "BlueWave Co", status: "Inactive", revenue: "$45K", region: "South", dot: "bg-red-400" },
                { name: "Quantum Sys", status: "Active", revenue: "$167K", region: "North", dot: "bg-emerald-400" },
              ].map((row, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-5 border-b border-[#1E293B]/30 ${
                    i === 1 ? "bg-indigo-600/10" : "hover:bg-slate-700/20"
                  } transition-colors`}
                >
                  <div className="px-2 py-1.5 flex items-center w-6">
                    <div className={`w-2.5 h-2.5 rounded border ${i === 1 ? "bg-indigo-500 border-indigo-500" : "border-slate-500"}`} />
                  </div>
                  <div className="px-2 py-1.5 text-[9px] font-medium text-slate-200">{row.name}</div>
                  <div className="px-2 py-1.5 flex items-center gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${row.dot}`} />
                    <span className="text-[9px] text-slate-300">{row.status}</span>
                  </div>
                  <div className="px-2 py-1.5 text-[9px] text-slate-200 font-mono">{row.revenue}</div>
                  <div className="px-2 py-1.5 text-[9px] text-slate-400">{row.region}</div>
                </div>
              ))}
            </div>

            {/* Pagination bar */}
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-slate-500">Showing 1–25 of 124,832 records</span>
              <div className="flex gap-1">
                {["«", "1", "2", "3", "...", "4993", "»"].map((p, i) => (
                  <div
                    key={i}
                    className={`w-5 h-5 flex items-center justify-center rounded text-[8px] cursor-pointer ${
                      p === "1" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -right-4 top-16 bg-white rounded-xl shadow-xl px-3 py-2.5 border border-[#E2E8F0] text-xs font-semibold text-slate-700 flex items-center gap-2 animate-bounce" style={{ animationDuration: "3s" }}>
        <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        124K records loaded
      </div>
      <div className="absolute -left-4 bottom-24 bg-white rounded-xl shadow-xl px-3 py-2.5 border border-[#E2E8F0] text-xs font-semibold text-slate-700 flex items-center gap-2 animate-bounce" style={{ animationDuration: "4s", animationDelay: "0.5s" }}>
        <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        Results in &lt;50ms
      </div>
    </div>
  );
}

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animated particle/grid background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: { x: number; y: number; vx: number; vy: number; alpha: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 197, 253, ${p.alpha})`;
        ctx.fill();
      });

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(147, 197, 253, ${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0B1120 0%, #1e1b4b 35%, #1e3a5f 65%, #0B1120 100%)",
      }}
    >
      {/* Animated canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.6 }}
      />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "4s" }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "6s", animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-400/20 rounded-full px-4 py-1.5 mb-6">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-indigo-300 text-sm font-medium">Enterprise Data Intelligence Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
              Discover.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">
                Search.
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                Understand
              </span>{" "}
              Your Data.
            </h1>

            {/* Description */}
            <p className="text-slate-300 text-lg lg:text-xl leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              Explore millions of business records through{" "}
              <span className="text-indigo-300 font-medium">powerful search</span>,{" "}
              <span className="text-violet-300 font-medium">intelligent filtering</span>, and{" "}
              <span className="text-sky-300 font-medium">high-performance</span> data exploration.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#features"
                className="group relative inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-900/40 hover:shadow-indigo-700/40 transition-all duration-200 hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                Explore Platform
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a
                href="#get-started"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl border border-white/20 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5"
              >
                Get Started
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* Trust signals */}
            <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start text-sm text-slate-400">
              {[
                "No credit card required",
                "Free exploration",
                "Enterprise ready",
              ].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Dashboard Preview */}
          <div className="hidden lg:block">
            <DashboardPreview />
          </div>
        </div>

        {/* Large centered text like the reference image */}
        <div className="mt-16 lg:mt-20 text-center">
          <p className="text-7xl sm:text-8xl lg:text-[9rem] font-black text-white/[0.04] tracking-tight leading-none select-none uppercase">
            DataScope
          </p>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent" />
    </section>
  );
}
