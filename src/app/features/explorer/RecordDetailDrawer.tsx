'use client';

import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Network,
  ListTree,
  Clock,
  ArrowRight,
  Database,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { DatasetFieldItem } from '../../api/endpoints/datasets.api';
import {
  RecordItem,
  useGetRecordRelationshipsQuery,
} from '../../api/endpoints/records.api';

interface RecordDetailDrawerProps {
  datasetId: string;
  record: RecordItem | null;
  fields: DatasetFieldItem[];
  isOpen: boolean;
  onClose: () => void;
  onNavigateToRelatedRecord?: (relatedDatasetId: string, relatedRecordId: string) => void;
}

export function RecordDetailDrawer({
  datasetId,
  record,
  fields,
  isOpen,
  onClose,
  onNavigateToRelatedRecord,
}: RecordDetailDrawerProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'attributes' | 'relationships'>('attributes');

  const recordId = record?.id ?? '';
  const { data: relData, isLoading: relLoading } = useGetRecordRelationshipsQuery(
    { datasetId, recordId },
    { skip: !recordId || !isOpen },
  );

  const relationships = relData?.data ?? [];

  if (!isOpen || !record) return null;

  const handleCopyId = () => {
    if (record?.id) {
      navigator.clipboard.writeText(record.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatValue = (val: unknown, type: string) => {
    if (val === null || val === undefined || val === '') {
      return <span className="text-slate-400 italic">Not specified (NULL)</span>;
    }
    if (type === 'boolean') {
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
            val === true || val === 'true'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          {val === true || val === 'true' ? 'True / Yes' : 'False / No'}
        </span>
      );
    }
    if (type === 'number') {
      return <span className="font-mono font-medium text-slate-900">{Number(val).toLocaleString()}</span>;
    }
    if (type === 'date') {
      const d = new Date(String(val));
      return (
        <span className="font-mono text-slate-800">
          {!isNaN(d.getTime()) ? d.toLocaleString() : String(val)}
        </span>
      );
    }
    return <span className="text-slate-800 break-words">{String(val)}</span>;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="flex w-screen max-w-xl flex-col bg-white shadow-2xl border-l border-slate-200 animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
                  <Database className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Record Details</h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-mono text-xs text-slate-500">
                      ID: {record.id.slice(0, 18)}...
                    </span>
                    <button
                      onClick={handleCopyId}
                      className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                      title="Copy full UUID"
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="mt-4 flex gap-2 border-b border-slate-200 pb-0">
              <button
                onClick={() => setActiveTab('attributes')}
                className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
                  activeTab === 'attributes'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <ListTree className="h-3.5 w-3.5" />
                <span>Attributes & Schema ({fields.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('relationships')}
                className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
                  activeTab === 'relationships'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Network className="h-3.5 w-3.5" />
                <span>Relationships</span>
                {relationships.length > 0 && (
                  <span className="rounded-full bg-indigo-100 px-2 py-0.2 text-[10px] font-bold text-indigo-700">
                    {relationships.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'attributes' ? (
              <div className="space-y-4">
                {/* Dynamic Attributes Grid */}
                <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
                  {fields.map((field) => {
                    const val = record.recordData[field.fieldKey];
                    return (
                      <div key={field.fieldKey} className="p-3.5 text-xs hover:bg-slate-50/70">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-700">
                            {field.fieldLabel}
                          </span>
                          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] uppercase text-slate-500">
                            {field.dataType}
                          </span>
                        </div>
                        <div className="mt-1">
                          {formatValue(val, field.dataType)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* System Audit Metadata */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-xs text-slate-500 space-y-2">
                  <div className="font-semibold text-slate-700 uppercase tracking-wider text-[10px]">
                    System Audit Metadata
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3 text-slate-400" />
                      Created At
                    </span>
                    <span className="font-mono text-slate-800">
                      {new Date(record.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3 text-slate-400" />
                      Updated At
                    </span>
                    <span className="font-mono text-slate-800">
                      {new Date(record.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Relationships Tab */
              <div className="space-y-4">
                {relLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-28 rounded-xl border border-slate-200 bg-slate-50 animate-pulse"
                      />
                    ))}
                  </div>
                ) : relationships.length === 0 ? (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
                    <Network className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                    <p className="text-sm font-semibold text-slate-700">No relationships found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      This record does not have linked foreign references in other datasets.
                    </p>
                  </div>
                ) : (
                  relationships.map((rel) => {
                    const isOutgoing = rel.direction === 'outgoing';
                    const previewKeys = Object.keys(rel.relatedRecordData || {}).slice(0, 4);

                    return (
                      <div
                        key={rel.id}
                        className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-indigo-300 transition-colors"
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            {isOutgoing ? (
                              <ArrowUpRight className="h-4 w-4 text-indigo-600" />
                            ) : (
                              <ArrowDownLeft className="h-4 w-4 text-emerald-600" />
                            )}
                            <span className="font-semibold text-slate-900 text-xs">
                              {rel.relatedDatasetName}
                            </span>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                              {rel.relatedDatasetCategory ?? 'General'}
                            </span>
                          </div>
                          <span className="rounded-md bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 capitalize">
                            {rel.relationshipType.replace(/_/g, ' ')}
                          </span>
                        </div>

                        {/* Description */}
                        {rel.description && (
                          <p className="mt-2 text-xs text-slate-500">{rel.description}</p>
                        )}

                        {/* Preview Attributes */}
                        <div className="mt-3 rounded-lg bg-slate-50/70 p-2.5 text-[11px] space-y-1">
                          {previewKeys.map((k) => (
                            <div key={k} className="flex items-center justify-between">
                              <span className="text-slate-500 font-medium capitalize">
                                {k.replace(/_/g, ' ')}:
                              </span>
                              <span className="font-mono text-slate-800 truncate max-w-[180px]">
                                {String(rel.relatedRecordData[k] ?? '—')}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Navigation button */}
                        {onNavigateToRelatedRecord && (
                          <button
                            type="button"
                            onClick={() =>
                              onNavigateToRelatedRecord(
                                rel.relatedDatasetId,
                                rel.relatedRecordId,
                              )
                            }
                            className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                          >
                            <span>Inspect Linked Record</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
