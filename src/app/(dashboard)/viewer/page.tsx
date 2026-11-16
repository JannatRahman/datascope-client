'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Eye,
  Database,
  Bookmark,
  ArrowRight,
  ShieldCheck,
  Settings,
  Layers,
  Clock,
  Activity,
} from 'lucide-react';
import { useGetViewerOverviewQuery } from '../../api/endpoints/portal.api';
import { useGetPreferencesQuery, useUpdatePreferencesMutation } from '../../api/endpoints/preferences.api';

export default function ViewerPage() {
  const { data: overviewData, isLoading: overviewLoading } = useGetViewerOverviewQuery();
  const { data: prefData } = useGetPreferencesQuery();
  const [updatePreferences] = useUpdatePreferencesMutation();

  const [activeTab, setActiveTab] = useState<'overview' | 'views' | 'preferences'>('overview');

  const [densityOverride, setDensityOverride] = useState<string | null>(null);
  const [pageSizeOverride, setPageSizeOverride] = useState<number | null>(null);
  const density = densityOverride ?? prefData?.data?.tableDensity ?? 'comfortable';
  const pageSize = pageSizeOverride ?? prefData?.data?.defaultPageSize ?? 25;

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePreferences({ tableDensity: density, defaultPageSize: pageSize }).unwrap();
      alert('Preferences saved successfully!');
    } catch {
      alert('Failed to save preferences');
    }
  };

  if (overviewLoading) {
    return (
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-slate-950">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(16,185,129,0.25),transparent)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-400/30 border-t-emerald-400" />
      </div>
    );
  }

  const summary = overviewData?.data?.summary ?? {
    assignedDatasetsCount: 0,
    totalAccessibleRecords: 0,
    sharedViewsCount: 0,
  };

  const datasets = overviewData?.data?.datasets ?? [];
  const sharedViews = overviewData?.data?.sharedViews ?? [];
  const recentlyAccessedDatasets = overviewData?.data?.recentlyAccessedDatasets ?? [];
  const recentActivity = overviewData?.data?.recentActivity ?? [];

  return (
    <div className="relative min-h-full overflow-hidden bg-slate-950 text-slate-100 antialiased">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_90%_70%_at_20%_-10%,rgba(16,185,129,0.14),transparent_55%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_50%_40%_at_100%_100%,rgba(79,70,229,0.12),transparent_50%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="relative border-b border-white/10">
        <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-md border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-emerald-200/90">
                <Eye className="h-3.5 w-3.5" />
                Viewer portal
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Workspace overview</h1>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-400">
                Secure, read-only access to assigned datasets, curated shared views, and your browsing preferences.
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-200">
              <ShieldCheck className="h-4 w-4" />
              Read-only access
            </span>
          </div>

          <div className="mt-8 flex gap-2 border-b border-white/10 pb-px">
            {[
              { id: 'overview', label: 'Assigned datasets', icon: Database },
              { id: 'views', label: 'Shared views', icon: Bookmark },
              { id: 'preferences', label: 'Preferences', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-medium transition-all ${
                    isActive
                      ? 'border-emerald-400 text-emerald-200'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="relative mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-10 lg:py-10 w-full">
        {/* TAB 1: OVERVIEW & DATASETS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                  <span>Assigned Datasets</span>
                  <Database className="h-4 w-4 text-indigo-500" />
                </div>
                <div className="mt-2 text-2xl font-bold text-slate-900">
                  {summary.assignedDatasetsCount}
                </div>
                <div className="mt-1 text-[11px] text-slate-500">Configured in Dataset Members</div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                  <span>Accessible Records Scope</span>
                  <Layers className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="mt-2 text-2xl font-bold text-slate-900">
                  {summary.totalAccessibleRecords.toLocaleString()}
                </div>
                <div className="mt-1 text-[11px] text-slate-500">Live Synchronized Data</div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                  <span>Shared Saved Views</span>
                  <Bookmark className="h-4 w-4 text-purple-500" />
                </div>
                <div className="mt-2 text-2xl font-bold text-slate-900">
                  {summary.sharedViewsCount}
                </div>
                <div className="mt-1 text-[11px] text-slate-500">Created by Analysts & Admins</div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-4 w-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">Recently accessed datasets</h3>
                </div>
                {recentlyAccessedDatasets.length === 0 ? (
                  <p className="text-xs text-slate-500">
                    No recent access recorded yet. Open a dataset in the Explorer to see it here.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {recentlyAccessedDatasets.map((d) => (
                      <li key={d.id} className="flex items-center justify-between text-xs border-b border-slate-100 pb-2 last:border-0">
                        <div>
                          <p className="font-semibold text-slate-900">{d.name}</p>
                          <p className="text-slate-500">{d.category}</p>
                        </div>
                        <Link
                          href={`/explorer?datasetId=${d.id}`}
                          className="text-indigo-600 font-semibold hover:underline"
                        >
                          Open
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="h-4 w-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">Recent activity</h3>
                </div>
                {recentActivity.length === 0 ? (
                  <p className="text-xs text-slate-500">No recent activity recorded for your account.</p>
                ) : (
                  <ul className="space-y-3 max-h-64 overflow-y-auto">
                    {recentActivity.map((a) => (
                      <li key={a.id} className="text-xs border-b border-slate-100 pb-2 last:border-0">
                        <p className="font-medium text-slate-800">{a.activityType}</p>
                        {a.description && <p className="text-slate-500 mt-0.5">{a.description}</p>}
                        <p className="text-slate-400 mt-1">{new Date(a.createdAt).toLocaleString()}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Datasets Grid */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Assigned Datasets for Exploration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {datasets.map((d) => (
                  <div
                    key={d.id}
                    className="flex flex-col justify-between rounded-lg border border-slate-200 bg-slate-50/50 p-4 hover:border-indigo-300 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900 text-sm">{d.name}</span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-semibold text-slate-600 uppercase">
                          Read-Only
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">{d.category}</span>
                      <p className="mt-2 text-xs text-slate-600 line-clamp-2">
                        {d.description || 'Enterprise dataset configured for browsing and filtering.'}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-200 pt-2">
                        <span>Records: <b>{d.recordCount.toLocaleString()}</b></span>
                        <span>Fields: <b>{d.fieldCount}</b></span>
                      </div>
                    </div>
                    <Link
                      href={`/explorer?datasetId=${d.id}`}
                      className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-md bg-white border border-slate-200 py-1.5 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-all"
                    >
                      <span>Explore Data</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SHARED VIEWS */}
        {activeTab === 'views' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Shared Filter Presets & Views</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sharedViews.length === 0 ? (
                <div className="col-span-3 rounded-xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-500">
                  No shared views available. When Analysts or Administrators share filter views, they will appear here.
                </div>
              ) : (
                sharedViews.map((sv) => (
                  <div
                    key={sv.id}
                    className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 text-sm">{sv.name}</h4>
                        <span className="rounded bg-indigo-50 text-indigo-700 text-[10px] font-semibold px-1.5 py-0.5">
                          Shared by {sv.ownerName || 'Analyst'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {sv.description || 'Custom filtered data view.'}
                      </p>
                      <div className="mt-3 text-[11px] text-slate-400 font-medium">
                        Dataset: <span className="text-slate-700 font-semibold">{sv.datasetName}</span>
                      </div>
                    </div>

                    <Link
                      href={`/explorer?datasetId=${sv.datasetId}`}
                      className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
                    >
                      <span>Load View</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PREFERENCES */}
        {activeTab === 'preferences' && (
          <div className="max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Viewer Display Preferences</h3>
            <p className="text-xs text-slate-500 mb-6">
              Customize how tables and default pagination behave for your account.
            </p>

            <form onSubmit={handleSavePreferences} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Default Table Density</label>
                <select
                  value={density}
                  onChange={(e) => setDensityOverride(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-slate-800 shadow-2xs focus:border-indigo-500 focus:outline-hidden"
                >
                  <option value="comfortable">Comfortable (Standard)</option>
                  <option value="compact">Compact</option>
                  <option value="spacious">Spacious</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Default Page Size</label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSizeOverride(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-slate-800 shadow-2xs focus:border-indigo-500 focus:outline-hidden"
                >
                  <option value={10}>10 records per page</option>
                  <option value={25}>25 records per page</option>
                  <option value={50}>50 records per page</option>
                  <option value={100}>100 records per page</option>
                </select>
              </div>

              <button
                type="submit"
                className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow-2xs hover:bg-indigo-700"
              >
                Save Preferences
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
