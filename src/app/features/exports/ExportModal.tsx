'use client';

import { useState, useEffect } from 'react';
import {
  useCreateExportJobMutation,
  useGetExportJobQuery,
  useCancelExportJobMutation,
  type CreateExportDto,
  type ExportJobItem,
} from '../../api/endpoints/exports.api';
import { type DatasetFieldItem } from '../../api/endpoints/datasets.api';
import { Download, X, Loader2, CheckCircle, AlertCircle, Ban } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  datasetId: string;
  datasetName: string;
  fields: DatasetFieldItem[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentFilters?: any[];
  currentFilterLogic?: 'AND' | 'OR';
  currentSortBy?: string;
  currentSortOrder?: 'asc' | 'desc';
}

export default function ExportModal({
  isOpen,
  onClose,
  datasetId,
  datasetName,
  fields,
  currentFilters = [],
  currentFilterLogic = 'AND',
  currentSortBy,
  currentSortOrder,
}: ExportModalProps) {
  const [format, setFormat] = useState<'csv' | 'json'>('csv');
  const [selectedFields, setSelectedFields] = useState<Set<string>>(
    new Set(fields.map((f) => f.fieldKey))
  );
  const [includeCurrentFilters, setIncludeCurrentFilters] = useState(true);
  const [jobId, setJobId] = useState<string | null>(null);
  const [createExportJob, { isLoading: isCreating }] = useCreateExportJobMutation();
  const [cancelExportJob, { isLoading: isCancelling }] = useCancelExportJobMutation();

  // Poll the job status after creating
  const { data: jobData, refetch } = useGetExportJobQuery(jobId ?? '', {
    skip: !jobId,
    pollingInterval: jobId ? 1500 : 0,
  });

  const job: ExportJobItem | undefined = jobData?.data;
  const isJobDone = job?.status === 'completed' || job?.status === 'failed' || job?.status === 'cancelled';

  // Stop polling once done
  useEffect(() => {
    if (isJobDone && jobId) {
      refetch();
    }
  }, [isJobDone, jobId, refetch]);

  const toggleField = (fieldKey: string) => {
    setSelectedFields((prev) => {
      const next = new Set(prev);
      next.has(fieldKey) ? next.delete(fieldKey) : next.add(fieldKey);
      return next;
    });
  };

  const selectAll = () => setSelectedFields(new Set(fields.map((f) => f.fieldKey)));
  const clearAll = () => setSelectedFields(new Set());

  const handleExport = async () => {
    const dto: CreateExportDto = {
      format,
      selectedFields: selectedFields.size === fields.length ? [] : Array.from(selectedFields),
    };

    if (includeCurrentFilters && currentFilters && currentFilters.length > 0) {
      dto.filters = currentFilters;
      dto.filterLogic = currentFilterLogic;
    }

    if (currentSortBy) {
      dto.sortBy = currentSortBy;
      dto.sortOrder = currentSortOrder;
    }

    const result = await createExportJob({ datasetId, body: dto }).unwrap();
    setJobId(result.data.id);
  };

  const handleCancel = async () => {
    if (!jobId) return;
    try {
      await cancelExportJob(jobId).unwrap();
    } catch { }
  };

  const handleDownload = () => {
    if (!jobId) return;
    const url = `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5001'}/api/v1/exports/${jobId}/download`;
    const a = document.createElement('a');
    a.href = url;
    a.download = job?.fileName ?? `export_${datasetName}.${format}`;
    a.click();
  };

  const handleClose = () => {
    setJobId(null);
    setSelectedFields(new Set(fields.map((f) => f.fieldKey)));
    setIncludeCurrentFilters(true);
    setFormat('csv');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Export Dataset</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* Dataset Info & Format Selection */}
          <div className="bg-indigo-50 rounded-lg px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-900">{datasetName}</p>
              <p className="text-xs text-indigo-600 mt-0.5">Bounded-memory streaming export</p>
            </div>
            {!jobId && (
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-indigo-200">
                <button
                  type="button"
                  onClick={() => setFormat('csv')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${format === 'csv'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  CSV
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('json')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${format === 'json'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  JSON
                </button>
              </div>
            )}
          </div>

          {!jobId ? (
            <>
              {/* Filter toggle */}
              {currentFilters && currentFilters.length > 0 && (
                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <input
                    type="checkbox"
                    checked={includeCurrentFilters}
                    onChange={(e) => setIncludeCurrentFilters(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600"
                  />
                  <span className="text-sm text-gray-700">
                    Apply active search filters ({currentFilters.length} filter rules)
                  </span>
                </label>
              )}

              {/* Field selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">Columns to include</p>
                  <div className="flex gap-2 text-xs">
                    <button onClick={selectAll} className="text-indigo-600 hover:underline">Select All</button>
                    <span className="text-gray-400">|</span>
                    <button onClick={clearAll} className="text-gray-500 hover:underline">Clear</button>
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
                  {fields.map((f) => (
                    <label key={f.fieldKey} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFields.has(f.fieldKey)}
                        onChange={() => toggleField(f.fieldKey)}
                        className="rounded border-gray-300 text-indigo-600"
                      />
                      <span className="text-sm text-gray-700">{f.fieldLabel}</span>
                      <span className="ml-auto text-xs text-gray-400 font-mono">{f.dataType}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedFields.size} of {fields.length} columns selected
                </p>
              </div>
            </>
          ) : (
            /* Job status view */
            <div className="text-center py-6">
              {!isJobDone ? (
                <>
                  <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mx-auto mb-3" />
                  <p className="font-medium text-gray-800">Generating {format.toUpperCase()} export...</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Status: <span className="font-mono capitalize font-semibold">{job?.status ?? 'processing'}</span>
                  </p>
                  {(job?.processedRecords ?? 0) > 0 && (
                    <p className="text-sm text-indigo-600 font-mono mt-1">
                      {job?.processedRecords?.toLocaleString()} / {job?.totalRecords ? job.totalRecords.toLocaleString() : '...'} records processed
                    </p>
                  )}
                  <button
                    onClick={handleCancel}
                    disabled={isCancelling}
                    className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium"
                  >
                    <Ban className="h-3.5 w-3.5" />
                    Cancel Export
                  </button>
                </>
              ) : job?.status === 'completed' ? (
                <>
                  <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-3" />
                  <p className="font-medium text-gray-800">Export Ready!</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {(job?.totalRecords ?? 0).toLocaleString()} records generated as {format.toUpperCase()}
                  </p>
                  <button
                    onClick={handleDownload}
                    className="mt-4 inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 font-medium shadow-sm transition-all"
                  >
                    <Download className="h-4 w-4" />
                    Download {format.toUpperCase()} File
                  </button>
                </>
              ) : job?.status === 'cancelled' ? (
                <>
                  <Ban className="h-10 w-10 text-amber-500 mx-auto mb-3" />
                  <p className="font-medium text-gray-800">Export Cancelled</p>
                  <p className="text-xs text-gray-500 mt-1">This export job was cancelled before completion.</p>
                </>
              ) : (
                <>
                  <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
                  <p className="font-medium text-gray-800">Export Failed</p>
                  <p className="text-sm text-red-600 mt-1 max-w-sm mx-auto">
                    {job?.errorMessage ?? 'An error occurred during export'}
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium"
          >
            {isJobDone ? 'Close' : 'Cancel'}
          </button>
          {!jobId && (
            <button
              onClick={handleExport}
              disabled={isCreating || selectedFields.size === 0}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
            >
              {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Export as {format.toUpperCase()}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
