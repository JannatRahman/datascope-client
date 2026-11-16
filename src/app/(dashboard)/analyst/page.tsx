'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LineChart,
  Database,
  Search,
  Bookmark,
  Clock,
  ArrowRight,
  Layers,
  Zap,
  Settings,
  ShieldAlert,
  Download,
  Trash2,
  Share2,
  Check,
  Home,
  Sparkles,
  Calendar,
  Activity,
  ChevronRight,
} from 'lucide-react';
import { useGetAnalystOverviewQuery } from '../../api/endpoints/portal.api';
import { useGetPreferencesQuery, useUpdatePreferencesMutation } from '../../api/endpoints/preferences.api';
import { useGetMeQuery } from '../../api/endpoints/auth.api';
import {
  useGetSearchHistoryQuery,
  useDeleteSearchEntryMutation,
  useClearSearchHistoryMutation,
} from '../../api/endpoints/search.api';
import {
  useGetSavedViewsQuery,
  useDeleteSavedViewMutation,
  useShareSavedViewMutation,
} from '../../api/endpoints/saved-views.api';
import { useGetExportJobsQuery, type ExportJobItem } from '../../api/endpoints/exports.api';
import { type SearchHistoryItem } from '../../api/endpoints/search.api';
import { type SavedViewItem } from '../../api/endpoints/saved-views.api';
import { AnalyticsCharts } from '../../components/charts/AnalyticsCharts';

export default function AnalystPage() {
  const { data: meData, isLoading: meLoading } = useGetMeQuery();
  const isAnalyst =
    meData?.user?.roleName === 'Data Analyst' ||
    meData?.user?.roleName === 'Administrator';

  const { data: overviewData, isLoading: overviewLoading } =
    useGetAnalystOverviewQuery(undefined, { skip: !isAnalyst });

  const { data: searchHistoryData } = useGetSearchHistoryQuery(undefined, { skip: !isAnalyst });
  const [deleteSearch] = useDeleteSearchEntryMutation();
  const [clearHistory] = useClearSearchHistoryMutation();

  const { data: savedViewsData } = useGetSavedViewsQuery(undefined, { skip: !isAnalyst });
  const [deleteSavedView] = useDeleteSavedViewMutation();
  const [shareSavedView] = useShareSavedViewMutation();

  const { data: exportJobsData } = useGetExportJobsQuery(undefined, { skip: !isAnalyst });

  const { data: prefData } = useGetPreferencesQuery();
  const [updatePreferences] = useUpdatePreferencesMutation();

  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'history' | 'views' | 'exports' | 'preferences'>('overview');

  const [densityOverride, setDensityOverride] = useState<string | null>(null);
  const [pageSizeOverride, setPageSizeOverride] = useState<number | null>(null);
  const density = densityOverride ?? prefData?.data?.tableDensity ?? 'comfortable';
  const pageSize = pageSizeOverride ?? prefData?.data?.defaultPageSize ?? 25;
  const [prefSaved, setPrefSaved] = useState(false);

  const [shareModalViewId, setShareModalViewId] = useState<string | null>(null);
  const [shareTargetUserId, setShareTargetUserId] = useState('');
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePreferences({ tableDensity: density, defaultPageSize: pageSize }).unwrap();
      setPrefSaved(true);
      setTimeout(() => setPrefSaved(false), 3000);
    } catch {
      alert('Failed to save preferences');
    }
  };

  const handleShareView = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shareModalViewId || !shareTargetUserId.trim()) return;
    try {
      await shareSavedView({ id: shareModalViewId, userId: shareTargetUserId.trim() }).unwrap();
      setShareSuccess(true);
      setTimeout(() => {
        setShareSuccess(false);
        setShareModalViewId(null);
        setShareTargetUserId('');
      }, 2000);
    } catch {
      alert('Failed to share view. Verify target user ID.');
    }
  };

  if (meLoading || overviewLoading) {
    return (
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-slate-950">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(99,102,241,0.35),transparent)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="relative flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-400/30 border-t-indigo-400" />
          <span className="text-xs font-medium tracking-widest text-slate-400 uppercase">Initializing workspace</span>
        </div>
      </div>
    );
  }

  if (!isAnalyst) {
    return (
      <div className="relative min-h-[60vh] flex items-center justify-center p-4 bg-slate-950">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(244,63,94,0.12),transparent)]" />
        <div className="relative max-w-md rounded-2xl border border-white/10 bg-slate-900/80 p-8 text-center shadow-2xl backdrop-blur-xl">
          <ShieldAlert className="mx-auto h-12 w-12 text-rose-400" />
          <h2 className="mt-4 text-xl font-semibold tracking-tight text-white">Analyst Access Required</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Your account currently has Viewer privileges. Request elevated access from an administrator.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/" className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-white/10">
              <Home className="h-3.5 w-3.5" /> Return home
            </Link>
            <Link href="/viewer" className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500">
              Viewer portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const summary = overviewData?.data?.summary ?? {
    accessibleDatasetsCount: 0,
    totalAccessibleRecords: 0,
    totalQueriesExecuted: 0,
    avgQueryLatencyMs: 0,
    savedViewsCount: 0,
  };

  const datasets = overviewData?.data?.datasets ?? [];
  const searchHistoryList = searchHistoryData?.data ?? [];
  const savedViewsList = savedViewsData?.data ?? [];
  const exportJobsList = exportJobsData?.data ?? [];

  return (
    <div className="relative min-h-full overflow-hidden bg-slate-950 text-slate-100 antialiased">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_100%_80%_at_80%_-10%,rgba(79,70,229,0.18),transparent_55%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_50%_at_0%_100%,rgba(59,130,246,0.12),transparent_50%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <main className="relative mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-indigo-300/90">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-indigo-400/30 bg-indigo-500/10 px-2.5 py-1">
                <Sparkles className="h-3.5 w-3.5" />
                DataScope Intelligence
              </span>
              <span className="text-slate-500">/</span>
              <span className="text-slate-400">Analyst workspace</span>
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Analyst Studio</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
                Query telemetry, governed datasets, saved perspectives, and streaming exports — built for high-confidence analysis.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-400 sm:flex">
              <Calendar className="h-3.5 w-3.5 text-indigo-400" />
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <Link
              href="/explorer"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-400"
            >
              <Database className="h-4 w-4" />
              Open explorer
            </Link>
          </div>
        </div>

        {/* ─── SECTION TITLE & VIEW SWITCHER PILLS ─── */}
        <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 border border-blue-200/60 mb-2">
              <Sparkles className="h-3 w-3 text-blue-600" />
              Data Intelligence Command Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Data Analyst Studio
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">
              Real-data query telemetry, relational distributions, shared team views, and bounded-memory streaming exports.
            </p>
          </div>

          {/* View Mode Switcher Pills (Matching the image's Image / List / Calendar pill style) */}
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] p-1 backdrop-blur-sm overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: Layers },
              { id: 'analytics', label: 'Live Analytics', icon: LineChart },
              { id: 'history', label: `Search History (${searchHistoryList.length})`, icon: Clock },
              { id: 'views', label: `Saved Views (${savedViewsList.length})`, icon: Bookmark },
              { id: 'exports', label: `Exports (${exportJobsList.length})`, icon: Download },
              { id: 'preferences', label: 'Settings', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-500/90 text-white shadow-lg shadow-indigo-500/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── TAB 1: OVERVIEW KANBAN / CARD COLUMNS (Inspired by Reference UI) ─── */}
        {activeTab === 'overview' && (
          <div className="mt-8 space-y-8">
            {/* 4 Colored Category Columns (Directly matching Backlog / In Progress / Completed / Review) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Column 1: Core Datasets */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between px-1">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/80 px-2.5 py-1 text-xs font-bold text-blue-700">
                    <Database className="h-3.5 w-3.5" />
                    Datasets Hub ({summary.accessibleDatasetsCount})
                  </span>
                  <Link href="/datasets" className="text-[11px] font-semibold text-blue-600 hover:underline">
                    View All
                  </Link>
                </div>

                <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs hover:shadow-md transition-all">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>Customer Information</span>
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] text-blue-700">100k rows</span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500 line-clamp-2">
                    Profiles, lifetime value, loyalty tiers, and contact directories.
                  </p>
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] text-slate-400 font-medium mb-1">
                      <span>Index Health</span>
                      <span className="text-blue-600 font-bold">100%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full w-full" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400">PostgreSQL B-Tree</span>
                    <Link href="/explorer" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                      Explore <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs hover:shadow-md transition-all">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>Sales Transactions</span>
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] text-blue-700">100k rows</span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500 line-clamp-2">
                    Orders, payment channels, unit discounts, and revenue totals.
                  </p>
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] text-slate-400 font-medium mb-1">
                      <span>Query Optimization</span>
                      <span className="text-blue-600 font-bold">98%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full w-[98%]" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400">Sub-300ms</span>
                    <Link href="/explorer" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                      Explore <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Column 2: Query Telemetry */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between px-1">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/80 px-2.5 py-1 text-xs font-bold text-amber-800">
                    <Zap className="h-3.5 w-3.5 text-amber-600" />
                    Telemetry & Latency
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600">Online</span>
                </div>

                <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs hover:shadow-md transition-all">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Live Records</span>
                  <p className="mt-1 text-2xl font-black text-slate-900">{summary.totalAccessibleRecords.toLocaleString()}</p>
                  <span className="text-[11px] text-slate-500">Accessible across 6 enterprise datasets</span>
                  <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-50 p-2.5 text-xs text-amber-900 border border-amber-100">
                    <Activity className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>PostgreSQL connection pool healthy with 0 deadlocks</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs hover:shadow-md transition-all">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Redis Cache Tier</span>
                  <p className="mt-1 text-2xl font-black text-emerald-600">Active</p>
                  <span className="text-[11px] text-slate-500">Session tokens & query cache online</span>
                  <div className="mt-3 flex justify-between text-[10px] text-slate-400">
                    <span>Cache Hit Rate</span>
                    <span className="text-emerald-600 font-bold">94.2%</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[94%]" />
                  </div>
                </div>
              </div>

              {/* Column 3: Saved Views & Collaboration */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between px-1">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-2.5 py-1 text-xs font-bold text-emerald-800">
                    <Bookmark className="h-3.5 w-3.5 text-emerald-600" />
                    Saved Views ({savedViewsList.length})
                  </span>
                  <button onClick={() => setActiveTab('views')} className="text-[11px] font-semibold text-emerald-700 hover:underline">
                    Manage
                  </button>
                </div>

                {savedViewsList.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-6 text-center text-xs text-slate-400">
                    <Bookmark className="mx-auto h-6 w-6 text-slate-300 mb-2" />
                    No saved views yet. Save a filter view in Data Explorer.
                  </div>
                ) : (
                  savedViewsList.slice(0, 2).map((view: SavedViewItem) => (
                    <div key={view.id} className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs hover:shadow-md transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate">{view.name}</span>
                        <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                          {view.datasetName || 'Dataset'}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500 line-clamp-1">{view.description || 'Pre-configured filters'}</p>
                      <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="text-[10px] text-slate-400">Created by you</span>
                        <Link href="/explorer" className="text-xs font-semibold text-emerald-600 hover:underline">
                          Apply View →
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Column 4: Streaming Exports */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between px-1">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100/80 px-2.5 py-1 text-xs font-bold text-purple-800">
                    <Download className="h-3.5 w-3.5 text-purple-600" />
                    Streaming Exports ({exportJobsList.length})
                  </span>
                  <button onClick={() => setActiveTab('exports')} className="text-[11px] font-semibold text-purple-700 hover:underline">
                    View Jobs
                  </button>
                </div>

                {exportJobsList.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-6 text-center text-xs text-slate-400">
                    <Download className="mx-auto h-6 w-6 text-slate-300 mb-2" />
                    No export jobs scheduled yet.
                  </div>
                ) : (
                  exportJobsList.slice(0, 2).map((job: ExportJobItem) => (
                    <div key={job.id} className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs hover:shadow-md transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 uppercase">{job.format} Export</span>
                        <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                          job.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {job.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">Dataset ID: {job.datasetId.substring(0, 8)}…</p>
                      <div className="mt-3">
                        <div className="flex justify-between text-[10px] text-slate-400 font-medium mb-1">
                          <span>Export Progress</span>
                          <span className="text-purple-600 font-bold">
                            {job.totalRecords
                              ? Math.min(
                                  100,
                                  Math.round(
                                    ((job.processedRecords ?? 0) / job.totalRecords) * 100,
                                  ),
                                )
                              : job.status === 'completed'
                                ? 100
                                : 0}
                            %
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-purple-600 rounded-full w-full" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Accessible Datasets Grid */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Authorized Datasets & Dynamic Fields</h3>
                  <p className="text-xs text-slate-500">6 seeded production tables with cross-dataset relationships</p>
                </div>
                <Link href="/datasets" className="text-xs font-bold text-blue-600 hover:underline">
                  Browse All Datasets →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {datasets.map((ds) => (
                  <div key={ds.id} className="rounded-xl border border-slate-200/70 p-4 hover:border-blue-300 hover:shadow-sm transition-all bg-slate-50/40">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 truncate">{ds.name}</span>
                      <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                        {ds.recordCount?.toLocaleString() || '100,000'} rows
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">{ds.description || 'Enterprise domain records'}</p>
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px]">
                      <span className="text-slate-400 font-mono text-[10px]">{ds.category}</span>
                      <Link href={`/explorer?dataset=${ds.id}`} className="font-semibold text-blue-600 hover:underline">
                        Query Dataset
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: LIVE ANALYTICS (Recharts) ─── */}
        {activeTab === 'analytics' && (
          <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">Live Metric Distributions</h2>
              <p className="text-xs text-slate-500">
                Calculated directly against real seeded records using bounded aggregation
              </p>
            </div>
            <AnalyticsCharts />
          </div>
        )}

        {/* ─── TAB 3: SEARCH HISTORY ─── */}
        {activeTab === 'history' && (
          <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Query & Search History</h2>
                <p className="text-xs text-slate-500">Track and replay your previous dataset searches</p>
              </div>
              {searchHistoryList.length > 0 && (
                <button
                  onClick={() => clearHistory()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear All History
                </button>
              )}
            </div>

            <div className="mt-4 divide-y divide-slate-100">
                {searchHistoryList.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400">
                    <Clock className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                    No search history tracked yet. Searches in Data Explorer will appear here.
                  </div>
                ) : (
                  searchHistoryList.map((item: SearchHistoryItem) => {
                    const filterSummary =
                      Array.isArray(item.filters) && item.filters.length > 0
                        ? `${item.filters.length} filter(s)`
                        : typeof item.filters === 'object' && item.filters && Object.keys(item.filters).length > 0
                          ? `${Object.keys(item.filters as Record<string, unknown>).length} filter(s)`
                          : 'No filters';
                    const sortSummary = Array.isArray(item.sortConfig) && item.sortConfig.length > 0 ? 'Sorted' : 'Default sort';
                    return (
                      <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
                            <Search className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              &ldquo;{item.searchQuery || '(no text query)'}&rdquo;
                            </p>
                            <p className="text-[11px] text-slate-400">
                              Dataset: {item.datasetName || 'All'} · {new Date(item.searchedAt).toLocaleString()}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Conditions: {filterSummary} · {sortSummary}
                              {typeof item.resultCount === 'number' ? ` · ${item.resultCount} results` : ''}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/explorer?search=${encodeURIComponent(item.searchQuery || '')}${item.datasetId ? `&datasetId=${item.datasetId}` : ''}`}
                            className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                          >
                            Re-run
                          </Link>
                          <button
                            onClick={() => deleteSearch(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                            title="Delete entry"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
            </div>
          </div>
        )}

        {/* ─── TAB 4: SAVED VIEWS ─── */}
        {activeTab === 'views' && (
          <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Custom Saved Views</h2>
                <p className="text-xs text-slate-500">Persisted filters, sorting, and field configurations</p>
              </div>
              <Link
                href="/explorer"
                className="rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
              >
                + Create New View in Explorer
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedViewsList.length === 0 ? (
                <div className="col-span-full py-12 text-center text-xs text-slate-400">
                  <Bookmark className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                  No saved views found. Create one from the Data Explorer table controls.
                </div>
              ) : (
                savedViewsList.map((view: SavedViewItem) => (
                  <div key={view.id} className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{view.name}</span>
                        <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                          {view.datasetName || 'Dataset'}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600">{view.description || 'No description provided'}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-200/70">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShareModalViewId(view.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                        >
                          <Share2 className="h-3 w-3" /> Share
                        </button>
                        <button
                          onClick={() => deleteSavedView(view.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                          title="Delete view"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <Link
                        href="/explorer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                      >
                        Apply View →
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Share View Modal */}
            {shareModalViewId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
                <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900">Share View with Teammate</h3>
                  <p className="mt-1 text-xs text-slate-500">Enter user ID or email to grant access to this saved configuration.</p>

                  {shareSuccess && (
                    <div className="mt-3 rounded-lg bg-emerald-50 p-2 text-xs text-emerald-800 font-semibold">
                      ✓ Shared successfully!
                    </div>
                  )}

                  <form onSubmit={handleShareView} className="mt-4 space-y-3">
                    <input
                      type="text"
                      value={shareTargetUserId}
                      onChange={(e) => setShareTargetUserId(e.target.value)}
                      placeholder="Target User ID or Email"
                      required
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShareModalViewId(null)}
                        className="rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
                      >
                        Share View
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 5: EXPORT JOBS ─── */}
        {activeTab === 'exports' && (
          <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Streaming Export Jobs</h2>
                <p className="text-xs text-slate-500">
                  Bounded-memory CSV and JSON downloads generated asynchronously
                </p>
              </div>
              <Link
                href="/explorer"
                className="rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
              >
                + Export New Data from Explorer
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {exportJobsList.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  <Download className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                  No export jobs executed yet. Trigger an export from the Data Explorer.
                </div>
              ) : (
                exportJobsList.map((job: ExportJobItem) => {
                  const isDone = job.status === 'completed';
                  return (
                    <div
                      key={job.id}
                      className="flex items-center justify-between rounded-xl border border-slate-200 p-4 bg-slate-50/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold text-xs uppercase">
                          {job.format}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            {job.format.toUpperCase()} Export #{job.id.substring(0, 8)}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Dataset: {job.datasetId.substring(0, 8)}… · Created: {new Date(job.requestedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize ${
                          isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {job.status}
                        </span>

                        {isDone && (
                          <a
                            href={`http://localhost:5001/api/v1/exports/${job.id}/download`}
                            download
                            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:from-blue-700 hover:to-indigo-700 transition-all"
                          >
                            <Download className="h-3.5 w-3.5" /> Download File
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ─── TAB 6: PREFERENCES ─── */}
        {activeTab === 'preferences' && (
          <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs max-w-xl">
            <h2 className="text-base font-bold text-slate-900">Display & Data Table Preferences</h2>
            <p className="text-xs text-slate-500">Customize default row density and page sizes</p>

            {prefSaved && (
              <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600" /> Preferences saved successfully!
              </div>
            )}

            <form onSubmit={handleSavePreferences} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700">Table Density</label>
                <div className="mt-1.5 grid grid-cols-3 gap-2">
                  {['compact', 'comfortable', 'spacious'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDensityOverride(d)}
                      className={`rounded-xl border py-2 text-xs font-semibold capitalize transition-all cursor-pointer ${
                        density === d
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Default Records Per Page</label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSizeOverride(Number(e.target.value))}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={10}>10 rows</option>
                  <option value={25}>25 rows (Standard)</option>
                  <option value={50}>50 rows</option>
                  <option value={100}>100 rows</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 cursor-pointer"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
