'use client';

import React from 'react';
import Link from 'next/link';
import { Database, Columns, Shield, ArrowRight, Activity, Calendar } from 'lucide-react';
import { DatasetItem } from '../../api/endpoints/datasets.api';

interface DatasetCardProps {
  dataset: DatasetItem;
}

export function DatasetCard({ dataset }: DatasetCardProps) {
  const categoryColors: Record<string, string> = {
    CRM: 'bg-blue-50 text-blue-700 border-blue-200',
    Inventory: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Sales: 'bg-amber-50 text-amber-700 border-amber-200',
    HR: 'bg-purple-50 text-purple-700 border-purple-200',
    SupplyChain: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    Logistics: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const badgeColor =
    categoryColors[dataset.category ?? ''] ??
    'bg-slate-100 text-slate-700 border-slate-200';

  const accessBadgeColors: Record<string, string> = {
    manager: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    editor: 'bg-teal-50 text-teal-700 border-teal-200',
    viewer: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-indigo-400 hover:shadow-md">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeColor}`}
          >
            {dataset.category ?? 'General'}
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border uppercase tracking-wider ${
              accessBadgeColors[dataset.accessLevel] ?? 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            <Shield className="h-3 w-3" />
            {dataset.accessLevel}
          </span>
        </div>

        {/* Dataset Title & Description */}
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
          {dataset.name}
        </h3>
        <p className="mt-2 text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {dataset.description || 'Enterprise dataset configured for multi-dimensional querying.'}
        </p>

        {/* Dataset Metrics */}
        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2 text-slate-600">
            <Database className="h-4 w-4 text-indigo-500" />
            <div className="flex flex-col">
              <span className="text-xs text-slate-400">Total Records</span>
              <span className="text-sm font-semibold text-slate-800">
                {dataset.recordCount.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Columns className="h-4 w-4 text-emerald-500" />
            <div className="flex flex-col">
              <span className="text-xs text-slate-400">Schema Fields</span>
              <span className="text-sm font-semibold text-slate-800">
                {dataset.fieldCount} fields
              </span>
            </div>
          </div>
        </div>

        {/* Meta info */}
        <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Activity className="h-3.5 w-3.5 text-slate-400" />
            <span>{dataset.dataSource ?? 'PostgreSQL'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>{new Date(dataset.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-6 border-t border-slate-100 pt-4">
        <Link
          href={`/explorer?datasetId=${dataset.id}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-indigo-600 hover:text-white group-hover:bg-indigo-50 group-hover:text-indigo-600 hover:group-hover:bg-indigo-600 hover:group-hover:text-white"
        >
          <span>Explore Dataset</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
