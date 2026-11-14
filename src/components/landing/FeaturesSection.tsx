"use client";

const features = [
  {
    id: 1,
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
    title: "Advanced Data Search",
    description:
      "Full-text search across all dataset fields with real-time debouncing. Find any record in milliseconds with keyword highlighting and relevance ranking.",
    tags: ["Full-text", "Debounced", "Highlighted"],
    gradient: "from-indigo-500 to-sky-500",
    bgLight: "bg-indigo-50",
    textColor: "text-indigo-600",
    badgeColor: "bg-indigo-100 text-indigo-700",
  },
  {
    id: 2,
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
      </svg>
    ),
    title: "Dynamic Filtering",
    description:
      "Apply multiple filters simultaneously across any field type — text, numbers, dates, enums. Combine conditions with AND/OR logic for precision queries.",
    tags: ["Multi-filter", "AND / OR", "Any field type"],
    gradient: "from-violet-500 to-purple-500",
    bgLight: "bg-violet-50",
    textColor: "text-violet-600",
    badgeColor: "bg-violet-100 text-violet-700",
  },
  {
    id: 3,
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="3" y1="15" x2="21" y2="15" />
        <line x1="9" y1="3" x2="9" y2="21" />
      </svg>
    ),
    title: "High-Performance Data Tables",
    description:
      "Virtualized table rendering for millions of rows without lag. Resizable columns, row selection, inline preview, and configurable visible columns.",
    tags: ["Virtualized", "Resizable cols", "Row select"],
    gradient: "from-orange-500 to-amber-500",
    bgLight: "bg-orange-50",
    textColor: "text-orange-600",
    badgeColor: "bg-orange-100 text-orange-700",
  },
  {
    id: 4,
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polyline points="9 18 15 12 9 6" />
        <line x1="3" y1="12" x2="21" y2="12" />
      </svg>
    ),
    title: "Smart Pagination",
    description:
      "Server-side cursor-based pagination with configurable page sizes (25, 50, 100). Navigate massive datasets efficiently without loading everything at once.",
    tags: ["Cursor-based", "Configurable", "Server-side"],
    gradient: "from-pink-500 to-rose-500",
    bgLight: "bg-pink-50",
    textColor: "text-pink-600",
    badgeColor: "bg-pink-100 text-pink-700",
  },
  {
    id: 5,
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: "Saved Views",
    description:
      "Save any combination of search query, filters, sort order, and column layout as a reusable view. Share views with teammates for collaborative workflows.",
    tags: ["Shareable", "Persistent", "Team views"],
    gradient: "from-emerald-500 to-emerald-500",
    bgLight: "bg-emerald-50",
    textColor: "text-emerald-600",
    badgeColor: "bg-emerald-100 text-emerald-700",
  },
  {
    id: 6,
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    title: "Data Analytics",
    description:
      "Built-in analytics dashboards with Recharts visualizations. Understand trends, distributions, and summaries across any dataset without leaving the platform.",
    tags: ["Charts", "Trends", "Summaries"],
    gradient: "from-sky-500 to-sky-500",
    bgLight: "bg-sky-50",
    textColor: "text-sky-600",
    badgeColor: "bg-sky-100 text-sky-700",
  },
  {
    id: 7,
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
    title: "Data Export",
    description:
      "Async background export jobs for large datasets. Export filtered and sorted data as CSV with real-time progress tracking and email notification on completion.",
    tags: ["Async jobs", "CSV export", "Progress tracking"],
    gradient: "from-indigo-500 to-indigo-500",
    bgLight: "bg-indigo-50",
    textColor: "text-indigo-600",
    badgeColor: "bg-indigo-100 text-indigo-700",
  },
  {
    id: 8,
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
    ),
    title: "Record Relationships",
    description:
      "Discover and navigate connections between records across different datasets. Understand how customers, orders, products, and employees interrelate.",
    tags: ["Cross-dataset", "Graph view", "Linked records"],
    gradient: "from-fuchsia-500 to-violet-500",
    bgLight: "bg-fuchsia-50",
    textColor: "text-fuchsia-600",
    badgeColor: "bg-fuchsia-100 text-fuchsia-700",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-20 lg:py-28 bg-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-50 rounded-full blur-3xl opacity-60" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span className="text-indigo-600 text-sm font-semibold">Core Platform Features</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
            Everything you need to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-600">
              master your data
            </span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Eight tightly-integrated capabilities designed to make large-scale data exploration
            fast, intuitive, and powerful.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group relative bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer overflow-hidden"
            >
              {/* Top gradient bar on hover */}
              <div
                className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              {/* Background fill on hover */}
              <div
                className={`absolute inset-0 ${feature.bgLight} opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-2xl`}
              />

              <div className="relative z-10">
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-5 shadow-md group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="text-slate-900 font-bold text-base mb-2 leading-snug">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  {feature.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {feature.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${feature.badgeColor}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Number indicator */}
              <div
                className={`absolute bottom-4 right-4 text-5xl font-black ${feature.textColor} opacity-5 select-none`}
              >
                {String(feature.id).padStart(2, "0")}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl px-8 py-6 shadow-xl">
            <div className="text-left">
              <div className="text-white font-bold text-lg">Ready to explore your data?</div>
              <div className="text-slate-400 text-sm">Start with 100K+ sample records. No setup needed.</div>
            </div>
            <div className="flex gap-3 shrink-0">
              <a
                href="#get-started"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-lg"
              >
                Get Started Free
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl text-sm transition-all duration-200 border border-white/10"
              >
                See How It Works
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
