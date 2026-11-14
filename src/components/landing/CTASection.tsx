"use client";

export default function CTASection() {
  return (
    <section
      id="get-started"
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0B1120 0%, #1e1b4b 40%, #1e3a5f 70%, #0B1120 100%)",
      }}
    >
      {/* Animated background orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl" />
      <div
        className="absolute top-0 left-1/4 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: "5s" }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-64 h-64 bg-violet-500/15 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: "7s", animationDelay: "1s" }}
      />

      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #818cf8 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
        {/* Top badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-400/20 rounded-full px-4 py-1.5 mb-8">
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-indigo-300 text-sm font-semibold">
            Start Exploring Today — Free
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
          Ready to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-indigo-400">
            Explore
          </span>{" "}
          Your Data?
        </h2>

        {/* Description */}
        <p className="text-slate-300 text-lg lg:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
          Start discovering, searching, and understanding your business data.
          Powered by a high-performance stack built for{" "}
          <span className="text-indigo-300 font-medium">millions of records</span>,
          designed for{" "}
          <span className="text-violet-300 font-medium">real engineers</span>.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
          <a
            href="#"
            className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-2xl shadow-indigo-900/60 hover:shadow-indigo-700/60 transition-all duration-200 hover:-translate-y-1 text-base"
          >
            {/* Shimmer */}
            <span className="absolute inset-0 rounded-2xl overflow-hidden">
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </span>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            Get Started Free
          </a>
          <a
            href="#features"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 text-base"
          >
            Explore Features
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Trust row */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400 mb-14">
          {[
            { icon: "✅", text: "No credit card required" },
            { icon: "⚡", text: "100K+ records ready to explore" },
            { icon: "🔒", text: "Secure & role-protected" },
            { icon: "🚀", text: "Sub-50ms query performance" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2">
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-14" />

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { value: "100K+", label: "Sample Records" },
            { value: "6",     label: "Data Collections" },
            { value: "<50ms", label: "Query Response" },
            { value: "100%",  label: "Type-Safe Stack" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400 mb-1">
                {stat.value}
              </div>
              <div className="text-slate-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

