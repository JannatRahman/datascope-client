"use client";

import { useState, type ReactNode } from "react";

// ─── Shared micro-components ───────────────────────────────────────────────

function WindowChrome({ url }: { url: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-800/90 border-b border-[#1E293B]/60 shrink-0">
      <div className="flex gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400/90" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400/90" />
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/90" />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-slate-700/70 rounded px-4 py-0.5 text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
          <svg className="w-2.5 h-2.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          {url}
        </div>
      </div>
    </div>
  );
}

function AppSidebar({ active }: { active: string }) {
  const items = [
    { icon: "grid", label: "Datasets", id: "datasets" },
    { icon: "table", label: "Explorer", id: "explorer" },
    { icon: "search", label: "Search", id: "search" },
    { icon: "bar-chart", label: "Analytics", id: "analytics" },
    { icon: "bookmark", label: "Saved Views", id: "saved" },
    { icon: "download", label: "Exports", id: "exports" },
  ];

  const icons: Record<string, ReactNode> = {
    grid: <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />,
    table: <><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="3" x2="9" y2="21" /></>,
    search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></>,
    "bar-chart": <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>,
    bookmark: <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>,
  };

  return (
    <div className="w-44 bg-[#111827] border-r border-[#1E293B]/50 flex flex-col py-3 shrink-0">
      {/* Logo area */}
      <div className="flex items-center gap-2 px-3 pb-4 mb-2 border-b border-[#1E293B]/50">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" opacity="0.4" />
            <path d="M5 5h3v3H5zM16 5h3v3h-3zM5 16h3v3H5zM16 16h3v3h-3z" />
          </svg>
        </div>
        <span className="text-sm font-bold text-white">Data<span className="text-indigo-400">Scope</span></span>
      </div>

      {/* Nav items */}
      <div className="flex flex-col gap-0.5 px-2 flex-1">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[11px] font-medium transition-colors ${
              active === item.id
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {icons[item.icon]}
            </svg>
            {item.label}
          </div>
        ))}
      </div>

      {/* User area */}
      <div className="px-2 mt-auto pt-3 border-t border-[#1E293B]/50">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-[8px] font-bold text-white shrink-0">JD</div>
          <div>
            <div className="text-[9px] font-semibold text-slate-200">John Doe</div>
            <div className="text-[8px] text-slate-500">Admin</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Showcase 1: Data Explorer ─────────────────────────────────────────────

function DataExplorerMockup() {
  const rows = [
    { id: "CU-001", name: "Acme Corporation", email: "contact@acme.com", status: "Active", revenue: "$1.24M", region: "North America", joined: "Jan 12, 2023" },
    { id: "CU-002", name: "TechFlow Industries", email: "info@techflow.io", status: "Active", revenue: "$890K", region: "Europe", joined: "Mar 5, 2023" },
    { id: "CU-003", name: "NovaStar Global", email: "hello@novastar.co", status: "Pending", revenue: "$2.03M", region: "Asia Pacific", joined: "Jun 18, 2023" },
    { id: "CU-004", name: "BlueWave Solutions", email: "bd@bluewave.net", status: "Inactive", revenue: "$450K", region: "South America", joined: "Aug 2, 2023" },
    { id: "CU-005", name: "Quantum Systems", email: "sales@quantum.ai", status: "Active", revenue: "$1.67M", region: "North America", joined: "Sep 14, 2023" },
    { id: "CU-006", name: "Meridian Partners", email: "ops@meridian.co", status: "Active", revenue: "$3.1M", region: "Europe", joined: "Oct 30, 2023" },
  ];

  const statusColors: Record<string, string> = {
    Active: "bg-emerald-900/50 text-emerald-400 border border-emerald-800/50",
    Pending: "bg-amber-900/50 text-amber-400 border border-amber-800/50",
    Inactive: "bg-red-900/50 text-red-400 border border-red-800/50",
  };

  return (
    <div className="flex flex-col h-full bg-[#0B1120]">
      <WindowChrome url="datascope.app/explorer/customers" />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar active="explorer" />
        {/* Main content */}
        <div className="flex-1 flex flex-col p-3 gap-2.5 overflow-hidden">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-sm font-bold text-slate-100">Customers</h1>
              <p className="text-[9px] text-slate-500">124,832 records · Last updated 2 min ago</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 bg-slate-800 border border-[#1E293B]/60 px-2 py-1 rounded text-[9px] text-slate-400">
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                Columns
              </div>
              <div className="bg-indigo-600 text-white px-2.5 py-1 rounded text-[9px] font-semibold flex items-center gap-1">
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Export CSV
              </div>
            </div>
          </div>

          {/* Search + filter bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-slate-800 border border-[#1E293B]/50 rounded-lg px-2.5 py-1.5">
              <svg className="w-3 h-3 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <span className="text-[10px] text-slate-300">acme</span>
              <span className="text-[10px] text-slate-600 ml-auto">Search all fields...</span>
            </div>
            <div className="flex items-center gap-1 bg-indigo-900/40 border border-indigo-700/50 rounded-lg px-2.5 py-1.5 text-[9px] text-indigo-300">
              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              Status: Active
              <span className="ml-1 text-indigo-500">×</span>
            </div>
            <div className="flex items-center gap-1 bg-purple-900/40 border border-purple-700/50 rounded-lg px-2.5 py-1.5 text-[9px] text-purple-300">
              Region: N. America
              <span className="ml-1 text-purple-500">×</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-800 border border-[#1E293B]/50 rounded-lg px-2 py-1.5 text-[9px] text-slate-400">
              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              Add Filter
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 bg-[#111827] rounded-xl border border-[#1E293B]/40 overflow-hidden flex flex-col">
            {/* Table header */}
            <div className="grid text-[9px] font-semibold text-slate-400 uppercase tracking-wider border-b border-[#1E293B]/50 bg-slate-800/60 shrink-0" style={{ gridTemplateColumns: "24px 90px 1fr 120px 60px 70px 90px 70px" }}>
              <div className="px-2 py-2 flex items-center"><div className="w-2.5 h-2.5 rounded border border-slate-500" /></div>
              <div className="px-2 py-2">ID</div>
              <div className="px-2 py-2 flex items-center gap-1">Company <svg className="w-2 h-2 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg></div>
              <div className="px-2 py-2">Email</div>
              <div className="px-2 py-2">Status</div>
              <div className="px-2 py-2">Revenue</div>
              <div className="px-2 py-2">Region</div>
              <div className="px-2 py-2">Joined</div>
            </div>

            {/* Rows */}
            <div className="flex-1 overflow-hidden">
              {rows.map((row, i) => (
                <div
                  key={row.id}
                  className={`grid text-[9px] border-b border-[#1E293B]/60 hover:bg-slate-800/40 transition-colors ${i === 0 ? "bg-indigo-950/30" : ""}`}
                  style={{ gridTemplateColumns: "24px 90px 1fr 120px 60px 70px 90px 70px" }}
                >
                  <div className="px-2 py-2 flex items-center">
                    <div className={`w-2.5 h-2.5 rounded border ${i === 0 ? "bg-indigo-500 border-indigo-500" : "border-slate-600"}`} />
                  </div>
                  <div className="px-2 py-2 font-mono text-indigo-400">{row.id}</div>
                  <div className="px-2 py-2 font-medium text-slate-200 truncate">{row.name}</div>
                  <div className="px-2 py-2 text-slate-500 truncate">{row.email}</div>
                  <div className="px-2 py-2">
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-semibold ${statusColors[row.status]}`}>{row.status}</span>
                  </div>
                  <div className="px-2 py-2 font-mono text-emerald-400">{row.revenue}</div>
                  <div className="px-2 py-2 text-slate-400 truncate">{row.region}</div>
                  <div className="px-2 py-2 text-slate-500">{row.joined}</div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-3 py-2 border-t border-[#1E293B]/50 bg-slate-800/40 shrink-0">
              <span className="text-[9px] text-slate-500">Showing 1–25 of 124,832 records</span>
              <div className="flex items-center gap-1">
                <span className="text-[9px] text-slate-500 mr-2">Page size:</span>
                <div className="bg-slate-700 text-slate-200 text-[8px] px-1.5 py-0.5 rounded">25 ▾</div>
                {["«","1","2","3","...","4993","»"].map((p, i) => (
                  <div key={i} className={`w-5 h-5 flex items-center justify-center rounded text-[8px] ${p === "1" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-700"}`}>{p}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Showcase 2: Advanced Search Builder ───────────────────────────────────

function SearchBuilderMockup() {
  return (
    <div className="flex flex-col h-full bg-[#0B1120]">
      <WindowChrome url="datascope.app/search?dataset=orders" />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar active="search" />
        <div className="flex-1 flex gap-2.5 p-3 overflow-hidden">
          {/* Left: Query builder */}
          <div className="w-72 flex flex-col gap-2.5 shrink-0">
            <div className="bg-[#111827] rounded-xl border border-[#1E293B]/40 p-3 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-200">Search Query</span>
                <span className="text-[8px] text-indigo-400 bg-indigo-900/30 px-1.5 py-0.5 rounded">Advanced</span>
              </div>
              {/* Text search */}
              <div className="flex items-center gap-1.5 bg-slate-800 border border-indigo-500/50 rounded-lg px-2 py-1.5">
                <svg className="w-3 h-3 text-indigo-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <span className="text-[10px] text-slate-200">enterprise software</span>
                <div className="ml-auto w-1.5 h-3.5 bg-indigo-500 animate-pulse rounded-sm" />
              </div>

              {/* Filter conditions */}
              <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Filter Conditions</div>

              {[
                { field: "Order Total", op: "greater than", value: "$50,000", color: "text-emerald-400", dot: "bg-emerald-500" },
                { field: "Status", op: "is one of", value: "Completed, Processing", color: "text-indigo-400", dot: "bg-indigo-500" },
                { field: "Order Date", op: "between", value: "Jan 2024 – Now", color: "text-purple-400", dot: "bg-purple-500" },
              ].map((f, i) => (
                <div key={i} className="bg-slate-800/60 border border-[#1E293B]/40 rounded-lg p-2 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${f.dot}`} />
                    <span className="text-[9px] font-semibold text-slate-300">{f.field}</span>
                    <span className="ml-auto text-[7px] text-slate-500 cursor-pointer hover:text-red-400">×</span>
                  </div>
                  <div className="flex items-center gap-1 ml-3">
                    <span className="text-[8px] bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded">{f.op}</span>
                  </div>
                  <div className={`text-[9px] ml-3 font-mono ${f.color}`}>{f.value}</div>
                </div>
              ))}

              <button className="flex items-center gap-1 text-[9px] text-indigo-400 hover:text-indigo-300 transition-colors">
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add condition
              </button>
            </div>

            {/* Sort config */}
            <div className="bg-[#111827] rounded-xl border border-[#1E293B]/40 p-3 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-200">Sort Order</span>
              {[
                { field: "Order Total", dir: "DESC", arrow: "↓" },
                { field: "Order Date", dir: "ASC", arrow: "↑" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-[9px]">
                  <div className="w-4 h-4 bg-slate-700 rounded flex items-center justify-center text-slate-500 text-[8px]">{i + 1}</div>
                  <span className="text-slate-300 flex-1">{s.field}</span>
                  <span className="text-indigo-400 font-mono font-bold">{s.arrow}</span>
                  <span className="text-slate-500">{s.dir}</span>
                </div>
              ))}
            </div>

            {/* Execute button */}
            <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Execute Search
            </button>
          </div>

          {/* Right: Results */}
          <div className="flex-1 flex flex-col gap-2.5 overflow-hidden">
            {/* Results header */}
            <div className="bg-[#111827] rounded-xl border border-[#1E293B]/40 p-3 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-200">Search Results</div>
                <div className="text-[9px] text-slate-500">3,241 records matched · executed in 47ms</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-[8px] text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded-lg border border-emerald-800/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Cache hit
                </div>
                <div className="text-[8px] text-slate-400 bg-slate-800 px-2 py-1 rounded-lg">Save as View</div>
              </div>
            </div>

            {/* Result cards */}
            <div className="flex-1 overflow-hidden grid grid-cols-1 gap-2 content-start">
              {[
                { id: "ORD-7821", company: "NovaStar Global", items: "14 items", total: "$128,450", status: "Completed", date: "Nov 2, 2024", badge: "bg-emerald-900/50 text-emerald-400" },
                { id: "ORD-7634", company: "Quantum Systems", items: "8 items", total: "$94,200", status: "Processing", date: "Nov 5, 2024", badge: "bg-indigo-900/50 text-indigo-400" },
                { id: "ORD-7589", company: "Meridian Partners", items: "22 items", total: "$215,800", status: "Completed", date: "Nov 8, 2024", badge: "bg-emerald-900/50 text-emerald-400" },
                { id: "ORD-7412", company: "Acme Corporation", items: "6 items", total: "$67,100", status: "Completed", date: "Nov 10, 2024", badge: "bg-emerald-900/50 text-emerald-400" },
              ].map((r, i) => (
                <div key={i} className={`bg-[#111827] border ${i === 0 ? "border-indigo-600/50 ring-1 ring-indigo-600/20" : "border-[#1E293B]/40"} rounded-xl p-2.5 flex items-center gap-3`}>
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold text-slate-100">{r.id}</span>
                      <span className={`text-[7px] font-semibold px-1 py-0.5 rounded ${r.badge}`}>{r.status}</span>
                    </div>
                    <div className="text-[9px] text-slate-400 truncate">{r.company} · {r.items}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[11px] font-bold text-emerald-400">{r.total}</div>
                    <div className="text-[8px] text-slate-500">{r.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Showcase 3: Dataset Library ───────────────────────────────────────────

function DatasetLibraryMockup() {
  const datasets = [
    { name: "Customers", icon: "👥", records: "124,832", fields: 12, status: "Active", category: "CRM", trend: "+2.4%", color: "from-indigo-500 to-sky-500", access: "viewer" },
    { name: "Orders", icon: "📦", records: "891,204", fields: 18, status: "Active", category: "Sales", trend: "+8.1%", color: "from-emerald-500 to-emerald-500", access: "editor" },
    { name: "Products", icon: "🏷️", records: "43,560", fields: 15, status: "Active", category: "Inventory", trend: "+0.3%", color: "from-orange-500 to-amber-500", access: "manager" },
    { name: "Employees", icon: "🧑‍💼", records: "8,920", fields: 22, status: "Active", category: "HR", trend: "-0.1%", color: "from-purple-500 to-violet-500", access: "viewer" },
    { name: "Inventory", icon: "🏭", records: "312,450", fields: 14, status: "Active", category: "Operations", trend: "+5.7%", color: "from-pink-500 to-rose-500", access: "editor" },
    { name: "Analytics", icon: "📊", records: "2,100,000", fields: 8, status: "Active", category: "Reporting", trend: "+12.3%", color: "from-sky-500 to-sky-500", access: "viewer" },
  ];

  const accessBadge: Record<string, string> = {
    viewer: "bg-slate-700 text-slate-300",
    editor: "bg-indigo-900/60 text-indigo-400",
    manager: "bg-purple-900/60 text-purple-400",
  };

  return (
    <div className="flex flex-col h-full bg-[#0B1120]">
      <WindowChrome url="datascope.app/datasets" />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar active="datasets" />
        <div className="flex-1 flex flex-col p-3 gap-2.5 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-sm font-bold text-slate-100">Dataset Library</h1>
              <p className="text-[9px] text-slate-500">6 datasets · 3,480,966 total records</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-800 border border-[#1E293B]/50 px-2 py-1.5 rounded-lg text-[9px] text-slate-400">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                Search datasets...
              </div>
              <div className="flex border border-[#1E293B]/50 rounded-lg overflow-hidden text-[9px]">
                <div className="bg-slate-700 text-slate-200 px-2 py-1.5 cursor-pointer">Grid</div>
                <div className="text-slate-400 px-2 py-1.5 cursor-pointer hover:bg-slate-800">List</div>
              </div>
            </div>
          </div>

          {/* Summary row */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Total Records", value: "3.48M", icon: "💾", color: "text-indigo-400" },
              { label: "Active Datasets", value: "6 / 6", icon: "✅", color: "text-emerald-400" },
              { label: "Avg. Fields/Dataset", value: "14.8", icon: "🔢", color: "text-purple-400" },
              { label: "Queries Today", value: "2,841", icon: "⚡", color: "text-orange-400" },
            ].map((s) => (
              <div key={s.label} className="bg-[#111827] border border-[#1E293B]/40 rounded-xl p-2.5">
                <div className="text-base font-black mb-0.5 leading-none">
                  <span className={s.color}>{s.value}</span>
                </div>
                <div className="text-[8px] text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Dataset grid */}
          <div className="flex-1 overflow-hidden grid grid-cols-3 gap-2.5 content-start">
            {datasets.map((ds, i) => (
              <div key={i} className={`bg-[#111827] border ${i === 1 ? "border-indigo-600/50 ring-1 ring-indigo-600/20" : "border-[#1E293B]/40"} rounded-xl p-3 flex flex-col gap-2 hover:border-slate-600/60 transition-colors cursor-pointer group`}>
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${ds.color} flex items-center justify-center text-lg shadow-lg`}>
                    {ds.icon}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[8px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">{ds.category}</span>
                    <span className={`text-[7px] font-semibold px-1.5 py-0.5 rounded ${accessBadge[ds.access]}`}>{ds.access}</span>
                  </div>
                </div>

                {/* Name + records */}
                <div>
                  <div className="text-[11px] font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">{ds.name}</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">{ds.records} records · {ds.fields} fields</div>
                </div>

                {/* Progress bar */}
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${ds.color} rounded-full`} style={{ width: `${Math.min(100, (parseInt(ds.records.replace(/,/g, "")) / 2200000) * 100)}%` }} />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-0.5">
                  <div className="flex items-center gap-1 text-[8px]">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-slate-500">{ds.status}</span>
                  </div>
                  <span className={`text-[9px] font-bold ${ds.trend.startsWith("+") ? "text-emerald-400" : "text-red-400"}`}>{ds.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Showcase 4: Analytics Dashboard ──────────────────────────────────────

function AnalyticsDashboardMockup() {
  // Simple bar chart data
  const barData = [
    { label: "Jan", value: 65, color: "from-indigo-500 to-indigo-400" },
    { label: "Feb", value: 48, color: "from-indigo-500 to-indigo-400" },
    { label: "Mar", value: 82, color: "from-indigo-500 to-indigo-400" },
    { label: "Apr", value: 71, color: "from-indigo-500 to-indigo-400" },
    { label: "May", value: 94, color: "from-indigo-500 to-indigo-400" },
    { label: "Jun", value: 87, color: "from-indigo-500 to-purple-500" },
    { label: "Jul", value: 100, color: "from-indigo-500 to-purple-500" },
    { label: "Aug", value: 78, color: "from-indigo-500 to-purple-500" },
    { label: "Sep", value: 91, color: "from-indigo-500 to-purple-500" },
    { label: "Oct", value: 85, color: "from-indigo-500 to-purple-500" },
    { label: "Nov", value: 73, color: "from-indigo-500 to-purple-500" },
    { label: "Dec", value: 60, color: "from-indigo-500 to-purple-500" },
  ];

  // Donut chart segments (fake SVG)
  const donutData = [
    { label: "North America", pct: 42, color: "#6366f1" },
    { label: "Europe", pct: 28, color: "#8b5cf6" },
    { label: "Asia Pacific", pct: 19, color: "#10b981" },
    { label: "Others", pct: 11, color: "#f59e0b" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0B1120]">
      <WindowChrome url="datascope.app/analytics?dataset=orders" />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar active="analytics" />
        <div className="flex-1 flex flex-col p-3 gap-2.5 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-sm font-bold text-slate-100">Analytics Dashboard</h1>
              <p className="text-[9px] text-slate-500">Orders dataset · 2024 fiscal year</p>
            </div>
            <div className="flex items-center gap-1.5">
              {["7D","30D","90D","1Y"].map((p, i) => (
                <div key={p} className={`text-[9px] px-2 py-1 rounded cursor-pointer ${i === 3 ? "bg-indigo-600 text-white" : "text-slate-400 bg-slate-800 hover:bg-slate-700"}`}>{p}</div>
              ))}
            </div>
          </div>

          {/* KPI row */}
          <div className="grid grid-cols-4 gap-2 shrink-0">
            {[
              { label: "Total Revenue", value: "$8.94M", change: "+18.3%", up: true, color: "text-emerald-400" },
              { label: "Total Orders", value: "24,831", change: "+12.1%", up: true, color: "text-indigo-400" },
              { label: "Avg. Order Value", value: "$360", change: "+5.4%", up: true, color: "text-purple-400" },
              { label: "Completion Rate", value: "96.2%", change: "-0.3%", up: false, color: "text-orange-400" },
            ].map((kpi, i) => (
              <div key={i} className="bg-[#111827] border border-[#1E293B]/40 rounded-xl p-2.5">
                <div className="text-[8px] text-slate-500 mb-1">{kpi.label}</div>
                <div className={`text-sm font-black ${kpi.color}`}>{kpi.value}</div>
                <div className={`text-[8px] flex items-center gap-0.5 mt-0.5 ${kpi.up ? "text-emerald-400" : "text-red-400"}`}>
                  <span>{kpi.up ? "↑" : "↓"}</span>{kpi.change} vs last year
                </div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="flex-1 grid grid-cols-3 gap-2.5 overflow-hidden">
            {/* Bar chart — wider */}
            <div className="col-span-2 bg-[#111827] border border-[#1E293B]/40 rounded-xl p-3 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-3 shrink-0">
                <span className="text-[10px] font-bold text-slate-200">Monthly Revenue</span>
                <div className="flex gap-2 text-[8px] text-slate-500">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-indigo-500" /> 2023</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-purple-500" /> 2024</div>
                </div>
              </div>
              {/* Chart area */}
              <div className="flex-1 flex items-end gap-1 overflow-hidden">
                {barData.map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 justify-end h-full">
                    <div className="w-full flex justify-center">
                      <div
                        className={`w-full max-w-[18px] rounded-t-sm bg-gradient-to-t ${bar.color} opacity-90`}
                        style={{ height: `${bar.value}%` }}
                      />
                    </div>
                    <span className="text-[7px] text-slate-600">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column: donut + top customers */}
            <div className="flex flex-col gap-2.5 overflow-hidden">
              {/* Donut chart */}
              <div className="bg-[#111827] border border-[#1E293B]/40 rounded-xl p-3 flex flex-col flex-1">
                <span className="text-[10px] font-bold text-slate-200 mb-2 shrink-0">Revenue by Region</span>
                {/* SVG donut */}
                <div className="flex items-center gap-2 flex-1 min-h-0">
                  <svg className="w-16 h-16 shrink-0 -rotate-90" viewBox="0 0 36 36">
                    {(() => {
                      let offset = 0;
                      return donutData.map((seg, i) => {
                        const dash = seg.pct;
                        const gap = 100 - dash;
                        const el = (
                          <circle
                            key={i}
                            cx="18" cy="18" r="15.9"
                            fill="none"
                            stroke={seg.color}
                            strokeWidth="4"
                            strokeDasharray={`${dash} ${gap}`}
                            strokeDashoffset={-offset}
                            strokeLinecap="butt"
                          />
                        );
                        offset += dash;
                        return el;
                      });
                    })()}
                    <text x="18" y="22" textAnchor="middle" className="text-[8px]" fill="#94a3b8" fontSize="6" transform="rotate(90 18 18)">42%</text>
                  </svg>
                  <div className="flex flex-col gap-1 flex-1">
                    {donutData.map((seg, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                          <span className="text-[7px] text-slate-400 truncate max-w-[70px]">{seg.label}</span>
                        </div>
                        <span className="text-[8px] font-bold text-slate-200">{seg.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top customers mini table */}
              <div className="bg-[#111827] border border-[#1E293B]/40 rounded-xl p-3 shrink-0">
                <span className="text-[10px] font-bold text-slate-200 block mb-2">Top Customers</span>
                {[
                  { name: "NovaStar Global", rev: "$2.1M" },
                  { name: "Meridian Partners", rev: "$1.8M" },
                  { name: "Quantum Systems", rev: "$1.4M" },
                ].map((c, i) => (
                  <div key={i} className="flex items-center justify-between py-1 border-t border-[#1E293B]/60">
                    <div className="flex items-center gap-1.5">
                      <div className="text-[8px] text-slate-500 w-3">{i + 1}.</div>
                      <div className="text-[9px] text-slate-300 truncate max-w-[90px]">{c.name}</div>
                    </div>
                    <div className="text-[9px] font-bold text-emerald-400">{c.rev}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Showcase Switcher ─────────────────────────────────────────────────────

const showcases = [
  {
    id: "explorer",
    label: "Data Explorer",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="3" x2="9" y2="21"/>
      </svg>
    ),
    description: "Browse & manage records",
    component: DataExplorerMockup,
  },
  {
    id: "search",
    label: "Search Builder",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    ),
    description: "Advanced query composer",
    component: SearchBuilderMockup,
  },
  {
    id: "datasets",
    label: "Dataset Library",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>
      </svg>
    ),
    description: "Explore all collections",
    component: DatasetLibraryMockup,
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    description: "Charts, KPIs & insights",
    component: AnalyticsDashboardMockup,
  },
];

export default function ShowcaseSection() {
  const [active, setActive] = useState(0);
  const ActiveComponent = showcases[active].component;

  return (
    <section id="how-it-works" className="relative py-20 lg:py-28 bg-[#0B1120] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #334155 1px, transparent 0)", backgroundSize: "24px 24px" }} />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-400/20 rounded-full px-4 py-1.5 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-indigo-300 text-sm font-semibold">Product Showcase</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            See DataScope{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-400">
              in action
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Four purpose-built interfaces designed for efficiency at scale.
            Every screen is production-grade.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {showcases.map((showcase, i) => (
            <button
              key={showcase.id}
              onClick={() => setActive(i)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                active === i
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40 scale-105"
                  : "bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700/80 border border-[#1E293B]/50"
              }`}
            >
              {showcase.icon}
              <span>{showcase.label}</span>
              {active !== i && (
                <span className="text-xs text-slate-500 hidden sm:inline">— {showcase.description}</span>
              )}
            </button>
          ))}
        </div>

        {/* Mockup window */}
        <div className="relative">
          {/* Outer glow */}
          <div className="absolute -inset-2 bg-indigo-500/10 rounded-3xl blur-xl" />

          {/* Window */}
          <div className="relative rounded-2xl overflow-hidden border border-[#1E293B]/60 shadow-2xl" style={{ height: "500px" }}>
            <ActiveComponent />
          </div>

          {/* Bottom label */}
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2">
            <div className="bg-slate-800 border border-[#1E293B]/60 rounded-full px-4 py-1.5 text-xs text-slate-400 flex items-center gap-2 shadow-lg whitespace-nowrap">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {showcases[active].label} · Interactive Platform Preview
            </div>
          </div>
        </div>

        {/* Feature callouts below */}
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: "⚡", label: "Sub-50ms Queries", desc: "Redis cache + DB indexes" },
            { icon: "🔒", label: "RBAC Security", desc: "Role & dataset-level access" },
            { icon: "📄", label: "Async CSV Export", desc: "Background job processing" },
            { icon: "🔗", label: "Record Relationships", desc: "Cross-dataset data linking" },
          ].map((f) => (
            <div key={f.label} className="bg-[#111827]/60 border border-[#1E293B]/40 rounded-xl p-4 text-center hover:border-slate-600/60 transition-colors">
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="text-sm font-bold text-slate-100 mb-1">{f.label}</div>
              <div className="text-xs text-slate-500">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
