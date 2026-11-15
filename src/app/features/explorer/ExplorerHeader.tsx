'use client';

import React from 'react';
import Link from 'next/link';
import {
  Database,
  ArrowLeft,
  ChevronDown,
  RefreshCw,
  SlidersHorizontal,
  Columns3,
  Search,
  X,
  Download,
} from 'lucide-react';
import { DatasetItem } from '../../api/endpoints/datasets.api';

interface ExplorerHeaderProps {
  currentDataset?: DatasetItem;
  datasets: DatasetItem[];
  onSelectDataset: (id: string) => void;
  recordCount: number;
  isFetching: boolean;
  onRefresh: () => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  activeFilterCount: number;
  onOpenFilterModal: () => void;
  onOpenColumnModal: () => void;
  onOpenExportModal?: () => void;
  canExport?: boolean;
}

export function ExplorerHeader({
  currentDataset,
  datasets,
  onSelectDataset,
  recordCount,
  isFetching,
  onRefresh,
  searchTerm,
  onSearchChange,
  activeFilterCount,
  onOpenFilterModal,
  onOpenColumnModal,
  onOpenExportModal,
  canExport = false,
}: ExplorerHeaderProps) {
  return (
    <div className="border-b border-slate-200 bg-white">
      {/* Top Banner & Switcher */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/datasets"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 shadow-2xs hover:bg-slate-50 hover:text-slate-900"
              title="Return to Dataset Library"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Library</span>
            </Link>

            {/* Dataset Selector Dropdown */}
            <div className="relative inline-block text-left">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
                  <Database className="h-4 w-4" />
                </div>
                <div className="relative">
                  <select
                    value={currentDataset?.id ?? ''}
                    onChange={(e) => onSelectDataset(e.target.value)}
                    className="appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-sm font-bold text-slate-900 shadow-2xs hover:border-indigo-400 focus:border-indigo-500 focus:outline-hidden"
                  >
                    {datasets.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.category})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>
            </div>

            {currentDataset && (
              <span className="hidden sm:inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 border border-slate-200">
                {currentDataset.category}
              </span>
            )}
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenFilterModal}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium shadow-2xs transition-colors ${
                activeFilterCount > 0
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-600" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenColumnModal}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50"
            >
              <Columns3 className="h-3.5 w-3.5 text-slate-500" />
              <span>Columns</span>
            </button>

            {canExport && onOpenExportModal && (
              <button
                onClick={onOpenExportModal}
                className="inline-flex items-center gap-1.5 rounded-lg border border-green-300 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 shadow-2xs hover:bg-green-100"
              >
                <Download className="h-3.5 w-3.5 text-green-600" />
                <span>Export</span>
              </button>
            )}

            <button
              onClick={onRefresh}
              disabled={isFetching}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-50"
              title="Refresh Records"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin text-indigo-600' : 'text-slate-500'}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Search Bar & Quick Status */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-slate-100 pt-3">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search in searchable fields (press Enter or type to filter)..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/70 py-1.5 pl-9 pr-8 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div>
              Total dataset records:{' '}
              <span className="font-semibold text-slate-800">
                {recordCount.toLocaleString()}
              </span>
            </div>
            {currentDataset && (
              <div className="hidden md:inline">
                Access:{' '}
                <span className="font-semibold uppercase tracking-wider text-indigo-600">
                  {currentDataset.accessLevel}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
