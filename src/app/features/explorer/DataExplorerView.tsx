'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { X, AlertTriangle, RotateCcw } from 'lucide-react';

import {
  useGetDatasetsQuery,
  useGetDatasetFieldsQuery,
} from '../../api/endpoints/datasets.api';
import {
  useGetRecordsQuery,
  FilterRule,
  RecordItem,
} from '../../api/endpoints/records.api';
import { useGetMeQuery } from '../../api/endpoints/auth.api';
import { useCreateSavedViewMutation } from '../../api/endpoints/saved-views.api';

import { ExplorerHeader } from './ExplorerHeader';
import { DataTable } from './DataTable';
import { PaginationControls } from './PaginationControls';
import { FilterBuilder } from './FilterBuilder';
import { ColumnVisibilityModal } from './ColumnVisibilityModal';
import { RecordDetailDrawer } from './RecordDetailDrawer';
import ExportModal from '../exports/ExportModal';

export function DataExplorerView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Fetch all accessible datasets
  const {
    data: datasetsResponse,
    isLoading: datasetsLoading,
    isError: datasetsError,
  } = useGetDatasetsQuery();

  const datasets = useMemo(() => datasetsResponse?.data ?? [], [datasetsResponse]);

  // 2. Derive current dataset ID from URL or pick first available
  const urlDatasetId = searchParams.get('datasetId');
  const currentDatasetId = useMemo(() => {
    if (urlDatasetId && datasets.some((d) => d.id === urlDatasetId)) {
      return urlDatasetId;
    }
    return datasets[0]?.id ?? '';
  }, [urlDatasetId, datasets]);

  const currentDataset = useMemo(
    () => datasets.find((d) => d.id === currentDatasetId),
    [datasets, currentDatasetId],
  );

  // 3. Fetch schema fields for current dataset
  const { data: fieldsResponse, isLoading: fieldsLoading } = useGetDatasetFieldsQuery(
    currentDatasetId,
    { skip: !currentDatasetId },
  );

  const fields = useMemo(() => fieldsResponse?.data ?? [], [fieldsResponse]);

  // 4. URL query state parsing
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get('pageSize') ?? '25', 10) || 25),
  );
  const qParam = searchParams.get('q') ?? '';
  const sortBy = searchParams.get('sortBy') ?? undefined;
  const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') ?? undefined;
  const filterLogic = (searchParams.get('filterLogic') as 'AND' | 'OR') ?? 'AND';

  const activeFilters = useMemo<FilterRule[]>(() => {
    const raw = searchParams.get('filters');
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }, [searchParams]);

  // 5. Local Search input with debouncing
  const [searchInput, setSearchInput] = useState(qParam);

  // Helper to update URL query params cleanly
  const updateQueryParams = useCallback(
    (updates: Record<string, string | number | null | undefined>) => {
      const current = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          current.delete(key);
        } else {
          current.set(key, String(value));
        }
      });

      router.push(`${pathname}?${current.toString()}`);
    },
    [router, pathname, searchParams],
  );

  // Debounce search update to URL
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== qParam) {
        updateQueryParams({ q: searchInput.trim(), page: 1 });
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchInput, qParam, updateQueryParams]);

  // 6. Column Visibility State
  const [columnState, setColumnState] = useState<{
    datasetId: string;
    keys: Set<string>;
  } | null>(null);

  const defaultColumns = new Set(fields.map((f) => f.fieldKey));
  const visibleColumns =
    columnState?.datasetId === currentDatasetId ? columnState.keys : defaultColumns;

  const handleToggleColumn = (fieldKey: string) => {
    setColumnState((prev) => {
      const next =
        prev?.datasetId === currentDatasetId
          ? new Set(prev.keys)
          : new Set(fields.map((f) => f.fieldKey));
      if (next.has(fieldKey)) {
        if (next.size > 1) next.delete(fieldKey); // Prevent hiding all
      } else {
        next.add(fieldKey);
      }
      return { datasetId: currentDatasetId, keys: next };
    });
  };

  const handleSelectAllColumns = () => {
    setColumnState({
      datasetId: currentDatasetId,
      keys: new Set(fields.map((f) => f.fieldKey)),
    });
  };

  const handleResetDefaultColumns = () => {
    setColumnState({
      datasetId: currentDatasetId,
      keys: new Set(fields.map((f) => f.fieldKey)),
    });
  };

  // 7. Modals & Drawer State
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSaveViewOpen, setIsSaveViewOpen] = useState(false);
  const [saveViewName, setSaveViewName] = useState('');
  const [saveViewDesc, setSaveViewDesc] = useState('');
  const [createSavedView, { isLoading: isSavingView }] = useCreateSavedViewMutation();
  const [manualSelectedRecord, setManualSelectedRecord] = useState<RecordItem | null>(null);
  const [drawerOpenOverride, setDrawerOpenOverride] = useState<boolean | null>(null);
  const [selectedRecordIds, setSelectedRecordIds] = useState<Set<string>>(new Set());

  // Determine if user can export
  const { data: meData } = useGetMeQuery();
  const userRole = meData?.user?.roleName ?? '';
  const canExport = userRole === 'Administrator' || userRole === 'Data Analyst';
  const canSaveView = userRole === 'Administrator' || userRole === 'Data Analyst';

  // 8. Fetch live records from API
  const {
    data: recordsResponse,
    isLoading: recordsLoading,
    isFetching: recordsFetching,
    refetch: refetchRecords,
  } = useGetRecordsQuery(
    {
      datasetId: currentDatasetId,
      page,
      pageSize,
      q: qParam,
      sortBy,
      sortOrder,
      filters: activeFilters,
      filterLogic,
    },
    { skip: !currentDatasetId },
  );

  const records = useMemo(() => recordsResponse?.data ?? [], [recordsResponse]);
  const meta = recordsResponse?.meta ?? {
    page: 1,
    pageSize: 25,
    total: currentDataset?.recordCount ?? 0,
    totalPages: 1,
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedRecordIds(new Set());
  }, [currentDatasetId, page, pageSize, qParam, sortBy, sortOrder, filterLogic, searchParams]);

  // Check if URL has a recordId to open drawer directly
  const urlRecordId = searchParams.get('recordId');
  const urlSelectedRecord = useMemo(
    () => (urlRecordId ? records.find((r) => r.id === urlRecordId) ?? null : null),
    [urlRecordId, records],
  );
  const selectedRecord = manualSelectedRecord ?? urlSelectedRecord;
  const isDrawerOpen = drawerOpenOverride ?? Boolean(urlSelectedRecord);

  // 9. Handlers
  const handleSelectDataset = (newId: string) => {
    updateQueryParams({
      datasetId: newId,
      page: 1,
      q: '',
      sortBy: null,
      sortOrder: null,
      filters: null,
      recordId: null,
    });
    setSearchInput('');
  };

  const handleSort = (fieldKey: string) => {
    if (sortBy === fieldKey) {
      if (sortOrder === 'asc') {
        updateQueryParams({ sortBy: fieldKey, sortOrder: 'desc', page: 1 });
      } else {
        updateQueryParams({ sortBy: null, sortOrder: null, page: 1 });
      }
    } else {
      updateQueryParams({ sortBy: fieldKey, sortOrder: 'asc', page: 1 });
    }
  };

  const handleApplyFilters = (newFilters: FilterRule[], logic: 'AND' | 'OR') => {
    updateQueryParams({
      filters: newFilters.length > 0 ? JSON.stringify(newFilters) : null,
      filterLogic: logic,
      page: 1,
    });
  };

  const handleRemoveSingleFilter = (index: number) => {
    const updated = activeFilters.filter((_, i) => i !== index);
    updateQueryParams({
      filters: updated.length > 0 ? JSON.stringify(updated) : null,
      page: 1,
    });
  };

  const handleClearAllFilters = () => {
    updateQueryParams({
      filters: null,
      q: null,
      page: 1,
    });
    setSearchInput('');
  };

  const handleSaveViewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDatasetId || !saveViewName.trim()) return;
    try {
      await createSavedView({
        name: saveViewName.trim(),
        description: saveViewDesc.trim() || undefined,
        datasetId: currentDatasetId,
        searchQuery: qParam || '',
        filters: activeFilters,
        sortConfig: sortBy ? { field: sortBy, order: sortOrder || 'asc' } : null,
        visibleColumns: Array.from(visibleColumns),
        isShared: false,
      }).unwrap();
      setIsSaveViewOpen(false);
      setSaveViewName('');
      setSaveViewDesc('');
      alert('Saved view created.');
    } catch {
      alert('Failed to save view.');
    }
  };

  const handleRowClick = (record: RecordItem) => {
    setManualSelectedRecord(record);
    setDrawerOpenOverride(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpenOverride(false);
    setManualSelectedRecord(null);
    if (urlRecordId) {
      updateQueryParams({ recordId: null });
    }
  };

  const handleNavigateToRelatedRecord = (
    relatedDatasetId: string,
    relatedRecordId: string,
  ) => {
    setManualSelectedRecord(null);
    setDrawerOpenOverride(null);
    setSearchInput('');
    updateQueryParams({
      datasetId: relatedDatasetId,
      recordId: relatedRecordId,
      page: 1,
      q: null,
      filters: null,
    });
  };

  const handleToggleRecordSelected = (recordId: string) => {
    setSelectedRecordIds((prev) => {
      const next = new Set(prev);
      if (next.has(recordId)) next.delete(recordId);
      else next.add(recordId);
      return next;
    });
  };

  const handleSelectAllOnPage = () => {
    setSelectedRecordIds(new Set(records.map((r) => r.id)));
  };

  const handleClearSelection = () => setSelectedRecordIds(new Set());

  if (datasetsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <span className="text-sm font-medium text-slate-600">
            Connecting to DataScope PostgreSQL Engine...
          </span>
        </div>
      </div>
    );
  }

  if (datasetsError || datasets.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-lg">
          <AlertTriangle className="mx-auto h-12 w-12 text-rose-500" />
          <h2 className="mt-4 text-lg font-bold text-slate-900">Dataset Access Restricted</h2>
          <p className="mt-2 text-xs text-slate-600">
            No active datasets could be loaded for your account. Please sign in with an Administrator or authorized account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-slate-100 overflow-hidden">
      {/* Explorer Top Navigation & Controls */}
      <ExplorerHeader
        currentDataset={currentDataset}
        datasets={datasets}
        onSelectDataset={handleSelectDataset}
        recordCount={meta.total}
        isFetching={recordsFetching}
        onRefresh={() => refetchRecords()}
        searchTerm={searchInput}
        onSearchChange={setSearchInput}
        activeFilterCount={activeFilters.length}
        onOpenFilterModal={() => setIsFilterModalOpen(true)}
        onOpenColumnModal={() => setIsColumnModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        canExport={canExport}
        canSaveView={canSaveView}
        onSaveView={() => setIsSaveViewOpen(true)}
      />

      {/* Active Filter Chips Bar */}
      {(activeFilters.length > 0 || qParam) && (
        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs sm:px-6 overflow-x-auto">
          <span className="font-semibold text-slate-500 uppercase text-[10px] tracking-wider whitespace-nowrap">
            Active Filters ({filterLogic}):
          </span>

          {qParam && (
            <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-indigo-700 whitespace-nowrap">
              <span>Search: &quot;{qParam}&quot;</span>
              <button
                onClick={() => {
                  setSearchInput('');
                  updateQueryParams({ q: null, page: 1 });
                }}
                className="hover:text-indigo-900"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {activeFilters.map((f, idx) => (
            <span
              key={`chip-${idx}`}
              className="inline-flex items-center gap-1 rounded-md bg-white border border-slate-200 px-2.5 py-0.5 text-slate-700 shadow-2xs whitespace-nowrap"
            >
              <span className="font-semibold text-slate-900">{f.field}</span>
              <span className="text-slate-400">{f.operator}</span>
              <span className="font-mono text-slate-800">
                {Array.isArray(f.value) ? f.value.join(' & ') : String(f.value ?? '')}
              </span>
              <button
                onClick={() => handleRemoveSingleFilter(idx)}
                className="hover:text-rose-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          <button
            onClick={handleClearAllFilters}
            className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-medium text-rose-600 hover:bg-rose-50 whitespace-nowrap ml-auto"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Clear all</span>
          </button>
        </div>
      )}

      {/* Live Data Explorer Table */}
      <DataTable
        datasetId={currentDatasetId}
        fields={fields}
        visibleColumns={visibleColumns}
        records={records}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        onSelectRecord={handleRowClick}
        selectedRecordId={selectedRecord?.id}
        isLoading={recordsLoading || fieldsLoading}
        selectedRecordIds={selectedRecordIds}
        onToggleRecordSelected={handleToggleRecordSelected}
        onSelectAllOnPage={handleSelectAllOnPage}
        onClearSelection={handleClearSelection}
        searchTerm={qParam}
      />

      {/* Pagination Controls */}
      <PaginationControls
        page={meta.page}
        pageSize={meta.pageSize}
        total={meta.total}
        totalPages={meta.totalPages}
        onPageChange={(newPage) => updateQueryParams({ page: newPage })}
        onPageSizeChange={(newSize) => updateQueryParams({ pageSize: newSize, page: 1 })}
        isLoading={recordsLoading}
      />

      {/* Filter Builder Modal */}
      <FilterBuilder
        fields={fields}
        activeFilters={activeFilters}
        filterLogic={filterLogic}
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
      />

      {/* Column Visibility Modal */}
      <ColumnVisibilityModal
        fields={fields}
        visibleColumns={visibleColumns}
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        onToggleColumn={handleToggleColumn}
        onSelectAll={handleSelectAllColumns}
        onResetDefaults={handleResetDefaultColumns}
      />

      {/* Record Details Slide-over Drawer */}
      <RecordDetailDrawer
        datasetId={currentDatasetId}
        record={selectedRecord}
        fields={fields}
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        onNavigateToRelatedRecord={handleNavigateToRelatedRecord}
      />

      {/* Export Modal */}
      {currentDataset && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          datasetId={currentDatasetId}
          datasetName={currentDataset.name}
          fields={fields}
          currentFilters={activeFilters}
          currentFilterLogic={filterLogic}
          currentSortBy={sortBy}
          currentSortOrder={sortOrder}
          selectedRecordIds={Array.from(selectedRecordIds)}
        />
      )}

      {isSaveViewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Save current view</h3>
            <p className="mt-1 text-xs text-slate-500">
              Saves search, filters, sort, and visible columns for this dataset.
            </p>
            <form onSubmit={handleSaveViewSubmit} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Name</label>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                  value={saveViewName}
                  onChange={(e) => setSaveViewName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Description (optional)</label>
                <textarea
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                  rows={2}
                  value={saveViewDesc}
                  onChange={(e) => setSaveViewDesc(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSaveViewOpen(false)}
                  className="rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingView}
                  className="rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSavingView ? 'Saving…' : 'Save view'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
