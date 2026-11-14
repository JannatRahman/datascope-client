"use client";

const steps = [
  {
    number: "01",
    title: "Connect & Discover Datasets",
    description:
      "Browse the Dataset Library to find the data collections relevant to your work. Each dataset shows record counts, field schemas, your access level, and real-time growth trends. Request access or dive straight in.",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
    gradient: "from-indigo-500 to-sky-500",
    shadowColor: "shadow-indigo-500/20",
    ringColor: "ring-indigo-500/20",
    lineColor: "from-indigo-500 to-violet-500",
    details: ["6 curated data collections", "Schema preview before access", "Role-based dataset visibility", "Real-time record counts"],
    // Mini visual
    visual: (
      <div className="bg-slate-800/60 rounded-xl border border-[#1E293B]/40 p-3">
        <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-2 font-semibold">Available Datasets</div>
        <div className="flex flex-col gap-1.5">
          {[
            { name: "Customers", records: "124K", dot: "bg-indigo-400", bar: "w-10/12" },
            { name: "Orders", records: "891K", dot: "bg-emerald-400", bar: "w-full" },
            { name: "Products", records: "43K", dot: "bg-orange-400", bar: "w-4/12" },
            { name: "Employees", records: "8.9K", dot: "bg-purple-400", bar: "w-2/12" },
          ].map((d) => (
            <div key={d.name} className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${d.dot} shrink-0`} />
              <span className="text-[9px] text-slate-300 w-16">{d.name}</span>
              <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full ${d.dot} ${d.bar} rounded-full opacity-70`} />
              </div>
              <span className="text-[8px] font-mono text-slate-500">{d.records}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    number: "02",
    title: "Search & Apply Filters",
    description:
      "Use the full-text search with sub-50ms response times powered by Redis caching. Layer multiple filter conditions — by field type, value range, enum, or date — combined with AND/OR logic to pinpoint exactly what you need.",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
    gradient: "from-violet-500 to-purple-500",
    shadowColor: "shadow-violet-500/20",
    ringColor: "ring-violet-500/20",
    lineColor: "from-violet-500 to-pink-500",
    details: ["Full-text search with debouncing", "AND / OR filter logic", "Filter by text, number, date, enum", "Redis-cached results &lt;50ms"],
    visual: (
      <div className="bg-slate-800/60 rounded-xl border border-[#1E293B]/40 p-3">
        <div className="flex items-center gap-2 mb-2 bg-slate-700/60 rounded-lg px-2 py-1.5">
          <svg className="w-3 h-3 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <span className="text-[9px] text-slate-200">enterprise software</span>
          <span className="ml-auto text-[8px] text-slate-500">3,241 results</span>
        </div>
        <div className="flex flex-col gap-1">
          {[
            { label: "Status", op: "is", val: "Active", color: "text-violet-400 bg-violet-900/40 border-violet-700/50" },
            { label: "Revenue", op: ">", val: "$50,000", color: "text-emerald-400 bg-emerald-900/40 border-emerald-700/50" },
            { label: "Region", op: "in", val: "N. America, EU", color: "text-indigo-400 bg-indigo-900/40 border-indigo-700/50" },
          ].map((f) => (
            <div key={f.label} className={`flex items-center gap-1.5 px-2 py-1 rounded border text-[8px] ${f.color}`}>
              <span className="font-semibold">{f.label}</span>
              <span className="text-slate-500">{f.op}</span>
              <span>{f.val}</span>
              <span className="ml-auto cursor-pointer opacity-50">×</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    number: "03",
    title: "Explore & Analyze Records",
    description:
      "Navigate millions of records through a virtualized high-performance table. Click any row to open a full record detail view. Switch to the Analytics tab for Recharts-powered charts — revenue trends, distributions, regional breakdowns.",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="3" y1="15" x2="21" y2="15" />
        <line x1="9" y1="3" x2="9" y2="21" />
      </svg>
    ),
    gradient: "from-orange-500 to-amber-500",
    shadowColor: "shadow-orange-500/20",
    ringColor: "ring-orange-500/20",
    lineColor: "from-orange-500 to-emerald-500",
    details: ["Virtualized table (millions of rows)", "Inline record detail panel", "Recharts analytics visualizations", "Configurable column visibility"],
    visual: (
      <div className="bg-slate-800/60 rounded-xl border border-[#1E293B]/40 p-3">
        <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-2 font-semibold">Monthly Revenue</div>
        <div className="flex items-end gap-1 h-12">
          {[40, 65, 50, 80, 72, 95, 88, 100, 76, 84, 68, 55].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm"
              style={{
                height: `${h}%`,
                background: i >= 5 ? "linear-gradient(to top, #8b5cf6, #6366f1)" : "linear-gradient(to top, #6366f1, #818cf8)",
                opacity: 0.85,
              }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1">
          {["J","F","M","A","M","J","J","A","S","O","N","D"].map((m, idx) => (
            <span key={idx} className="text-[6px] text-slate-600">{m}</span>
          ))}
        </div>
      </div>
    ),
  },
  {
    number: "04",
    title: "Save & Share Your Views",
    description:
      "Save any combination of search query, filters, sort order, and column layout as a named View. Reuse it instantly from the sidebar or share it with teammates. Trigger a CSV export and get notified when the background job completes.",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    ),
    gradient: "from-emerald-500 to-emerald-500",
    shadowColor: "shadow-emerald-500/20",
    ringColor: "ring-emerald-500/20",
    lineColor: "",
    details: ["Persistent saved views", "One-click view restore", "Share views with teammates", "Async CSV export with notification"],
    visual: (
      <div className="bg-slate-800/60 rounded-xl border border-[#1E293B]/40 p-3">
        <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-2 font-semibold">Saved Views</div>
        <div className="flex flex-col gap-1.5">
          {[
            { name: "Q4 Enterprise Leads", user: "You", shared: true },
            { name: "High-Value Orders 2024", user: "Sarah M.", shared: false },
            { name: "Active EU Customers", user: "You", shared: true },
          ].map((v, i) => (
            <div key={i} className="flex items-center gap-2 bg-slate-700/40 rounded-lg px-2 py-1.5">
              <svg className="w-3 h-3 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              <div className="flex-1 min-w-0">
                <div className="text-[8px] font-medium text-slate-200 truncate">{v.name}</div>
                <div className="text-[7px] text-slate-500">{v.user}</div>
              </div>
              {v.shared && (
                <svg className="w-2.5 h-2.5 text-indigo-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              )}
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export default function HowItWorksSection() {
  return (
    <section id="about" className="relative py-20 lg:py-28 bg-slate-50 overflow-hidden">
      {/* Decorative grid */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)",
          backgroundSize: "36px 36px",
        }}
      />
      {/* Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-violet-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span className="text-indigo-600 text-sm font-semibold">How It Works</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
            From raw data to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              actionable insight
            </span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Four simple steps that take you from dataset discovery to sharing polished, reusable data views — all inside one platform.
          </p>
        </div>

        {/* Steps — alternating layout on desktop */}
        <div className="flex flex-col gap-16 lg:gap-24">
          {steps.map((step, i) => {
            const isEven = i % 2 === 0;
            return (
              <div
                key={step.number}
                className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${!isEven ? "lg:[direction:rtl]" : ""}`}
              >
                {/* Text side */}
                <div className={`${!isEven ? "lg:[direction:ltr]" : ""}`}>
                  {/* Step badge */}
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white shadow-lg ${step.shadowColor}`}
                    >
                      {step.icon}
                    </div>
                    <div
                      className={`text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${step.gradient} opacity-20 leading-none select-none`}
                    >
                      {step.number}
                    </div>
                  </div>

                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 text-base leading-relaxed mb-6">
                    {step.description}
                  </p>

                  {/* Detail bullets */}
                  <ul className="grid grid-cols-2 gap-2">
                    {step.details.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-sm text-slate-600">
                        <div
                          className={`w-4 h-4 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center shrink-0 mt-0.5`}
                        >
                          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <span dangerouslySetInnerHTML={{ __html: d }} />
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual side */}
                <div className={`${!isEven ? "lg:[direction:ltr]" : ""}`}>
                  <div className="relative">
                    {/* Card glow */}
                    <div className={`absolute -inset-3 bg-gradient-to-br ${step.gradient} rounded-3xl blur-xl opacity-10`} />

                    {/* Main card */}
                    <div
                      className={`relative bg-[#111827] rounded-2xl border border-[#1E293B]/50 shadow-2xl ring-1 ${step.ringColor} overflow-hidden`}
                    >
                      {/* Window chrome */}
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/80 border-b border-[#1E293B]/50">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
                        </div>
                        <div
                          className={`ml-auto text-[8px] font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r ${step.gradient} text-white`}
                        >
                          Step {step.number}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">{step.visual}</div>

                      {/* Step label */}
                      <div className={`px-4 pb-3 text-[9px] text-transparent bg-clip-text bg-gradient-to-r ${step.gradient} font-bold uppercase tracking-wider`}>
                        {step.title}
                      </div>
                    </div>

                    {/* Floating step number */}
                    <div
                      className={`absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg ${step.shadowColor} text-white font-black text-lg`}
                    >
                      {parseInt(step.number)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom connector — progress line on mobile */}
        <div className="mt-16 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white text-xs font-bold shadow-md`}
                >
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-12 h-0.5 bg-gradient-to-r from-slate-300 to-slate-200 rounded" />
                )}
              </div>
            ))}
          </div>
          <p className="text-slate-400 text-sm text-center">
            Start exploring in minutes — no setup required
          </p>
          <a
            href="#get-started"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5 text-sm"
          >
            Get Started Free
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
