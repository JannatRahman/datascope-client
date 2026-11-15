'use client';

import React, { useState, useMemo } from 'react';
import { Search, Database, Layers, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';
import { useGetDatasetsQuery } from '../../api/endpoints/datasets.api';
import { DatasetCard } from './DatasetCard';

export function DatasetLibrary() {
  const { data, isLoading, isError, refetch, isFetching } = useGetDatasetsQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const datasets = data?.data ?? [];

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    datasets.forEach((d) => {
      if (d.category) set.add(d.category);
    });
    return ['all', ...Array.from(set)];
  }, [datasets]);

  // Aggregate stats
  const totalRecords = useMemo(
    () => datasets.reduce((sum, d) => sum + (d.recordCount || 0), 0),
    [datasets],
  );

  const totalFields = useMemo(
    () => datasets.reduce((sum, d) => sum + (d.fieldCount || 0), 0),
    [datasets],
  );

  // Filtered datasets
  const filteredDatasets = useMemo(() => {
    return datasets.filter((d) => {
      const matchesSearch =
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.description && d.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (d.category && d.category.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCat =
        selectedCategory === 'all' || d.category?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [datasets, searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Page Header */}
      <div className="border-b border-slate-200 bg-white shadow-xs">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
                <Database className="h-4 w-4" />
                <span>Enterprise Catalog</span>
              </div>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Dataset Library
              </h1>
              <p className="mt-1.5 text-sm text-slate-500">
                Browse, inspect schema metadata, and explore live synchronized datasets in PostgreSQL.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-3 md:mt-0">
              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 focus:outline-hidden disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
                <span>Sync Datasets</span>
              </button>
            </div>
          </div>

          {/* Metric Highlights */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3.5 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900">{datasets.length}</div>
                <div className="text-xs font-medium text-slate-500">Available Datasets</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900">{totalRecords.toLocaleString()}</div>
                <div className="text-xs font-medium text-slate-500">Live Indexed Records</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900">{totalFields}</div>
                <div className="text-xs font-medium text-slate-500">Configured Schema Fields</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* Search & Category Filter Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search datasets by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 shadow-2xs focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-xl border border-slate-200 bg-white p-6 shadow-2xs animate-pulse"
              >
                <div className="flex justify-between">
                  <div className="h-4 w-20 rounded bg-slate-200" />
                  <div className="h-4 w-16 rounded bg-slate-200" />
                </div>
                <div className="mt-4 h-6 w-3/4 rounded bg-slate-200" />
                <div className="mt-2 h-4 w-full rounded bg-slate-200" />
                <div className="mt-1 h-4 w-2/3 rounded bg-slate-200" />
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="h-8 rounded bg-slate-200" />
                  <div className="h-8 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-8 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-rose-500" />
            <h3 className="mt-3 text-base font-semibold text-rose-900">Failed to load datasets</h3>
            <p className="mt-1 text-sm text-rose-600">
              An error occurred while connecting to the DataScope backend. Please check your session.
            </p>
            <button
              onClick={() => refetch()}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-rose-700"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry Request</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && filteredDatasets.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-2xs">
            <Database className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-3 text-base font-semibold text-slate-800">No datasets found</h3>
            <p className="mt-1 text-sm text-slate-500">
              No datasets match your search query &quot;{searchTerm}&quot;. Try adjusting your filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="mt-4 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Dataset Grid */}
        {!isLoading && !isError && filteredDatasets.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDatasets.map((dataset) => (
              <DatasetCard key={dataset.id} dataset={dataset} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
