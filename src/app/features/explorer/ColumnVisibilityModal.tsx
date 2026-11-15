'use client';

import React from 'react';
import { X, Columns3, Check } from 'lucide-react';
import { DatasetFieldItem } from '../../api/endpoints/datasets.api';

interface ColumnVisibilityModalProps {
  fields: DatasetFieldItem[];
  visibleColumns: Set<string>;
  isOpen: boolean;
  onClose: () => void;
  onToggleColumn: (fieldKey: string) => void;
  onSelectAll: () => void;
  onResetDefaults: () => void;
}

export function ColumnVisibilityModal({
  fields,
  visibleColumns,
  isOpen,
  onClose,
  onToggleColumn,
  onSelectAll,
  onResetDefaults,
}: ColumnVisibilityModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="flex max-h-[85vh] w-full max-w-md flex-col rounded-2xl bg-white shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Columns3 className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Customize Columns</h2>
              <p className="text-xs text-slate-500">
                Choose which fields are displayed in the explorer table
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-2.5">
          <span className="text-xs font-medium text-slate-600">
            {visibleColumns.size} of {fields.length} visible
          </span>
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={onSelectAll}
              className="font-medium text-indigo-600 hover:text-indigo-800"
            >
              Select All
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={onResetDefaults}
              className="font-medium text-slate-500 hover:text-slate-700"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Column List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1.5">
          {fields.map((f) => {
            const isChecked = visibleColumns.has(f.fieldKey);
            return (
              <label
                key={f.fieldKey}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-xs hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleColumn(f.fieldKey)}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="font-medium text-slate-800">{f.fieldLabel}</span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400">
                    ({f.dataType})
                  </span>
                </div>
                {isChecked && <Check className="h-3.5 w-3.5 text-indigo-600" />}
              </label>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-slate-200 bg-slate-50 px-6 py-3 rounded-b-2xl">
          <button
            onClick={onClose}
            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-indigo-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
