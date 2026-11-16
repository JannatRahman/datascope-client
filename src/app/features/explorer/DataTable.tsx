'use client';

import React, { useState } from 'react';
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  ExternalLink,
  Mail,
  Inbox,
} from 'lucide-react';
import { DatasetFieldItem } from '../../api/endpoints/datasets.api';
import { RecordItem } from '../../api/endpoints/records.api';

interface DataTableProps {
  fields: DatasetFieldItem[];
  visibleColumns: Set<string>;
  records: RecordItem[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort: (fieldKey: string) => void;
  onSelectRecord: (record: RecordItem) => void;
  selectedRecordId?: string;
  isLoading?: boolean;
  selectedRecordIds?: Set<string>;
  onToggleRecordSelected?: (recordId: string) => void;
  onSelectAllOnPage?: () => void;
  onClearSelection?: () => void;
  searchTerm?: string;
}

export function DataTable({
  fields,
  visibleColumns,
  records,
  sortBy,
  sortOrder,
  onSort,
  onSelectRecord,
  selectedRecordId,
  isLoading,
  selectedRecordIds,
  onToggleRecordSelected,
  onSelectAllOnPage,
  onClearSelection,
  searchTerm = '',
  datasetId,
}: DataTableProps & { datasetId?: string }) {
  const displayedFields = fields.filter((f) => visibleColumns.has(f.fieldKey));
  const highlightTerm = searchTerm.trim();
  const [colWidths, setColWidths] = useState<Record<string, number>>(() => {
    if (!datasetId || typeof window === 'undefined') return {};
    try {
      const raw = window.localStorage.getItem(`datascope_col_widths_${datasetId}`);
      return raw ? (JSON.parse(raw) as Record<string, number>) : {};
    } catch {
      return {};
    }
  });
  const highlightText = (text: string) => {
    if (!highlightTerm) return text;
    const lower = text.toLowerCase();
    const idx = lower.indexOf(highlightTerm.toLowerCase());
    if (idx < 0) return text;
    const before = text.slice(0, idx);
    const match = text.slice(idx, idx + highlightTerm.length);
    const after = text.slice(idx + highlightTerm.length);
    return (
      <>
        {before}
        <mark className="rounded bg-amber-200 px-0.5 text-slate-900">{match}</mark>
        {after}
      </>
    );
  };

  // Cell formatter
  const formatCellValue = (value: unknown, field: DatasetFieldItem) => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-slate-300 select-none">—</span>;
    }

    switch (field.dataType) {
      case 'number':
        return (
          <span className="font-mono text-slate-900 font-medium">
            {typeof value === 'number'
              ? value.toLocaleString()
              : !isNaN(Number(value))
              ? Number(value).toLocaleString()
              : String(value)}
          </span>
        );

      case 'date': {
        const d = new Date(String(value));
        if (isNaN(d.getTime())) return String(value);
        return (
          <span className="text-slate-700 font-mono text-[11px]">
            {d.toISOString().slice(0, 10)}
          </span>
        );
      }

      case 'boolean': {
        const boolVal = value === true || value === 'true';
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
              boolVal
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                boolVal ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
            {boolVal ? 'True' : 'False'}
          </span>
        );
      }

      case 'email':
        return (
          <a
            href={`mailto:${value}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            <Mail className="h-3 w-3 text-slate-400" />
            <span className="truncate max-w-[180px]">{highlightText(String(value))}</span>
          </a>
        );

      case 'url':
        return (
          <a
            href={String(value)}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            <span className="truncate max-w-[160px]">{highlightText(String(value))}</span>
            <ExternalLink className="h-3 w-3 text-slate-400" />
          </a>
        );

      default:
        return (
          <span className="truncate max-w-[240px] block" title={String(value)}>
            {highlightText(String(value))}
          </span>
        );
    }
  };

  const showSelection = Boolean(onToggleRecordSelected && selectedRecordIds);
  const allPageSelected = showSelection && records.length > 0 && records.every((r) => selectedRecordIds?.has(r.id));

  const startResize = (fieldKey: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startW = colWidths[fieldKey] ?? 220;
    const onMove = (ev: MouseEvent) => {
      const next = Math.max(120, startW + (ev.clientX - startX));
      setColWidths((prev) => ({ ...prev, [fieldKey]: next }));
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      setColWidths((prev) => {
        if (datasetId && typeof window !== 'undefined') {
          try {
            window.localStorage.setItem(`datascope_col_widths_${datasetId}`, JSON.stringify(prev));
          } catch {}
        }
        return prev;
      });
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div className="relative flex-1 overflow-x-auto border-t border-slate-200 bg-white">
      {showSelection && selectedRecordIds && selectedRecordIds.size > 0 && (
        <div className="flex items-center justify-between border-b border-indigo-100 bg-indigo-50/80 px-3 py-2 text-xs">
          <span className="font-medium text-indigo-900">
            {selectedRecordIds.size} selected on current page/context
          </span>
          <div className="flex gap-2">
            {onSelectAllOnPage && (
              <button
                type="button"
                onClick={onSelectAllOnPage}
                className="rounded-md border border-indigo-200 bg-white px-2 py-1 font-medium text-indigo-700 hover:bg-indigo-50"
              >
                Select all on page
              </button>
            )}
            {onClearSelection && (
              <button
                type="button"
                onClick={onClearSelection}
                className="rounded-md px-2 py-1 font-medium text-slate-600 hover:bg-slate-100"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
      <table className="w-full border-collapse text-left text-xs">
        {/* Table Header */}
        <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50/95 backdrop-blur-xs text-[11px] font-semibold uppercase tracking-wider text-slate-600">
          <tr>
            {showSelection && (
              <th className="w-10 px-2 py-3 text-center">
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  onChange={() => (allPageSelected ? onClearSelection?.() : onSelectAllOnPage?.())}
                  aria-label="Select all on page"
                />
              </th>
            )}
            <th className="w-12 px-3 py-3 text-center text-slate-400">#</th>
            {displayedFields.map((field) => {
              const isCurrentSort = sortBy === field.fieldKey;
              const isSortable = field.isSortable;

              return (
                <th
                  key={field.fieldKey}
                  onClick={() => isSortable && onSort(field.fieldKey)}
                  style={{ width: colWidths[field.fieldKey] ?? 220, minWidth: 120 }}
                  className={`relative px-4 py-3 whitespace-nowrap select-none transition-colors ${
                    isSortable
                      ? 'cursor-pointer hover:bg-slate-100 hover:text-slate-900'
                      : ''
                  } ${field.dataType === 'number' ? 'text-right' : ''}`}
                >
                  <div
                    className={`inline-flex items-center gap-1.5 ${
                      field.dataType === 'number' ? 'justify-end' : ''
                    }`}
                  >
                    <span className="truncate">{field.fieldLabel}</span>
                    {isSortable && (
                      <span className="text-slate-400">
                        {isCurrentSort ? (
                          sortOrder === 'asc' ? (
                            <ArrowUp className="h-3.5 w-3.5 text-indigo-600" />
                          ) : (
                            <ArrowDown className="h-3.5 w-3.5 text-indigo-600" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3 w-3 opacity-40 hover:opacity-100" />
                        )}
                      </span>
                    )}
                  </div>
                  <span
                    role="separator"
                    aria-orientation="vertical"
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => startResize(field.fieldKey, e)}
                    className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize bg-transparent hover:bg-indigo-300"
                    title="Drag to resize column"
                  />
                </th>
              );
            })}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-slate-100 text-slate-800">
          {isLoading ? (
            // Skeleton Rows
            [...Array(12)].map((_, rowIdx) => (
              <tr key={`skeleton-${rowIdx}`} className="animate-pulse">
                {showSelection && <td className="px-2 py-3" />}
                <td className="px-3 py-3 text-center">
                  <div className="mx-auto h-3 w-4 rounded bg-slate-200" />
                </td>
                {displayedFields.map((f) => (
                  <td key={`sk-${rowIdx}-${f.fieldKey}`} className="px-4 py-3">
                    <div
                      className={`h-3.5 rounded bg-slate-200 ${
                        f.dataType === 'number' ? 'ml-auto w-16' : 'w-28'
                      }`}
                    />
                  </td>
                ))}
              </tr>
            ))
          ) : records.length === 0 ? (
            // Empty State
            <tr>
              <td
                colSpan={displayedFields.length + (showSelection ? 2 : 1)}
                className="py-16 text-center text-slate-500"
              >
                <div className="flex flex-col items-center justify-center">
                  <Inbox className="h-10 w-10 text-slate-300 mb-2" />
                  <p className="text-sm font-semibold text-slate-700">No records found</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    No records match the current filters or search terms. Try clearing or relaxing conditions.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            // Real Data Rows
            records.map((record, index) => {
              const isSelected = selectedRecordId === record.id;
              const isChecked = selectedRecordIds?.has(record.id) ?? false;
              return (
                <tr
                  key={record.id}
                  onClick={() => onSelectRecord(record)}
                  className={`group cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-indigo-50/80 hover:bg-indigo-50'
                      : 'hover:bg-slate-50/80'
                  }`}
                >
                  {showSelection && (
                    <td className="w-10 px-2 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onToggleRecordSelected?.(record.id)}
                        aria-label={`Select row ${index + 1}`}
                      />
                    </td>
                  )}
                  <td className="w-12 px-3 py-3 text-center font-mono text-[11px] text-slate-400">
                    {index + 1}
                  </td>
                  {displayedFields.map((field) => {
                    const cellVal = record.recordData[field.fieldKey];
                    return (
                        <td
                          key={field.fieldKey}
                          style={{ width: colWidths[field.fieldKey] ?? 220, minWidth: 120, maxWidth: colWidths[field.fieldKey] ?? 220 }}
                          className={`px-4 py-3 ${
                            field.dataType === 'number' ? 'text-right' : ''
                          }`}
                        >
                          {formatCellValue(cellVal, field)}
                        </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
