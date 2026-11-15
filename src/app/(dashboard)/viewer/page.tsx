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
  Search,
} from 'lucide-react';
import { AppNavbar } from '../../components/layout/AppNavbar';
import { useGetViewerOverviewQuery } from '../../api/endpoints/portal.api';
import { useGetPreferencesQuery, useUpdatePreferencesMutation } from '../../api/endpoints/preferences.api';

export default function ViewerPage() {
  const { data: overviewData, isLoading: overviewLoading } = useGetViewerOverviewQuery();
  const { data: prefData } = useGetPreferencesQuery();
  const [updatePreferences] = useUpdatePreferencesMutation();

  const [activeTab, setActiveTab] = useState<'overview' | 'views' | 'preferences'>('overview');

  // Preferences form
  const [density, setDensity] = useState('comfortable');
  const [pageSize, setPageSize] = useState(25);

  React.useEffect(() => {
    if (prefData?.data) {
      setDensity(prefData.data.tableDensity);
      setPageSize(prefData.data.defaultPageSize);
    }
  }, [prefData]);

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AppNavbar />

      {/* Top Banner */}
      <div className="border-b border-slate-200 bg-white shadow-2xs">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <Eye className="h-4 w-4 text-indigo-500" />
                <span>Enterprise Viewer Portal</span>
              </div>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Viewer Dashboard
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Read-only access to assigned enterprise datasets, shared filter presets, and record discovery.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-3 md:mt-0">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 border border-slate-200">
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
                Read-Only Access
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6 flex gap-1 border-b border-slate-200">
            {[
              { id: 'overview', label: 'My Assigned Datasets', icon: Database },
              { id: 'views', label: 'Shared Saved Views', icon: Bookmark },
              { id: 'preferences', label: 'Display Preferences', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 w-full">
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
                  onChange={(e) => setDensity(e.target.value)}
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
                  onChange={(e) => setPageSize(Number(e.target.value))}
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
